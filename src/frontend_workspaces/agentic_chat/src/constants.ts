import { UserType } from "@carbon/ai-chat";

export const RESPONSE_USER_PROFILE = {
  id: "ai-chatbot-user",
  userName: "CUGA",
  fullName: "CUGA Agent",
  displayName: "CUGA",
  accountName: "CUGA Agent",
  replyToId: "ai-chatbot-user",
  userType: UserType.BOT,
};

// Get the base URL for the backend API
// In production (HF Spaces), use the current origin
// In development, use localhost with port 7860 (HF Spaces default)
export const getApiBaseUrl = (): string => {
  // If running in Hugging Face Spaces or production, use current origin
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Check if we're on HF Spaces or not localhost
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return window.location.origin;
    }
  }
  
  // Default to localhost:7860 for local development (HF Spaces port)
  // This can be overridden by setting REACT_APP_API_URL environment variable
  return process.env.REACT_APP_API_URL || 'http://localhost:7860';
};

export const API_BASE_URL = getApiBaseUrl();
