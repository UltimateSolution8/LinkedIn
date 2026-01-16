import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import AuthBrandingSection from "@/components/auth/AuthBrandingSection";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 w-full max-w-6xl mx-auto min-h-screen lg:min-h-[80vh]">
      {/* Left Column - Branding */}
      <AuthBrandingSection />

      {/* Right Column - Forgot Password Form */}
      <div className="lg:col-span-3 flex items-center justify-center p-4 sm:p-8 relative">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="absolute top-4 right-4 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col w-full max-w-md bg-white dark:bg-neutral-950 p-6 sm:p-8 rounded-xl shadow-lg shadow-black/5"
        >
          <ForgotPasswordForm />
        </motion.div>
      </div>
    </div>
  );
}