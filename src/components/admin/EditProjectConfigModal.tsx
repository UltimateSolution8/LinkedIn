import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus, Loader2 } from "lucide-react";
import { updateAdminProjectConfig, type ProjectDetail, type UpdateProjectConfigPayload } from "@/lib/api/admin";

interface EditProjectConfigModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectDetail;
  onSuccess: () => void;
}

export default function EditProjectConfigModal({
  isOpen,
  onOpenChange,
  project,
  onSuccess,
}: EditProjectConfigModalProps) {
  const [keywords, setKeywords] = useState<string[]>(project.keywords || []);
  const [semanticQueries, setSemanticQueries] = useState<string[]>(project.semanticQueries || []);
  const [subreddits, setSubreddits] = useState<string[]>(project.subreddits || []);
  const [postThreshold, setPostThreshold] = useState<number>(project.postThreshold);
  const [commentThreshold, setCommentThreshold] = useState<number>(project.commentThreshold);
  const [postDateRangeDays, setPostDateRangeDays] = useState<number>(project.postDateRangeDays);
  const [emailNotificationEnabled, setEmailNotificationEnabled] = useState<boolean>(project.emailNotificationEnabled ?? false);

  const [keywordInput, setKeywordInput] = useState("");
  const [semanticQueryInput, setSemanticQueryInput] = useState("");
  const [subredditInput, setSubredditInput] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleAddSemanticQuery = () => {
    const trimmed = semanticQueryInput.trim();
    if (trimmed && !semanticQueries.includes(trimmed)) {
      setSemanticQueries([...semanticQueries, trimmed]);
      setSemanticQueryInput("");
    }
  };

  const handleRemoveSemanticQuery = (query: string) => {
    setSemanticQueries(semanticQueries.filter(q => q !== query));
  };

  const handleAddSubreddit = () => {
    let trimmed = subredditInput.trim();
    // Remove "r/" prefix if user added it
    if (trimmed.startsWith("r/")) {
      trimmed = trimmed.substring(2);
    }
    if (trimmed && !subreddits.includes(trimmed)) {
      setSubreddits([...subreddits, trimmed]);
      setSubredditInput("");
    }
  };

  const handleRemoveSubreddit = (subreddit: string) => {
    setSubreddits(subreddits.filter(s => s !== subreddit));
  };

  const handleKeyDown = (e: React.KeyboardEvent, addFn: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFn();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const payload: UpdateProjectConfigPayload = {
        keywords,
        semanticQueries,
        subreddits,
        postThreshold,
        commentThreshold,
        postDateRangeDays,
        emailNotificationEnabled,
      };

      await updateAdminProjectConfig(project.projectId, payload);
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project configuration");
      console.error("Error updating project:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Project Configuration
          </DialogTitle>
          <DialogDescription>
            Update project settings for {project.projectName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Keywords */}
          <div>
            <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Keywords
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add a keyword"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleAddKeyword)}
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddKeyword}
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {keywords.map((keyword, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                >
                  {keyword}
                  <button
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="ml-2 hover:text-purple-900 dark:hover:text-purple-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Semantic Queries */}
          <div>
            <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Semantic Queries
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add a semantic query"
                value={semanticQueryInput}
                onChange={(e) => setSemanticQueryInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleAddSemanticQuery)}
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddSemanticQuery}
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {semanticQueries.map((query, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="px-3 py-1"
                >
                  {query}
                  <button
                    onClick={() => handleRemoveSemanticQuery(query)}
                    className="ml-2 hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Subreddits */}
          <div>
            <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Subreddits
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add a subreddit (without r/)"
                value={subredditInput}
                onChange={(e) => setSubredditInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleAddSubreddit)}
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddSubreddit}
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {subreddits.map((subreddit, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800"
                >
                  r/{subreddit}
                  <button
                    onClick={() => handleRemoveSubreddit(subreddit)}
                    className="ml-2 hover:text-orange-900 dark:hover:text-orange-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Thresholds */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="postThreshold" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Post Threshold
              </Label>
              <Input
                id="postThreshold"
                type="number"
                min="0"
                value={postThreshold}
                onChange={(e) => setPostThreshold(Number(e.target.value))}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="commentThreshold" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Comment Threshold
              </Label>
              <Input
                id="commentThreshold"
                type="number"
                min="0"
                value={commentThreshold}
                onChange={(e) => setCommentThreshold(Number(e.target.value))}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="postDateRangeDays" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Date Range (Days)
              </Label>
              <Input
                id="postDateRangeDays"
                type="number"
                min="1"
                value={postDateRangeDays}
                onChange={(e) => setPostDateRangeDays(Number(e.target.value))}
                className="mt-2"
              />
            </div>
          </div>

          {/* Email Notification */}
          <div className="flex items-center space-x-3 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <Checkbox
              id="emailNotification"
              checked={emailNotificationEnabled}
              onCheckedChange={(checked: boolean) => setEmailNotificationEnabled(checked)}
            />
            <div className="flex flex-col">
              <Label
                htmlFor="emailNotification"
                className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer"
              >
                Enable Email Notifications
              </Label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                User will receive email notifications when new leads are discovered for this project
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
