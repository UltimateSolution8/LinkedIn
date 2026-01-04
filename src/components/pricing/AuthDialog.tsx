
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
//import GoogleIcon from "@/components/auth/GoogleIcon";
import { signin, signup, verifyOtp } from "@/lib/api/auth";
import { checkSubscriptionAccess } from "@/lib/utils/subscription";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
  defaultView?: "login" | "signup";
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  repeatPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.repeatPassword, {
  message: "Passwords don't match",
  path: ["repeatPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export default function AuthDialog({
  isOpen,
  onClose,
  onAuthSuccess,
  defaultView = "login",
}: AuthDialogProps) {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"login" | "signup" | "otp">(defaultView);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [otp, setOtp] = useState("");

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // Clear forms and errors when dialog opens
  useEffect(() => {
    if (isOpen) {
      loginForm.reset();
      signupForm.reset();
      setApiError(null);
      setActiveView(defaultView);
      setOtp("");
    }
  }, [isOpen, defaultView, loginForm, signupForm]);

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await signin({
        email: data.email,
        password: data.password,
      });

      localStorage.clear();
      sessionStorage.clear();

      // Store user data in localStorage (access token is now in HTTP-only cookie)
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      if (!response.user.isEmailVerified) {
        if (onAuthSuccess) {
          onAuthSuccess();
        } else {
          navigate("/verify-email-prompt");
        }
        return;
      }

      if (onAuthSuccess) {
        onAuthSuccess();
        return;
      }

      try {
        const hasAccess = await checkSubscriptionAccess();
        if (hasAccess) {
          navigate("/dashboard");
        } else {
          navigate("/pricing");
        }
      } catch (error) {
        console.error("Error checking subscription status:", error);
        navigate("/pricing");
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await signup({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        verificationMethod: "otp",
      });

      localStorage.clear();

      // Store user data in localStorage (access token is now in HTTP-only cookie)
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      // Transition to OTP verification view
      setActiveView("otp");
      setApiError(null);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setApiError("Please enter a valid OTP");
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await verifyOtp({ otp });

      // Update user in localStorage if returned
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      // Call onAuthSuccess to proceed to payment flow
      if (onAuthSuccess) {
        onAuthSuccess();
      } else {
        navigate("/pricing");
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleAuth = async () => {
  //   console.log("Google auth clicked");
  //   // TODO: Implement Google OAuth
  // };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] p-5">
        <DialogHeader className="space-y-1 pb-1">
          <DialogTitle className="text-lg font-bold text-center">
            {activeView === "otp" ? "Verify OTP" : activeView === "signup" ? "Create Account" : "Welcome Back"}
          </DialogTitle>
        </DialogHeader>

        {/* Informational Banner */}
        {activeView !== "otp" && (
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-md p-2 flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] leading-tight text-purple-900 dark:text-purple-100">
              {activeView === "signup" ? "Sign up" : "Log in"} to proceed to payment
            </p>
          </div>
        )}

        {apiError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-2 py-1.5 rounded-md text-[10px]">
            {apiError}
          </div>
        )}

        {activeView === "login" ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-2.5">
            <div className="space-y-1">
              <Label htmlFor="login-email" className="text-xs">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                {...loginForm.register("email")}
                className="h-9 text-sm"
              />
              {loginForm.formState.errors.email && (
                <p className="text-[10px] text-red-500">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="login-password" className="text-xs">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                {...loginForm.register("password")}
                className="h-9 text-sm"
              />
              {loginForm.formState.errors.password && (
                <p className="text-[10px] text-red-500">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 h-9 text-sm"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>

            {/* <div className="flex items-center gap-2 py-1">
              <hr className="flex-1 border-neutral-200 dark:border-white/20" />
              <span className="text-[10px] text-neutral-400">OR</span>
              <hr className="flex-1 border-neutral-200 dark:border-white/20" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleAuth}
              className="w-full h-9 text-sm"
            >
              <GoogleIcon className="w-4 h-4 mr-2" />
              Continue with Google
            </Button> */}

            <div className="pt-2 border-t">
              <p className="text-[10px] text-center text-neutral-600 dark:text-neutral-400 mb-1.5">
                New to Rixly?
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setActiveView("signup");
                  setApiError(null);
                  loginForm.reset();
                }}
                className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 h-8 text-xs"
              >
                Sign up with Email
              </Button>
            </div>
          </form>
        ) : activeView === "signup" ? (
          <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="firstName" className="text-xs">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  {...signupForm.register("firstName")}
                  className="h-9 text-sm"
                />
                {signupForm.formState.errors.firstName && (
                  <p className="text-[10px] text-red-500">{signupForm.formState.errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="lastName" className="text-xs">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  {...signupForm.register("lastName")}
                  className="h-9 text-sm"
                />
                {signupForm.formState.errors.lastName && (
                  <p className="text-[10px] text-red-500">{signupForm.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="signup-email" className="text-xs">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                {...signupForm.register("email")}
                className="h-9 text-sm"
              />
              {signupForm.formState.errors.email && (
                <p className="text-[10px] text-red-500">{signupForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="signup-password" className="text-xs">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                {...signupForm.register("password")}
                className="h-9 text-sm"
              />
              {signupForm.formState.errors.password && (
                <p className="text-[10px] text-red-500">{signupForm.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="repeatPassword" className="text-xs">Confirm Password</Label>
              <Input
                id="repeatPassword"
                type="password"
                placeholder="••••••••"
                {...signupForm.register("repeatPassword")}
                className="h-9 text-sm"
              />
              {signupForm.formState.errors.repeatPassword && (
                <p className="text-[10px] text-red-500">{signupForm.formState.errors.repeatPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 h-9 text-sm"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            {/* <div className="flex items-center gap-2 py-1">
              <hr className="flex-1 border-neutral-200 dark:border-white/20" />
              <span className="text-[10px] text-neutral-400">OR</span>
              <hr className="flex-1 border-neutral-200 dark:border-white/20" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleAuth}
              className="w-full h-9 text-sm"
            >
              <GoogleIcon className="w-4 h-4 mr-2" />
              Continue with Google
            </Button> */}

            <div className="pt-2 border-t">
              <p className="text-[10px] text-center text-neutral-600 dark:text-neutral-400 mb-1.5">
                Already have an account?
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setActiveView("login");
                  setApiError(null);
                  signupForm.reset();
                }}
                className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 h-8 text-xs"
              >
                Log in
              </Button>
            </div>
          </form>
        ) : activeView === "otp" ? (
          <div className="space-y-3">
            {/* OTP Information */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 text-center">
              <p className="text-xs text-blue-900 dark:text-blue-100">
                We've sent a verification code to your email. Please enter it below.
              </p>
            </div>

            {/* OTP Input */}
            <div className="space-y-1">
              <Label htmlFor="otp" className="text-xs">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="h-9 text-sm text-center tracking-widest"
                maxLength={6}
              />
            </div>

            {/* Verify Button */}
            <Button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 h-9 text-sm"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>

            {/* Back to Signup */}
            <div className="pt-2 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setActiveView("signup");
                  setApiError(null);
                  setOtp("");
                }}
                className="w-full h-8 text-xs text-neutral-600 hover:text-neutral-900"
              >
                ← Back to Sign Up
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
