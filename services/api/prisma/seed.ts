import { PrismaClient, UserRole, SubscriptionStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Admin User (no subscription required)
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kolamott.com' },
    update: {},
    create: {
      email: 'admin@kolamott.com',
      phone: '+919876543210',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
      isEmailVerified: true,
      isPhoneVerified: true,
      genrePreferences: ['Action', 'Drama', 'Comedy'],
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create Test User with Active Subscription
  const testPassword = await bcrypt.hash('Test@123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@kolamott.com' },
    update: {},
    create: {
      email: 'test@kolamott.com',
      phone: '+919876543211',
      passwordHash: testPassword,
      name: 'Test User',
      role: UserRole.USER,
      isEmailVerified: true,
      isPhoneVerified: true,
      genrePreferences: ['Romance', 'Thriller', 'Comedy'],
    },
  });
  console.log('✅ Test user created:', testUser.email);

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

  // Add Active Subscription for Test User
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30); // 30 days from now

  await prisma.subscription.upsert({
    where: { id: 'test-user-subscription' },
    update: {},
    create: {
      id: 'test-user-subscription',
      userId: testUser.id,
      planId: premiumPlan.id,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date(),
      endDate: endDate,
      autoRenew: true,
    },
  });
  console.log('✅ Active subscription created for test user');

  // Create User without Subscription (for testing)
  const freePassword = await bcrypt.hash('Free@123', 10);
  const freeUser = await prisma.user.upsert({
    where: { email: 'free@kolamott.com' },
    update: {},
    create: {
      email: 'free@kolamott.com',
      phone: '+919876543212',
      passwordHash: freePassword,
      name: 'Free User',
      role: UserRole.USER,
      isEmailVerified: true,
      isPhoneVerified: false,
      genrePreferences: ['Drama'],
    },
  });
  console.log('✅ Free user (no subscription) created:', freeUser.email);

  console.log('\n📝 Test Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin (No subscription required):');
  console.log('  Email: admin@kolamott.com');
  console.log('  Password: Admin@123');
  console.log('  Role: ADMIN\n');
  console.log('Test User (With active subscription):');
  console.log('  Email: test@kolamott.com');
  console.log('  Password: Test@123');
  console.log('  Role: USER');
  console.log('  Plan: Premium (30 days)\n');
  console.log('Free User (No subscription):');
  console.log('  Email: free@kolamott.com');
  console.log('  Password: Free@123');
  console.log('  Role: USER');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
