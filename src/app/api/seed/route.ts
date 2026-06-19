import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getSecurityHeaders } from '@/lib/security/rate-limit';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
    const { action } = body;

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
            output: stdout 
          },
          { headers: getSecurityHeaders() }
        );
      } catch (error: any) {
        console.error('Seeding error:', error);
        return NextResponse.json(
          { 
            error: 'Seeding failed', 
            details: error.message || error 
          },
          { status: 500, headers: getSecurityHeaders() }
        );
      }
    } else if (action === 'reset') {
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
            output: stdout 
          },
          { headers: getSecurityHeaders() }
        );
      } catch (error: any) {
        console.error('Reset and seeding error:', error);
        return NextResponse.json(
          { 
            error: 'Reset and seeding failed', 
            details: error.message || error 
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