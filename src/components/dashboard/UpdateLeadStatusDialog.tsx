import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateLeadStatus, type Post } from "@/lib/api/posts";

interface UpdateLeadStatusDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Post | null;
  onStatusUpdated: (updatedLead: Post) => void;
}

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "FOLLOW_UP_SCHEDULED", label: "Follow-up Scheduled" },
  { value: "CONVERTED", label: "Converted" },
  { value: "NOT_INTERESTED", label: "Not Interested" },
  { value: "DUPLICATE", label: "Duplicate" },
  { value: "DONE", label: "Done" },
];

const REASON_OPTIONS = [
  { value: "not_relevant", label: "Not relevant" },
  { value: "budget_constraints", label: "Budget constraints" },
  { value: "competitor", label: "Competitor / already using" },
  { value: "spam", label: "Spam / bot" },
  { value: "other", label: "Other" },
];

export default function UpdateLeadStatusDialog({
  isOpen,
  onOpenChange,
  lead,
  onStatusUpdated,
}: UpdateLeadStatusDialogProps) {
  const [status, setStatus] = useState<string>("");
  const [followUpAt, setFollowUpAt] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [statusReason, setStatusReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when dialog opens/closes or lead changes
  useEffect(() => {
    if (isOpen && lead) {
      setStatus(lead.status || "NEW");
      setFollowUpAt(lead.followUpAt ? new Date(lead.followUpAt).toISOString().slice(0, 16) : "");
      setNotes(lead.notes || "");
      setStatusReason(lead.statusReason || "");
      setError(null);
    }
  }, [isOpen, lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const updateData = {
        status: status as any,
        ...(status === "FOLLOW_UP_SCHEDULED" && followUpAt && { followUpAt }),
        ...(notes.trim() && { notes: notes.trim() }),
        ...((status === "NOT_INTERESTED" || status === "DUPLICATE") && statusReason && { statusReason }),
      };

      const response = await updateLeadStatus(lead.leadId, updateData);
      onStatusUpdated(response.data);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showFollowUpField = status === "FOLLOW_UP_SCHEDULED";
  const showReasonField = status === "NOT_INTERESTED" || status === "DUPLICATE";
  const showOtherReasonInput = showReasonField && statusReason === "other";

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Lead Status</DialogTitle>
          <DialogDescription>
            Update the status for this lead. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={status} onValueChange={setStatus} required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Follow-up Date/Time */}
          {showFollowUpField && (
            <div className="space-y-2">
              <Label htmlFor="followUpAt">Follow-up Date & Time *</Label>
              <Input
                id="followUpAt"
                type="datetime-local"
                value={followUpAt}
                onChange={(e) => setFollowUpAt(e.target.value)}
                required={showFollowUpField}
                min={new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 16)}
              />
              <p className="text-sm text-neutral-500">
                Must be at least 5 minutes from now
              </p>
            </div>
          )}

          {/* Reason */}
          {showReasonField && (
            <div className="space-y-2">
              <Label htmlFor="statusReason">Reason</Label>
              <Select value={statusReason} onValueChange={setStatusReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {REASON_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Other Reason Input */}
          {showOtherReasonInput && (
            <div className="space-y-2">
              <Label htmlFor="otherReason">Specify Reason</Label>
              <Input
                id="otherReason"
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="Please specify..."
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
              maxLength={1000}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-sm text-neutral-500">
              {notes.length}/1000 characters
            </p>
          </div>


          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}