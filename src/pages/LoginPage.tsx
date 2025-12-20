
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import AuthBrandingSection from "@/components/auth/AuthBrandingSection";
import AuthToggle from "@/components/auth/AuthToggle";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 w-full max-w-6xl mx-auto min-h-screen lg:min-h-[80vh]">
      {/* Left Column - Branding */}
      <AuthBrandingSection />

      {/* Right Column - Authentication Form */}
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
          <h1 className="text-neutral-950 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] text-left pb-3">
            Welcome to Rixly
          </h1>

          {/* Tab Toggle */}
          <AuthToggle activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Form Content */}
          {activeTab === "login" ? <LoginForm /> : <SignupForm />}
        </motion.div>
      </div>
    </div>
  );
}
