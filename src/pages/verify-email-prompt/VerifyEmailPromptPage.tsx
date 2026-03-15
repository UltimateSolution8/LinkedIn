
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, RefreshCw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { resendVerificationEmail, getCurrentUser, logout, type User } from "@/lib/api/auth";
import Logo from "@/components/common/Logo";

export default function VerifyEmailPromptPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const currentUser = getCurrentUser();

    // If no user or user is already verified, redirect
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.isEmailVerified) {
      navigate("/dashboard");
      return;
    }

    setUser(currentUser);

    // Poll for email verification status every 3 seconds
    // This handles the case where user verifies email in another tab
    const pollInterval = setInterval(() => {
      const updatedUser = getCurrentUser();
      if (updatedUser?.isEmailVerified) {
        navigate("/dashboard");
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [navigate]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResendEmail = async () => {
    if (cooldown > 0) return;

    setIsResending(true);
    setResendMessage(null);

    try {
      await resendVerificationEmail();
      setResendMessage({
        type: "success",
        text: "Verification email sent! Please check your inbox and spam folder.",
      });
      setCooldown(60); // 60 second cooldown
    } catch (error) {
      setResendMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to resend verification email. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo and Logout */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 sm:p-12">
              <div className="flex flex-col items-center text-center gap-6">
                {/* Email Icon */}
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
                  <Mail className="w-10 h-10 text-teal-600" />
                </div>

                {/* Header */}
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Verify Your Email Address
                  </h1>
                  <p className="text-lg text-gray-600">
                    We've sent a verification link to
                  </p>
                  <p className="text-lg font-semibold text-teal-600">
                    {user.email}
                  </p>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 w-full text-left">
                  <h3 className="font-semibold text-blue-900 mb-3">
                    To complete your registration:
                  </h3>
                  <ol className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">1.</span>
                      <span>Check your inbox for an email from Rixly</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">2.</span>
                      <span>Click the verification link in the email</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">3.</span>
                      <span>You'll be redirected back to continue</span>
                    </li>
                  </ol>
                  <p className="text-xs text-blue-700 mt-4">
                    💡 Tip: If you don't see the email, check your spam or junk folder
                  </p>
                </div>

                {/* Resend Message */}
                {resendMessage && (
                  <div
                    className={`w-full p-4 rounded-lg ${resendMessage.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                      }`}
                  >
                    {resendMessage.text}
                  </div>
                )}

                {/* Resend Button */}
                <div className="w-full space-y-3 mt-4">
                  <Button
                    onClick={handleResendEmail}
                    disabled={isResending || cooldown > 0}
                    variant="outline"
                    className="w-full border-teal-600 text-teal-600 hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : cooldown > 0 ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Resend in {cooldown}s
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Resend Verification Email
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500">
                    Didn't receive the email?{" "}
                    <button
                      onClick={handleLogout}
                      className="text-teal-600 hover:underline font-semibold"
                    >
                      Try a different email address
                    </button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <a href="mailto:support@rixly.com" className="text-teal-600 hover:underline font-semibold">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
