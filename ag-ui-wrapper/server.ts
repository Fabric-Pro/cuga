/**
 * CUGA AG-UI Wrapper Server
 *
 * This server acts as a **protocol translation layer** between:
 * - A2A Protocol (used by Orchestrator for agent-to-agent communication)
 * - AG-UI/LangGraph Platform API (used by CopilotKit frontend)
 * - CUGA Native API (the Python FastAPI backend)
 *
 * Architecture:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                    AG-UI Wrapper (Port 9999)                    │
 * │  ┌─────────────┐  ┌──────────────────┐  ┌─────────────────────┐ │
 * │  │ A2A Protocol │  │ AG-UI/LangGraph  │  │  CUGA-specific      │ │
 * │  │ /.well-known │  │ Platform API     │  │  /cuga/health       │ │
 * │  │ /a2a/send    │  │ /runs/stream     │  │  /cuga/stop         │ │
 * │  │ /a2a/tasks   │  │ /invoke, /stream │  │  /cuga/resume       │ │
 * │  └──────┬───────┘  └────────┬─────────┘  └──────────┬──────────┘ │
 * │         │                   │                       │            │
 * │         └───────────────────┼───────────────────────┘            │
 * │                             │                                    │
 * │                    ┌────────▼────────┐                           │
 * │                    │  Translation    │                           │
 * │                    │  Layer          │                           │
 * │                    └────────┬────────┘                           │
 * └─────────────────────────────┼────────────────────────────────────┘
 *                               │
 *                     ┌─────────▼─────────┐
 *                     │ CUGA Python       │
 *                     │ Backend (7860)    │
 *                     │ POST /stream      │
 *                     │ {"query": "..."}  │
 *                     └───────────────────┘
 *
 * The wrapper handles:
 * 1. A2A message.parts[].text → CUGA {"query": "..."}
 * 2. A2A contextId → CUGA X-Thread-ID header
 * 3. CUGA SSE events → A2A TaskEvent streaming format
 */

import {
  createUnifiedServer,
  type AgentSkill,
  type LangGraphStreamEvent,
} from '@repo/agent-core';
import { v4 as uuidv4 } from 'uuid';

import { checkHealth, resumeExecution, stopExecution, streamQuery } from './cuga-client.js';
import type {
  CugaAgentState,
  CugaBrowserScreenshot,
  CugaCodeExecutionEvent,
  CugaFinalAnswer,
  CugaSSEEvent,
  CugaSubtask,
} from './types.js';

// Configuration
const PORT = Number.parseInt(process.env.PORT || '9999', 10);
const HOST = process.env.HOST || '0.0.0.0';
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Define agent skills for A2A discovery
const AGENT_SKILLS: AgentSkill[] = [
  {
    id: 'browser-automation',
    name: 'Browser Automation',
    description: 'Automate web browser interactions with full Playwright support',
    parameters: {
      type: 'object',
      properties: {
        task: { type: 'string', description: 'Task to perform in the browser' },
        url: { type: 'string', description: 'Starting URL (optional)' },
      },
      required: ['task'],
    },
    examples: [
      'Navigate to GitHub and star a repository',
      'Fill out a form on a website',
      'Extract data from a web page',
    ],
    tags: ['browser', 'automation', 'web'],
  },
  {
    id: 'api-orchestration',
    name: 'API Orchestration',
    description: 'Execute complex multi-API workflows with variable management',
    parameters: {
      type: 'object',
      properties: {
        task: { type: 'string', description: 'API task to perform' },
        apis: { type: 'array', items: { type: 'string' }, description: 'APIs to use' },
      },
      required: ['task'],
    },
    examples: [
      'Fetch user data from API and create a report',
      'Chain multiple API calls to complete a workflow',
    ],
    tags: ['api', 'orchestration', 'workflow'],
  },
  {
    id: 'code-execution',
    name: 'Code Execution',
    description: 'Execute Python code with sandbox support (Docker/E2B)',
    parameters: {
      type: 'object',
      properties: {
        task: { type: 'string', description: 'Code task to perform' },
        language: { type: 'string', enum: ['python'] },
      },
      required: ['task'],
    },
    examples: [
      'Write and execute a Python script to process data',
      'Generate code to solve a problem',
    ],
    tags: ['code', 'execution', 'python'],
  },
  {
    id: 'task-decomposition',
    name: 'Task Decomposition',
    description: 'Break down complex tasks into subtasks and execute them',
    examples: [
      'Plan and execute a multi-step workflow',
      'Decompose a complex request into manageable steps',
    ],
    tags: ['planning', 'decomposition', 'workflow'],
  },
];

/**
 * Transform CUGA SSE event to AG-UI state update
 */
function transformCugaEvent(
  event: CugaSSEEvent,
  currentState: CugaAgentState
): Partial<CugaAgentState> {
  const updates: Partial<CugaAgentState> = {
    currentNode: event.name,
  };

  switch (event.name) {
    case 'Answer': {
      try {
        const parsed = JSON.parse(event.data) as CugaFinalAnswer;
        updates.finalAnswer = parsed.data;
        updates.variables = parsed.variables;
        updates.streamingContent = parsed.data;
        updates.status = 'complete';
      } catch {
        updates.finalAnswer = event.data;
        updates.streamingContent = event.data;
        updates.status = 'complete';
      }
      break;
    }
    case 'tool_call': {
      try {
        updates.pendingToolCalls = JSON.parse(event.data);
      } catch {
        console.warn('Failed to parse tool_call data:', event.data);
      }
      break;
    }
    case '__interrupt__': {
      updates.needsApproval = true;
      updates.status = 'waiting_hitl';
      try {
        const hitlData = JSON.parse(event.data);
        updates.hitlRequests = [
          ...(currentState.hitlRequests || []),
          {
            id: `hitl_${Date.now()}`,
            type: hitlData.type || 'approval',
            message: hitlData.message || 'Human approval required',
            context: hitlData.context,
            pending: true,
          },
        ];
      } catch {
        updates.hitlRequests = [
          ...(currentState.hitlRequests || []),
          {
            id: `hitl_${Date.now()}`,
            type: 'approval',
            message: event.data || 'Human approval required',
            pending: true,
          },
        ];
      }
      break;
    }
    case 'Stopped': {
      updates.error = 'Execution stopped by user';
      updates.status = 'failed';
      break;
    }
    case 'TaskAnalyzerAgent': {
      updates.status = 'planning';
      updates.thoughts = event.data;
      break;
    }
    case 'TaskDecompositionAgent': {
      try {
        const data = JSON.parse(event.data);
        if (data.subtasks || data.task_decomposition) {
          const subtasks = data.subtasks || data.task_decomposition?.subtasks || [];
          updates.subtasks = subtasks.map((s: { id?: string; description?: string; task?: string; status?: string; app?: string; type?: string }, idx: number) => ({
            id: s.id || `subtask_${idx}`,
            description: s.description || s.task || '',
            status: s.status || 'pending',
            app: s.app,
            type: s.type,
          }));
        }
        updates.status = 'planning';
      } catch {
        updates.streamingContent = (currentState.streamingContent || '') + event.data;
      }
      break;
    }
    case 'PlanControllerAgent': {
      updates.status = 'executing';
      try {
        const data = JSON.parse(event.data);
        if (data.current_subtask_id) {
          updates.currentSubtaskId = data.current_subtask_id;
        }
        // Update subtask status
        if (data.subtask_status && currentState.subtasks) {
          updates.subtasks = currentState.subtasks.map((s) =>
            s.id === data.subtask_id ? { ...s, status: data.subtask_status } : s
          );
        }
      } catch {
        // Non-JSON data, just log
      }
      break;
    }
    case 'BrowserPlannerAgent':
    case 'ActionAgent': {
      updates.status = 'executing';
      try {
        const data = JSON.parse(event.data);
        if (data.screenshot) {
          updates.browserState = {
            screenshot: data.screenshot,
            url: data.url || currentState.browserState?.url || '',
            elements: data.elements,
            viewport: data.viewport,
          };
        }
        if (data.action) {
          updates.browserAction = {
            type: data.action.type,
            bid: data.action.bid,
            value: data.action.value,
            status: data.action.status || 'executing',
          };
        }
      } catch {
        updates.streamingContent = (currentState.streamingContent || '') + '\n' + event.data;
      }
      break;
    }
    case 'browser_screenshot': {
      try {
        const data = JSON.parse(event.data);
        updates.browserState = {
          screenshot: data.screenshot,
          url: data.url || currentState.browserState?.url || '',
          elements: data.elements,
          viewport: data.viewport,
        };
      } catch {
        console.warn('Failed to parse browser_screenshot data');
      }
      break;
    }
    case 'browser_action': {
      try {
        const data = JSON.parse(event.data);
        updates.browserAction = {
          type: data.type,
          bid: data.bid,
          value: data.value,
          status: data.status || 'executing',
          error: data.error,
        };
      } catch {
        console.warn('Failed to parse browser_action data');
      }
      break;
    }
    case 'code_execution': {
      try {
        const data = JSON.parse(event.data);
        const codeExec = {
          id: data.id || `code_${Date.now()}`,
          code: data.code,
          language: data.language || 'python',
          status: data.status || 'running',
          output: data.output,
          error: data.error,
          executionTimeMs: data.execution_time_ms,
          sandbox: data.sandbox,
        };
        updates.codeExecutions = [...(currentState.codeExecutions || []).filter(c => c.id !== codeExec.id), codeExec];
      } catch {
        console.warn('Failed to parse code_execution data');
      }
      break;
    }
    case 'variable_update': {
      try {
        const data = JSON.parse(event.data);
        updates.variables = {
          ...currentState.variables,
          [data.name]: {
            type: data.type,
            value: data.value,
            description: data.description,
          },
        };
      } catch {
        console.warn('Failed to parse variable_update data');
      }
      break;
    }
    case 'ApiAgent': {
      updates.status = 'executing';
      try {
        const data = JSON.parse(event.data);
        if (data.code) {
          const codeExec = {
            id: data.id || `api_code_${Date.now()}`,
            code: data.code,
            language: 'python' as const,
            status: data.status || 'running',
            output: data.output,
            error: data.error,
          };
          updates.codeExecutions = [...(currentState.codeExecutions || []).filter(c => c.id !== codeExec.id), codeExec];
        }
      } catch {
        updates.streamingContent = (currentState.streamingContent || '') + '\n' + event.data;
      }
      break;
    }
    default: {
      // Append to streaming content for other events
      if (event.data) {
        updates.streamingContent = (currentState.streamingContent || '') + '\n' + event.data;
      }
    }
  }

  return updates;
}

/**
 * Extract user message from input
 * Handles both AG-UI messages array format and direct string content
 */
function extractUserMessage(input: {
  messages?: Array<{ role: string; content: string }>;
  threadId?: string;
  contextId?: string;
}): { query: string; threadId: string } {
  const messages = input.messages || [];
  const lastMessage = messages[messages.length - 1];
  const userMessage = lastMessage?.content || '';
  // Use threadId from input, or contextId (from A2A), or generate new one
  const threadId = input.threadId || input.contextId || uuidv4();

  return { query: userMessage, threadId };
}

// Create unified server
const { app, start } = createUnifiedServer(
  {
    name: 'cuga_generalist',
    description: 'CUGA - Configurable Universal Generalist Agent. Provides browser automation, API orchestration, code execution, and task decomposition capabilities.',
    baseUrl: BASE_URL,
    port: PORT,
    host: HOST,
    skills: AGENT_SKILLS,
    tags: ['browser', 'api', 'code', 'planning', 'generalist', 'cuga'],
    supportsStreaming: true,
    // Generalist Agent Capabilities - tells orchestrator CUGA can handle complete tasks autonomously
    autonomousExecution: true, // Can handle complete tasks end-to-end
    taskDecomposition: true, // Has internal task decomposition (TaskDecompositionAgent)
    contextPreservation: true, // Maintains context via VariablesManager
    codeExecution: true, // Has CodeAgent with sandbox execution
    browserAutomation: true, // Has BrowserPlannerAgent + ActionAgent
    memoryEnabled: true, // Has memory system for learning
    multiTenancyAware: false, // CUGA is stateless, doesn't know about Fabric tenancy
    maxAutonomyLevel: 'task', // Can handle complete tasks autonomously
  },
  // Invoke function - non-streaming execution
  async (input: { messages?: Array<{ role: string; content: string }>; threadId?: string; contextId?: string }) => {
    const { query, threadId } = extractUserMessage(input);

    console.log('[CUGA-Wrapper] Invoking CUGA (sync) with:', {
      queryLength: query.length,
      threadId,
      inputKeys: Object.keys(input),
    });

    if (!query) {
      console.warn('[CUGA-Wrapper] Empty query received');
      return {
        response: 'No query provided',
        variables: {},
        threadId,
        streamingContent: '',
        codeExecutions: [],
        subtasks: [],
        browserState: undefined,
      };
    }

    let finalAnswer = '';
    let variables = {};
    let lastError: string | undefined;

    // Track full execution state for A2A response
    let currentState: CugaAgentState = {
      currentNode: 'ChatAgent',
      query,
      threadId,
      streamingContent: '',
      codeExecutions: [],
      subtasks: [],
      browserState: undefined,
    };

    // Collect all events from CUGA stream
    try {
      for await (const event of streamQuery({ query, thread_id: threadId, api_mode: true })) {
        console.log(`[CUGA-Wrapper] Event: ${event.name}`);

        // Update state with each event to capture code executions, subtasks, etc.
        const updates = transformCugaEvent(event, currentState);
        currentState = { ...currentState, ...updates };

        if (event.name === 'Answer') {
          try {
            const parsed = JSON.parse(event.data) as CugaFinalAnswer;
            finalAnswer = parsed.data;
            variables = parsed.variables || {};
          } catch {
            finalAnswer = event.data;
          }
        } else if (event.name === 'Stopped') {
          lastError = 'Execution stopped';
        }
      }
    } catch (error) {
      console.error('[CUGA-Wrapper] Stream error:', error);
      lastError = error instanceof Error ? error.message : 'Stream error';
    }

    // If no answer but had an error, include error in response
    if (!finalAnswer && lastError) {
      finalAnswer = `Error: ${lastError}`;
    }

    // Return full execution state including code executions, subtasks, browser state
    return {
      response: finalAnswer,
      variables,
      threadId,
      streamingContent: finalAnswer,
      error: lastError,
      codeExecutions: currentState.codeExecutions || [],
      subtasks: currentState.subtasks || [],
      browserState: currentState.browserState,
      thoughts: currentState.thoughts,
      status: currentState.status,
    };
  },
  // Transform output for A2A response
  (output: {
    response?: string;
    threadId?: string;
    variables?: Record<string, unknown>;
    error?: string;
    codeExecutions?: CugaCodeExecutionEvent[];
    subtasks?: CugaSubtask[];
    browserState?: CugaBrowserScreenshot;
    thoughts?: string;
    status?: string;
  }) => {
    const response = output.response || '';
    const artifacts = [];

    // Always include the main result artifact
    if (response) {
      artifacts.push({
        id: uuidv4(),
        name: 'cuga-result',
        description: 'CUGA execution result',
        mimeType: 'text/plain',
        parts: [{ type: 'text' as const, text: response }],
      });
    }

    // Add code execution artifacts
    if (output.codeExecutions && output.codeExecutions.length > 0) {
      for (const codeExec of output.codeExecutions) {
        artifacts.push({
          id: uuidv4(),
          name: `code-execution-${codeExec.id}`,
          description: `Code execution (${codeExec.language || 'python'}) - ${codeExec.status}`,
          mimeType: 'application/json',
          parts: [
            {
              type: 'data' as const,
              data: {
                type: 'code-execution',
                code: codeExec.code,
                language: codeExec.language || 'python',
                status: codeExec.status,
                output: codeExec.output,
                error: codeExec.error,
                executionTimeMs: codeExec.executionTimeMs,
                sandbox: codeExec.sandbox,
              },
            },
          ],
        });
      }
    }

    // Add subtasks artifact
    if (output.subtasks && output.subtasks.length > 0) {
      artifacts.push({
        id: uuidv4(),
        name: 'subtasks',
        description: `Task decomposition with ${output.subtasks.length} subtasks`,
        mimeType: 'application/json',
        parts: [
          {
            type: 'data' as const,
            data: {
              type: 'subtasks',
              subtasks: output.subtasks,
            },
          },
        ],
      });
    }

    // Add browser state artifact
    if (output.browserState) {
      artifacts.push({
        id: uuidv4(),
        name: 'browser-state',
        description: `Browser state at ${output.browserState.url}`,
        mimeType: 'application/json',
        parts: [
          {
            type: 'data' as const,
            data: {
              type: 'browser-state',
              url: output.browserState.url,
              screenshot: output.browserState.screenshot ? '[base64-image]' : undefined,
              hasScreenshot: !!output.browserState.screenshot,
              viewport: output.browserState.viewport,
              elements: output.browserState.elements,
            },
          },
        ],
      });
    }

    return {
      response,
      artifacts,
      metadata: {
        threadId: output.threadId,
        variables: output.variables,
        ...(output.error ? { error: output.error } : {}),
        codeExecutions: output.codeExecutions,
        subtasks: output.subtasks,
        browserState: output.browserState,
        thoughts: output.thoughts,
        status: output.status,
      },
    };
  },
  // A2A streaming executor
  async function* (input: { messages?: Array<{ role: string; content: string }>; threadId?: string; contextId?: string }) {
    const { query, threadId } = extractUserMessage(input);

    console.log('[CUGA-Wrapper] A2A streaming with:', {
      queryLength: query.length,
      threadId,
    });

    if (!query) {
      yield { type: 'text' as const, text: 'No query provided' };
      return;
    }

    let currentState: CugaAgentState = {
      currentNode: 'ChatAgent',
      query,
      threadId,
      streamingContent: '',
    };

    try {
      for await (const event of streamQuery({ query, thread_id: threadId, api_mode: true })) {
        const updates = transformCugaEvent(event, currentState);
        currentState = { ...currentState, ...updates };

        // Map CUGA events to A2A streaming format
        if (event.name === 'Answer') {
          const answer = currentState.finalAnswer || event.data;
          yield { type: 'text' as const, text: answer };
        } else if (event.name === 'Stopped') {
          yield { type: 'error' as const, error: 'Execution stopped by user' };
        } else if (event.name === '__interrupt__') {
          yield {
            type: 'text' as const,
            text: `[HITL Required] ${currentState.hitlRequests?.[0]?.message || 'Human approval needed'}`
          };
        } else if (currentState.streamingContent) {
          yield { type: 'text' as const, text: currentState.streamingContent };
          currentState.streamingContent = '';
        }
      }
    } catch (error) {
      console.error('[CUGA-Wrapper] A2A stream error:', error);
      yield { type: 'error' as const, error: error instanceof Error ? error.message : 'Stream error' };
    }
  },
  // Platform streaming executor for CopilotKit LangGraphAgent
  async function* (input: { messages?: Array<{ role: string; content: string }>; threadId?: string; contextId?: string }): AsyncGenerator<LangGraphStreamEvent> {
    const { query, threadId } = extractUserMessage(input);

    console.log('[CUGA-Wrapper] Platform streaming with:', {
      queryLength: query.length,
      threadId,
    });

    if (!query) {
      yield {
        nodeName: 'Error',
        state: { error: 'No query provided' },
        isFinal: true,
      };
      return;
    }

    // Initialize state
    let state: CugaAgentState = {
      currentNode: 'ChatAgent',
      query,
      threadId,
      streamingContent: '',
    };

    try {
      // Stream from CUGA and transform to AG-UI/LangGraph Platform events
      for await (const event of streamQuery({ query, thread_id: threadId, api_mode: true })) {
        const updates = transformCugaEvent(event, state);
        state = { ...state, ...updates };

        console.log(`[CUGA-Wrapper] Platform stream update from node: ${event.name}`);

        // Yield the update event in LangGraph Platform format
        yield {
          nodeName: event.name,
          state: { ...state },
          isFinal: event.name === 'Answer',
        };
      }
    } catch (error) {
      console.error('[CUGA-Wrapper] Platform stream error:', error);
      yield {
        nodeName: 'Error',
        state: {
          error: error instanceof Error ? error.message : 'Stream error',
          status: 'failed',
        },
        isFinal: true,
      };
    }
  },
);

// Add CUGA-specific endpoints

// Health check that proxies to CUGA
app.get('/cuga/health', async (c: { json: (data: unknown) => Response }) => {
  const health = await checkHealth();
  return c.json(health);
});

// Stop execution endpoint
app.post('/cuga/stop', async (c: { req: { json: () => Promise<{ thread_id?: string }> }; json: (data: unknown, status?: number) => Response }) => {
  const body = await c.req.json();
  const threadId = body.thread_id;
  if (!threadId) {
    return c.json({ error: 'thread_id required' }, 400);
  }
  await stopExecution(threadId);
  return c.json({ status: 'stopped' });
});

// Resume execution endpoint (for human-in-the-loop)
app.post('/cuga/resume', async (c: { req: { json: () => Promise<{ thread_id?: string; action?: string; modified_value?: string }> }; json: (data: unknown, status?: number) => Response }) => {
  const body = await c.req.json();
  const { thread_id, action, modified_value } = body;

  if (!thread_id || !action) {
    return c.json({ error: 'thread_id and action required' }, 400);
  }

  // Validate action type
  const validActions = ['approve', 'reject', 'modify'] as const;
  if (!validActions.includes(action as typeof validActions[number])) {
    return c.json({ error: 'action must be approve, reject, or modify' }, 400);
  }

  // Stream response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const event of resumeExecution({
          thread_id,
          action: action as 'approve' | 'reject' | 'modify',
          modified_value
        })) {
          const data = `event: ${event.name}\ndata: ${event.data}\n\n`;
          controller.enqueue(encoder.encode(data));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
});

// Start the server
start();

export { app };

