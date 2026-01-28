/**
 * Cache header utilities for API routes
 * Improves performance by setting appropriate cache headers
 */

export type CacheStrategy = 
  | 'no-cache'
  | 'static'
  | 'dynamic'
  | 'user-specific';

/**
 * Get cache control headers based on strategy
 */
export function getCacheHeaders(strategy: CacheStrategy): Record<string, string> {
  switch (strategy) {
    case 'no-cache':
      return {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      };
    
    case 'static':
      // For static content that rarely changes (e.g., property listings)
      return {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      };
    
    case 'dynamic':
      // For dynamic content that changes frequently (e.g., availability)
      return {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      };
    
    case 'user-specific':
      // For user-specific content (e.g., bookings, cart)
      return {
        'Cache-Control': 'private, max-age=0, must-revalidate',
      };
    
    default:
      return {
        'Cache-Control': 'no-store',
      };
  }
}

/**
 * Add cache headers to a Response
 */
export function withCacheHeaders(
  response: Response,
  strategy: CacheStrategy
): Response {
  const headers = getCacheHeaders(strategy);
  
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

/**
 * Create a NextResponse with cache headers
 */
export function createCachedResponse<T>(
  data: T,
  strategy: CacheStrategy,
  status: number = 200
): Response {
  const headers = getCacheHeaders(strategy);
  
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}
