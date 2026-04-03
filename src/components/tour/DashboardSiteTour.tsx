import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Tour, { StepType } from "@reactour/tour";

interface DashboardSiteTourProps {
  isOpen: boolean;
  onClose: (completed: boolean) => void;
}

interface TourStepConfig {
  selector: string;
  content: string;
  position?: StepType["position"];
}

function isElementVisible(element: Element | null): boolean {
  if (!element) return false;
  if (!(element instanceof HTMLElement)) return false;
  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden" && element.offsetParent !== null;
}

export default function DashboardSiteTour({ isOpen, onClose }: DashboardSiteTourProps) {
  const [steps, setSteps] = useState<StepType[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [disabledActions, setDisabledActions] = useState(false);
  const completedRef = useRef(false);
  const hasClosedRef = useRef(false);

  const safeClose = useCallback((completed: boolean) => {
    if (hasClosedRef.current) return;
    hasClosedRef.current = true;
    onClose(completed);
  }, [onClose]);

  const baseSteps = useMemo<TourStepConfig[]>(
    () => [
      {
        selector: '[data-tour="dashboard"]',
        content: "Welcome to your dashboard.",
        position: "bottom",
      },
      {
        selector: '[data-tour="leads"]',
        content: "Track and manage leads here.",
        position: "bottom",
      },
      {
        selector: '[data-tour="opportunities"]',
        content: "Move deals through opportunities.",
        position: "bottom",
      },
      {
        selector: '[data-tour="settings"]',
        content: "Adjust account and workspace settings here.",
        position: "bottom",
      },
    ],
    []
  );

  useEffect(() => {
    if (!isOpen) return;

    const availableSteps: StepType[] = baseSteps
      .filter((step) => isElementVisible(document.querySelector(step.selector)))
      .map((step) => ({
        ...step,
        action: (element) => {
          if (element instanceof HTMLElement) {
            element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
          }
        },
      }));

    completedRef.current = false;
    hasClosedRef.current = false;
    setCurrentStep(0);
    setSteps(availableSteps);

    if (availableSteps.length === 0) {
      safeClose(false);
    }
  }, [baseSteps, isOpen, safeClose]);

  const handleSetIsOpen: Dispatch<SetStateAction<boolean>> = (value) => {
    const nextValue = typeof value === "function" ? value(isOpen) : value;
    if (!nextValue) {
      onClose(completedRef.current);
    }
  };

  if (!isOpen || steps.length === 0) {
    return null;
  }

  return (
    <Tour
      isOpen={isOpen && steps.length > 0}
      setIsOpen={handleSetIsOpen}
      steps={steps}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      disabledActions={disabledActions}
      setDisabledActions={setDisabledActions}
      showBadge
      showCloseButton
      showNavigation
      showDots
      showPrevNextButtons
      disableFocusLock={false}
      scrollSmooth
      accessibilityOptions={{
        closeButtonAriaLabel: "Close site tour",
        showNavigationScreenReaders: true,
      }}
      styles={{
        popover: (base) => ({
          ...base,
          borderRadius: 12,
          boxShadow: "0 20px 40px rgba(2, 132, 199, 0.15)",
          backgroundColor: "var(--background, #ffffff)",
          color: "var(--foreground, #0f172a)",
          maxWidth: 320,
        }),
        button: (base) => ({
          ...base,
          borderRadius: 10,
          backgroundColor: "#0f766e", // Always teal
          color: "#ffffff",
          border: "none",
          padding: "8px 14px",
          fontSize: "13px",
          fontWeight: 600,
          opacity: 1, // Ensure visibility
          cursor: "pointer",
        }),
        close: (base) => ({
          ...base,
          right: 10,
          top: 10,
          color: "#475569",
          cursor: "pointer",
        }),
        badge: (base) => ({
          ...base,
          backgroundColor: "#ccfbf1",
          color: "#115e59",
          fontWeight: 700,
        }),
      }}
      prevButton={({ currentStep, setCurrentStep }) =>
        currentStep > 0 ? (
<<<<<<< HEAD
          <button
            type="button"
            className="px-6 py-2 bg-teal-600 text-white rounded-full text-xs font-bold hover:bg-teal-700 transition-colors uppercase tracking-wider shadow-sm"
=======
          <button 
            type="button"
            className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg text-xs font-bold hover:bg-neutral-300 transition-colors uppercase tracking-wider"
>>>>>>> b59175e (Dashboard tour clean up)
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
          >
            Back
          </button>
        ) : null
      }
      nextButton={({ currentStep, stepsLength, setCurrentStep, setIsOpen }) => {
        const isLast = currentStep === stepsLength - 1;
        return (
          <button
            type="button"
<<<<<<< HEAD
            className="px-6 py-2 bg-teal-600 text-white rounded-full text-xs font-bold hover:bg-teal-700 transition-colors uppercase tracking-wider shadow-sm"
=======
            className="px-6 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors uppercase tracking-wider shadow-sm"
>>>>>>> b59175e (Dashboard tour clean up)
            onClick={() => {
              if (isLast) {
                completedRef.current = true;
                setIsOpen(false);
                onClose(true);
                return;
              }
              setCurrentStep((prev) => Math.min(prev + 1, stepsLength - 1));
            }}
          >
            {isLast ? "Finish" : "Next"}
          </button>
        );
      }}
      onClickClose={({ setIsOpen }) => {
        setIsOpen(false);
        onClose(completedRef.current);
      }}
      onClickMask={({ setIsOpen }) => {
        setIsOpen(false);
        onClose(completedRef.current);
      }}
    />
  );
}
