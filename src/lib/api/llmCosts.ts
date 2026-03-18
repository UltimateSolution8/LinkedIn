const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;

/**
 * LLM Cost Tracking Types
 */

export interface LLMCostSummary {
  total_calls: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_tokens: number;
  total_cost_usd: number;
  avg_latency_ms: number;
  success_count: number;
  error_count: number;
}

export interface LLMCostByOperation {
  operation_type: string;
  call_count: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_tokens: number;
  total_cost_usd: number;
  avg_latency_ms: number;
  success_count: number;
  error_count: number;
}

export interface LLMCostByProvider {
  provider: string;
  model: string;
  call_count: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_tokens: number;
  total_cost_usd: number;
  avg_latency_ms: number;
  success_count: number;
  error_count: number;
}

export interface DailyCost {
  date: string;
  call_count: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_tokens: number;
  total_cost_usd: number;
  avg_latency_ms: number;
}

export interface ProjectCosts {
  project_id: number;
  project_name: string;
  total_calls: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_tokens: number;
  total_cost_usd: number;
  avg_latency_ms: number;
  success_count: number;
  error_count: number;
}

export interface LLMCostSummaryResponse {
  success: boolean;
  data: LLMCostSummary;
}

export interface LLMCostsByOperationResponse {
  success: boolean;
  data: LLMCostByOperation[];
}

export interface LLMCostsByProviderResponse {
  success: boolean;
  data: LLMCostByProvider[];
}

export interface DailyCostsResponse {
  success: boolean;
  data: DailyCost[];
}

export interface ProjectCostsResponse {
  success: boolean;
  data: ProjectCosts;
}

/**
 * Get total LLM costs summary with optional date range
 */
export async function getTotalLLMCosts(
  startDate?: Date,
  endDate?: Date
): Promise<LLMCostSummary> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const params = new URLSearchParams();
    if (startDate) {
      params.append("startDate", startDate.toISOString());
    }
    if (endDate) {
      params.append("endDate", endDate.toISOString());
    }

    const queryString = params.toString();
    const url = `${RIXLY_API_BASE_URL}/api/llm-costs/summary${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const responseData: LLMCostSummaryResponse = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch LLM cost summary");
    }

    return responseData.data;
  } catch (error) {
    console.error("Error fetching LLM cost summary:", error);
    throw error;
  }
}

/**
 * Get LLM costs breakdown by operation type
 */
export async function getLLMCostsByOperation(
  startDate?: Date,
  endDate?: Date
): Promise<LLMCostByOperation[]> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const params = new URLSearchParams();
    if (startDate) {
      params.append("startDate", startDate.toISOString());
    }
    if (endDate) {
      params.append("endDate", endDate.toISOString());
    }

    const queryString = params.toString();
    const url = `${RIXLY_API_BASE_URL}/api/llm-costs/by-operation${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const responseData: LLMCostsByOperationResponse = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch LLM costs by operation");
    }

    return responseData.data;
  } catch (error) {
    console.error("Error fetching LLM costs by operation:", error);
    throw error;
  }
}

/**
 * Get LLM costs breakdown by provider
 */
export async function getLLMCostsByProvider(
  startDate?: Date,
  endDate?: Date
): Promise<LLMCostByProvider[]> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const params = new URLSearchParams();
    if (startDate) {
      params.append("startDate", startDate.toISOString());
    }
    if (endDate) {
      params.append("endDate", endDate.toISOString());
    }

    const queryString = params.toString();
    const url = `${RIXLY_API_BASE_URL}/api/llm-costs/by-provider${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const responseData: LLMCostsByProviderResponse = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch LLM costs by provider");
    }

    return responseData.data;
  } catch (error) {
    console.error("Error fetching LLM costs by provider:", error);
    throw error;
  }
}

/**
 * Get daily LLM cost trends
 */
export async function getDailyLLMCosts(
  days: number = 30,
  projectId?: number
): Promise<DailyCost[]> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const params = new URLSearchParams({
      days: days.toString(),
    });

    if (projectId) {
      params.append("projectId", projectId.toString());
    }

    const response = await fetch(
      `${RIXLY_API_BASE_URL}/api/llm-costs/daily?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const responseData: DailyCostsResponse = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch daily LLM costs");
    }

    return responseData.data;
  } catch (error) {
    console.error("Error fetching daily LLM costs:", error);
    throw error;
  }
}

/**
 * Get LLM costs for a specific project
 */
export async function getProjectLLMCosts(
  projectId: number
): Promise<ProjectCosts> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const response = await fetch(
      `${RIXLY_API_BASE_URL}/api/llm-costs/project/${projectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const responseData: ProjectCostsResponse = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch project LLM costs");
    }

    return responseData.data;
  } catch (error) {
    console.error("Error fetching project LLM costs:", error);
    throw error;
  }
}
