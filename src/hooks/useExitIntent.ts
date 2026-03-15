import { useEffect, useRef } from "react";

type UseExitIntentOptions = {
  enabled: boolean;
  onExitIntent: () => void;
  sessionKey?: string;
  cooldownHours?: number;
  minTimeOnPageMs?: number;
  minScrollY?: number;
  topBoundaryPx?: number;
  minUpwardDeltaPx?: number;
  beforeUnloadFallback?: boolean;
};

export function useExitIntent({
  enabled,
  onExitIntent,
  sessionKey = "rixly_exit_intent_seen",
  cooldownHours = 24,
  minTimeOnPageMs = 3000,
  minScrollY = 80,
  topBoundaryPx = 24,
  minUpwardDeltaPx = 18,
  beforeUnloadFallback = true,
}: UseExitIntentOptions) {
  const startTimeRef = useRef<number>(0);
  const maxScrollYRef = useRef(0);
  const moveCountRef = useRef(0);
  const lastYRef = useRef<number>(typeof window !== "undefined" ? window.innerHeight : 0);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const now = Date.now();
    const cooldownKey = `${sessionKey}_cooldown_until`;

    const seenInSession = sessionStorage.getItem(sessionKey) === "1";
    const cooldownUntil = Number(localStorage.getItem(cooldownKey) || 0);

    if (seenInSession || now < cooldownUntil) return;

    startTimeRef.current = now;
    maxScrollYRef.current = window.scrollY || 0;
    moveCountRef.current = 0;
    lastYRef.current = window.innerHeight;
    triggeredRef.current = false;

    const isArmed = () => {
      if (triggeredRef.current) return false;

      const elapsedMs = Date.now() - startTimeRef.current;
      if (elapsedMs < minTimeOnPageMs) return false;

      const hasScrollEngagement = maxScrollYRef.current >= minScrollY;
      const hasPointerEngagement = moveCountRef.current >= 4;
      return hasScrollEngagement || hasPointerEngagement;
    };

    const markTriggered = () => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      sessionStorage.setItem(sessionKey, "1");
      if (cooldownHours > 0) {
        const cooldownMs = cooldownHours * 60 * 60 * 1000;
        localStorage.setItem(cooldownKey, String(Date.now() + cooldownMs));
      }
      onExitIntent();
    };

    const handleScroll = () => {
      maxScrollYRef.current = Math.max(maxScrollYRef.current, window.scrollY || 0);
    };

    const handleMouseMove = (event: MouseEvent) => {
      moveCountRef.current += 1;
      const movingUpFast = lastYRef.current - event.clientY >= minUpwardDeltaPx;
      if (isArmed() && movingUpFast && event.clientY <= topBoundaryPx) {
        markTriggered();
      }
      lastYRef.current = event.clientY;
    };

    const handleMouseExit = (event: MouseEvent) => {
      const leftFromTop = event.clientY <= topBoundaryPx;
      const leavingViewport = !event.relatedTarget;
      if (isArmed() && leftFromTop && leavingViewport) {
        markTriggered();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const triesToCloseTab = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "w";
      if (!triesToCloseTab || !isArmed()) return;

      event.preventDefault();
      markTriggered();
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!beforeUnloadFallback || !isArmed()) return;

      markTriggered();
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    document.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseout", handleMouseExit);
    document.addEventListener("mouseleave", handleMouseExit);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseout", handleMouseExit);
      document.removeEventListener("mouseleave", handleMouseExit);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [
    beforeUnloadFallback,
    cooldownHours,
    enabled,
    minScrollY,
    minTimeOnPageMs,
    minUpwardDeltaPx,
    onExitIntent,
    sessionKey,
    topBoundaryPx,
  ]);
}
