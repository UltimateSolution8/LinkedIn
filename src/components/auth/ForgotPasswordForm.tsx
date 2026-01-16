import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { requestPasswordReset } from "@/lib/api/auth";
import logger from "@/lib/logger";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onBack?: () => void;
}

export default function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps = {}) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      await requestPasswordReset({
        email: data.email,
      });

      logger.logPasswordResetEvent('request_submitted', {
        emailDomain: data.email.split('@')[1],
        success: true
      });

      setIsSuccess(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred while requesting password reset";

      logger.logPasswordResetEvent('request_failed', {
        emailDomain: data.email.split('@')[1],
        error: errorMessage,
        success: false
      });

      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/login");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-950 dark:text-white">
              Check Your Email
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              We&apos;ve sent a password reset link to{" "}
              <span className="font-medium text-neutral-950 dark:text-white">
                {getValues("email")}
              </span>
            </p>
            <p className="text-neutral-500 dark:text-neutral-500 text-xs">
              If you don&apos;t see the email, check your spam folder or try again.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleBack}
            variant="outline"
            className="w-full border-neutral-200 dark:border-white/20 hover:bg-neutral-50 dark:hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>

          <Button
            onClick={() => {
              setIsSuccess(false);
              setApiError(null);
            }}
            variant="ghost"
            className="w-full text-purple-600 dark:text-purple-500 hover:text-purple-700 dark:hover:text-purple-400"
          >
            Try Different Email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="w-8 h-8 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold text-neutral-950 dark:text-white">
            Forgot Password
          </h2>
        </div>

        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {apiError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
            {apiError}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-neutral-950/80 dark:text-white/80">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
            className="border-neutral-200 dark:border-white/20 focus-visible:ring-purple-600/50 focus-visible:border-purple-600/50"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white hover:bg-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 dark:focus:ring-offset-neutral-950 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            "Sending Reset Link..."
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Send Reset Link
            </>
          )}
        </Button>
      </form>
    </div>
  );
}