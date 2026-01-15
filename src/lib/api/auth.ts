import { handleApiResponse } from "./api-utils";
import { clearCurrencyCache } from "../utils/geolocation";
import { clearSubscriptionCache } from "../utils/subscription";

const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;

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
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
    authType: string;
    role?: string;
    createdAt: string;
    updatedAt: string;
  };
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
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  authType: string;
  role?: string;
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

  // Clear ALL authentication and session data from localStorage
  localStorage.removeItem("user");
  // Clear any cached subscription data
  localStorage.removeItem("subscriptionStatus");
  localStorage.removeItem("subscriptionDetails");
  // Clear any other session data that might exist
  localStorage.clear();
  clearCurrencyCache();
  clearSubscriptionCache();
}

export function getCurrentUser(): User | null {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error("Failed to parse user data:", error);
    return null;
  }
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

  await handleApiResponse(response);

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
