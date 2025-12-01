const RIXLY_API_BASE_URL = process.env.NEXT_PUBLIC_RIXLY_API_BASE_URL;

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to sign up");
  }

  return responseData;
}

export async function signin(data: SigninRequest): Promise<SigninResponse> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to sign in");
  }

  return responseData;
}

export function logout(): void {
  // Clear authentication data from localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
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
