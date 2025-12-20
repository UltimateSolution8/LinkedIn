
import { useState } from "react";
import { Sparkles, X, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { generateKeywords } from "@/lib/api/projects";

export interface Keyword {
  id: string;
  text: string;
  isAIGenerated: boolean;
}

interface KeywordSetupStepProps {
  onNext: () => void;
  onBack: () => void;
  keywords: Keyword[];
  onKeywordsChange: (keywords: Keyword[]) => void;
  productDescription: string;
}

export default function KeywordSetupStep({
  onNext,
  onBack,
  keywords,
  onKeywordsChange,
  productDescription,
}: KeywordSetupStepProps) {
  const [keywordInput, setKeywordInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      const newKeyword: Keyword = {
        id: Date.now().toString(),
        text: keywordInput.trim(),
        isAIGenerated: false,
      };
      onKeywordsChange([...keywords, newKeyword]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (id: string) => {
    onKeywordsChange(keywords.filter((k) => k.id !== id));
  };

  const handleAIGenerate = async () => {
    if (!productDescription) {
      setGenerationError("Product description is required to generate keywords");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await generateKeywords({
        productDescription: productDescription,
      });

      if (response.data.keywords && response.data.keywords.length > 0) {
        const aiKeywords: Keyword[] = response.data.keywords.map((keyword, index) => ({
          id: Date.now().toString() + `-${index}`,
          text: keyword,
          isAIGenerated: true,
        }));
        onKeywordsChange([...keywords, ...aiKeywords]);
      }
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : "Failed to generate keywords"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <div className="flex flex-col items-stretch justify-start rounded-xl shadow-sm bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
      <div className="flex w-full grow flex-col items-stretch justify-center gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <p className="text-neutral-950 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            Keywords to Track
          </p>

          {/* Keyword Input */}
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Enter a keyword..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 focus-visible:ring-purple-600/50 focus-visible:border-purple-600"
            />
            <Button
              type="button"
              onClick={handleAddKeyword}
              className="flex-shrink-0 bg-purple-600 hover:bg-purple-700 text-white px-6"
            >
              Add
            </Button>
          </div>

          {/* AI Generator Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleAIGenerate}
            disabled={isGenerating || !productDescription}
            className="w-full border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                <span>Generating Keywords...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>AI Keyword Generator</span>
              </>
            )}
          </Button>
          {generationError && (
            <p className="text-sm text-red-500">{generationError}</p>
          )}
        </div>

        {/* Keywords Display */}
        <div className="flex flex-col gap-3 rounded-lg bg-neutral-100 dark:bg-neutral-900/50 p-4 min-h-[12rem]">
          <div className="flex flex-wrap gap-3">
            {keywords.length === 0 ? (
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                No keywords added yet. Add keywords manually or use the AI generator.
              </p>
            ) : (
              keywords.map((keyword) => (
                <div
                  key={keyword.id}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium shadow-sm ${
                    keyword.isAIGenerated
                      ? "bg-teal-500/10 dark:bg-teal-400/20 border border-teal-500/20 dark:border-teal-400/30 text-teal-700 dark:text-teal-300"
                      : "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200"
                  }`}
                >
                  <span>{keyword.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword.id)}
                    className={`cursor-pointer transition-colors ${
                      keyword.isAIGenerated
                        ? "text-teal-600/70 dark:text-teal-300/80 hover:text-teal-600 dark:hover:text-teal-300"
                        : "text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center gap-4 p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 rounded-b-xl">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="min-w-[84px] border-neutral-300 dark:border-neutral-700"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="min-w-[84px] bg-purple-600 hover:bg-purple-700 text-white gap-2"
        >
          <span>Next</span>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
