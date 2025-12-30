
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import GoogleIcon from "@/components/auth/GoogleIcon";
import { signin } from "@/lib/api/auth";
import { checkSubscriptionAccess } from "@/lib/utils/subscription";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps = {}) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await signin({
        email: data.email,
        password: data.password,
      });

      // IMPORTANT: Clear any cached data from previous session first
      localStorage.clear();
      sessionStorage.clear();

      // Store the access token and user data in localStorage
      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
      }
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      // Check email verification first
      if (!response.user.isEmailVerified) {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/verify-email-prompt");
        }
        return;
      }

      // If onSuccess callback is provided, call it instead of redirecting
      if (onSuccess) {
        onSuccess();
        return;
      }

      // Then check subscription access
      try {
        const hasAccess = await checkSubscriptionAccess();
        if (hasAccess) {
          navigate("/dashboard");
        } else {
          navigate("/auth-pricing");
        }
      } catch (error) {
        console.error("Error checking subscription status:", error);
        navigate("/auth-pricing");
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "An error occurred during signin");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log("Google login clicked");
    // TODO: Implement Google OAuth
    // For now, check subscription and navigate accordingly
    try {
      const hasAccess = await checkSubscriptionAccess();
      if (hasAccess) {
        navigate("/dashboard");
      } else {
        navigate("/auth-pricing");
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
      navigate("/auth-pricing");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
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

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password" className="text-neutral-950/80 dark:text-white/80">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          {...register("password")}
          className="border-neutral-200 dark:border-white/20 focus-visible:ring-purple-600/50 focus-visible:border-purple-600/50"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <a
        href="#"
        className="text-sm text-purple-600 dark:text-purple-500 hover:underline self-end"
      >
        Forgot Password?
      </a>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-purple-600 text-white hover:bg-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 dark:focus:ring-offset-neutral-950 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Signing In..." : "Continue with Email"}
      </Button>

      {/* <div className="flex items-center gap-2 my-2">
        <hr className="w-full border-neutral-200 dark:border-white/20" />
        <span className="text-xs text-neutral-500 dark:text-neutral-400">OR</span>
        <hr className="w-full border-neutral-200 dark:border-white/20" />
      </div> */}

      {/* <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        className="w-full bg-white dark:bg-white/10 text-neutral-950 dark:text-white border-neutral-200 dark:border-white/20 hover:bg-neutral-50 dark:hover:bg-white/20"
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continue with Google
      </Button> */}

      <p className="text-xs text-center text-neutral-500 dark:text-neutral-400 mt-8">
        By continuing, you agree to Rixly&apos;s{" "}
        <Link to="/policies/terms" className="text-purple-600/90 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/policies/privacy" className="text-purple-600/90 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
