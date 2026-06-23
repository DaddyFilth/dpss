import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  console.log('🧪 Testing Prisma queries...\n');

  try {
    // Test 1: Create a new category
    console.log('1️⃣ Creating a new product category...');
    const apparelCategory = await prisma.productCategory.upsert({
      where: { slug: 'apparel' },
      update: {},
      create: {
        name: 'Apparel',
        slug: 'apparel',
        description: 'Clothing and fashion items',
      },
    });
    console.log(`✅ Created category: ${apparelCategory.name}\n`);

    // Test 2: Create a newsletter subscription
    console.log('2️⃣ Creating a newsletter subscription...');
    const subscription = await prisma.newsletterSubscription.create({
      data: {
        email: 'test@example.com',
        source: 'demo',
      },
    });
    console.log(`✅ Created subscription for: ${subscription.email}\n`);

    // Test 3: Create a coupon code
    console.log('3️⃣ Creating a coupon code...');
    const coupon = await prisma.couponCode.create({
      data: {
        code: 'WELCOME20',
        description: 'Welcome discount for new customers',
        type: 'PERCENTAGE',
        value: 20.00,
        minOrderAmount: 50.00,
        maxUses: 100,
        expiresAt: new Date('2025-12-31'),
      },
    });
    console.log(`✅ Created coupon: ${coupon.code} (${coupon.type})\n`);

    // Test 4: Log an analytics event
    console.log('4️⃣ Logging an analytics event...');
    const event = await prisma.analyticsEvent.create({
      data: {
        eventType: 'page_view',
        eventData: { page: '/products', referrer: 'google' },
        sessionId: 'demo-session-123',
        ipAddress: '127.0.0.1',
      },
    });
    console.log(`✅ Logged event: ${event.eventType}\n`);

    // Test 5: Read queries with relations
    console.log('5️⃣ Reading products with category...');
    const products = await prisma.product.findMany({
      include: {
        productCategory: true,
        printingSource: true,
      },
      take: 3,
    });
    console.log(`✅ Found ${products.length} products`);
    products.forEach((p: any) => {
      console.log(`   - ${p.name} (${p.productCategory?.name || 'No category'})`);
    });
    console.log();

    // Test 6: Update query
    console.log('6️⃣ Updating coupon usage...');
    const updatedCoupon = await prisma.couponCode.update({
      where: { code: 'WELCOME20' },
      data: { usedCount: { increment: 1 } },
    });
    console.log(`✅ Coupon ${updatedCoupon.code} used ${updatedCoupon.usedCount} times\n`);

    // Test 7: Aggregation query
    console.log('7️⃣ Running aggregation query...');
    const stats = await prisma.product.aggregate({
      _count: { id: true },
      _avg: { price: true },
      _min: { price: true },
      _max: { price: true },
    });
    console.log(`✅ Product stats:`);
    console.log(`   - Total: ${stats._count.id}`);
    console.log(`   - Avg price: $${stats._avg.price?.toFixed(2)}`);
    console.log(`   - Min price: $${stats._min.price}`);
    console.log(`   - Max price: $${stats._max.price}\n`);

    // Test 8: Complex query with filtering
    console.log('8️⃣ Complex query with filtering...');
    const featuredProducts = await prisma.product.findMany({
      where: {
        featured: true,
        customizable: true,
        price: { lte: 50 },
      },
      orderBy: { price: 'asc' },
      take: 5,
    });
    console.log(`✅ Found ${featuredProducts.length} featured customizable products under $50\n`);

    // Test 9: Transaction example
    console.log('9️⃣ Testing transaction...');
    await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.findFirst();
      if (user) {
        await tx.auditLog.create({
          data: {
            userId: user.id,
            action: 'TEST_TRANSACTION',
            entity: 'Demo',
            details: 'Testing transaction with Prisma',
          },
        });
      }
    });
    console.log('✅ Transaction completed successfully\n');

    // Test 10: Cleanup demo data
    console.log('🔧 Cleaning up demo data...');
    await prisma.analyticsEvent.deleteMany({ where: { sessionId: 'demo-session-123' } });
    await prisma.newsletterSubscription.delete({ where: { id: subscription.id } });
    await prisma.couponCode.delete({ where: { code: 'WELCOME20' } });
    console.log('✅ Cleanup complete\n');

    console.log('🎉 All Prisma query tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
