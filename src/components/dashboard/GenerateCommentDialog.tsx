
import { useState, useEffect } from "react";
import { Sparkles, Loader2, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getGeneratedComments, generatePostComment, getCommentStrategies } from "@/lib/api/posts";
import { trackEvent } from "@/lib/analytics";


type Tone = "friendly" | "professional" | "casual";
type Length = "short" | "medium";

function formatApproach(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface GenerateCommentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  postTitle: string;
  messageType?: "comment" | "dm";
}

export default function GenerateCommentDialog({
  isOpen,
  onOpenChange,
  leadId,
  postTitle,
  messageType = "comment",
}: GenerateCommentDialogProps) {
  const [isGeneratingComment, setIsGeneratingComment] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [cachedComments, setCachedComments] = useState<string[]>([]);
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);
  const [responseError, setResponseError] = useState<string>("");
  const [tone, setTone] = useState<Tone>("friendly");
  const [length, setLength] = useState<Length>("medium");
  const [remainingAttempts, setRemainingAttempts] = useState(2);
  const [monthlyUsed, setMonthlyUsed] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState<number | null>(null);

  // Comment Approach (strategy) state — only used when messageType === "comment"
  const [approaches, setApproaches] = useState<string[]>([]);
  const [selectedApproach, setSelectedApproach] = useState<string | null>(null);
  const [recommendedApproach, setRecommendedApproach] = useState<string | null>(null);
  const [isLoadingApproaches, setIsLoadingApproaches] = useState(false);

  // Tone and Length options
  const toneOptions: { value: Tone; label: string }[] = [
    { value: "friendly", label: "Friendly" },
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
  ];

  const lengthOptions: { value: Length; label: string }[] = [
    { value: "short", label: "Short" },
    { value: "medium", label: "Medium" },
  ];

  // Load previous comments and strategies when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadPreviousComments();
      if (messageType === "comment") {
        loadApproaches();
      }
    }
  }, [isOpen, leadId]);

  const loadApproaches = async () => {
    setIsLoadingApproaches(true);
    try {
      const response = await getCommentStrategies(leadId);
      const { applicable, recommended } = response.data;
      setApproaches(applicable);
      setRecommendedApproach(recommended);
      setSelectedApproach(recommended);
    } catch {
      // Silently fail — strategy section simply won't show
      setApproaches([]);
      setRecommendedApproach(null);
      setSelectedApproach(null);
    } finally {
      setIsLoadingApproaches(false);
    }
  };

  const loadPreviousComments = async () => {
    setResponseError("");
    setIsLoadingComments(true);

    try {
      const response = await getGeneratedComments(leadId);
      const comments = response.data.messages.map((comment) => comment.message);
      setCachedComments(comments);
      setRemainingAttempts(response.data.remainingAttempts);

      // Update monthly usage from API response
      if ((response.data as any).monthlyUsed !== undefined) {
        setMonthlyUsed((response.data as any).monthlyUsed);
        setMonthlyLimit((response.data as any).monthlyLimit);
      }
    } catch (error) {
      setResponseError(
        error instanceof Error ? error.message : "Failed to load previous comments"
      );
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleGenerateComment = async () => {
    if (remainingAttempts <= 0) {
      setResponseError("No remaining attempts. Please refresh to check for more.");
      return;
    }

    setIsGeneratingComment(true);
    setResponseError("");
    try {
      const strategyToUse = messageType === "comment" ? (selectedApproach ?? undefined) : undefined;
      const response = await generatePostComment(leadId, tone, length, messageType, strategyToUse);
      const newComment = response.data.message;

      // Add to cache
      setCachedComments((prev) => [...prev, newComment]);

      // Set current index to the new comment
      setCachedComments((prev) => {
        setCurrentCommentIndex(prev.length - 1);
        return prev;
      });

      // Update remaining attempts from response
      setRemainingAttempts(response.data.remainingAttempts);
      // Update monthly usage from API response
      if ((response.data as any).monthlyUsed !== undefined) {
        setMonthlyUsed((response.data as any).monthlyUsed);
        setMonthlyLimit((response.data as any).monthlyLimit);
      }

      trackEvent('comment_generated');

    } catch (error) {
      setResponseError(
        error instanceof Error ? error.message : "Failed to generate comment"
      );
    } finally {
      setIsGeneratingComment(false);
    }
  };

  const handleNavigateComment = (direction: "prev" | "next") => {
    if (direction === "prev" && currentCommentIndex > 0) {
      setCurrentCommentIndex((prev) => prev - 1);
    } else if (direction === "next" && currentCommentIndex < cachedComments.length - 1) {
      setCurrentCommentIndex((prev) => prev + 1);
    }
  };

  const handleCopyComment = () => {
    const currentComment = cachedComments[currentCommentIndex];
    if (!currentComment) return;

    // Copy to clipboard
    navigator.clipboard.writeText(currentComment);

    trackEvent('comment_copied');


    // Show success message (you could add a toast notification here)
    alert("Comment copied to clipboard!");
  };

  const currentComment = cachedComments[currentCommentIndex] || "";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{messageType === "dm" ? "Generate DM" : "Generate Comment for Post"}</DialogTitle>
          <DialogDescription className="line-clamp-2">
            {postTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 flex-1 min-h-0 overflow-y-auto">
          {/* Customization Options */}
          <div className="space-y-3">
            {/* Tone Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-950 dark:text-white">
                Tone
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {toneOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTone(option.value)}
                    className={`py-1.5 px-2 rounded-md border-2 transition-all ${
                      tone === option.value
                        ? "border-teal-600 bg-teal-50 dark:bg-teal-950 dark:border-teal-400"
                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                    }`}
                  >
                    <div className="text-xs font-medium text-neutral-950 dark:text-white">
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Length Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-950 dark:text-white">
                Length
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {lengthOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setLength(option.value)}
                    className={`py-1.5 px-2 rounded-md border-2 transition-all ${
                      length === option.value
                        ? "border-teal-600 bg-teal-50 dark:bg-teal-950 dark:border-teal-400"
                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                    }`}
                  >
                    <div className="text-xs font-medium text-neutral-950 dark:text-white">
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Approach — only for opportunity (comment) mode */}
            {messageType === "comment" && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Label className="text-xs font-semibold text-neutral-950 dark:text-white">
                    Comment Approach
                  </Label>
                  <span className="text-xs text-neutral-400 dark:text-neutral-500">
                    AI-recommended based on post &amp; subreddit
                  </span>
                </div>

                {isLoadingApproaches ? (
                  <div className="flex items-center gap-2 py-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600 dark:text-teal-400" />
                    <span className="text-xs text-neutral-400">Analysing post...</span>
                  </div>
                ) : approaches.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {approaches.map((approach) => {
                      const isSelected = selectedApproach === approach;
                      const isRecommended = recommendedApproach === approach;
                      return (
                        <button
                          key={approach}
                          onClick={() => setSelectedApproach(approach)}
                          className={`relative py-1.5 px-3 rounded-md border-2 transition-all text-left ${
                            isSelected
                              ? "border-teal-600 bg-teal-50 dark:bg-teal-950 dark:border-teal-400"
                              : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-neutral-950 dark:text-white">
                              {formatApproach(approach)}
                            </span>
                            {isRecommended && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 leading-none">
                                Best fit
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateComment}
            disabled={isGeneratingComment || remainingAttempts <= 0 || isLoadingComments || (monthlyLimit !== null && monthlyUsed >= monthlyLimit)}
            className="w-full py-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700"
          >
            {isGeneratingComment ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                <span className="text-xs">Generating...</span>
              </>
            ) : monthlyLimit !== null && monthlyUsed >= monthlyLimit ? (
              <span className="text-xs">Monthly limit reached ({monthlyUsed}/{monthlyLimit})</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                <span className="text-xs">{messageType === "dm" ? "Generate DM" : "Generate Comment"} ({remainingAttempts} remaining)</span>
              </>
            )}
          </Button>

          {/* Monthly Usage Indicator */}
          {monthlyLimit !== null && (
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 px-1">
              <span>Monthly drafts: {monthlyUsed} / {monthlyLimit}</span>
              <div className="w-24 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${monthlyUsed >= monthlyLimit ? 'bg-red-500' : 'bg-teal-500'}`}
                  style={{ width: `${Math.min((monthlyUsed / monthlyLimit) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Display */}
          {responseError && (
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-xs">{responseError}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoadingComments && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-5 h-5 animate-spin text-teal-600 dark:text-teal-400" />
              <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
                {messageType === "dm" ? "Loading previous DMs..." : "Loading previous comments..."}
              </span>
            </div>
          )}

          {/* Comment Display Area with Navigation */}
          {!isLoadingComments && cachedComments.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-neutral-950 dark:text-white">
                  {messageType === "dm" ? "Generated DM" : "Generated Comment"}
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleNavigateComment("prev")}
                    disabled={currentCommentIndex === 0}
                    className="h-7 w-7"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </Button>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {currentCommentIndex + 1} / {cachedComments.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleNavigateComment("next")}
                    disabled={currentCommentIndex === cachedComments.length - 1}
                    className="h-7 w-7"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <div className="w-full h-[160px] p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-white text-xs leading-relaxed overflow-y-auto whitespace-pre-wrap">
                {currentComment}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Copy Comment Button */}
        {!isLoadingComments && cachedComments.length > 0 && (
          <DialogFooter className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <Button
              onClick={handleCopyComment}
              className="w-full py-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700"
            >
              <MessageSquare className="w-3.5 h-3.5 mr-2" />
              <span className="text-xs">{messageType === "dm" ? "Copy DM" : "Copy Comment"}</span>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
