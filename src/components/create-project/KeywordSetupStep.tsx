
import { useState, useEffect } from "react";
import { Sparkles, X, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { generateKeywords } from "@/lib/api/projects";
import { getSubscriptionStatusCached } from "@/lib/utils/subscription";

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
  targetAudience?: string[];
  valuePropositions?: string[];
}

export default function KeywordSetupStep({
  onNext,
  onBack,
  keywords,
  onKeywordsChange,
  productDescription,
  targetAudience,
  valuePropositions,
}: KeywordSetupStepProps) {
  const [keywordInput, setKeywordInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [maxKeywords, setMaxKeywords] = useState(30);
  const minKeywords = 25;

  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const subStatus = await getSubscriptionStatusCached();
        if (subStatus?.subscription?.planDetails?.maxKeywords) {
          setMaxKeywords(subStatus.subscription.planDetails.maxKeywords);
        }
      } catch { /* keep default 30 */ }
    };
    fetchLimits();
  }, []);

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      const newKeyword: Keyword = {
        id: Date.now().toString(),
        text: keywordInput.trim(),
        isAIGenerated: false,
      };
      if (keywords.length < maxKeywords) {
        onKeywordsChange([...keywords, newKeyword]);
        setKeywordInput("");
      }
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
        targetAudience: targetAudience,
        valuePropositions: valuePropositions,
      });

      if (response.data.keywords && response.data.keywords.length > 0) {
        const aiKeywords: Keyword[] = response.data.keywords.map((keyword, index) => ({
          id: Date.now().toString() + `-${index}`,
          text: keyword,
          isAIGenerated: true,
        }));
        const merged = [...keywords, ...aiKeywords].slice(0, maxKeywords);
        onKeywordsChange(merged);
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
              className="border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 focus-visible:ring-teal-600/50 focus-visible:border-teal-600"
            />
            <Button
              type="button"
              onClick={handleAddKeyword}
              disabled={keywords.length >= maxKeywords}
              className="flex-shrink-0 bg-teal-600 hover:bg-teal-700 text-white px-6 disabled:opacity-50"
            >
              Add
            </Button>
          </div>

          {/* AI Generator Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleAIGenerate}
            disabled={isGenerating || !productDescription || keywords.length >= maxKeywords}
            className="w-full border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
                <span>Generating Keywords...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-teal-600" />
                <span>AI Keyword Generator</span>
              </>
            )}
          </Button>
          {generationError && (
            <p className="text-sm text-red-500">{generationError}</p>
          )}

          {/* Minimum Keywords Warning */}
          {keywords.length < minKeywords && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                You need at least <strong>{minKeywords} keywords</strong> to proceed. Use the <strong>AI Keyword Generator</strong> above to get started quickly.
              </p>
            </div>
          )}
        </div>

        {/* Keywords Display */}
        <div className="flex flex-col gap-3 rounded-lg bg-neutral-100 dark:bg-neutral-900/50 p-4 min-h-[12rem]">
          {/* Keyword Counter */}
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Your Keywords</h4>
            <span className={`text-sm font-medium ${keywords.length >= maxKeywords ? "text-green-600 dark:text-green-500" : "text-amber-600 dark:text-amber-500"}`}>
              {keywords.length} / {maxKeywords} keywords
            </span>
          </div>
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
          disabled={keywords.length < minKeywords}
          className="min-w-[84px] bg-teal-600 hover:bg-teal-700 text-white gap-2"
        >
          <span>Next</span>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
