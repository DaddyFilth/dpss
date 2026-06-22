import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { getSecurityHeaders } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { productId, platform, content, scheduledAt } = body;

    if (!productId || !platform || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Get the social account for the platform
    const socialAccount = await prisma.socialAccount.findFirst({
      where: {
        userId: session.user.id,
        provider: platform,
        isActive: true,
      },
    });

    if (!socialAccount) {
      return NextResponse.json(
        { error: `No connected ${platform} account` },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    // Create social post record
    const socialPost = await prisma.socialPost.create({
      data: {
        productId,
        accountId: socialAccount.id,
        platform,
        content,
        imageUrl: product.image,
        status: scheduledAt ? 'SCHEDULED' : 'PENDING',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
    });

    // If not scheduled, post immediately (would call platform APIs here)
    if (!scheduledAt) {
      // TODO: Implement actual posting to each platform's API
      // For now, just mark as posted for demo purposes
      await prisma.socialPost.update({
        where: { id: socialPost.id },
        data: {
          status: 'POSTED',
          postedAt: new Date(),
        },
      });
    }

    return NextResponse.json(
      {
        message: scheduledAt ? 'Post scheduled successfully' : 'Post created successfully',
        post: socialPost,
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error({ err: error }, 'Failed to create social post');
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {
      socialAccount: { userId: session.user.id },
    };

    if (status) {
      where.status = status;
    }

    const posts = await prisma.socialPost.findMany({
      where,
      include: {
        product: true,
        socialAccount: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      { posts },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error({ err: error }, 'Failed to fetch social posts');
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}