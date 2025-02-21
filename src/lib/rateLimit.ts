import { NextRequest } from "next/server";
import { cache } from "./cache";
import { CreateResponseApiError } from "./utils";

interface RateLimitOptions {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests allowed in the interval
}

function rateLimit(
  identifier: string,
  options: RateLimitOptions = { interval: 60000, maxRequests: 10 }
) {
  const key = `rate_limit:${identifier}`;
  const now = Date.now();

  // Get current requests data from cache
  const requestData = cache.get<{ count: number; resetTime: number }>(key);

  if (!requestData) {
    // First request, initialize counter
    cache.set(
      key,
      { count: 1, resetTime: now + options.interval },
      options.interval
    );
    return null;
  }

  if (now > requestData.resetTime) {
    // Time window expired, reset counter
    cache.set(
      key,
      { count: 1, resetTime: now + options.interval },
      options.interval
    );
    return null;
  }

  if (requestData.count >= options.maxRequests) {
    // Rate limit exceeded
    return CreateResponseApiError(new Error("Too many requests"), 429);
  }

  // Increment counter
  cache.set(
    key,
    { count: requestData.count + 1, resetTime: requestData.resetTime },
    options.interval
  );
  return null;
}

export function CreateRateLimit(
  request: NextRequest,
  options?: RateLimitOptions
) {
  const key = `sb-${process.env.SUPABASE_PROJECT_NAME}-auth.token.0`;
  const identifier = request.cookies.get(key)?.value!;
  return rateLimit(identifier, options);
}
