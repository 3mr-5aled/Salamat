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
