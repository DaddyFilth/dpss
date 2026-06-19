import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getClientIP, getSecurityHeaders, rateLimit } from '@/lib/security/rate-limit';
import { getSessionRole, isAdminRole, isSuperAdminRole } from '@/lib/auth/roles';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    const userRole = getSessionRole(session);
    if (!session || !isAdminRole(userRole)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(ip, 'database-seed', 3, 3600000);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many database maintenance requests' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DATABASE_SEEDING !== 'true') {
      return NextResponse.json(
        { error: 'Database seeding is disabled in production' },
        { status: 403, headers: getSecurityHeaders() }
      );
    }

    if (action === 'seed') {
      console.log('Starting database seeding...');
      
      try {
        // Run the seed script
        const { stdout, stderr } = await execAsync('npx prisma db seed');
        
        console.log('Seeding stdout:', stdout);
        if (stderr) console.log('Seeding stderr:', stderr);
        
        return NextResponse.json(
          { 
            success: true, 
            message: 'Database seeded successfully',
            output: stdout.slice(-2000)
          },
          { headers: getSecurityHeaders() }
        );
      } catch (error: any) {
        console.error('Seeding error:', error);
        return NextResponse.json(
          { 
            error: 'Seeding failed', 
            details: error.message || 'Seed command failed'
          },
          { status: 500, headers: getSecurityHeaders() }
        );
      }
    } else if (action === 'reset') {
      if (!isSuperAdminRole(userRole)) {
        return NextResponse.json(
          { error: 'Unauthorized - Super admin access required' },
          { status: 403, headers: getSecurityHeaders() }
        );
      }

      console.log('Resetting database and seeding...');
      
      try {
        // Reset database (drop and recreate)
        const { stdout: resetOutput } = await execAsync('npx prisma db push --force-reset');
        console.log('Reset output:', resetOutput);
        
        // Then seed
        const { stdout, stderr } = await execAsync('npx prisma db seed');
        console.log('Seeding stdout:', stdout);
        if (stderr) console.log('Seeding stderr:', stderr);
        
        return NextResponse.json(
          { 
            success: true, 
            message: 'Database reset and seeded successfully',
            output: stdout.slice(-2000)
          },
          { headers: getSecurityHeaders() }
        );
      } catch (error: any) {
        console.error('Reset and seeding error:', error);
        return NextResponse.json(
          { 
            error: 'Reset and seeding failed', 
            details: error.message || 'Reset command failed'
          },
          { status: 500, headers: getSecurityHeaders() }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Unknown action' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }
  } catch (error) {
    console.error('Seed API error:', error);
    return NextResponse.json(
      { error: 'Failed to process seed request' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
