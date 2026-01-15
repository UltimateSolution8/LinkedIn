/**
 * Handles API response errors, specifically checking for authentication failures.
 * If a 401 or 403 error is detected, it clears the session and redirects to login.
 *
 * @param response - The fetch Response object
 * @returns The response if successful, throws error otherwise
 */
export async function handleApiResponse(response: Response): Promise<Response> {
  // Handle authentication failures (401) and authorization failures (403)
  if (response.status === 401 || response.status === 403) {
    // Clear all session data
    localStorage.removeItem("user");
    localStorage.removeItem("subscriptionStatus");
    localStorage.removeItem("subscriptionDetails");
    localStorage.clear();

    // Show notification to user using alert (since no toast library is installed)
    // You can replace this with a toast library notification if you install one (e.g., sonner, react-hot-toast)
    alert("Your session has expired. Please login again.");

    // Redirect to login page
    window.location.href = "/login";

    // Throw error to prevent further processing
    throw new Error("Session expired");
  }

  return response;
}

/**
 * Clears user session and navigates to login page.
 * Used for both manual logout and automatic session expiration.
 *
 * @param showMessage - Whether to show a notification message
 * @param message - Custom message to display (defaults to session expiration message)
 */
export function clearSessionAndRedirect(showMessage: boolean = true, message?: string): void {
  // Clear all session data
  localStorage.removeItem("user");
  localStorage.removeItem("subscriptionStatus");
  localStorage.removeItem("subscriptionDetails");
  localStorage.clear();

  // Show notification if requested
  if (showMessage) {
    alert(message || "Your session has expired. Please login again.");
  }

  // Redirect to login page
  window.location.href = "/login";
}
