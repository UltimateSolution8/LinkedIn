/**
 * Geolocation utility for detecting user's currency based on IP location
 * Uses ipapi.co for IP-based country detection
 */

const GEOLOCATION_CACHE_KEY = 'rixly_user_currency';
const GEOLOCATION_API_URL = 'https://ipapi.co/json/';
const DEFAULT_CURRENCY = 'USD';
const INDIA_CURRENCY = 'INR';
const REQUEST_TIMEOUT = 5000; // 5 seconds

interface IpApiResponse {
  country_code?: string;
  country?: string;
  error?: boolean;
}

/**
 * Detects user's currency based on their IP geolocation
 * Returns "INR" for India, "USD" for all other countries
 * Caches result in sessionStorage to avoid repeated API calls
 */
export async function detectUserCurrency(): Promise<'USD' | 'INR'> {
  // Check cache first
  if (typeof window !== 'undefined') {
    const cached = sessionStorage.getItem(GEOLOCATION_CACHE_KEY);
    if (cached === 'USD' || cached === 'INR') {
      return cached;
    }
  }

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    // Fetch geolocation data
    const response = await fetch(GEOLOCATION_API_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Geolocation API error: ${response.status}`);
    }

    const data: IpApiResponse = await response.json();

    // Check if API returned an error
    if (data.error) {
      throw new Error('Geolocation API returned error');
    }

    // Determine currency based on country code
    const countryCode = data.country_code?.toUpperCase();
    console.log("Geolocation API country code:", countryCode);
    const currency = countryCode === 'IN' ? INDIA_CURRENCY : DEFAULT_CURRENCY;

    // Cache the result
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(GEOLOCATION_CACHE_KEY, currency);
    }

    return currency;
  } catch (error) {
    // Log error for debugging (optional)
    if (process.env.NODE_ENV === 'development') {
      console.warn('Geolocation detection failed, using default currency:', error);
    }

    // Default to USD on any error
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(GEOLOCATION_CACHE_KEY, DEFAULT_CURRENCY);
    }

    return DEFAULT_CURRENCY;
  }
}

/**
 * Clears the cached currency (useful for testing)
 */
export function clearCurrencyCache(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(GEOLOCATION_CACHE_KEY);
  }
}
