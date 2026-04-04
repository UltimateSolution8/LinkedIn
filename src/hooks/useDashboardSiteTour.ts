import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const TOUR_STORAGE_PREFIX = "rixly.siteTour.dashboard.v1";

function readBooleanStorage(key: string): boolean {
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

function writeBooleanStorage(key: string, value: boolean): void {
  try {
    localStorage.setItem(key, value ? "true" : "false");
  } catch {
    // no-op: localStorage may be unavailable in restricted environments
  }
}

export function useDashboardSiteTour() {
  const { user } = useAuth();
  const userId = user?._id ?? (user?.userId ? String(user.userId) : "anonymous");

  const keys = useMemo(
    () => ({
      promptSeen: `${TOUR_STORAGE_PREFIX}.${userId}.promptSeen`,
      dismissed: `${TOUR_STORAGE_PREFIX}.${userId}.dismissed`,
      completed: `${TOUR_STORAGE_PREFIX}.${userId}.completed`,
    }),
    [userId]
  );

  const [promptSeen, setPromptSeen] = useState(() => readBooleanStorage(keys.promptSeen));
  const [dismissed, setDismissed] = useState(() => readBooleanStorage(keys.dismissed));
  const [completed, setCompleted] = useState(() => readBooleanStorage(keys.completed));

  // Re-sync if the user identity (and therefore keys) changes
  useEffect(() => {
    setPromptSeen(readBooleanStorage(keys.promptSeen));
    setDismissed(readBooleanStorage(keys.dismissed));
    setCompleted(readBooleanStorage(keys.completed));
  }, [keys]);

  const markPromptSeen = useCallback(() => {
    setPromptSeen(true);
    writeBooleanStorage(keys.promptSeen, true);
  }, [keys.promptSeen]);

  const markNotNow = useCallback(() => {
    markPromptSeen();
  }, [markPromptSeen]);

  const markDontShowAgain = useCallback(() => {
    markPromptSeen();
    setDismissed(true);
    writeBooleanStorage(keys.dismissed, true);
  }, [keys.dismissed, markPromptSeen]);

  const markTourDismissed = useCallback(() => {
    markPromptSeen();
    setDismissed(true);
    writeBooleanStorage(keys.dismissed, true);
  }, [keys.dismissed, markPromptSeen]);

  const markTourCompleted = useCallback(() => {
    markPromptSeen();
    setCompleted(true);
    writeBooleanStorage(keys.completed, true);
  }, [keys.completed, markPromptSeen]);

  const hasStableUserId = Boolean(user?._id || user?.userId);
  const shouldAutoPrompt = hasStableUserId && !promptSeen && !dismissed && !completed;

  return {
    shouldAutoPrompt,
    markPromptSeen,
    markNotNow,
    markDontShowAgain,
    markTourDismissed,
    markTourCompleted,
  };
}
