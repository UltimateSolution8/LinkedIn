"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface SemanticQuery {
  id: string;
  text: string;
}

interface SemanticQueriesStepProps {
  onNext: () => void;
  onBack: () => void;
  queries: SemanticQuery[];
  onQueriesChange: (queries: SemanticQuery[]) => void;
  isSubmitting?: boolean;
  error?: string | null;
}

export default function SemanticQueriesStep({
  onNext,
  onBack,
  queries,
  onQueriesChange,
  isSubmitting = false,
  error = null,
}: SemanticQueriesStepProps) {
  const [queryInput, setQueryInput] = useState("");

  const handleAddQuery = () => {
    if (queryInput.trim()) {
      const newQuery: SemanticQuery = {
        id: Date.now().toString(),
        text: queryInput.trim(),
      };
      onQueriesChange([...queries, newQuery]);
      setQueryInput("");
    }
  };

  const handleRemoveQuery = (id: string) => {
    onQueriesChange(queries.filter((q) => q.id !== id));
  };

  const handleAIGenerate = () => {
    // TODO: Implement AI query generation
    // For now, add some sample queries
    const aiQueries: SemanticQuery[] = [
      { id: Date.now().toString() + "-1", text: "What is the best tool for lead generation?" },
      { id: Date.now().toString() + "-2", text: "How to find clients on Reddit?" },
      { id: Date.now().toString() + "-3", text: "Alternative to manual social media monitoring" },
    ];
    onQueriesChange([...queries, ...aiQueries]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddQuery();
    }
  };

  return (
    <div className="flex flex-col gap-8 rounded-xl bg-white dark:bg-neutral-950 p-6 sm:p-8 md:p-10 shadow-sm border border-neutral-200/50 dark:border-neutral-800">
      {/* Page Heading */}
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl text-neutral-950 dark:text-white">
          What questions are your ideal customers asking?
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Add semantic queries or questions that signal a user is looking for a solution like yours.
          Our AI will find conversations matching this intent.
        </p>
      </div>

      {/* Input Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        {/* Text Field */}
        <div className="flex flex-col flex-1">
          <Label
            htmlFor="semantic-query"
            className="text-sm font-medium leading-normal pb-2 text-neutral-950 dark:text-white"
          >
            Add a semantic query
          </Label>
          <Input
            id="semantic-query"
            type="text"
            placeholder="e.g., How can I automate social media posting?"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 focus-visible:ring-purple-600/50"
          />
        </div>

        {/* Generate AI Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleAIGenerate}
          className="h-12 px-5 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
        >
          Generate with AI
        </Button>
      </div>

      {/* Query Chips Container */}
      <div className="flex flex-col gap-4">
        <div className="w-full border-t border-neutral-200 dark:border-neutral-800"></div>

        {/* Chips */}
        <div className="flex gap-3 flex-wrap">
          {queries.length === 0 ? (
            <p className="text-neutral-500 dark:text-neutral-400 text-sm text-center w-full py-4">
              No queries added yet. Add queries manually or use AI generation.
            </p>
          ) : (
            queries.map((query) => (
              <div
                key={query.id}
                className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-purple-600/10 dark:bg-purple-600/20 pl-4 pr-2.5 text-purple-700 dark:text-purple-300"
              >
                <p className="text-sm font-medium leading-normal">{query.text}</p>
                <button
                  type="button"
                  onClick={() => handleRemoveQuery(query.id)}
                  className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-purple-600/20 dark:hover:bg-purple-600/40 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full sm:w-auto min-w-[84px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="w-full sm:w-auto min-w-[84px] bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating Project..." : "Complete Setup"}
        </Button>
      </div>
    </div>
  );
}
