import { PrismaClient } from '../generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  console.log('🌱 Starting database seed...');

  // Starter models — replace with your own

  // Create a default printing source
  const printingSource = await prisma.printingSource.upsert({
    where: { id: 'default-printful' },
    update: {},
    create: {
      id: 'default-printful',
      name: 'Printful Integration',
      provider: 'PRINTFUL',
      status: 'ACTIVE',
      apiUrl: 'https://api.printful.com',
      basePrice: 0,
      markup: 0,
      productionDays: 3,
      shippingDays: 5,
    },
  });
  console.log('✅ Created default printing source');

  // Create a sample product
  const product = await prisma.product.upsert({
    where: { sku: 'TSHIRT-001' },
    update: {},
    create: {
      name: 'Custom Premium T-Shirt',
      description: 'High-quality 100% cotton t-shirt perfect for custom designs.',
      price: 24.99,
      comparePrice: 34.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop'],
      category: 'Apparel',
      tags: ['custom', 't-shirt', 'cotton'],
      stock: 999,
      sku: 'TSHIRT-001',
      featured: true,
      customizable: true,
      printingSourceId: printingSource.id,
    },
  });
  console.log('✅ Created sample product');

  // Create a sample user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: 'hashed_password_here',
      role: 'CUSTOMER',
    },
  });
  console.log('✅ Created demo user');

  console.log('🌱 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
