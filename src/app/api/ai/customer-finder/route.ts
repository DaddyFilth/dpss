import { NextRequest, NextResponse } from 'next/server';
import { aiCustomerFinder } from '@/lib/ai/customer-finder';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getSecurityHeaders } from '@/lib/security/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Admin only access
    const userRole = (session?.user as any)?.role;
    if (!session || (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // Generate acquisition strategy
    const strategy = aiCustomerFinder.generateAcquisitionStrategy();
    
    // Generate lead capture strategies
    const leadCapture = aiCustomerFinder.generateLeadCaptureStrategies();
    
    // Generate retargeting strategy
    const retargeting = aiCustomerFinder.generateRetargetingStrategy();

    return NextResponse.json(
      {
        strategy,
        leadCapture,
        retargeting,
        meta: {
          algorithm: 'ai-customer-finder',
          version: '1.0',
          timestamp: new Date().toISOString()
        }
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('AI customer finder error:', error);
    return NextResponse.json(
      { error: 'Failed to generate customer targeting strategy' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    const userRole = (session?.user as any)?.role;
    if (!session || (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { personaId } = body;

    if (!personaId) {
      return NextResponse.json(
        { error: 'Persona ID required' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Find the persona
    const strategy = aiCustomerFinder.generateAcquisitionStrategy();
    const persona = strategy.personas.find((p: any) => p.id === personaId);

    if (!persona) {
      return NextResponse.json(
        { error: 'Persona not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    // Get customer habitats for this persona
    const habitats = aiCustomerFinder.findCustomerHabitats(persona);
    
    // Find best channels for this persona
    const bestChannels = aiCustomerFinder.findBestChannels(persona);

    return NextResponse.json(
      {
        persona,
        habitats,
        bestChannels,
        meta: {
          algorithm: 'ai-customer-finder',
          version: '1.0',
          timestamp: new Date().toISOString()
        }
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('AI customer finder error:', error);
    return NextResponse.json(
      { error: 'Failed to get customer targeting data' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}