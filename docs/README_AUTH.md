# 🎬 KOLAM-OTT Authentication System

> Complete authentication system with role-based access control and **automatic admin subscription bypass**

## 🌟 Key Feature: Admin Bypass

**Admins don't need subscriptions!** They automatically get full access to all premium content.

```typescript
// Automatic in SubscriptionGuard
if (user.role === 'ADMIN') {
  return true; // ✅ Skip subscription check
}
```

---

## 📚 Documentation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [TEST_CREDENTIALS.md](./TEST_CREDENTIALS.md) | 🔑 **START HERE!** Quick reference for test users | First time setup, testing |
| [QUICK_START_AUTH.md](./QUICK_START_AUTH.md) | ⚡ Quick setup guide | Getting started fast |
| [AUTH_SUMMARY.md](./AUTH_SUMMARY.md) | 📋 Complete overview | Understanding the system |
| [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) | 🔧 Technical deep dive | Implementing features |
| [FRONTEND_AUTH_INTEGRATION.md](./FRONTEND_AUTH_INTEGRATION.md) | 🎨 React/Next.js examples | Frontend integration |
| [AUTH_FILE_STRUCTURE.md](./AUTH_FILE_STRUCTURE.md) | 📁 File organization | Understanding structure |

---

## ⚡ Quick Start (2 minutes)

```bash
# 1. Navigate to API
cd services/api

# 2. Seed mock users
npm run prisma:seed

# 3. Start API
npm run dev

# 4. Test login (in another terminal)
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kolamott.com","password":"Admin@123"}'
```

---

## 👥 Test Users

| Role | Email | Password | Subscription | Access Level |
|------|-------|----------|--------------|--------------|
| 👑 **Admin** | admin@kolamott.com | Admin@123 | ❌ Not Required | ✅ **Full Access** |
| ⭐ **Premium** | test@kolamott.com | Test@123 | ✅ Active (30d) | ✅ Premium Content |
| 👤 **Free** | free@kolamott.com | Free@123 | ❌ None | ⚠️ Limited Access |

---

## 🎯 What You Get

### Backend (NestJS)
- ✅ Complete auth module (`/auth/login`, `/auth/register`, `/auth/profile`)
- ✅ JWT authentication with Passport
- ✅ Role-based access control (Admin/User)
- ✅ Subscription validation guard
- ✅ **Admin subscription bypass** (automatic!)
- ✅ Password hashing with bcryptjs
- ✅ Mock user seed script

### Guards Available
```typescript
@UseGuards(JwtAuthGuard)              // Require authentication
@UseGuards(SubscriptionGuard)         // Require subscription (admin bypass!)
@UseGuards(RolesGuard)                // Require specific role
@Roles(UserRole.ADMIN)                // Admin-only decorator
```

### Example Usage
```typescript
// Premium content - admins bypass subscription
@Get('movies/:id')
@UseGuards(JwtAuthGuard, SubscriptionGuard)
async getMovie(@Param('id') id: string) {
  // ✅ Admins: Always allowed
  // ✅ Users with subscription: Allowed
  // ❌ Users without subscription: 403 Forbidden
}

// Admin-only endpoint
@Post('movies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
async createMovie(@Body() data: any) {
  // ✅ Admins only
}
```

---

## 🧪 Testing

### Test as Admin (No Subscription Needed)
```bash
# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kolamott.com","password":"Admin@123"}'

# Response includes:
# "hasActiveSubscription": true  ← Always true for admins!
```

### Test as Free User (Blocked)
```bash
# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"free@kolamott.com","password":"Free@123"}'

# Try premium content with token:
# ❌ 403 Forbidden - "Active subscription required..."
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Request Flow                            │
└─────────────────────────────────────────────────────────────┘

Client Request with JWT Token
       ↓
1. JwtAuthGuard
   ├─ Validate JWT token
   ├─ Extract user info (id, email, role)
   └─ Set req.user
       ↓
2. SubscriptionGuard (if applied)
   ├─ Check if user.role === 'ADMIN'
   │  └─ YES → ✅ ALLOW (bypass subscription)
   └─ NO → Check active subscription in DB
      ├─ Found → ✅ ALLOW
      └─ Not found → ❌ 403 Forbidden
       ↓
3. RolesGuard (if applied)
   ├─ Check if user.role matches @Roles()
   └─ Match → ✅ ALLOW
       ↓
4. Controller Handler
   └─ Execute business logic
```

---

## 📦 Files Created

### Backend (11 files)
```
services/api/src/auth/
├── auth.module.ts
├── auth.service.ts
├── auth.controller.ts
├── strategies/
│   ├── jwt.strategy.ts
│   └── local.strategy.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   ├── local-auth.guard.ts
│   ├── roles.guard.ts
│   └── subscription.guard.ts  ← Admin bypass here!
└── decorators/
    └── roles.decorator.ts
```

### Database
```
services/api/prisma/
└── seed.ts  ← Creates 3 test users + 2 plans
```

### Documentation (6 files)
```
kolam-ott/
├── TEST_CREDENTIALS.md
├── QUICK_START_AUTH.md
├── AUTH_SUMMARY.md
├── AUTHENTICATION_SETUP.md
├── FRONTEND_AUTH_INTEGRATION.md
└── AUTH_FILE_STRUCTURE.md
```

---

## 🎨 Frontend Integration

Quick example:
```typescript
// Login
const response = await fetch('http://localhost:3001/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'admin@kolamott.com', 
    password: 'Admin@123' 
  })
});

const { access_token, user } = await response.json();

// Store token
localStorage.setItem('token', access_token);

// Check if admin or has subscription
if (user.hasActiveSubscription) {
  // Allow access to premium content
  // This is true for:
  // - All admins (regardless of subscription)
  // - Users with active subscription
}
```

See [FRONTEND_AUTH_INTEGRATION.md](./FRONTEND_AUTH_INTEGRATION.md) for complete React examples.

---

## 🔐 Security Features

- ✅ JWT tokens (7-day expiry)
- ✅ Password hashing (bcryptjs, 10 rounds)
- ✅ Role-based access control
- ✅ Subscription validation
- ✅ Admin privilege system
- ✅ Secure token validation

---

## 🚀 Production Checklist

- [ ] Change `JWT_SECRET` to strong random value
- [ ] Enable HTTPS
- [ ] Configure CORS
- [ ] Add rate limiting
- [ ] Set up refresh tokens
- [ ] Add 2FA for admins
- [ ] Enable audit logging
- [ ] Update token expiry times
- [ ] Review and test all flows

---

## 📞 Need Help?

1. **First time?** → Read [TEST_CREDENTIALS.md](./TEST_CREDENTIALS.md)
2. **Quick setup?** → Read [QUICK_START_AUTH.md](./QUICK_START_AUTH.md)
3. **Deep dive?** → Read [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)
4. **Frontend?** → Read [FRONTEND_AUTH_INTEGRATION.md](./FRONTEND_AUTH_INTEGRATION.md)

---

## ✨ Summary

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ✅ Complete authentication system ready!                   │
│                                                              │
│  • 3 test users (Admin, Premium, Free)                      │
│  • JWT authentication                                        │
│  • Role-based access control                                │
│  • Subscription validation                                   │
│  • Admin subscription bypass (automatic!)                    │
│                                                              │
│  Run: npm run prisma:seed                                    │
│  Then: npm run dev                                           │
│  Test: See TEST_CREDENTIALS.md                               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Ready to use! 🎉**

---

*Built for KOLAM-OTT Platform*
