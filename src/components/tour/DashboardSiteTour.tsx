import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
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
    setCurrentStep(0);
    setSteps(availableSteps);

    if (availableSteps.length === 0) {
      onClose(false);
    }
  }, [baseSteps, isOpen, onClose]);

  const handleSetIsOpen: Dispatch<SetStateAction<boolean>> = (value) => {
    const nextValue = typeof value === "function" ? value(isOpen) : value;
    if (!nextValue) {
      onClose(completedRef.current);
    }
  };

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
        button: (base, state) => ({
          ...base,
          borderRadius: 10,
          backgroundColor: state?.disabled ? "#94a3b8" : "#0f766e",
          color: "#ffffff",
          border: "none",
          padding: "8px 14px",
          fontSize: "13px",
          fontWeight: 600,
        }),
        close: (base) => ({
          ...base,
          right: 10,
          top: 10,
          color: "#475569",
        }),
        badge: (base) => ({
          ...base,
          backgroundColor: "#ccfbf1",
          color: "#115e59",
          fontWeight: 700,
        }),
      }}
      prevButton={({ Button, currentStep, setCurrentStep }) =>
        currentStep > 0 ? (
          <Button onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}>Back</Button>
        ) : null
      }
      nextButton={({ Button, currentStep, stepsLength, setCurrentStep, setIsOpen }) => {
        const isLast = currentStep === stepsLength - 1;
        return (
          <Button
            onClick={() => {
              if (isLast) {
                completedRef.current = true;
                setIsOpen(false);
                return;
              }
              setCurrentStep((prev) => Math.min(prev + 1, stepsLength - 1));
            }}
          >
            {isLast ? "Finish" : "Next"}
          </Button>
        );
      }}
      onClickClose={({ setIsOpen }) => {
        if (!completedRef.current) {
          setIsOpen(false);
        }
      }}
      onClickMask={({ setIsOpen }) => {
        if (!completedRef.current) {
          setIsOpen(false);
        }
      }}
    />
  );
}
