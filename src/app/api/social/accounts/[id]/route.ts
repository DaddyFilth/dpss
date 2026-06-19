import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getSecurityHeaders } from '@/lib/security/rate-limit';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const account = await prisma.socialAccount.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    await prisma.socialAccount.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json(
      { message: 'Account disconnected successfully' },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Failed to disconnect account:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect account' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}