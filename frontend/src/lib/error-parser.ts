/**
 * Parses any client/API error to return a secure, friendly, and readable message.
 */
export function getFriendlyErrorMessage(error: any): string {
  if (!error) {
    return "An unexpected error occurred. Please try again.";
  }

  // Handle String error directly
  if (typeof error === "string") {
    return error;
  }

  // Handle Axios / HTTP Network Errors
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    // Bad Request / Validation errors
    if (status === 400) {
      if (data?.message) {
        return data.message;
      }
      if (Array.isArray(data?.errors) && data.errors.length > 0) {
        return data.errors.map((e: any) => e.msg || e.message).join(", ");
      }
      return "The request contains invalid details. Please check and try again.";
    }

    // Unauthorized
    if (status === 401) {
      return data?.message || "Invalid email or password. Please try again.";
    }

    // Forbidden / Access Denied
    if (status === 403) {
      return data?.message || "You do not have permission to access this resource.";
    }

    // Not Found
    if (status === 404) {
      return data?.message || "The requested service or record was not found.";
    }

    // Server Crash / Internal Error
    if (status >= 500) {
      return "Our medical portal services are experiencing temporary difficulties. Please try again shortly.";
    }
  }

  // Handle offline / connection failures
  if (error.request) {
    return "Unable to connect to the medical servers. Please verify your internet connection.";
  }

  // Standard JavaScript error
  if (error.message) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Parses AI-specific errors into warm, client-friendly, non-technical messages.
 */
export function getFriendlyAIErrorMessage(error: any, fallbackContext: "triage" | "summarize" = "triage"): string {
  if (!error) {
    return "Our AI assistant is temporarily unavailable. Please try again in a moment.";
  }

  // Network / Connection Error
  if (error.request && !error.response) {
    return "Unable to connect to our medical AI assistant. Please check your internet connection and try again.";
  }

  if (error.response) {
    const status = error.response.status;

    if (status === 400) {
      return fallbackContext === "triage"
        ? "Please describe your symptoms in a bit more detail so our AI can give an accurate recommendation."
        : "Please add a few more details to your clinical notes so the AI can structure them into SOAP format.";
    }

    if (status === 401 || status === 403) {
      return "Your session has expired or you do not have permission to access the AI assistant. Please re-login.";
    }

    if (status === 429) {
      return "The AI assistant is receiving a high number of requests right now. Please wait a few seconds and try again.";
    }

    if (status >= 500) {
      return "Our AI medical service is experiencing a temporary delay. Please click retry or try again shortly.";
    }
  }

  return fallbackContext === "triage"
    ? "We couldn't analyze your symptoms right now. Please try again in a moment."
    : "We couldn't structure your clinical notes right now. Please try again in a moment.";
}
