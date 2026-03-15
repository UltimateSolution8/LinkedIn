import { useNavigate } from "react-router-dom";

interface WhileYouWaitProps {
  onAddProject?: () => void;
  onEditSettings?: () => void;
}

export default function WhileYouWait({ onAddProject, onEditSettings }: WhileYouWaitProps) {
  const navigate = useNavigate();

  const handleAddProject = () => {
    if (onAddProject) {
      onAddProject();
    } else {
      navigate("/projects/new");
    }
  };

  const handleEditSettings = () => {
    if (onEditSettings) {
      onEditSettings();
    } else {
      navigate("/settings");
    }
  };

  const tips = [
    "Draft 2–3 reply angles for your product",
    "Set up follow-up tracking in Settings",
    "Add a second project while this runs"
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-6" data-purpose="preparation-panel">
      {/* Main Tips Panel */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-4 md:p-8">
        <h3 className="font-semibold text-neutral-800 dark:text-white text-base md:text-lg mb-3 md:mb-4">
          While you wait...
        </h3>
        <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mb-4 md:mb-6 leading-relaxed">
          Your first scan usually surfaces 15–40 leads. Here's what to prepare:
        </p>

        {/* Tips List */}
        <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0"></div>
              <p className="text-xs md:text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                {tip}
              </p>
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 md:gap-3">
          <button
            onClick={handleAddProject}
            className="w-full bg-primary hover:bg-teal-600 text-white font-semibold py-2 md:py-2.5 px-4 rounded-lg transition-all shadow-sm text-sm md:text-base"
          >
            Add another project
          </button>
          <button
            onClick={handleEditSettings}
            className="w-full bg-white dark:bg-neutral-900 border border-primary text-primary hover:bg-teal-50 dark:hover:bg-teal-900/30 font-semibold py-2 md:py-2.5 px-4 rounded-lg transition-all text-sm md:text-base"
          >
            Edit settings
          </button>
        </div>
      </div>

      {/* Help Widget */}
      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-700">
        <p className="text-[10px] md:text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2">
          Need help?
        </p>
        <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
          Check out our{" "}
          <a
            href="#"
            className="text-primary font-semibold underline underline-offset-2 hover:text-teal-600"
          >
            Quick Start Guide
          </a>{" "}
          for making the most of your first batch of leads.
        </p>
      </div>
    </div>
  );
}
