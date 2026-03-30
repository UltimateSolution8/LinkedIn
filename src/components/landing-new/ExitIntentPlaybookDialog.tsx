// @ts-nocheck
import { useEffect, useState } from "react";
import { CheckCircle, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { submitLeadCapture } from "@/lib/api/leadCapture";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface ExitIntentPlaybookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExitIntentPlaybookDialog({ open, onOpenChange }: ExitIntentPlaybookDialogProps) {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setErrors({});
      setSubmitError("");
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
      });
    }
  }, [open]);

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name.trim()) nextErrors.name = "Name is required";
    if (!formData.email.trim()) nextErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = "Invalid email format";
    return nextErrors;
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSubmitError("");
    setIsSubmitting(true);
    try {
      await submitLeadCapture({
        name: formData.name,
        email: formData.email,
        source: "exit_intent_playbook",
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/Rixly_Reddit_LeadGen_Playbook.pdf";
    link.download = "Rixly_Reddit_LeadGen_Playbook.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        {!submitted ? (
          <>
            <DialogHeader>
              <DialogTitle>Before You Go: Free Reddit Lead Gen Playbook</DialogTitle>
              <DialogDescription>
                Get a practical guide to finding high intent leads from Reddit conversations.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="exit-name">Name *</Label>
                <Input
                  id="exit-name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="exit-email">Email *</Label>
                <Input
                  id="exit-email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90">
                {isSubmitting ? "Submitting..." : "Unlock Playbook"}
              </Button>
              {submitError && <p className="text-sm text-red-500">{submitError}</p>}
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Playbook Unlocked</h3>
            <p className="text-slate-600 mb-6">
              Download your free Reddit lead generation playbook.
            </p>
            <Button onClick={handleDownload} className="w-full bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
