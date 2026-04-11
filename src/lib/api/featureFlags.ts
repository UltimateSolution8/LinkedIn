const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;

if (!RIXLY_API_BASE_URL) {
  console.error(
    "VITE_RIXLY_API_BASE_URL is not set. Please create a .env file with VITE_RIXLY_API_BASE_URL=http://localhost:YOUR_PORT"
  );
}

export interface GetFeatureFlagResponse {
  success: boolean;
  flagValue: string | null;
}

export interface UpdateFeatureFlagRequest {
  flagValue: string;
}

export interface UpdateFeatureFlagResponse {
  success: boolean;
  message: string;
  data: {
    flagKey: string;
    flagValue: string;
  };
}

/**
 * Get the value of a feature flag for the authenticated user
 * @param flagKey - The key of the feature flag to retrieve
 * @returns The flag value (string) or null if not set
 */
export async function getFeatureFlag(flagKey: string): Promise<string | null> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const response = await fetch(
      `${RIXLY_API_BASE_URL}/api/feature-flags/${flagKey}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      // For feature flags, we silently fail and return null
      // This ensures the app continues working even if the API is down
      console.warn(
        `Failed to fetch feature flag "${flagKey}":`,
        response.status,
        response.statusText
      );
      return null;
    }

    const data: GetFeatureFlagResponse = await response.json();
    return data.flagValue;
  } catch (error) {
    // Network errors, parsing errors, etc. - fail silently
    console.warn(`Error fetching feature flag "${flagKey}":`, error);
    return null;
  }
}

/**
 * Update (upsert) a feature flag for the authenticated user
 * @param flagKey - The key of the feature flag to update
 * @param flagValue - The new value for the flag
 */
export async function updateFeatureFlag(
  flagKey: string,
  flagValue: string
): Promise<void> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const response = await fetch(
      `${RIXLY_API_BASE_URL}/api/feature-flags/${flagKey}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ flagValue }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(
        `Failed to update feature flag "${flagKey}":`,
        response.status,
        errorData
      );
      throw new Error(
        errorData.message || `Failed to update feature flag "${flagKey}"`
      );
    }

    // Success - no need to return data
  } catch (error) {
    console.error(`Error updating feature flag "${flagKey}":`, error);
    // Re-throw to allow caller to handle if needed
    throw error;
  }
}
