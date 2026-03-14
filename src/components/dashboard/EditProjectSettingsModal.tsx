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
import { updateProjectSettings, type Project } from "@/lib/api/projects";

interface EditProjectSettingsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onSuccess: () => void;
}

export default function EditProjectSettingsModal({
  isOpen,
  onOpenChange,
  project,
  onSuccess,
}: EditProjectSettingsModalProps) {
  const [keywords, setKeywords] = useState<string[]>(project.keywords || []);
  const [targetAudience, setTargetAudience] = useState<string[]>(project.targetAudience || []);
  const [valuePropositions, setValuePropositions] = useState<string[]>(project.valuePropositions || []);
  const [emailNotifyEnabled, setEmailNotifyEnabled] = useState<boolean>(
    project.emailNotifyEnabled ?? false
  );

  const [keywordInput, setKeywordInput] = useState("");
  const [audienceInput, setAudienceInput] = useState("");
  const [valuePropositionInput, setValuePropositionInput] = useState("");

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

  const handleAddAudience = () => {
    const trimmed = audienceInput.trim();
    if (trimmed && !targetAudience.includes(trimmed)) {
      setTargetAudience([...targetAudience, trimmed]);
      setAudienceInput("");
    }
  };

  const handleRemoveAudience = (audience: string) => {
    setTargetAudience(targetAudience.filter(a => a !== audience));
  };

  const handleAddValueProposition = () => {
    const trimmed = valuePropositionInput.trim();
    if (trimmed && !valuePropositions.includes(trimmed)) {
      setValuePropositions([...valuePropositions, trimmed]);
      setValuePropositionInput("");
    }
  };

  const handleRemoveValueProposition = (valueProposition: string) => {
    setValuePropositions(valuePropositions.filter(v => v !== valueProposition));
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
      await updateProjectSettings(project._id, {
        keywords,
        targetAudience,
        valuePropositions,
        emailNotifyEnabled,
      });
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project settings");
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
            Edit Project Settings
          </DialogTitle>
          <DialogDescription>
            Update your project settings for {project.projectName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Keywords */}
          <div>
            <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Keywords
            </Label>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 mb-2">
              Keywords for tracking relevant posts
            </p>
            <div className="flex gap-2">
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
                  className="px-3 py-1 bg-primary/10 text-primary border-primary/20"
                >
                  {keyword}
                  <button
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="ml-2 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Target Audience
            </Label>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 mb-2">
              Your ideal customer segments and personas
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Add a target audience"
                value={audienceInput}
                onChange={(e) => setAudienceInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleAddAudience)}
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddAudience}
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {targetAudience.map((audience, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="px-3 py-1 bg-primary/10 text-primary border-primary/20"
                >
                  {audience}
                  <button
                    onClick={() => handleRemoveAudience(audience)}
                    className="ml-2 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Value Propositions */}
          <div>
            <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Value Propositions
            </Label>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 mb-2">
              Key benefits and solutions your product offers
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Add a value proposition"
                value={valuePropositionInput}
                onChange={(e) => setValuePropositionInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleAddValueProposition)}
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddValueProposition}
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {valuePropositions.map((valueProposition, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="px-3 py-1 bg-primary/10 text-primary border-primary/20"
                >
                  {valueProposition}
                  <button
                    onClick={() => handleRemoveValueProposition(valueProposition)}
                    className="ml-2 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Email Notification */}
          <div className="flex items-center space-x-3 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <Checkbox
              id="emailNotification"
              checked={emailNotifyEnabled}
              onCheckedChange={(checked: boolean) => setEmailNotifyEnabled(checked)}
            />
            <div className="flex flex-col">
              <Label
                htmlFor="emailNotification"
                className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer"
              >
                Enable Email Notifications
              </Label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Receive email notifications when new leads are discovered for this project
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
            className="bg-primary hover:bg-primary/90 text-white"
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
