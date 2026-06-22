import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { getSecurityHeaders, getClientIP, rateLimit } from '@/lib/security/rate-limit';
import { getSessionRole, isAdminRole } from '@/lib/auth/roles';

type RouteHandler = (
  request: NextRequest,
  context?: any
) => Promise<NextResponse>;

interface WithAuthOptions {
  requireAdmin?: boolean;
}

/**
 * Wraps a route handler to require authentication via NextAuth session.
 * Returns 401 if not authenticated, 403 if admin required but user is not admin.
 */
export function withAuth(handler: RouteHandler, options: WithAuthOptions = {}): RouteHandler {
  return async (request: NextRequest, context?: any) => {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    if (options.requireAdmin && !isAdminRole(getSessionRole(session))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403, headers: getSecurityHeaders() }
      );
    }

    return handler(request, context);
  };
}

interface WithRateLimitOptions {
  limit?: number;
  windowMs?: number;
  endpoint?: string;
}

/**
 * Wraps a route handler with rate limiting logic.
 * Returns 429 if rate limit is exceeded.
 */
export function withRateLimit(handler: RouteHandler, options: WithRateLimitOptions = {}): RouteHandler {
  const { limit = 100, windowMs = 900000, endpoint = 'api' } = options;

  return async (request: NextRequest, context?: any) => {
    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, endpoint, limit, windowMs);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            ...Object.fromEntries(getSecurityHeaders().entries()),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimitResult.resetTime),
          },
        }
      );
    }

    return handler(request, context);
  };
}

/**
 * Composes multiple middleware wrappers.
 * Applied from right to left (innermost first).
 */
export function compose(...wrappers: ((handler: RouteHandler) => RouteHandler)[]): (handler: RouteHandler) => RouteHandler {
  return (handler: RouteHandler) => {
    return wrappers.reduceRight((acc, wrapper) => wrapper(acc), handler);
  };
}
