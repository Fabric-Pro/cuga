#!/bin/bash
set -e

# CUGA Docker Entrypoint
# Starts the Python CUGA backend and optionally the TypeScript AG-UI wrapper

echo "Starting CUGA Agent..."

# Set default ports
CUGA_BACKEND_PORT=${CUGA_BACKEND_PORT:-8201}
AGUI_WRAPPER_PORT=${PORT:-8200}

# Start CUGA Python backend in background
echo "Starting CUGA Python backend on port $CUGA_BACKEND_PORT..."
cd /app/agents/langchain/cuga
uv run cuga start demo --host 0.0.0.0 --port $CUGA_BACKEND_PORT &
CUGA_PID=$!

# Wait for CUGA backend to be ready
echo "Waiting for CUGA backend to be ready..."
for i in {1..30}; do
    if curl -s "http://localhost:$CUGA_BACKEND_PORT/health" > /dev/null 2>&1; then
        echo "CUGA backend is ready!"
        break
    fi
    echo "Attempt $i: Waiting for CUGA backend..."
    sleep 2
done

# Check if AG-UI wrapper is enabled
if [ "${ENABLE_AGUI_WRAPPER:-true}" = "true" ]; then
    echo "Starting AG-UI wrapper on port $AGUI_WRAPPER_PORT..."
    cd /app/agents/langchain/cuga/ag-ui-wrapper
    
    # Set CUGA backend URL for the wrapper
    export CUGA_BACKEND_URL="http://localhost:$CUGA_BACKEND_PORT"
    
    node dist/server.js &
    WRAPPER_PID=$!
    
    # Wait for wrapper to be ready
    echo "Waiting for AG-UI wrapper to be ready..."
    for i in {1..30}; do
        if curl -s "http://localhost:$AGUI_WRAPPER_PORT/health" > /dev/null 2>&1; then
            echo "AG-UI wrapper is ready!"
            break
        fi
        echo "Attempt $i: Waiting for AG-UI wrapper..."
        sleep 2
    done
    
    echo "CUGA Agent is fully operational!"
    echo "  - Python backend: http://localhost:$CUGA_BACKEND_PORT"
    echo "  - AG-UI wrapper: http://localhost:$AGUI_WRAPPER_PORT"
else
    echo "AG-UI wrapper disabled. Running CUGA backend only."
    echo "  - Python backend: http://localhost:$CUGA_BACKEND_PORT"
fi

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?

