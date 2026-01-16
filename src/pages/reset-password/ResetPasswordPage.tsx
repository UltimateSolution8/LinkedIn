import { useState, useEffect, Suspense } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CheckCircle, XCircle, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { resetPassword } from "@/lib/api/auth";
import logger from "@/lib/logger";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "form" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const tokenParam = searchParams.get("token");

    if (!tokenParam) {
      setStatus("error");
      setMessage("No reset token provided. Please check your email and click the reset link again.");
      return;
    }

    setToken(tokenParam);
    setStatus("form");
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    try {
      const response = await resetPassword({
        token,
        password: data.password,
      });

      logger.logPasswordResetEvent('password_reset_successful', {
        success: true
      });

      setStatus("success");
      setMessage(response.message || "Your password has been successfully reset!");

      // Wait 3 seconds before redirecting to login
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Failed to reset password. The reset link may be invalid or expired.";

      logger.logPasswordResetEvent('password_reset_failed', {
        success: false,
        error: errorMessage
      });

      setStatus("error");
      setMessage(errorMessage);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">Verifying Reset Token</h1>
                  <p className="text-gray-600">Please wait while we verify your reset token...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">Password Reset Successful!</h1>
                  <p className="text-gray-600">{message}</p>
                  <p className="text-sm text-gray-500 mt-4">
                    Redirecting you to login in a few seconds...
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                  <Button
                    onClick={() => navigate("/login")}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Go to Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">Reset Failed</h1>
                  <p className="text-gray-600">{message}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                  <Button
                    onClick={() => navigate("/")}
                    variant="outline"
                    className="w-full"
                  >
                    Go to Home
                  </Button>
                  <Button
                    onClick={() => navigate("/login")}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Go to Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">Reset Your Password</h1>
                  <p className="text-gray-600 text-sm">
                    Enter your new password below. Make sure it&apos;s strong and secure.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password" className="text-neutral-950/80 dark:text-white/80">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      {...register("password")}
                      className="border-neutral-200 dark:border-white/20 focus-visible:ring-purple-600/50 focus-visible:border-purple-600/50 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="confirmPassword" className="text-neutral-950/80 dark:text-white/80">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      {...register("confirmPassword")}
                      className="border-neutral-200 dark:border-white/20 focus-visible:ring-purple-600/50 focus-visible:border-purple-600/50 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 dark:focus:ring-offset-neutral-950 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Resetting Password..." : "Reset Password"}
                </Button>
              </form>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="w-full border-neutral-200 dark:border-white/20 hover:bg-neutral-50 dark:hover:bg-white/10"
                >
                  Back to Login
                </Button>
              </div>
            </div>
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}