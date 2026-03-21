// @ts-nocheck
import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
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
  DialogTrigger,
} from "../ui/dialog";

interface LinkedInEarlyAccessDialogProps {
  triggerClassName?: string;
  triggerLabel?: string;
}

export default function LinkedInEarlyAccessDialog({
  triggerClassName = "",
  triggerLabel = "Join LinkedIn early access",
}: LinkedInEarlyAccessDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    companyName: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name.trim()) nextErrors.name = "Name is required";
    if (!formData.email.trim()) nextErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = "Invalid email format";
    if (!formData.mobile.trim()) nextErrors.mobile = "Mobile is required";
    if (!formData.companyName.trim()) nextErrors.companyName = "Company Name is required";
    return nextErrors;
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
        mobile: formData.mobile,
        companyName: formData.companyName,
        source: "linkedin_early_access",
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const resetState = () => {
    setSubmitted(false);
    setErrors({});
    setFormData({
      name: "",
      email: "",
      mobile: "",
      companyName: "",
    });
    setSubmitError("");
    setIsSubmitting(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) resetState();
      }}
    >
      <DialogTrigger asChild>
        <Button className={triggerClassName}>
          {triggerLabel}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px]">
        {!submitted ? (
          <>
            <DialogHeader>
              <DialogTitle>Join LinkedIn Early Access</DialogTitle>
              <DialogDescription>
                Share your details and we will notify you when LinkedIn lead discovery is available.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="li-name">Name *</Label>
                <Input
                  id="li-name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="li-email">Email *</Label>
                <Input
                  id="li-email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="li-mobile">Mobile *</Label>
                <Input
                  id="li-mobile"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={formData.mobile}
                  onChange={(e) => updateField("mobile", e.target.value)}
                  className={errors.mobile ? "border-red-500" : ""}
                />
                {errors.mobile && <p className="text-xs text-red-500">{errors.mobile}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="li-company">Company Name *</Label>
                <Input
                  id="li-company"
                  placeholder="Your company"
                  value={formData.companyName}
                  onChange={(e) => updateField("companyName", e.target.value)}
                  className={errors.companyName ? "border-red-500" : ""}
                />
                {errors.companyName && <p className="text-xs text-red-500">{errors.companyName}</p>}
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90">
                {isSubmitting ? "Submitting..." : "Submit Early Access Request"}
              </Button>
              {submitError && <p className="text-sm text-red-500">{submitError}</p>}
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">You are on the list!</h3>
            <p className="text-slate-600 mb-6">
              Thanks for your interest. We will reach out when LinkedIn early access opens.
            </p>
            <Button onClick={() => setOpen(false)} className="w-full bg-primary hover:bg-primary/90">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
