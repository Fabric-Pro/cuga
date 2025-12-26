# syntax=docker/dockerfile:1

# CUGA (Computer Use General Agent) Dockerfile for Railway Deployment
# Python-based agent with optional AG-UI TypeScript wrapper
#
# Ports:
# - 8200: AG-UI wrapper (default external port)
# - 8201: Python CUGA backend (internal)

FROM python:3.12-slim

# ============================================================================
# CRITICAL FOR SSE STREAMING IN DOCKER:
# Without PYTHONUNBUFFERED, Python buffers stdout/stderr which breaks
# Server-Sent Events (SSE) streaming. Events get held until buffer fills
# or stream ends, causing incomplete streaming in Docker but working locally.
# ============================================================================
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Download and install uv
ADD https://astral.sh/uv/install.sh /uv-installer.sh
RUN sh /uv-installer.sh && rm /uv-installer.sh
ENV PATH="/root/.local/bin/:$PATH"

# Set working directory
WORKDIR /app/agents/langchain/cuga

# Copy dependency files
COPY agents/langchain/cuga/pyproject.toml agents/langchain/cuga/uv.lock ./

# Copy source code
COPY agents/langchain/cuga/src/ ./src/
COPY agents/langchain/cuga/docs/ ./docs/
COPY agents/langchain/cuga/configurations/ ./configurations/

# Install dependencies
RUN uv sync --group groq

# Create cuga_workspace directory
RUN mkdir -p /app/cuga_workspace

# Copy example files (optional workspace content)
COPY agents/langchain/cuga/docs/examples/huggingface/contacts.txt /app/cuga_workspace/contacts.txt
COPY agents/langchain/cuga/docs/examples/huggingface/cuga_knowledge.md /app/cuga_workspace/cuga_knowledge.md
COPY agents/langchain/cuga/docs/examples/huggingface/cuga_playbook.md /app/cuga_workspace/cuga_playbook.md
COPY agents/langchain/cuga/docs/examples/huggingface/email_template.md /app/cuga_workspace/email_template.md

# Environment variables
ENV NODE_ENV=production
ENV CUGA_HOST=0.0.0.0
ENV PORT=8200
ENV CUGA_BACKEND_PORT=8200

# Expose port
EXPOSE 8200

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:8200/health || exit 1

# Start CUGA
CMD ["uv", "run", "cuga", "start", "demo", "--host", "0.0.0.0", "--port", "8200"]

