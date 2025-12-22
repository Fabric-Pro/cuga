/**
 * CUGA Agent Types
 *
 * Type definitions for CUGA agent communication
 */

/**
 * CUGA SSE Event types
 */
export type CugaEventType =
  | 'ChatAgent'
  | 'TaskAnalyzerAgent'
  | 'TaskDecompositionAgent'
  | 'PlanControllerAgent'
  | 'ApiAgent'
  | 'BrowserPlannerAgent'
  | 'ActionAgent'
  | 'QaAgent'
  | 'Answer'
  | 'tool_call'
  | 'Stopped'
  | '__interrupt__'
  | 'browser_screenshot'
  | 'browser_action'
  | 'code_execution'
  | 'variable_update';

/**
 * CUGA SSE Event structure
 */
export interface CugaSSEEvent {
  name: CugaEventType;
  data: string;
}

/**
 * Browser Screenshot Event
 */
export interface CugaBrowserScreenshot {
  /** Base64 encoded screenshot */
  screenshot: string;
  /** Current URL */
  url: string;
  /** DOM elements with bid markers */
  elements?: CugaBrowserElement[];
  /** Viewport size */
  viewport?: { width: number; height: number };
}

/**
 * Browser Element with BID marker
 */
export interface CugaBrowserElement {
  /** Browser element ID (bid) */
  bid: string;
  /** Element tag name */
  tag: string;
  /** Element text content */
  text?: string;
  /** Bounding box for overlay */
  bbox?: { x: number; y: number; width: number; height: number };
  /** Whether this element is currently being interacted with */
  isActive?: boolean;
}

/**
 * Browser Action Event
 */
export interface CugaBrowserAction {
  /** Action type */
  type: 'click' | 'type' | 'select_option' | 'scroll' | 'go_back' | 'navigate';
  /** Target element bid */
  bid?: string;
  /** Action value (for type action) */
  value?: string;
  /** Action status */
  status: 'pending' | 'executing' | 'complete' | 'failed';
  /** Error if failed */
  error?: string;
}

/**
 * Code Execution Event
 */
export interface CugaCodeExecutionEvent {
  /** Execution ID */
  id: string;
  /** Code being executed */
  code: string;
  /** Programming language */
  language: 'python' | 'javascript';
  /** Execution status */
  status: 'pending' | 'running' | 'complete' | 'failed';
  /** Output from execution */
  output?: string;
  /** Error if failed */
  error?: string;
  /** Execution time in ms */
  executionTimeMs?: number;
  /** Sandbox type */
  sandbox?: 'local' | 'docker' | 'e2b';
}

/**
 * CUGA Query Request
 */
export interface CugaQueryRequest {
  query: string;
  thread_id?: string;
  api_mode?: boolean;
}

/**
 * CUGA Resume Request (for human-in-the-loop)
 */
export interface CugaResumeRequest {
  thread_id: string;
  action: 'approve' | 'reject' | 'modify';
  modified_value?: string;
}

/**
 * CUGA Variables Metadata
 */
export interface CugaVariablesMetadata {
  [key: string]: {
    type: string;
    value: unknown;
    description?: string;
  };
}

/**
 * CUGA Final Answer
 */
export interface CugaFinalAnswer {
  data: string;
  variables?: CugaVariablesMetadata;
}

/**
 * CUGA Tool Call
 */
export interface CugaToolCall {
  name: string;
  args: Record<string, unknown>;
  id?: string;
}

/**
 * Subtask status type
 */
export type CugaSubtaskStatus = 'pending' | 'running' | 'complete' | 'failed' | 'skipped';

/**
 * Subtask structure
 */
export interface CugaSubtask {
  id: string;
  description: string;
  status: CugaSubtaskStatus;
  app?: string;
  type?: string;
  dependencies?: string[];
  output?: string;
  error?: string;
  executionTimeMs?: number;
  children?: CugaSubtask[];
}

/**
 * HITL Request types
 */
export interface CugaHitlRequest {
  id: string;
  type: 'approval' | 'input' | 'confirmation' | 'selection';
  message: string;
  context?: {
    subtaskId?: string;
    action?: string;
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  };
  options?: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
  defaultValue?: string;
  pending: boolean;
}

/**
 * AG-UI State Update for CUGA
 */
export interface CugaAgentState {
  /** Current agent node */
  currentNode: string;
  /** User query */
  query: string;
  /** Thread ID for conversation continuity */
  threadId: string;
  /** Streaming content from agent */
  streamingContent: string;
  /** Final answer when complete */
  finalAnswer?: string;
  /** Variables extracted during execution */
  variables?: CugaVariablesMetadata;
  /** Current subtasks (from task decomposition) */
  subtasks?: CugaSubtask[];
  /** Current subtask being executed */
  currentSubtaskId?: string;
  /** Tool calls pending approval */
  pendingToolCalls?: CugaToolCall[];
  /** Whether human approval is needed */
  needsApproval?: boolean;
  /** HITL requests */
  hitlRequests?: CugaHitlRequest[];
  /** Error message if any */
  error?: string;
  /** Current browser state */
  browserState?: CugaBrowserScreenshot;
  /** Current browser action */
  browserAction?: CugaBrowserAction;
  /** Code executions */
  codeExecutions?: CugaCodeExecutionEvent[];
  /** Agent thoughts/reasoning */
  thoughts?: string;
  /** Execution status */
  status?: 'idle' | 'planning' | 'executing' | 'waiting_hitl' | 'complete' | 'failed';
}

/**
 * CUGA Health Response
 */
export interface CugaHealthResponse {
  status: 'healthy' | 'unhealthy';
  version?: string;
  mode?: string;
}

