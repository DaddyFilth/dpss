import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import bcrypt from 'bcryptjs';
import { getSecurityHeaders, getClientIP, rateLimit } from '@/lib/security/rate-limit';
import { isStrongPassword, isValidEmail, sanitizeInput } from '@/lib/security/encryption';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { getSessionRole, isSuperAdminRole } from '@/lib/auth/roles';
import { z } from 'zod';

const adminSignupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'admin-signup', 5, 3600000);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const validationResult = adminSignupSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const userCount = await prisma.user.count();
    const session = await getServerSession(authOptions);

    if (userCount > 0 && !isSuperAdminRole(getSessionRole(session))) {
      return NextResponse.json(
        { error: 'Only a super admin can create additional admin accounts' },
        { status: 403, headers: getSecurityHeaders() }
      );
    }

    const { password } = validationResult.data;
    const email = sanitizeInput(validationResult.data.email.toLowerCase());
    const name = sanitizeInput(validationResult.data.name);

    if (!isValidEmail(email) || !isStrongPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid email or weak password' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Bootstrap is public only for the first account. Later admin creation requires SUPER_ADMIN.
    const role = userCount === 0 ? 'SUPER_ADMIN' : 'ADMIN';

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as any,
      },
    });

    return NextResponse.json(
      { 
        message: 'Admin account created successfully',
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error({ err: error }, 'Signup error');
    return NextResponse.json(
      { error: 'Failed to create admin account' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
