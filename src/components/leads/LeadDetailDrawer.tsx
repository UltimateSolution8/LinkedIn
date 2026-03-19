import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Star, CalendarClock, CheckCircle2, Archive, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getLeadDetails, type Lead, type LeadDetailsResponse } from "@/lib/api/leads";
import GenerateCommentDialog from "@/components/dashboard/GenerateCommentDialog";

interface LeadDetailDrawerProps {
  open: boolean;
  lead: Lead | null;
  onOpenChange: (open: boolean) => void;
  onToggleStar: (lead: Lead) => Promise<void>;
  onSetFollowUp: (lead: Lead, followUpAt: string | null) => Promise<void>;
  onMarkContacted: (lead: Lead, replyText: string, tone: "casual" | "professional" | "friendly") => Promise<void>;
  onArchive: (lead: Lead) => Promise<void>;
}

function defaultTomorrowIsoLocal() {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  tomorrow.setHours(10, 0, 0, 0);
  return tomorrow.toISOString().slice(0, 16);
}

export default function LeadDetailDrawer({
  open,
  lead,
  onOpenChange,
  onToggleStar,
  onSetFollowUp,
  onMarkContacted,
  onArchive,
}: LeadDetailDrawerProps) {
  const [details, setDetails] = useState<LeadDetailsResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followUpAt, setFollowUpAt] = useState(defaultTomorrowIsoLocal());
  const [replyText, setReplyText] = useState("");
  const [replyTone, setReplyTone] = useState<"casual" | "professional" | "friendly">("friendly");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);

  useEffect(() => {
    if (!open || !lead) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const response = await getLeadDetails(String(lead.leadId));
        setDetails(response.data);
        setReplyText(response.data.replyStyle?.replyText ?? "");
        if (response.data.replyStyle?.tone === "casual" || response.data.replyStyle?.tone === "professional" || response.data.replyStyle?.tone === "friendly") {
          setReplyTone(response.data.replyStyle.tone);
        }
        const prefilledFollowUp = lead.followUpAt ? new Date(lead.followUpAt).toISOString().slice(0, 16) : defaultTomorrowIsoLocal();
        setFollowUpAt(prefilledFollowUp);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load lead details");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [open, lead]);

  const analysis = details?.analysisDetails;
  const drawerLead = details?.lead;

  const postedAt = useMemo(() => {
    if (!drawerLead?.originalPost.postedAt) return "Unknown";
    return new Date(drawerLead.originalPost.postedAt).toLocaleString();
  }, [drawerLead?.originalPost.postedAt]);

  const onSubmitFollowUp = async () => {
    if (!lead) return;
    setIsSubmitting(true);
    try {
      await onSetFollowUp(lead, new Date(followUpAt).toISOString());
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitContacted = async () => {
    if (!lead) return;
    setIsSubmitting(true);
    try {
      await onMarkContacted(lead, replyText, replyTone);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitArchive = async () => {
    if (!lead) return;
    setIsSubmitting(true);
    try {
      await onArchive(lead);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[600px] p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <SheetTitle className="text-left">
              {lead?.title ?? "Lead details"}
            </SheetTitle>
            {lead && (
              <div className="flex items-center gap-2 mt-3">
                <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 border-transparent">
                  r/{lead.subreddit}
                </Badge>
                <Badge variant="outline">{(lead.score ?? 0).toFixed(1)}</Badge>
              </div>
            )}
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading lead details...
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                {error}
              </div>
            )}

            {!isLoading && !error && details && (
              <>
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Original Post</h3>
                  <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-950">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                      {drawerLead?.originalPost.body || "No post body available."}
                    </p>
                    <div className="mt-3 text-xs text-neutral-500 flex items-center gap-2">
                      <span>by {drawerLead?.author || "Unknown"}</span>
                      <span>•</span>
                      <span>{postedAt}</span>
                    </div>
                    {drawerLead?.postUrl && (
                      <a
                        href={drawerLead.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-700 dark:text-teal-400"
                      >
                        Open on Reddit <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Top Comments</h3>
                  <div className="space-y-3">
                    {details.topComments.length === 0 && (
                      <p className="text-sm text-neutral-500">No comments found for this post.</p>
                    )}
                    {details.topComments.map((comment) => (
                      <div key={comment.commentId} className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
                        <div className="text-xs text-neutral-500 mb-2">
                          {comment.author} • score {comment.score}
                        </div>
                        <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-4">{comment.body}</p>
                        {comment.permalink && (
                          <a
                            href={comment.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-teal-700 dark:text-teal-400"
                          >
                            View on Reddit <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Pain Point Analysis</h3>
                  <div className="rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 p-4 text-sm text-orange-900 dark:text-orange-200">
                    {analysis?.painPoint || "No pain point extracted."}
                  </div>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Match Details</h3>
                  <div className="rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/20 p-4 space-y-3">
                    <p className="text-sm text-teal-900 dark:text-teal-200">{analysis?.whyPicked || "No match rationale available."}</p>
                    {analysis?.howToHelp && analysis.howToHelp.length > 0 && (
                      <ul className="text-sm text-teal-800 dark:text-teal-200 list-disc list-inside space-y-1">
                        {analysis.howToHelp.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Reply Capture</h3>
                  <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 space-y-3">
                    <textarea
                      value={replyText}
                      onChange={(event) => setReplyText(event.target.value)}
                      placeholder="What did you say?"
                      rows={4}
                      className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-2 text-sm text-neutral-900 dark:text-neutral-100"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        variant={replyTone === "casual" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setReplyTone("casual")}
                      >
                        Casual
                      </Button>
                      <Button
                        variant={replyTone === "professional" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setReplyTone("professional")}
                      >
                        Professional
                      </Button>
                      <Button
                        variant={replyTone === "friendly" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setReplyTone("friendly")}
                      >
                        Friendly
                      </Button>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>

          {lead && (
            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={lead.isStarred ? "default" : "outline"}
                  size="sm"
                  onClick={() => void onToggleStar(lead)}
                  disabled={isSubmitting}
                >
                  <Star className={`w-4 h-4 ${lead.isStarred ? "fill-current" : ""}`} />
                  {lead.isStarred ? "Starred" : "Star"}
                </Button>
                <div className="flex items-center gap-2">
                  <Input
                    type="datetime-local"
                    value={followUpAt}
                    onChange={(event) => setFollowUpAt(event.target.value)}
                    className="h-8 text-xs w-[190px]"
                    disabled={isSubmitting}
                  />
                  <Button size="sm" variant="outline" onClick={onSubmitFollowUp} disabled={isSubmitting}>
                    <CalendarClock className="w-4 h-4" />
                    Follow-up
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsCommentDialogOpen(true)}
                  disabled={isSubmitting}
                >
                  Generate Comment
                </Button>
                <Button size="sm" onClick={onSubmitContacted} disabled={isSubmitting}>
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Contacted
                </Button>
                <Button size="sm" variant="outline" onClick={onSubmitArchive} disabled={isSubmitting}>
                  <Archive className="w-4 h-4" />
                  Archive
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>

      <GenerateCommentDialog
        isOpen={isCommentDialogOpen}
        onOpenChange={setIsCommentDialogOpen}
        leadId={lead ? String(lead.leadId) : ""}
        postTitle={lead?.title ?? ""}
      />
    </Sheet>
  );
}
