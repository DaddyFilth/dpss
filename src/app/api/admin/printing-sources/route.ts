import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { rateLimit, getClientIP, getSecurityHeaders } from '@/lib/security/rate-limit';
import { sanitizeDisplayName } from '@/lib/security/sanitize';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { getSessionRole, isAdminRole } from '@/lib/auth/roles';
import { z } from 'zod';
import { encryptFields, decryptFields } from '@/lib/security/field-encryption';

const printingSourceSchema = z.object({
  name: z.string().min(1),
  provider: z.enum(['PRINTFUL', 'GOOTEN', 'PRINTIFY', 'CUSTOM', 'LOCAL']),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  apiUrl: z.string().url().optional(),
  webhookUrl: z.string().url().optional(),
  basePrice: z.number().positive().optional(),
  markup: z.number().min(0).optional(),
  productionDays: z.number().int().min(1).optional(),
  shippingDays: z.number().int().min(1).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE']).optional(),
});

// GET all printing sources
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !isAdminRole(getSessionRole(session))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'printing-sources-get', 30, 3600000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const printingSources = await prisma.printingSource.findMany({
      include: {
        products: {
          select: {
            id: true,
            name: true,
            customizable: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const decryptedSources = await Promise.all(
      printingSources.map(source => decryptFields('PrintingSource', source))
    );

    return NextResponse.json(
      { printingSources: decryptedSources },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error({ err: error }, 'Printing sources fetch error');
    return NextResponse.json(
      { error: 'Failed to fetch printing sources' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// POST create printing source
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !isAdminRole(getSessionRole(session))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'printing-sources-create', 10, 3600000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const validationResult = printingSourceSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const { name, ...rest } = validationResult.data;
    const sanitizedData = {
      name: sanitizeDisplayName(name),
      ...rest,
    };

    const encryptedData = await encryptFields('PrintingSource', sanitizedData);

    const printingSource = await prisma.printingSource.create({
      data: encryptedData as typeof sanitizedData,
    });

    // Log creation
    await prisma.auditLog.create({
      data: {
        action: 'PRINTING_SOURCE_CREATED',
        entity: 'PrintingSource',
        entityId: printingSource.id,
        userId: session.user.id,
        details: `Printing source created: ${printingSource.name}`,
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || undefined,
      },
    });

    return NextResponse.json(
      { printingSource },
      { status: 201, headers: getSecurityHeaders() }
    );
  } catch (error) {
    logger.error({ err: error }, 'Printing source creation error');
    return NextResponse.json(
      { error: 'Failed to create printing source' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}