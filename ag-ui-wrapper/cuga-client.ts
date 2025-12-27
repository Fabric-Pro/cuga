/**
 * CUGA Client
 *
 * Client for communicating with the CUGA FastAPI backend.
 * Supports multi-tenant credential injection via headers.
 */

import type { CugaSSEEvent, CugaQueryRequest, CugaResumeRequest, CugaHealthResponse, AICredentials } from './types.js';

// CUGA demo backend runs on port 7860
const CUGA_BASE_URL = process.env.CUGA_BASE_URL || 'http://localhost:7860';

/**
 * Build headers for CUGA request including credential headers if provided
 */
function buildHeaders(threadId?: string, credentials?: AICredentials): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream',
  };

  if (threadId) {
    headers['X-Thread-ID'] = threadId;
  }

  // Add credential headers for multi-tenant support
  if (credentials) {
    if (credentials.apiKey) {
      headers['X-AI-API-Key'] = credentials.apiKey;
    }
    if (credentials.provider) {
      headers['X-AI-Provider'] = credentials.provider;
    }
    if (credentials.model) {
      headers['X-AI-Model'] = credentials.model;
    }
    if (credentials.baseUrl) {
      headers['X-AI-Base-URL'] = credentials.baseUrl;
    }
    if (credentials.userId) {
      headers['X-User-ID'] = credentials.userId;
    }
    if (credentials.organizationId) {
      headers['X-Organization-ID'] = credentials.organizationId;
    }
  }

  return headers;
}

/**
 * Parse SSE event from CUGA stream
 */
function parseSSEEvent(eventStr: string): CugaSSEEvent | null {
  const lines = eventStr.trim().split('\n');
  let name = '';
  let data = '';

  for (const line of lines) {
    if (line.startsWith('event: ')) {
      name = line.slice(7).trim();
    } else if (line.startsWith('data: ')) {
      data = line.slice(6);
    }
  }

  if (!name) return null;
  return { name: name as CugaSSEEvent['name'], data };
}

/**
 * Build context string from conversation history
 * Summarizes history for context in follow-up questions
 */
function buildContextFromHistory(history?: Array<{ role: string; content: string }>): string {
  if (!history || history.length === 0) {
    return '';
  }

  // Take last 5 messages for context (to avoid token limits)
  const recentHistory = history.slice(-5);

  const contextParts = recentHistory.map((msg, idx) => {
    const role = msg.role === 'user' ? 'User' : 'Assistant';
    // Truncate long messages
    const content = msg.content.length > 500
      ? msg.content.substring(0, 500) + '...'
      : msg.content;
    return `[${role}]: ${content}`;
  });

  return `\n\n--- Previous Conversation Context ---\n${contextParts.join('\n')}\n--- End Context ---\n\n`;
}

/**
 * Stream query to CUGA backend
 *
 * Note: CUGA backend uses /stream endpoint with:
 * - Body: { "query": "...", "history": [...] }
 * - Header: X-Thread-ID for thread tracking
 *
 * Multi-tenant support: If credentials are provided, they are passed via headers
 * and the Python backend will use them instead of environment variables.
 */
export async function* streamQuery(
  request: CugaQueryRequest,
  credentials?: AICredentials
): AsyncGenerator<CugaSSEEvent> {
  const url = new URL('/stream', CUGA_BASE_URL);

  console.log(`[CUGA Client] Sending stream request to ${url.toString()} with thread_id: ${request.thread_id}, history: ${request.history?.length || 0} messages, hasCredentials: ${!!credentials}`);

  // Build headers with optional credentials
  const headers = buildHeaders(request.thread_id, credentials);

  // Build query with context from history if available
  let queryWithContext = request.query;
  if (request.history && request.history.length > 0) {
    const context = buildContextFromHistory(request.history);
    queryWithContext = `${context}Current question: ${request.query}`;
  }

  // CUGA backend expects one of these formats:
  // 1. { "query": "..." } - Simple query string
  // 2. { "action_id": ... } - ActionResponse for resume
  // 3. { "messages": [...] } - ChatRequest format
  // We use the simple query format as it's the most straightforward
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: queryWithContext }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    console.error(`[CUGA Client] Request failed: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`CUGA query failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  if (!response.body) {
    throw new Error('No response body from CUGA');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      
      // Split by double newline (SSE event separator)
      const events = buffer.split('\n\n');
      buffer = events.pop() || ''; // Keep incomplete event in buffer

      for (const eventStr of events) {
        if (!eventStr.trim()) continue;
        const event = parseSSEEvent(eventStr);
        if (event) {
          yield event;
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim()) {
      const event = parseSSEEvent(buffer);
      if (event) {
        yield event;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Resume CUGA execution after human-in-the-loop
 *
 * IMPORTANT: CUGA uses the same /stream endpoint for resume operations.
 * When you send an ActionResponse object (with action_id), it treats it as a resume.
 * The action can be 'approve', 'reject', or 'modify'.
 *
 * Multi-tenant support: If credentials are provided, they are passed via headers
 * to maintain consistency with the initial query.
 */
export async function* resumeExecution(
  request: CugaResumeRequest,
  credentials?: AICredentials
): AsyncGenerator<CugaSSEEvent> {
  // CUGA uses the /stream endpoint for both initial queries and resume operations
  // When the body contains action_id, it's treated as an ActionResponse for resume
  const url = new URL('/stream', CUGA_BASE_URL);

  // Build ActionResponse format expected by CUGA backend
  // See: cuga/backend/cuga_graph/nodes/human_in_the_loop/followup_model.py
  const actionResponse = {
    action_id: request.thread_id, // Use thread_id as action_id for correlation
    action: request.action, // 'approve', 'reject', or 'modify'
    modified_value: request.modified_value || null,
  };

  console.log('[CUGA-Client] Resuming execution with ActionResponse:', {
    thread_id: request.thread_id,
    action: request.action,
    hasModifiedValue: !!request.modified_value,
    hasCredentials: !!credentials,
  });

  // Build headers with optional credentials
  const headers = buildHeaders(request.thread_id, credentials);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers,
    body: JSON.stringify(actionResponse),
  });

  if (!response.ok) {
    throw new Error(`CUGA resume failed: ${response.status} ${response.statusText}`);
  }

  if (!response.body) {
    throw new Error('No response body from CUGA');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split('\n\n');
      buffer = events.pop() || '';

      for (const eventStr of events) {
        if (!eventStr.trim()) continue;
        const event = parseSSEEvent(eventStr);
        if (event) {
          yield event;
        }
      }
    }

    if (buffer.trim()) {
      const event = parseSSEEvent(buffer);
      if (event) {
        yield event;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Check CUGA health
 */
export async function checkHealth(): Promise<CugaHealthResponse> {
  const url = new URL('/', CUGA_BASE_URL);
  
  try {
    const response = await fetch(url.toString());
    if (response.ok) {
      return { status: 'healthy' };
    }
    return { status: 'unhealthy' };
  } catch {
    return { status: 'unhealthy' };
  }
}

/**
 * Stop CUGA execution for a thread
 */
export async function stopExecution(threadId: string): Promise<void> {
  const url = new URL('/stop', CUGA_BASE_URL);
  
  await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ thread_id: threadId }),
  });
}

