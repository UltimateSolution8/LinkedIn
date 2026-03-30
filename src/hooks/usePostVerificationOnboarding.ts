import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { saveOnboardingAcquisition } from "@/lib/api/auth";

const ONBOARDING_PENDING_KEY = "rixly.post_verification_onboarding.pending";

export function usePostVerificationOnboarding() {
  const { user, setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsOpen(false);
      return;
    }

    if (user.acquisitionCapturedAt) {
      sessionStorage.removeItem(ONBOARDING_PENDING_KEY);
      setIsOpen(false);
      return;
    }

    const shouldShow = user.isEmailVerified && sessionStorage.getItem(ONBOARDING_PENDING_KEY) === "1";
    setIsOpen(shouldShow);
  }, [user]);

  const handleSubmit = async ({
    source,
    sourceOther,
  }: {
    source: string;
    sourceOther?: string;
  }) => {
    try {
      setIsSubmitting(true);
      const updatedUser = await saveOnboardingAcquisition({ source, sourceOther });
      setUser(updatedUser);
      setIsOpen(false);
      sessionStorage.removeItem(ONBOARDING_PENDING_KEY);
    } catch (error) {
      console.error("Failed to save onboarding survey:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isOpen,
    isSubmitting,
    handleSubmit,
    setIsOpen,
  };
}
