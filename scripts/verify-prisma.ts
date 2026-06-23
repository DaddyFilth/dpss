import { PrismaClient } from '../generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  try {
    // Run a simple read query to verify connection
    const userCount = await prisma.user.count();
    console.log('✅ Connected');
    console.log(`Database has ${userCount} user(s)`);
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
