"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { verifyEmail, getCurrentUser } from "@/lib/api/auth";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token provided. Please check your email and click the verification link again.");
      return;
    }

    const handleVerification = async () => {
      try {
        setStatus("loading");
        const response = await verifyEmail(token);
        setStatus("success");
        setMessage(response.message || "Your email has been successfully verified!");

        // Update user in localStorage if they're logged in
        const currentUser = getCurrentUser();
        if (currentUser && response.user) {
          // Update the user data with verified status
          localStorage.setItem("user", JSON.stringify(response.user));
        }

        // Wait 2 seconds before redirecting
        setTimeout(() => {
          // Check if user is logged in
          const updatedUser = getCurrentUser();
          const accessToken = localStorage.getItem("accessToken");

          if (updatedUser && accessToken) {
            // User is logged in, redirect to pricing (they'll need to subscribe)
            router.push("/pricing");
          } else {
            // User is not logged in, redirect to login
            router.push("/login");
          }
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to verify email. The verification link may be invalid or expired."
        );
      }
    };

    handleVerification();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            {status === "loading" && (
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">Verifying Your Email</h1>
                  <p className="text-gray-600">Please wait while we verify your email address...</p>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">Email Verified!</h1>
                  <p className="text-gray-600">{message}</p>
                  <p className="text-sm text-gray-500 mt-4">
                    Redirecting you automatically...
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                  <Button
                    onClick={() => {
                      const currentUser = getCurrentUser();
                      const accessToken = localStorage.getItem("accessToken");
                      if (currentUser && accessToken) {
                        router.push("/pricing");
                      } else {
                        router.push("/login");
                      }
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">Verification Failed</h1>
                  <p className="text-gray-600">{message}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                  <Button
                    onClick={() => router.push("/")}
                    variant="outline"
                    className="w-full"
                  >
                    Go to Home
                  </Button>
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Go to Login
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Brand Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Powered by <span className="font-semibold text-purple-600">Rixly</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
