import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { hash } from 'bcryptjs';
import { isValidEmail, isStrongPassword, sanitizeInput } from '@/lib/security/encryption';
import { rateLimit, getClientIP } from '@/lib/security/rate-limit';
import { z } from 'zod';

// Input validation schema
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'register', 5, 3600000); // 5 requests per hour
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = registerSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { email, password, name } = validationResult.data;

    // Sanitize input
    const sanitizedEmail = sanitizeInput(email.toLowerCase());
    const sanitizedName = name ? sanitizeInput(name) : null;

    // Additional validation
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        password: hashedPassword,
        name: sanitizedName,
      },
    });

    // Log registration for security audit
    await prisma.auditLog.create({
      data: {
        action: 'USER_REGISTERED',
        entity: 'User',
        entityId: user.id,
        details: `User registered with email: ${sanitizedEmail}`,
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || undefined,
      },
    });

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error({ err: error }, 'Registration error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
