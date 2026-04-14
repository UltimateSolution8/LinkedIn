import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getFeedbackStatus, submitFeedback, type FeedbackType } from "@/lib/api/feedback";

const FEEDBACK_TYPES: Array<{ value: FeedbackType; label: string }> = [
  { value: "general", label: "General feedback" },
  { value: "feature_request", label: "Feature request" },
  { value: "bug_report", label: "Bug report" },
  { value: "ui_ux", label: "UI/UX feedback" },
];

export default function FeedbackView() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { logout } = useAuth();

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  const [rating, setRating] = useState<number>(0);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("general");
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchStatus = async () => {
      try {
        setLoadingStatus(true);
        const status = await getFeedbackStatus();
        if (!mounted) return;
        setAlreadySubmitted(status.submitted);
        setSubmittedAt(status.submittedAt);
      } catch (statusError) {
        console.warn("[FeedbackView] Failed to fetch feedback status:", statusError);
      } finally {
        if (mounted) setLoadingStatus(false);
      }
    };

    void fetchStatus();
    return () => {
      mounted = false;
    };
  }, []);

  const formattedSubmittedAt = useMemo(() => {
    if (!submittedAt) return null;
    return new Date(submittedAt).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [submittedAt]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (alreadySubmitted) {
      setError("Feedback has already been submitted.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Please select a rating.");
      return;
    }

    const trimmedComments = comments.trim();
    if (trimmedComments.length < 5) {
      setError("Please share a short comment (minimum 5 characters).");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await submitFeedback({
        rating,
        feedbackType,
        comments: trimmedComments,
      });

      setAlreadySubmitted(true);
      setSubmittedAt(new Date().toISOString());
      setSuccess("Thanks for your feedback. It has been recorded.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Feedback</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Share quick feedback to help us improve your experience.
          </p>
        </div>

        <Card className="border border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-lg">One-time feedback form</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStatus ? (
              <p className="text-sm text-neutral-500">Checking your feedback status...</p>
            ) : alreadySubmitted ? (
              <div className="space-y-3">
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  Feedback already submitted{formattedSubmittedAt ? ` on ${formattedSubmittedAt}` : ""}.
                </p>
                <div className="flex flex-wrap gap-2">
                  {projectId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/app/${projectId}/dashboard`)}
                    >
                      Back to dashboard
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={handleLogout}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Log out
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label>Overall experience</Label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className={`h-10 min-w-10 rounded-md border px-3 text-sm font-medium transition-colors ${
                          rating === value
                            ? "border-primary bg-primary text-white"
                            : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-primary/60"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback-type">Feedback type</Label>
                  <Select value={feedbackType} onValueChange={(value) => setFeedbackType(value as FeedbackType)}>
                    <SelectTrigger id="feedback-type" className="w-full">
                      <SelectValue placeholder="Select feedback type" />
                    </SelectTrigger>
                    <SelectContent>
                      {FEEDBACK_TYPES.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback-comments">Comments</Label>
                  <textarea
                    id="feedback-comments"
                    value={comments}
                    onChange={(event) => setComments(event.target.value)}
                    placeholder="What can we improve?"
                    maxLength={1500}
                    rows={5}
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
                {success && <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>}

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    {submitting ? "Submitting..." : "Submit feedback"}
                  </Button>
                  {projectId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/app/${projectId}/dashboard`)}
                    >
                      Back to dashboard
                    </Button>
                  )}
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
