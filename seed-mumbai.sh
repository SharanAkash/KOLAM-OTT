#!/bin/bash
set -e

echo "🌱 Seeding Mumbai database with test users..."

cd /Users/sharan.j/kolam-ott/services/api

# Set environment for Mumbai
cp .env.mumbai .env

# Run seed script
npm run seed:prod

echo "✅ Database seeded successfully!"
echo ""
echo "Test Users Created:"
echo "==================="
echo "👑 Admin:   admin@kolamott.com / Admin@123"
echo "💎 Premium: premium@kolamott.com / Premium@123"
echo "🆓 Free:    free@kolamott.com / Free@123"
echo ""
echo "Login at: http://kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com/login"
