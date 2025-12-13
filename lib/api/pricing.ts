const RIXLY_API_BASE_URL = process.env.NEXT_PUBLIC_RIXLY_API_BASE_URL;

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

export interface CreateOrderRequest {
  planId: string;
  currency: string;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  planId: string;
}

export interface PaymentVerificationRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  planId: string;
}

export interface PaymentVerificationResponse {
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
 * Create a Razorpay order for payment
 */
export async function createRazorpayOrder(
  data: CreateOrderRequest
): Promise<RazorpayOrderResponse> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please login.");
  }

  try {
    const response = await fetch(`${RIXLY_API_BASE_URL}/api/pricing/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to create order");
    }

    return responseData;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
}

/**
 * Verify payment signature after Razorpay payment
 */
export async function verifyPayment(
  data: PaymentVerificationRequest
): Promise<PaymentVerificationResponse> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please login.");
  }

  try {
    const response = await fetch(`${RIXLY_API_BASE_URL}/api/pricing/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Payment verification failed");
    }

    return responseData;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
}
