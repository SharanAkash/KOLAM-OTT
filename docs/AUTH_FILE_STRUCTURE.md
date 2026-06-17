# Authentication System - File Structure

## 📁 Complete File Structure

```
kolam-ott/
├── services/api/
│   ├── prisma/
│   │   ├── schema.prisma              # Database schema (already existed)
│   │   └── seed.ts                    # ✨ NEW: Mock users seed script
│   │
│   ├── src/
│   │   ├── auth/                      # ✨ NEW: Complete auth module
│   │   │   ├── auth.module.ts         # Auth module setup
│   │   │   ├── auth.service.ts        # Login/register/profile logic
│   │   │   ├── auth.controller.ts     # Auth API endpoints
│   │   │   │
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts    # JWT token validation
│   │   │   │   └── local.strategy.ts  # Email/password validation
│   │   │   │
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts       # JWT authentication guard
│   │   │   │   ├── local-auth.guard.ts     # Local auth guard
│   │   │   │   ├── roles.guard.ts          # Role-based access guard
│   │   │   │   └── subscription.guard.ts   # Subscription check (ADMIN BYPASS!)
│   │   │   │
│   │   │   └── decorators/
│   │   │       └── roles.decorator.ts      # @Roles() decorator
│   │   │
│   │   ├── movies/
│   │   │   ├── movies.controller.ts   # ✏️ UPDATED: Added guards
│   │   │   ├── movies.service.ts
│   │   │   └── movies.module.ts
│   │   │
│   │   ├── app.module.ts              # ✏️ UPDATED: Added AuthModule
│   │   └── main.ts
│   │
│   ├── package.json                   # ✏️ UPDATED: Added prisma:seed script
│   ├── .env.example                   # (Already had JWT_SECRET)
│   └── tsconfig.json
│
└── Documentation/
    ├── AUTH_SUMMARY.md                # ✨ Overview and quick reference
    ├── AUTHENTICATION_SETUP.md        # ✨ Complete technical guide
    ├── QUICK_START_AUTH.md            # ✨ Quick start guide
    ├── FRONTEND_AUTH_INTEGRATION.md   # ✨ React/Next.js examples
    └── AUTH_FILE_STRUCTURE.md         # ✨ This file
```

## 📊 Files Created/Modified Count

### ✨ New Files (17)

**Auth Module (11 files):**
1. `services/api/src/auth/auth.module.ts`
2. `services/api/src/auth/auth.service.ts`
3. `services/api/src/auth/auth.controller.ts`
4. `services/api/src/auth/strategies/jwt.strategy.ts`
5. `services/api/src/auth/strategies/local.strategy.ts`
6. `services/api/src/auth/guards/jwt-auth.guard.ts`
7. `services/api/src/auth/guards/local-auth.guard.ts`
8. `services/api/src/auth/guards/roles.guard.ts`
9. `services/api/src/auth/guards/subscription.guard.ts`
10. `services/api/src/auth/decorators/roles.decorator.ts`

**Database Seed:**
11. `services/api/prisma/seed.ts`

**Documentation (6 files):**
12. `AUTH_SUMMARY.md`
13. `AUTHENTICATION_SETUP.md`
14. `QUICK_START_AUTH.md`
15. `FRONTEND_AUTH_INTEGRATION.md`
16. `AUTH_FILE_STRUCTURE.md`

### ✏️ Modified Files (3)

1. `services/api/src/app.module.ts` - Added AuthModule import
2. `services/api/src/movies/movies.controller.ts` - Added guards examples
3. `services/api/package.json` - Added prisma:seed script and prisma.seed config

## 🎯 Key Files Explained

### Backend Core

#### 1. `auth.service.ts` - Authentication Logic
```typescript
// Main methods:
- validateUser()     // Email + password validation
- login()            // Generate JWT token
- register()         // Create new user
- getProfile()       // Get user with subscription info
```

#### 2. `subscription.guard.ts` - The Magic! 🎩
```typescript
// Admin bypass logic:
if (user.role === UserRole.ADMIN) {
  return true; // ✅ Skip subscription check
}

// Regular users:
const activeSubscription = await checkSubscription();
if (!activeSubscription) {
  throw new ForbiddenException('Subscription required');
}
```

#### 3. `seed.ts` - Test Data
```typescript
// Creates 3 users:
- admin@kolamott.com    (ADMIN, no subscription)
- test@kolamott.com     (USER, with subscription)
- free@kolamott.com     (USER, without subscription)

// Also creates:
- 2 subscription plans (Basic & Premium)
- 1 active subscription for test user
```

### Documentation

#### 1. `AUTH_SUMMARY.md`
**Quick Overview** - Start here!
- What was created
- Quick start guide
- Testing scenarios
- Key takeaways

#### 2. `AUTHENTICATION_SETUP.md`
**Complete Technical Guide**
- Full authentication flow
- All guards explained
- API endpoints documentation
- Implementation details

#### 3. `QUICK_START_AUTH.md`
**Quick Reference Card**
- Setup commands
- Test credentials table
- cURL examples
- Guard usage snippets

#### 4. `FRONTEND_AUTH_INTEGRATION.md`
**Frontend Examples**
- React Auth Context
- Login component
- Protected routes
- API utilities
- Complete working examples

## 🔍 How Guards Work Together

```typescript
// Example: Premium Movie Endpoint

@Get('movies/:id')
@UseGuards(JwtAuthGuard, SubscriptionGuard)
//          ↓              ↓
//     1. Check JWT   2. Check subscription
//        token          (Admin bypass!)
async getMovie(@Param('id') id: string) {
  return this.service.getMovie(id);
}
```

**Flow:**
1. **JwtAuthGuard**: Validates JWT token → Sets `req.user`
2. **SubscriptionGuard**: 
   - If `req.user.role === 'ADMIN'` → ✅ Allow
   - Else → Check active subscription
   - If no subscription → ❌ 403 Forbidden

## 🎨 Guard Combinations

### Public Route (No guards)
```typescript
@Get('movies')
async getAllMovies() {
  // Anyone can access
}
```

### Authenticated Route
```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
async getProfile() {
  // Requires valid JWT token
}
```

### Premium Content Route
```typescript
@Get('stream/:id')
@UseGuards(JwtAuthGuard, SubscriptionGuard)
async streamMovie() {
  // Requires JWT + subscription
  // Admins automatically pass
}
```

### Admin-Only Route
```typescript
@Post('movies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
async createMovie() {
  // Only ADMIN role allowed
}
```

### Super Protected Route
```typescript
@Delete('movies/:id')
@UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
@Roles(UserRole.ADMIN)
async deleteMovie() {
  // Admin + Auth + (Subscription bypass applies)
  // Though admins bypass subscription anyway!
}
```

## 📋 Quick Commands

```bash
# Navigate to API
cd services/api

# Install dependencies (if not done)
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed mock users ⭐
npm run prisma:seed

# Start dev server
npm run dev

# View database
npm run prisma:studio
```

## 🧪 Test the Setup

### Step 1: Check API is running
```bash
curl http://localhost:3001
```

### Step 2: Login as admin
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kolamott.com","password":"Admin@123"}'
```

### Step 3: Save the token
```bash
# Copy the access_token from response
TOKEN="eyJhbGciOiJI..."
```

### Step 4: Get profile
```bash
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Step 5: Try protected endpoint
```bash
curl -X GET http://localhost:3001/movies/some-id \
  -H "Authorization: Bearer $TOKEN"
```

## 🔐 Security Features

### Implemented
- ✅ Password hashing (bcryptjs)
- ✅ JWT tokens (7-day expiry)
- ✅ Role-based access control
- ✅ Subscription validation
- ✅ Admin privilege escalation
- ✅ Request authentication
- ✅ Guard composition

### Recommended for Production
- 🔒 HTTPS only
- 🔒 CORS configuration
- 🔒 Rate limiting
- 🔒 Refresh tokens
- 🔒 Token blacklisting
- 🔒 2FA for admins
- 🔒 Audit logging

## 🎓 Learning Path

1. **Understand the flow**: Read `AUTHENTICATION_SETUP.md`
2. **Run the seed**: `npm run prisma:seed`
3. **Test with cURL**: Use examples in `QUICK_START_AUTH.md`
4. **Integrate frontend**: Follow `FRONTEND_AUTH_INTEGRATION.md`
5. **Customize**: Modify guards/services for your needs

## 📞 Support

If you need help:
1. Check the error message
2. Look in the relevant documentation file
3. Verify environment variables (.env)
4. Check database connection
5. Ensure all dependencies installed

## 🚀 Production Checklist

Before deploying:
- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Update database URL for production
- [ ] Enable HTTPS
- [ ] Configure CORS for your domain
- [ ] Add rate limiting
- [ ] Set up monitoring/logging
- [ ] Test all authentication flows
- [ ] Remove/disable debug endpoints
- [ ] Review and update token expiry times
- [ ] Set up automated database backups

---

**Everything is ready to use! Run the seed and start testing!** 🎉
