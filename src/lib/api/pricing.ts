import { handleApiResponse } from "./api-utils";

const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;

export interface PricingPlan {
  id: string;
  name: string;
  currentPrice: number;
  originalPrice: number;
  currency: string;
  currencySymbol: string;
  features: string[];
  highlightNumber?: number;
  highlightLabel?: string;
  isIntroductory?: boolean;
  buttonText?: string;
}

export interface PricingResponse {
  plans: PricingPlan[];
  message?: string;
}

export interface CreateSubscriptionRequest {
  planId: string;
}

export interface RazorpaySubscriptionResponse {
  success: boolean;
  message: string;
  subscription: {
    id: string;
    planId: string;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    vendorSubscriptionId: string;
    planDetails: {
      name: string;
      amount: number;
      currency: string;
      interval: string;
    };
  };
  keyId: string;
}

export interface SubscriptionPaymentVerificationRequest {
  razorpaySubscriptionId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface SubscriptionPaymentVerificationResponse {
  success: boolean;
  message: string;
  subscriptionId?: string;
}

/**
 * Fetch pricing plans for a specific currency
 */
export async function getPricingPlans(currency: string = "USD"): Promise<PricingPlan[]> {
  try {
    const response = await fetch(`${RIXLY_API_BASE_URL}/api/pricing/plans?currency=${currency}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData: PricingResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch pricing plans");
    }

    return responseData.plans;
  } catch (error) {
    console.error("Error fetching pricing plans:", error);
    throw error;
  }
}

/**
 * Create a subscription for payment
 */
export async function createSubscription(
  data: CreateSubscriptionRequest
): Promise<RazorpaySubscriptionResponse> {
  try {
    const response = await fetch(`${RIXLY_API_BASE_URL}/api/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    await handleApiResponse(response);

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to create subscription");
    }

    return responseData;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
}

/**
 * Verify subscription payment signature after Razorpay payment
 */
export async function verifySubscriptionPayment(
  data: SubscriptionPaymentVerificationRequest
): Promise<SubscriptionPaymentVerificationResponse> {
  try {
    const response = await fetch(`${RIXLY_API_BASE_URL}/api/subscriptions/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    await handleApiResponse(response);

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Payment verification failed");
    }

    return responseData;
  } catch (error) {
    console.error("Error verifying subscription payment:", error);
    throw error;
  }
}
