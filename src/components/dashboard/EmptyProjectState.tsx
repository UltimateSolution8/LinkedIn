import { FolderKanban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function EmptyProjectState() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-h-screen overflow-hidden">
      <div className="max-w-[600px] w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
            <FolderKanban className="text-purple-600 w-8 h-8" />
          </div>
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-neutral-950 dark:text-white text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
            Welcome to Rixly!
          </h1>
          <p className="text-purple-600 dark:text-purple-400 text-lg md:text-xl font-medium mt-2">
            Let's find your first lead
          </p>
        </div>

        {/* Description */}
        <div className="px-4">
          <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed">
            Create a project to discover high-intent leads on Reddit.
            We'll scan for pain points and relevant conversations automatically.
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-2 flex flex-col items-center gap-3">
          <Button
            onClick={() => navigate("/create-project")}
            size="lg"
            className="inline-flex items-center justify-center px-8 py-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 text-base"
          >
            <FolderKanban className="mr-2 w-5 h-5" />
            Create Your First Project
          </Button>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Takes less than 2 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
