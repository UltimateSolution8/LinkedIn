import { useState, useEffect } from "react";
import { getFeatureFlag, updateFeatureFlag } from "@/lib/api/featureFlags";

const TOUR_FLAG_KEY = "alert_v1_site_tour";

interface UseDashboardTourPromptReturn {
  shouldShowPrompt: boolean;
  isLoading: boolean;
  handleNotNow: () => Promise<void>;
  handleDontShowAgain: () => Promise<void>;
  handleTakeTour: () => Promise<void>;
}

/**
 * Custom hook to manage the dashboard tour prompt dialog using feature flags.
 *
 * Shows the dialog when:
 * - The flag value is null (user hasn't seen it yet)
 * - The flag value is "not now" (user dismissed it temporarily)
 *
 * Hides the dialog when:
 * - The flag value is "dismissed" (user chose "Don't show again")
 * - The flag value is "completed" (user took the tour)
 * - Any other value
 * - API call fails (fail silently)
 */
export function useDashboardTourPrompt(): UseDashboardTourPromptReturn {
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkTourFlag() {
      try {
        setIsLoading(true);
        const flagValue = await getFeatureFlag(TOUR_FLAG_KEY);

        // Show dialog only if flag is null or "not now"
        const shouldShow = flagValue === null || flagValue === "not now";
        setShouldShowPrompt(shouldShow);
      } catch (error) {
        // Fail silently - don't show dialog on error
        console.warn("Failed to check tour flag:", error);
        setShouldShowPrompt(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkTourFlag();
  }, []);

  const handleNotNow = async () => {
    try {
      await updateFeatureFlag(TOUR_FLAG_KEY, "not now");
      setShouldShowPrompt(false);
    } catch (error) {
      console.error("Failed to update tour flag to 'not now':", error);
      // Still hide the dialog even if update fails
      setShouldShowPrompt(false);
    }
  };

  const handleDontShowAgain = async () => {
    try {
      await updateFeatureFlag(TOUR_FLAG_KEY, "dismissed");
      setShouldShowPrompt(false);
    } catch (error) {
      console.error("Failed to update tour flag to 'dismissed':", error);
      // Still hide the dialog even if update fails
      setShouldShowPrompt(false);
    }
  };

  const handleTakeTour = async () => {
    try {
      await updateFeatureFlag(TOUR_FLAG_KEY, "completed");
      setShouldShowPrompt(false);
    } catch (error) {
      console.error("Failed to update tour flag to 'completed':", error);
      // Still hide the dialog even if update fails
      setShouldShowPrompt(false);
    }
  };

  return {
    shouldShowPrompt,
    isLoading,
    handleNotNow,
    handleDontShowAgain,
    handleTakeTour,
  };
}
