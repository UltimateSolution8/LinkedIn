
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
import { signup } from "@/lib/api/auth";
import { getProjects } from "@/lib/api/projects";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  repeatPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.repeatPassword, {
  message: "Passwords don't match",
  path: ["repeatPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
}

export default function SignupForm({ onSuccess }: SignupFormProps = {}) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await signup({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      // IMPORTANT: Clear any cached data from previous session first
      localStorage.clear();

      // Store user data in localStorage (access token is now in HTTP-only cookie)
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      // If onSuccess callback is provided, call it instead of redirecting
      if (onSuccess) {
        onSuccess();
        return;
      }

      // Check if email is verified first
      if (!response.user.isEmailVerified) {
        navigate("/verify-email-prompt");
        return;
      }

      // Small delay to ensure cookie is set properly
      await new Promise(resolve => setTimeout(resolve, 100));

      // Fetch projects to determine where to navigate
      try {
        const projects = await getProjects();

        console.log("[SignupForm] Fetched projects:", projects);
        console.log("[SignupForm] Projects count:", projects.length);

        if (projects.length === 0) {
          // No projects - go to onboarding (new users typically have 0 projects)
          console.log("[SignupForm] No projects found, navigating to onboarding");
          navigate("/app/onboarding");
        } else {
          // Has projects - go to dashboard (which redirects to /app/{projectId}/dashboard)
          console.log("[SignupForm] Projects found, navigating to dashboard");
          navigate("/dashboard");
        }
      } catch (projectError) {
        // If fetching projects fails, default to onboarding (safer for new users)
        console.error("[SignupForm] Error fetching projects:", projectError);
        console.log("[SignupForm] Falling back to /app/onboarding");
        navigate("/app/onboarding");
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;
    const redirectPath = "/dashboard";
    // Redirect to backend Google OAuth with redirect path
    window.location.href = `${RIXLY_API_BASE_URL}/api/auth/google?redirect=${encodeURIComponent(redirectPath)}`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
      {apiError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
          {apiError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName" className="text-neutral-950/80 dark:text-white/80">
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            {...register("firstName")}
            className="border-neutral-200 dark:border-white/20 focus-visible:ring-teal-600/50 focus-visible:border-teal-600/50"
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName" className="text-neutral-950/80 dark:text-white/80">
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            {...register("lastName")}
            className="border-neutral-200 dark:border-white/20 focus-visible:ring-teal-600/50 focus-visible:border-teal-600/50"
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="text-neutral-950/80 dark:text-white/80">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className="border-neutral-200 dark:border-white/20 focus-visible:ring-teal-600/50 focus-visible:border-teal-600/50"
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
          autoComplete="new-password"
          {...register("password")}
          className="border-neutral-200 dark:border-white/20 focus-visible:ring-teal-600/50 focus-visible:border-teal-600/50"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="repeatPassword" className="text-neutral-950/80 dark:text-white/80">
          Repeat Password
        </Label>
        <Input
          id="repeatPassword"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          {...register("repeatPassword")}
          className="border-neutral-200 dark:border-white/20 focus-visible:ring-teal-600/50 focus-visible:border-teal-600/50"
        />
        {errors.repeatPassword && (
          <p className="text-sm text-red-500">{errors.repeatPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-teal-600 text-white hover:bg-teal-700 focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 dark:focus:ring-offset-neutral-950 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Creating Account..." : "Continue with Email"}
      </Button>

      <div className="flex items-center gap-2 my-2">
        <hr className="w-full border-neutral-200 dark:border-white/20" />
        <span className="text-xs text-neutral-500 dark:text-neutral-400">OR</span>
        <hr className="w-full border-neutral-200 dark:border-white/20" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignup}
        className="w-full bg-white dark:bg-white/10 text-neutral-950 dark:text-white border-neutral-200 dark:border-white/20 hover:bg-neutral-50 dark:hover:bg-white/20"
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      <p className="text-xs text-center text-neutral-500 dark:text-neutral-400 mt-8">
        By continuing, you agree to Rixly&apos;s{" "}
        <Link to="/policies/terms" className="text-teal-600/90 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/policies/privacy" className="text-teal-600/90 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
