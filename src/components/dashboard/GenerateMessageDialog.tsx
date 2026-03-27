
import { useState, useEffect } from "react";
import { Sparkles, Loader2, Send, ChevronLeft, ChevronRight } from "lucide-react";
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
import { generateLeadResponse, getInviteMessages } from "@/lib/api/leads";

type Tone = "friendly" | "professional" | "casual";
type Length = "short" | "medium";

interface GenerateMessageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  username: string;
}

export default function GenerateMessageDialog({
  isOpen,
  onOpenChange,
  leadId,
  username,
}: GenerateMessageDialogProps) {
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [cachedMessages, setCachedMessages] = useState<string[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [responseError, setResponseError] = useState<string>("");
  const [tone, setTone] = useState<Tone>("friendly");
  const [length, setLength] = useState<Length>("medium");
  const [remainingAttempts, setRemainingAttempts] = useState(2);
  const [monthlyUsed, setMonthlyUsed] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState<number | null>(null);

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

  // Load previous messages when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadPreviousMessages();
    }
  }, [isOpen, leadId]);

  const loadPreviousMessages = async () => {
    setResponseError("");
    setIsLoadingMessages(true);

    try {
      const response = await getInviteMessages(leadId);

      // Extract invite messages from the response
      const messages = response.data.messages.map((msg) => msg.message);
      setCachedMessages(messages);

      // Set current index to last message if there are any
      if (messages.length > 0) {
        setCurrentMessageIndex(messages.length - 1);
      }

      // Update remaining attempts from API
      setRemainingAttempts(response.data.remainingAttempts);
    } catch (error) {
      setResponseError(
        error instanceof Error ? error.message : "Failed to load previous messages"
      );
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleGenerateResponse = async () => {
    if (remainingAttempts <= 0) {
      setResponseError("No remaining attempts. Please refresh to check for more.");
      return;
    }

    setIsGeneratingResponse(true);
    setResponseError("");
    try {
      const response = await generateLeadResponse(leadId, tone, length);
      const newMessage = response.data.message;

      const newMessages = [...cachedMessages, newMessage];
      // Add to cache
      setCachedMessages(newMessages);

      // Set current index to the new message (use callback to get updated length)
      setCachedMessages((prev) => {
        setCurrentMessageIndex(prev.length - 1);
        return prev;
      });

      // Decrement remaining attempts
      setRemainingAttempts((prev) => prev - 1);

      // Update monthly usage from API response
      if ((response.data as any).monthlyUsed !== undefined) {
        setMonthlyUsed((response.data as any).monthlyUsed);
        setMonthlyLimit((response.data as any).monthlyLimit);
      }

    } catch (error) {
      setResponseError(
        error instanceof Error ? error.message : "Failed to generate response"
      );
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const handleNavigateMessage = (direction: "prev" | "next") => {
    if (direction === "prev" && currentMessageIndex > 0) {
      setCurrentMessageIndex((prev) => prev - 1);
    } else if (direction === "next" && currentMessageIndex < cachedMessages.length - 1) {
      setCurrentMessageIndex((prev) => prev + 1);
    }
  };

  const handleSendDM = () => {
    const currentMessage = cachedMessages[currentMessageIndex];
    if (!currentMessage) return;

    const cleanUsername = username.replace("u/", "");
    const encodedMessage = encodeURIComponent(currentMessage);
    const dmUrl = `https://reddit.com/message/compose/?to=${cleanUsername}&message=${encodedMessage}`;

    // Copy to clipboard
    navigator.clipboard.writeText(currentMessage);

    // Open Reddit DM
    window.open(dmUrl, "_blank");
  };

  const currentMessage = cachedMessages[currentMessageIndex] || "";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Generate Response for {username}</DialogTitle>
          <DialogDescription>
            Customize your message settings and navigate between generated responses
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
                    className={`py-1.5 px-2 rounded-md border-2 transition-all ${tone === option.value
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
                    className={`py-1.5 px-2 rounded-md border-2 transition-all ${length === option.value
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
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateResponse}
            disabled={isGeneratingResponse || remainingAttempts <= 0 || isLoadingMessages || (monthlyLimit !== null && monthlyUsed >= monthlyLimit)}
            className="w-full py-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700"
          >
            {isGeneratingResponse ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                <span className="text-xs">Generating...</span>
              </>
            ) : monthlyLimit !== null && monthlyUsed >= monthlyLimit ? (
              <span className="text-xs">Monthly limit reached ({monthlyUsed}/{monthlyLimit})</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                <span className="text-xs">Generate Message ({remainingAttempts} remaining)</span>
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
          {isLoadingMessages && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-5 h-5 animate-spin text-teal-600 dark:text-teal-400" />
              <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
                Loading previous messages...
              </span>
            </div>
          )}

          {/* Message Display Area with Navigation */}
          {!isLoadingMessages && cachedMessages.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-neutral-950 dark:text-white">
                  Generated Message
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleNavigateMessage("prev")}
                    disabled={currentMessageIndex === 0}
                    className="h-7 w-7"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </Button>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {currentMessageIndex + 1} / {cachedMessages.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleNavigateMessage("next")}
                    disabled={currentMessageIndex === cachedMessages.length - 1}
                    className="h-7 w-7"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <div className="w-full h-[160px] p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-white text-xs leading-relaxed overflow-y-auto whitespace-pre-wrap">
                {currentMessage}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Send DM Button */}
        {!isLoadingMessages && cachedMessages.length > 0 && (
          <DialogFooter className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <Button
              onClick={handleSendDM}
              className="w-full py-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700"
            >
              <Send className="w-3.5 h-3.5 mr-2" />
              <span className="text-xs">Send DM</span>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
