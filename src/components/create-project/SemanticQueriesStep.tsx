
import { useState } from "react";
import { X, Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { generateSemanticQueries } from "@/lib/api/projects";

export interface SemanticQuery {
  id: string;
  text: string;
}

interface SemanticQueriesStepProps {
  onNext: () => void;
  onBack: () => void;
  queries: SemanticQuery[];
  onQueriesChange: (queries: SemanticQuery[]) => void;
  productDescription: string;
}

export default function SemanticQueriesStep({
  onNext,
  onBack,
  queries,
  onQueriesChange,
  productDescription,
}: SemanticQueriesStepProps) {
  const [queryInput, setQueryInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

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

  const handleAIGenerate = async () => {
    if (!productDescription) {
      setGenerationError("Product description is required to generate queries");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await generateSemanticQueries({
        productDescription: productDescription,
      });

      if (response.data.queries && response.data.queries.length > 0) {
        const aiQueries: SemanticQuery[] = response.data.queries.map((query, index) => ({
          id: Date.now().toString() + `-${index}`,
          text: query,
        }));
        onQueriesChange([...queries, ...aiQueries]);
      }
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : "Failed to generate semantic queries"
      );
    } finally {
      setIsGenerating(false);
    }
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
      <div className="flex flex-col gap-4">
        {/* Text Field + Add Button */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="semantic-query"
            className="text-sm font-medium leading-normal text-neutral-950 dark:text-white"
          >
            Add a semantic query
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="semantic-query"
              type="text"
              placeholder="e.g., How can I automate social media posting?"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 focus-visible:ring-purple-600/50"
            />
            <Button
              type="button"
              onClick={handleAddQuery}
              className="flex-shrink-0 bg-purple-600 hover:bg-purple-700 text-white px-6"
            >
              Add
            </Button>
          </div>
        </div>

        {/* Generate AI Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleAIGenerate}
          disabled={isGenerating}
          className="w-full border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
              <span>Generating Queries...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>Generate with AI</span>
            </>
          )}
        </Button>
        {generationError && (
          <p className="text-sm text-red-500">{generationError}</p>
        )}
      </div>

      {/* Query Display Container */}
      <div className="flex flex-col gap-3 rounded-lg bg-neutral-100 dark:bg-neutral-900/50 p-4 min-h-[12rem]">
        {queries.length === 0 ? (
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            No queries added yet. Add queries manually or use AI generation.
          </p>
        ) : (
          queries.map((query) => (
            <div
              key={query.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-purple-600/10 dark:bg-purple-600/20 border border-purple-600/20 dark:border-purple-600/30 px-4 py-3 text-purple-700 dark:text-purple-300"
            >
              <p className="text-sm font-medium leading-normal flex-1">{query.text}</p>
              <button
                type="button"
                onClick={() => handleRemoveQuery(query.id)}
                className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-purple-600/20 dark:hover:bg-purple-600/40 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="w-full sm:w-auto min-w-[84px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto min-w-[84px] bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20 transition-colors"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
