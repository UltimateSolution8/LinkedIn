import { FolderKanban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function EmptyProjectState() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-[calc(100vh-200px)]">
      <div className="max-w-[640px] w-full text-center space-y-10">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
            <FolderKanban className="text-purple-600 w-8 h-8" />
          </div>
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-neutral-950 dark:text-white text-[32px] md:text-[40px] font-semibold tracking-tight leading-tight">
            Find your next opportunity
          </h1>
        </div>

        {/* Description */}
        <div className="px-8">
          <p className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed font-normal">
            Create your first project to start monitoring Reddit.
            Rixly will begin scanning for pain points, intent-rich discussions,
            and relevant conversations in real-time.
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-4 flex flex-col items-center gap-4">
          <Button
            onClick={() => navigate("/create-project")}
            className="inline-flex items-center justify-center px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all shadow-md shadow-purple-600/10"
          >
            <FolderKanban className="mr-2 w-5 h-5" />
            Create your first project
          </Button>
          <p className="text-sm text-neutral-400 dark:text-neutral-500">
            Takes less than 2 minutes to set up
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-30">
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600"></div>
        </div>
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">
          Getting Started
        </span>
      </div>
    </div>
  );
}
