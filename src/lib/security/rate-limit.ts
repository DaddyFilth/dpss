// Rate limiting utility for API protection
// Prevents brute force attacks and API abuse

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

const getStoreKey = (identifier: string, endpoint: string): string => {
  return `${identifier}:${endpoint}`;
};

export const rateLimit = async (
  identifier: string,
  endpoint: string,
  limit: number = 100,
  windowMs: number = 900000 // 15 minutes default
): Promise<{ success: boolean; remaining: number; resetTime: number }> => {
  const key = getStoreKey(identifier, endpoint);
  const now = Date.now();
  
  // Clean up expired entries
  for (const [storeKey, data] of store.entries()) {
    if (data.resetTime < now) {
      store.delete(storeKey);
    }
  }
  
  const entry = store.get(key);
  
  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired one
    store.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    
    return {
      success: true,
      remaining: limit - 1,
      resetTime: now + windowMs
    };
  }
  
  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime
    };
  }
  
  // Increment count
  entry.count++;
  store.set(key, entry);
  
  return {
    success: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime
  };
};

// Get client IP address from request
export const getClientIP = (request: Request): string => {
  // Check various headers for IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return 'unknown';
};

// Security headers configuration
export const getSecurityHeaders = (): Headers => {
  const headers = new Headers();
  
  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  headers.set('X-XSS-Protection', '1; mode=block');
  
  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY');
  
  // Strict Transport Security (only in production)
  if (process.env.NODE_ENV === 'production') {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Content Security Policy
  headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.paypal.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.stripe.com https://www.paypal.com",
      "frame-src 'self' https://js.stripe.com https://www.paypal.com"
    ].join('; ')
  );
  
  // Referrer Policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=()'
  );
  
  return headers;
};

// Validate CSRF token (simplified version)
export const generateCSRFToken = async (): Promise<string> => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const validateCSRFToken = (token: string, sessionToken: string): boolean => {
  // In production, implement proper CSRF validation
  // This is a simplified version
  return token === sessionToken;
};
