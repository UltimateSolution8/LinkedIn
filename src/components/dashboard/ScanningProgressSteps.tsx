interface ScanningProgressStepsProps {
  stage: 'idle' | 'validating_subreddits' | 'scoring_leads' | 'completed' | 'failed';
  subreddits?: string[];
}

export default function ScanningProgressSteps({ stage, subreddits = [] }: ScanningProgressStepsProps) {
  // Map stage to current step
  const getCurrentStep = () => {
    switch (stage) {
      case 'idle':
        return 2;
      case 'validating_subreddits':
        return 3;
      case 'scoring_leads':
        return 4;
      case 'completed':
        return 5;
      case 'failed':
        return 1; // Show first step only if failed
      default:
        return 1;
    }
  };

  const currentStep = getCurrentStep();

  // Format subreddit list for display
  const subredditDisplay = subreddits.length > 0
    ? subreddits.slice(0, 3).map(s => `r/${s}`).join(", ") + (subreddits.length > 3 ? "..." : "")
    : "Searching subreddits...";

  const steps = [
    {
      id: 1,
      title: "Project created",
      subtitle: "Keywords and subreddits configured",
      icon: "check"
    },
    {
      id: 2,
      title: "Preparing your scan...",
      subtitle: "Getting ready to search Reddit",
      icon: "spinner"
    },
    {
      id: 3,
      title: `Scanning ${subreddits.length} subreddit${subreddits.length !== 1 ? 's' : ''}`,
      subtitle: subredditDisplay,
      icon: "spinner"
    },
    {
      id: 4,
      title: "AI scoring leads",
      subtitle: null,
      icon: "spinner"
    },
    {
      id: 5,
      title: "Leads are flowing into your Leads tab",
      subtitle: "Dashboard unlocks automatically",
      icon: "dot"
    }
  ];

  return (
    <section
      className="bg-white rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden"
      data-purpose="activity-stepper"
    >
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
        <h3 className="font-semibold text-neutral-800 dark:text-white text-sm md:text-base">What's happening</h3>
      </div>

      <div className="p-4 md:p-8">
        <div className="space-y-6 md:space-y-8 relative">
          {/* Vertical Line Connector */}
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-neutral-100 dark:bg-neutral-800"></div>

          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;
            const isInactive = step.id > currentStep;

            return (
              <div
                key={step.id}
                className={`relative flex items-center gap-4 ${isInactive ? 'opacity-50' : ''}`}
              >
                {/* Step Icon */}
                <div
                  className={`z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-primary text-white'
                      : isActive
                      ? 'bg-teal-50 dark:bg-teal-900/30 border-2 border-primary text-primary'
                      : 'bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-400'
                  }`}
                >
                  {step.icon === 'check' && (
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clipRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        fillRule="evenodd"
                      />
                    </svg>
                  )}

                  {step.icon === 'spinner' && isActive && (
                    <svg
                      className="h-5 w-5 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  )}

                  {step.icon === 'dot' && (
                    <div className={`h-2 w-2 rounded-full ${
                      isInactive ? 'bg-neutral-300 dark:bg-neutral-600' : 'bg-primary'
                    }`}></div>
                  )}
                </div>

                {/* Step Content */}
                <div>
                  <p className={`text-sm font-semibold ${
                    isInactive ? 'text-neutral-500' : 'text-neutral-900 dark:text-white'
                  }`}>
                    {step.title}
                  </p>
                  {step.subtitle && (
                    <p className={`text-xs ${
                      isInactive ? 'text-neutral-400' : 'text-neutral-500 dark:text-neutral-400'
                    }`}>
                      {step.subtitle}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
