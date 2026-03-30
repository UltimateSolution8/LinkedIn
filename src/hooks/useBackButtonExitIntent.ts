import { useEffect } from "react";

type UseBackButtonExitIntentOptions = {
  enabled: boolean;
  onExitIntent: () => void;
  seenKey?: string;
};

/**
 * Shows exit-intent only when a visitor presses the browser back button.
 * Uses a persistent localStorage key so anonymous users only see it once.
 */
export function useBackButtonExitIntent({
  enabled,
  onExitIntent,
  seenKey = "rixly_exit_intent_back_seen",
}: UseBackButtonExitIntentOptions) {
  useEffect(() => {
    if (!enabled) return;

    try {
      if (localStorage.getItem(seenKey) === "1") return;
    } catch {
      // If storage is unavailable, continue with runtime-only behavior.
    }

    let isHandled = false;
    const guardState = { rixlyExitIntentGuard: Date.now() };

    window.history.pushState(guardState, "", window.location.href);

    const handlePopState = () => {
      if (isHandled) return;
      isHandled = true;

      try {
        localStorage.setItem(seenKey, "1");
      } catch {
        // ignore storage errors
      }

      onExitIntent();

      // Keep user on landing so they can interact with the dialog.
      window.history.pushState(guardState, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [enabled, onExitIntent, seenKey]);
}
