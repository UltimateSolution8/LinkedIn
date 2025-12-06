"use client";

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
import { getGeneratedComments, generatePostComment } from "@/lib/api/posts";

type Tone = "friendly" | "professional" | "casual";
type Length = "short" | "medium";

interface GenerateCommentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  postTitle: string;
}

export default function GenerateCommentDialog({
  isOpen,
  onOpenChange,
  leadId,
  postTitle,
}: GenerateCommentDialogProps) {
  const [isGeneratingComment, setIsGeneratingComment] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [cachedComments, setCachedComments] = useState<string[]>([]);
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);
  const [responseError, setResponseError] = useState<string>("");
  const [tone, setTone] = useState<Tone>("friendly");
  const [length, setLength] = useState<Length>("medium");
  const [remainingAttempts, setRemainingAttempts] = useState(2);

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

  // Load previous comments when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadPreviousComments();
    }
  }, [isOpen, leadId]);

  const loadPreviousComments = async () => {
    setResponseError("");
    setIsLoadingComments(true);

    try {
      const response = await getGeneratedComments(leadId);
      const comments = response.data.messages.map((comment) => comment.inviteMessage);
      setCachedComments(comments);
      setRemainingAttempts(response.data.remainingAttempts);
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
      const response = await generatePostComment(leadId, tone, length);
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

    // Show success message (you could add a toast notification here)
    alert("Comment copied to clipboard!");
  };

  const currentComment = cachedComments[currentCommentIndex] || "";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Generate Comment for Post</DialogTitle>
          <DialogDescription className="line-clamp-2">
            {postTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 flex-1 min-h-0">
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
                        ? "border-purple-600 bg-purple-50 dark:bg-purple-950 dark:border-purple-400"
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
                        ? "border-purple-600 bg-purple-50 dark:bg-purple-950 dark:border-purple-400"
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
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateComment}
            disabled={isGeneratingComment || remainingAttempts <= 0 || isLoadingComments}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700"
          >
            {isGeneratingComment ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                <span className="text-xs">Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                <span className="text-xs">Generate Comment ({remainingAttempts} remaining)</span>
              </>
            )}
          </Button>

          {/* Error Display */}
          {responseError && (
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-xs">{responseError}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoadingComments && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-5 h-5 animate-spin text-purple-600 dark:text-purple-400" />
              <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
                Loading previous comments...
              </span>
            </div>
          )}

          {/* Comment Display Area with Navigation */}
          {!isLoadingComments && cachedComments.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-neutral-950 dark:text-white">
                  Generated Comment
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
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700"
            >
              <MessageSquare className="w-3.5 h-3.5 mr-2" />
              <span className="text-xs">Copy Comment</span>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
