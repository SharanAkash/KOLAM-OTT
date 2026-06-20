const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Admin User
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kolamott.com' },
    update: {},
    create: {
      email: 'admin@kolamott.com',
      phone: '+919876543210',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      isEmailVerified: true,
      isPhoneVerified: true,
      genrePreferences: ['Action', 'Drama', 'Comedy'],
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create Test User
  const testPassword = await bcrypt.hash('Test@123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@kolamott.com' },
    update: {},
    create: {
      email: 'test@kolamott.com',
      phone: '+919876543211',
      passwordHash: testPassword,
      name: 'Test User',
      role: 'USER',
      isEmailVerified: true,
      isPhoneVerified: true,
      genrePreferences: ['Romance', 'Thriller', 'Comedy'],
    },
  });
  console.log('✅ Test user created:', testUser.email);

  // Create Free User
  const freePassword = await bcrypt.hash('Free@123', 10);
  const freeUser = await prisma.user.upsert({
    where: { email: 'free@kolamott.com' },
    update: {},
    create: {
      email: 'free@kolamott.com',
      phone: '+919876543212',
      passwordHash: freePassword,
      name: 'Free User',
      role: 'USER',
      isEmailVerified: true,
      isPhoneVerified: false,
      genrePreferences: ['Action', 'Comedy'],
    },
  });
  console.log('✅ Free user created:', freeUser.email);

  // Create Subscription Plans
  const basicPlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'basic-plan-id' },
    update: {},
    create: {
      id: 'basic-plan-id',
      name: 'Basic Plan',
      description: 'Watch on 2 devices, HD quality',
      price: 199,
      currency: 'INR',
      durationDays: 30,
      maxDevices: 2,
      features: {
        videoQuality: 'HD',
        downloads: true,
        devices: 2,
        ads: false,
      },
      order: 1,
      isActive: true,
    },
  });

  const premiumPlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'premium-plan-id' },
    update: {},
    create: {
      id: 'premium-plan-id',
      name: 'Premium Plan',
      description: 'Watch on 4 devices, 4K quality',
      price: 399,
      currency: 'INR',
      durationDays: 30,
      maxDevices: 4,
      features: {
        videoQuality: '4K',
        downloads: true,
        devices: 4,
        ads: false,
      },
      order: 2,
      isActive: true,
    },
  });

  console.log('✅ Subscription plans created');

  // Create Active Subscription for Test User
  const subscription = await prisma.subscription.upsert({
    where: { id: 'test-user-subscription' },
    update: {},
    create: {
      id: 'test-user-subscription',
      userId: testUser.id,
      planId: premiumPlan.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'ACTIVE',
      autoRenew: true,
    },
  });

  console.log('✅ Test user subscription created');
  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
