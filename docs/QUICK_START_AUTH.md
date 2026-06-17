# Quick Start: Authentication & Mock Users

## 🚀 Quick Setup

```bash
cd services/api

# 1. Set up environment
cp .env.example .env
# Edit .env and set your DATABASE_URL and JWT_SECRET

# 2. Install dependencies
npm install

# 3. Generate Prisma client
npm run prisma:generate

# 4. Run migrations
npm run prisma:migrate

# 5. Seed mock users
npm run prisma:seed

# 6. Start the API
npm run dev
```

## 👥 Test User Credentials

| Role | Email | Password | Subscription | Access |
|------|-------|----------|--------------|--------|
| **Admin** | admin@kolamott.com | Admin@123 | ❌ Not Required | ✅ Full Access |
| **User** | test@kolamott.com | Test@123 | ✅ Premium (30d) | ✅ Premium Content |
| **User** | free@kolamott.com | Free@123 | ❌ None | ⚠️ Limited Access |

## 🔑 Key Feature: Admin Bypass

**Admins don't need subscriptions!**

The `SubscriptionGuard` automatically allows admins to access all premium content without requiring an active subscription:

```typescript
// Admin user accessing premium content
if (user.role === UserRole.ADMIN) {
  return true; // ✅ Instant access, no subscription check
}
```

## 🧪 Testing

### Login as Admin
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kolamott.com","password":"Admin@123"}'
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "admin@kolamott.com",
    "role": "ADMIN",
    "hasActiveSubscription": true  // Always true for admins
  }
}
```

### Access Premium Content (as Admin)
```bash
curl -X GET http://localhost:3001/movies/some-id \
  -H "Authorization: Bearer <admin_token>"
```

✅ **Works without subscription!**

### Access Premium Content (as Free User)
```bash
# Login first
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"free@kolamott.com","password":"Free@123"}'

# Try to access premium content
curl -X GET http://localhost:3001/movies/some-id \
  -H "Authorization: Bearer <free_token>"
```

❌ **Returns 403:** "Active subscription required. Please subscribe to access premium content."

## 📝 Adding Guards to Your Controllers

### Require Authentication + Subscription (Admin bypasses)
```typescript
@UseGuards(JwtAuthGuard, SubscriptionGuard)
@Get('premium/:id')
async getPremiumContent(@Param('id') id: string) {
  // Accessible by:
  // ✅ Admin users (no subscription needed)
  // ✅ Regular users with active subscription
  // ❌ Regular users without subscription
}
```

### Admin-Only Endpoint
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Post('admin/movie')
async createMovie(@Body() data: any) {
  // Only accessible by admin users
}
```

## 📚 Full Documentation

See [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) for complete details.
