"use client";

import { useState } from "react";
import AuthBrandingSection from "@/components/auth/AuthBrandingSection";
import AuthToggle from "@/components/auth/AuthToggle";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 w-full max-w-6xl mx-auto min-h-[80vh]">
      {/* Left Column - Branding */}
      <AuthBrandingSection />

      {/* Right Column - Authentication Form */}
      <div className="lg:col-span-3 flex items-center justify-center p-4 sm:p-8">
        <div className="flex flex-col w-full max-w-md bg-white dark:bg-neutral-950 p-8 rounded-xl shadow-lg shadow-black/5">
          <h1 className="text-neutral-950 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] text-left pb-3">
            Welcome to Rixly
          </h1>

          {/* Tab Toggle */}
          <AuthToggle activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Form Content */}
          {activeTab === "login" ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  );
}
