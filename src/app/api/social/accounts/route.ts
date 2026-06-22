import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { getSecurityHeaders } from '@/lib/security/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const accounts = await prisma.socialAccount.findMany({
      where: { userId: session.user.id, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      { accounts },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error({ err: error }, 'Failed to fetch social accounts');
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}