"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import GoogleIcon from "@/components/auth/GoogleIcon";
import { signup } from "@/lib/api/auth";

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

export default function SignupForm() {
  const router = useRouter();
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

      // Store the access token and user data in localStorage
      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
      }
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      // Check if email is verified and redirect accordingly
      if (response.user.isEmailVerified) {
        router.push("/pricing");
      } else {
        router.push("/verify-email-prompt");
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
    // TODO: Implement Google OAuth
    // For now, navigate to pricing page
    router.push("/pricing");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
      {apiError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
          {apiError}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="firstName" className="text-neutral-950/80 dark:text-white/80">
          First Name
        </Label>
        <Input
          id="firstName"
          type="text"
          placeholder="John"
          {...register("firstName")}
          className="border-neutral-200 dark:border-white/20 focus-visible:ring-purple-600/50 focus-visible:border-purple-600/50"
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
          className="border-neutral-200 dark:border-white/20 focus-visible:ring-purple-600/50 focus-visible:border-purple-600/50"
        />
        {errors.lastName && (
          <p className="text-sm text-red-500">{errors.lastName.message}</p>
        )}
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
          autoComplete="new-password"
          {...register("password")}
          className="border-neutral-200 dark:border-white/20 focus-visible:ring-purple-600/50 focus-visible:border-purple-600/50"
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
          className="border-neutral-200 dark:border-white/20 focus-visible:ring-purple-600/50 focus-visible:border-purple-600/50"
        />
        {errors.repeatPassword && (
          <p className="text-sm text-red-500">{errors.repeatPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-purple-600 text-white hover:bg-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 dark:focus:ring-offset-neutral-950 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <Link href="/policies/terms" className="text-purple-600/90 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/policies/privacy" className="text-purple-600/90 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
