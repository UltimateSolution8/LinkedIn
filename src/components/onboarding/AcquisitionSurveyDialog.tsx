import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type AcquisitionSurveyValues = {
  source: string;
  sourceOther?: string;
  region: string;
};

type AcquisitionSurveyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AcquisitionSurveyValues) => Promise<void>;
  onSkip: () => void;
  isSubmitting: boolean;
};

const SOURCE_OPTIONS = [
  { value: "google_search", label: "Google Search" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "reddit", label: "Reddit" },
  { value: "youtube", label: "YouTube" },
  { value: "referral", label: "Referral" },
  { value: "community", label: "Community/Forum" },
  { value: "other", label: "Other" },
];

const REGION_OPTIONS = [
  { value: "india", label: "India" },
  { value: "north_america", label: "North America" },
  { value: "europe", label: "Europe" },
  { value: "apac", label: "APAC" },
  { value: "middle_east_africa", label: "Middle East & Africa" },
  { value: "latin_america", label: "Latin America" },
  { value: "other", label: "Other" },
];

export default function AcquisitionSurveyDialog({
  open,
  onOpenChange,
  onSubmit,
  onSkip,
  isSubmitting,
}: AcquisitionSurveyDialogProps) {
  const [source, setSource] = useState("");
  const [sourceOther, setSourceOther] = useState("");
  const [region, setRegion] = useState("");
  const [error, setError] = useState("");

  const requiresOtherSource = useMemo(() => source === "other", [source]);

  const handleSubmit = async () => {
    if (!source || !region) {
      setError("Please select source and region.");
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
      region,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>One quick question</DialogTitle>
          <DialogDescription>
            Help us personalize your experience. This takes just a few seconds.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="acq-source">How did you hear about Rixly?</Label>
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
              <Label htmlFor="acq-source-other">Other source</Label>
              <Input
                id="acq-source-other"
                placeholder="Please specify"
                value={sourceOther}
                onChange={(event) => setSourceOther(event.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="acq-region">Your region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger id="acq-region">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {REGION_OPTIONS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onSkip} disabled={isSubmitting}>
            Skip for now
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
