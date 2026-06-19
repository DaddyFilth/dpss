import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a default printing source (you'll need to configure real API keys later)
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

  // Create dropshipping products
  const products = [
    // Custom Apparel
    {
      name: 'Custom Premium T-Shirt',
      description: 'High-quality 100% cotton t-shirt perfect for custom designs. Soft, comfortable, and durable. Available in multiple colors and sizes.',
      price: 24.99,
      comparePrice: 34.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop',
      ],
      category: 'Apparel',
      tags: ['custom', 't-shirt', 'cotton', 'print-on-demand'],
      stock: 999,
      sku: 'TSHIRT-001',
      featured: true,
      customizable: true,
      customizationConfig: {
        options: [
          { type: 'text', name: 'Custom Text', maxChars: 50, price: 5 },
          { type: 'image', name: 'Upload Image', maxFiles: 2, price: 10 },
          { type: 'color', name: 'Base Color', options: ['White', 'Black', 'Gray', 'Navy'], price: 0 },
          { type: 'size', name: 'Size', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], price: 0 },
        ],
      },
      printingSourceId: printingSource.id,
    },
    {
      name: 'Custom Hoodie - Premium Quality',
      description: 'Comfortable and warm hoodie with custom printing options. Perfect for cooler weather and casual wear.',
      price: 44.99,
      comparePrice: 59.99,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&h=800&fit=crop',
      ],
      category: 'Apparel',
      tags: ['custom', 'hoodie', 'warm', 'print-on-demand'],
      stock: 999,
      sku: 'HOODIE-001',
      featured: true,
      customizable: true,
      customizationConfig: {
        options: [
          { type: 'text', name: 'Custom Text', maxChars: 50, price: 5 },
          { type: 'image', name: 'Upload Image', maxFiles: 2, price: 10 },
          { type: 'color', name: 'Base Color', options: ['Black', 'Gray', 'Navy', 'Maroon'], price: 0 },
          { type: 'size', name: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'], price: 0 },
        ],
      },
      printingSourceId: printingSource.id,
    },
    {
      name: 'Custom Canvas Print - Wall Art',
      description: 'Transform your photos into stunning canvas prints. High-quality printing on durable canvas material.',
      price: 34.99,
      comparePrice: 49.99,
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800&h=800&fit=crop',
      ],
      category: 'Home Decor',
      tags: ['canvas', 'wall-art', 'custom', 'print-on-demand'],
      stock: 999,
      sku: 'CANVAS-001',
      featured: true,
      customizable: true,
      customizationConfig: {
        options: [
          { type: 'image', name: 'Upload Image', maxFiles: 1, required: true, price: 0 },
          { type: 'size', name: 'Canvas Size', options: ['12x12', '16x20', '24x36'], price: [0, 10, 20] },
        ],
      },
      printingSourceId: printingSource.id,
    },
    {
      name: 'Custom Phone Case - iPhone & Android',
      description: 'Protective phone case with custom designs. Available for all major phone models.',
      price: 19.99,
      comparePrice: 29.99,
      image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&h=800&fit=crop',
      ],
      category: 'Accessories',
      tags: ['phone-case', 'custom', 'mobile', 'print-on-demand'],
      stock: 999,
      sku: 'CASE-001',
      featured: true,
      customizable: true,
      customizationConfig: {
        options: [
          { type: 'image', name: 'Upload Design', maxFiles: 1, required: true, price: 0 },
          { type: 'text', name: 'Custom Text', maxChars: 20, price: 3 },
          { type: 'select', name: 'Phone Model', options: ['iPhone 14', 'iPhone 15', 'Samsung Galaxy', 'Google Pixel'], price: 0 },
        ],
      },
      printingSourceId: printingSource.id,
    },
    {
      name: 'Custom Coffee Mug',
      description: 'Ceramic coffee mug with your custom design. Perfect for gifts or personal use.',
      price: 14.99,
      comparePrice: 19.99,
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=800&fit=crop',
      ],
      category: 'Home Goods',
      tags: ['mug', 'coffee', 'custom', 'print-on-demand'],
      stock: 999,
      sku: 'MUG-001',
      featured: true,
      customizable: true,
      customizationConfig: {
        options: [
          { type: 'image', name: 'Upload Image', maxFiles: 1, price: 5 },
          { type: 'text', name: 'Custom Text', maxChars: 30, price: 2 },
          { type: 'color', name: 'Mug Color', options: ['White', 'Black'], price: 0 },
        ],
      },
      printingSourceId: printingSource.id,
    },
    {
      name: 'Custom Tote Bag',
      description: 'Eco-friendly canvas tote bag with custom printing. Perfect for shopping or daily use.',
      price: 18.99,
      comparePrice: 24.99,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1597484661647-2f5fef640dd1?w=800&h=800&fit=crop',
      ],
      category: 'Accessories',
      tags: ['tote-bag', 'eco-friendly', 'custom', 'print-on-demand'],
      stock: 999,
      sku: 'TOTE-001',
      featured: false,
      customizable: true,
      customizationConfig: {
        options: [
          { type: 'image', name: 'Upload Design', maxFiles: 1, price: 5 },
          { type: 'text', name: 'Custom Text', maxChars: 40, price: 2 },
        ],
      },
      printingSourceId: printingSource.id,
    },
    {
      name: 'Custom Poster Print',
      description: 'High-quality poster prints with custom designs. Perfect for room decoration.',
      price: 12.99,
      comparePrice: 18.99,
      image: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800&h=800&fit=crop',
      ],
      category: 'Home Decor',
      tags: ['poster', 'wall-art', 'custom', 'print-on-demand'],
      stock: 999,
      sku: 'POSTER-001',
      featured: false,
      customizable: true,
      customizationConfig: {
        options: [
          { type: 'image', name: 'Upload Image', maxFiles: 1, required: true, price: 0 },
          { type: 'size', name: 'Size', options: ['11x14', '16x20', '24x36'], price: [0, 5, 10] },
        ],
      },
      printingSourceId: printingSource.id,
    },
    {
      name: 'Custom Throw Pillow',
      description: 'Soft throw pillow with custom cover design. Perfect for home decor.',
      price: 22.99,
      comparePrice: 32.99,
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1565033620-38d477a6e8e7?w=800&h=800&fit=crop',
      ],
      category: 'Home Decor',
      tags: ['pillow', 'home-decor', 'custom', 'print-on-demand'],
      stock: 999,
      sku: 'PILLOW-001',
      featured: false,
      customizable: true,
      customizationConfig: {
        options: [
          { type: 'image', name: 'Upload Design', maxFiles: 1, price: 5 },
          { type: 'size', name: 'Size', options: ['16x16', '18x18', '20x20'], price: [0, 3, 5] },
        ],
      },
      printingSourceId: printingSource.id,
    },
    // Standard Products (non-customizable)
    {
      name: 'Wireless Phone Charger',
      description: 'Fast wireless phone charger compatible with all Qi-enabled devices. Compact and efficient.',
      price: 29.99,
      comparePrice: 39.99,
      image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=800&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=800&h=800&fit=crop',
      ],
      category: 'Electronics',
      tags: ['wireless', 'charger', 'electronics', 'accessories'],
      stock: 100,
      sku: 'CHARGER-001',
      featured: false,
      customizable: false,
      printingSourceId: printingSource.id,
    },
    {
      name: 'Bluetooth Earbuds',
      description: 'True wireless earbuds with premium sound quality and long battery life.',
      price: 39.99,
      comparePrice: 59.99,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop',
      ],
      category: 'Electronics',
      tags: ['bluetooth', 'earbuds', 'audio', 'wireless'],
      stock: 75,
      sku: 'EARBUDS-001',
      featured: true,
      customizable: false,
      printingSourceId: printingSource.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });
  }

  console.log(`✅ Created ${products.length} products`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
