"""
Credential Context Module

Provides request-scoped credential management using Python's contextvars.
This allows multi-tenant API key injection without modifying the core LLM logic.

Usage:
    # In FastAPI middleware - extract from request headers
    from cuga.backend.llm.credential_context import set_request_credentials
    
    set_request_credentials(
        api_key="sk-...",
        provider="openai",
        model="gpt-4o",
        base_url=None
    )
    
    # In LLMManager - check for request credentials first
    from cuga.backend.llm.credential_context import get_request_credentials
    
    creds = get_request_credentials()
    if creds and creds.api_key:
        # Use request-provided credentials
    else:
        # Fall back to env vars
"""

from contextvars import ContextVar
from dataclasses import dataclass
from typing import Optional


@dataclass
class RequestCredentials:
    """Credentials for the current request context."""
    api_key: Optional[str] = None
    provider: Optional[str] = None  # openai, anthropic, azure, etc.
    model: Optional[str] = None  # Model string (e.g., "gpt-4o")
    base_url: Optional[str] = None  # Optional base URL for custom endpoints
    user_id: Optional[str] = None  # Tenant user ID (for logging)
    organization_id: Optional[str] = None  # Tenant org ID (for logging)


# Context variable for request-scoped credentials
_request_credentials: ContextVar[Optional[RequestCredentials]] = ContextVar(
    "request_credentials", default=None
)


def set_request_credentials(
    api_key: Optional[str] = None,
    provider: Optional[str] = None,
    model: Optional[str] = None,
    base_url: Optional[str] = None,
    user_id: Optional[str] = None,
    organization_id: Optional[str] = None,
) -> None:
    """
    Set credentials for the current request context.
    
    Called by middleware when processing incoming requests.
    These credentials take precedence over environment variables.
    """
    creds = RequestCredentials(
        api_key=api_key,
        provider=provider,
        model=model,
        base_url=base_url,
        user_id=user_id,
        organization_id=organization_id,
    )
    _request_credentials.set(creds)


def get_request_credentials() -> Optional[RequestCredentials]:
    """
    Get credentials for the current request context.
    
    Returns None if no credentials were set for this request,
    indicating that the LLM should fall back to environment variables.
    """
    return _request_credentials.get()


def clear_request_credentials() -> None:
    """
    Clear credentials for the current request context.
    
    Called at the end of request processing to clean up.
    """
    _request_credentials.set(None)


def has_request_credentials() -> bool:
    """
    Check if request-scoped credentials are available.
    
    Returns True if credentials were set and have an API key.
    """
    creds = _request_credentials.get()
    return creds is not None and creds.api_key is not None

