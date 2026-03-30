import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type AcquisitionSurveyValues = {
  source: string;
  sourceOther?: string;
};

type AcquisitionSurveyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AcquisitionSurveyValues) => Promise<void>;
  isSubmitting: boolean;
};

const SOURCE_OPTIONS = [
  { value: "reddit", label: "Reddit" },
  { value: "google_search", label: "Google Search" },
  { value: "chatgpt", label: "ChatGPT" },
  { value: "social_media", label: "Social Media" },
  { value: "friend_colleague", label: "Friend / Colleague" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "other", label: "Other" },
];

export default function AcquisitionSurveyDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: AcquisitionSurveyDialogProps) {
  const [source, setSource] = useState("");
  const [sourceOther, setSourceOther] = useState("");
  const [error, setError] = useState("");

  const requiresOtherSource = useMemo(() => source === "other", [source]);

  const handleSubmit = async () => {
    if (!source) {
      setError("Please select an option.");
      return;
    }

    if (requiresOtherSource && !sourceOther.trim()) {
      setError("Please tell us where you found us.");
      return;
    }

    setError("");
    await onSubmit({
      source,
      sourceOther: requiresOtherSource ? sourceOther.trim() : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>One quick onboarding question</DialogTitle>
          <DialogDescription>
            How did you hear about us?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="acq-source">Select one option</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger id="acq-source">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_OPTIONS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {requiresOtherSource && (
            <div className="space-y-2">
              <Label htmlFor="acq-source-other">Other</Label>
              <Input
                id="acq-source-other"
                placeholder="Please specify"
                value={sourceOther}
                onChange={(event) => setSourceOther(event.target.value)}
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
