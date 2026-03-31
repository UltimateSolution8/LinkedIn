import { clearCurrencyCache } from "../utils/geolocation";
import { clearSubscriptionCache } from "../utils/subscription";

const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;
const AUTH_LOCAL_STORAGE_KEYS = ["user", "accessToken", "lastAccessedProjectId"] as const;

if (!RIXLY_API_BASE_URL) {
  console.error(
    "NEXT_PUBLIC_RIXLY_API_BASE_URL is not set. Please create a .env.local file with NEXT_PUBLIC_RIXLY_API_BASE_URL=http://localhost:YOUR_PORT"
  );
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  verificationMethod?: string;
}

export interface SignupResponse {
  message: string;
  user: User;
  accessToken: string;
}

export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface User {
  userId?: number;
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  authType: string;
  role?: string;
  acquisitionSource?: string | null;
  acquisitionSourceOther?: string | null;
  acquisitionRegion?: string | null;
  acquisitionCapturedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SigninResponse {
  message: string;
  user: User;
  accessToken: string;
}

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set NEXT_PUBLIC_RIXLY_API_BASE_URL in your .env.local file."
    );
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  let responseData;
  const contentType = response.headers.get("content-type");

  try {
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      // Handle non-JSON responses (like HTML 404 pages)
      const text = await response.text();
      throw new Error(
        `Server returned ${response.status} ${response.statusText}. ${response.status === 404 ? "API endpoint not found. Please check if the backend server is running and NEXT_PUBLIC_RIXLY_API_BASE_URL is configured correctly." : text.substring(0, 100)}`
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("Server returned")) {
      throw error;
    }
    throw new Error("Failed to parse server response. The server may not be running or the API URL is incorrect.");
  }

  if (!response.ok) {
    throw new Error(responseData.message || responseData.error || "Failed to sign up");
  }

  return responseData;
}

export async function signin(data: SigninRequest): Promise<SigninResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set NEXT_PUBLIC_RIXLY_API_BASE_URL in your .env.local file."
    );
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  let responseData;
  const contentType = response.headers.get("content-type");

  try {
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      // Handle non-JSON responses (like HTML 404 pages)
      const text = await response.text();
      throw new Error(
        `Server returned ${response.status} ${response.statusText}. ${response.status === 404 ? "API endpoint not found. Please check if the backend server is running and NEXT_PUBLIC_RIXLY_API_BASE_URL is configured correctly." : text.substring(0, 100)}`
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("Server returned")) {
      throw error;
    }
    throw new Error("Failed to parse server response. The server may not be running or the API URL is incorrect.");
  }

  if (!response.ok) {
    throw new Error(responseData.message || responseData.error || "Failed to sign in");
  }

  return responseData;
}

export async function logout(): Promise<void> {
  // Call backend to clear HTTP-only cookie
  try {
    await fetch(`${RIXLY_API_BASE_URL}/api/auth/signout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Error during logout:", error);
  }

  clearClientAuthState();
}

export function clearClientAuthState(): void {
  for (const key of AUTH_LOCAL_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
  sessionStorage.clear();
  clearCurrencyCache();
  clearSubscriptionCache();
}

export async function getMe(): Promise<User | null> {
  if (!RIXLY_API_BASE_URL) {
    return null;
  }

  try {
    const response = await fetch(`${RIXLY_API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Handle the case where the backend returns success: true and data: user
    const userData = data.user || data.data || data;

    if (userData && (userData.email || userData.emailId)) {
      // Map emailId to email if needed
      if (userData.emailId && !userData.email) {
        userData.email = userData.emailId;
      }
      return userData as User;
    }

    return null;
  } catch (error) {
    console.error("Error fetching current user from server:", error);
    return null;
  }
}

export function getCurrentUser(): User | null {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    const userData = JSON.parse(userStr);

    // Handle emailId field if it exists (map it to email)
    if (userData.emailId && !userData.email) {
      userData.email = userData.emailId;
    }

    return userData as User;
  } catch (error) {
    console.error("Failed to parse user data:", error);
    return null;
  }
}

export interface OnboardingAcquisitionPayload {
  source: string;
  sourceOther?: string;
}

export async function saveOnboardingAcquisition(payload: OnboardingAcquisitionPayload): Promise<User> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/auth/onboarding-acquisition`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Failed to save onboarding details");
  }

  const userData = data.user || data.data || data;
  if (userData?.emailId && !userData?.email) {
    userData.email = userData.emailId;
  }
  return userData as User;
}

export interface VerifyEmailResponse {
  message: string;
  user?: User;
}

export async function verifyEmail(token: string): Promise<VerifyEmailResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set NEXT_PUBLIC_RIXLY_API_BASE_URL in your .env.local file."
    );
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  let responseData;
  const contentType = response.headers.get("content-type");

  try {
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      throw new Error(
        `Server returned ${response.status} ${response.statusText}. ${response.status === 404 ? "API endpoint not found. Please check if the backend server is running and NEXT_PUBLIC_RIXLY_API_BASE_URL is configured correctly." : text.substring(0, 100)}`
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("Server returned")) {
      throw error;
    }
    throw new Error("Failed to parse server response. The server may not be running or the API URL is incorrect.");
  }

  if (!response.ok) {
    throw new Error(responseData.message || responseData.error || "Failed to verify email");
  }

  return responseData;
}

export interface ResendVerificationResponse {
  message: string;
}

export async function resendVerificationEmail(): Promise<ResendVerificationResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set NEXT_PUBLIC_RIXLY_API_BASE_URL in your .env.local file."
    );
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/auth/resend-verification-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  let responseData;
  const contentType = response.headers.get("content-type");

  try {
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      throw new Error(
        `Server returned ${response.status} ${response.statusText}. ${response.status === 404 ? "API endpoint not found. Please check if the backend server is running and NEXT_PUBLIC_RIXLY_API_BASE_URL is configured correctly." : text.substring(0, 100)}`
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("Server returned")) {
      throw error;
    }
    throw new Error("Failed to parse server response. The server may not be running or the API URL is incorrect.");
  }

  if (!response.ok) {
    throw new Error(responseData.message || responseData.error || "Failed to resend verification email");
  }

  return responseData;
}

export interface VerifyOtpRequest {
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  user?: User;
}

export async function verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set NEXT_PUBLIC_RIXLY_API_BASE_URL in your .env.local file."
    );
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  let responseData;
  const contentType = response.headers.get("content-type");

  try {
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      throw new Error(
        `Server returned ${response.status} ${response.statusText}. ${response.status === 404 ? "API endpoint not found. Please check if the backend server is running and NEXT_PUBLIC_RIXLY_API_BASE_URL is configured correctly." : text.substring(0, 100)}`
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("Server returned")) {
      throw error;
    }
    throw new Error("Failed to parse server response. The server may not be running or the API URL is incorrect.");
  }

  if (!response.ok) {
    throw new Error(responseData.message || responseData.error || "Failed to verify OTP");
  }

  return responseData;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export async function requestPasswordReset(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set NEXT_PUBLIC_RIXLY_API_BASE_URL in your .env.local file."
    );
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  let responseData;
  const contentType = response.headers.get("content-type");

  try {
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      throw new Error(
        `Server returned ${response.status} ${response.statusText}. ${response.status === 404 ? "API endpoint not found. Please check if the backend server is running and NEXT_PUBLIC_RIXLY_API_BASE_URL is configured correctly." : text.substring(0, 100)}`
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("Server returned")) {
      throw error;
    }
    throw new Error("Failed to parse server response. The server may not be running or the API URL is incorrect.");
  }

  if (!response.ok) {
    throw new Error(responseData.message || responseData.error || "Failed to request password reset");
  }

  return responseData;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export async function resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set NEXT_PUBLIC_RIXLY_API_BASE_URL in your .env.local file."
    );
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  let responseData;
  const contentType = response.headers.get("content-type");

  try {
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      throw new Error(
        `Server returned ${response.status} ${response.statusText}. ${response.status === 404 ? "API endpoint not found. Please check if the backend server is running and NEXT_PUBLIC_RIXLY_API_BASE_URL is configured correctly." : text.substring(0, 100)}`
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("Server returned")) {
      throw error;
    }
    throw new Error("Failed to parse server response. The server may not be running or the API URL is incorrect.");
  }

  if (!response.ok) {
    throw new Error(responseData.message || responseData.error || "Failed to reset password");
  }

  return responseData;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export async function changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set NEXT_PUBLIC_RIXLY_API_BASE_URL in your .env.local file."
    );
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  let responseData;
  const contentType = response.headers.get("content-type");

  try {
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      throw new Error(
        `Server returned ${response.status} ${response.statusText}. ${response.status === 404 ? "API endpoint not found. Please check if the backend server is running and NEXT_PUBLIC_RIXLY_API_BASE_URL is configured correctly." : text.substring(0, 100)}`
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("Server returned")) {
      throw error;
    }
    throw new Error("Failed to parse server response. The server may not be running or the API URL is incorrect.");
  }

  if (!response.ok) {
    throw new Error(responseData.message || responseData.error || "Failed to change password");
  }

  return responseData;
}
