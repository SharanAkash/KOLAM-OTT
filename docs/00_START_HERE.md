# 🎬 START HERE - KOLAM-OTT Quick Guide

> **New to this project?** Read this first!

## ✨ What You Have

A complete **OTT streaming platform** with:
- ✅ Web app (Next.js)
- ✅ Mobile app (React Native)
- ✅ Backend API (NestJS)
- ✅ Authentication system with JWT
- ✅ Admin panel (no subscription required)
- ✅ Subscription management
- ✅ Mock test users ready to use

---

## 🚀 3-Minute Quick Start

```bash
# 1. Navigate to API
cd services/api

# 2. Create test users
npm run prisma:seed

# 3. Start the API
npm run dev
```

**Done!** API running on http://localhost:3001

---

## 👥 Test Login Credentials

```
👑 Admin (Full Access, No Subscription)
   Email: admin@kolamott.com
   Password: Admin@123

⭐ Premium User (Has Subscription)
   Email: test@kolamott.com
   Password: Test@123

👤 Free User (No Subscription)
   Email: free@kolamott.com
   Password: Free@123
```

---

## 📚 What to Read Next

### First Time Setup
1. **[TEST_CREDENTIALS.md](./TEST_CREDENTIALS.md)** - All test user details
2. **[QUICK_START_AUTH.md](./QUICK_START_AUTH.md)** - Authentication setup
3. **[START_SERVICES.md](./START_SERVICES.md)** - Start all services

### Understanding the System
1. **[README_AUTH.md](./README_AUTH.md)** - Authentication overview
2. **[BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)** - Backend structure
3. **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Complete setup guide

### Frontend Development
1. **[FRONTEND_AUTH_INTEGRATION.md](./FRONTEND_AUTH_INTEGRATION.md)** - React integration
2. **[RESPONSIVE_DESIGN.md](./RESPONSIVE_DESIGN.md)** - UI guidelines
3. **[WEB_ADMIN_READY.md](./WEB_ADMIN_READY.md)** - Admin panel

### Mobile Development
1. **[APK_BUILD_SUCCESS.md](./APK_BUILD_SUCCESS.md)** - Android builds
2. **[EMULATOR_QUICK_GUIDE.md](./EMULATOR_QUICK_GUIDE.md)** - Emulator setup

---

## 🎯 Common Tasks

### Test Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kolamott.com","password":"Admin@123"}'
```

### Access Profile
```bash
# Use token from login response
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### View Database
```bash
cd services/api
npm run prisma:studio
```

---

## 🔑 Key Features

### Admin Bypass (Important!)
**Admins don't need subscriptions!** They automatically get full access to all premium content.

```typescript
// This happens automatically in the backend
if (user.role === 'ADMIN') {
  return true; // ✅ Skip subscription check
}
```

### Role-Based Access
- **Admin**: Full access + can manage content
- **Premium User**: Access to all premium content
- **Free User**: Limited access only

---

## 📁 Project Structure

```
kolam-ott/
├── apps/
│   ├── web/          # Next.js web app
│   ├── mobile/       # React Native app
│   └── admin/        # Admin panel
├── services/
│   └── api/          # NestJS backend
├── docs/             # 📚 All documentation (YOU ARE HERE)
└── README.md         # Main project README
```

---

## 🆘 Troubleshooting

**Can't login?**
→ Did you run `npm run prisma:seed`?

**API not starting?**
→ Check your `.env` file and database connection

**Need test users?**
→ See [TEST_CREDENTIALS.md](./TEST_CREDENTIALS.md)

**Authentication not working?**
→ Read [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)

**Need more help?**
→ Check [INDEX.md](./INDEX.md) for all documentation

---

## 📖 Full Documentation Index

See **[INDEX.md](./INDEX.md)** for complete list of all documentation (29 files organized by category).

---

## ⚡ Next Steps

1. ✅ Run the seed: `npm run prisma:seed`
2. ✅ Start the API: `npm run dev`
3. ✅ Test login with admin credentials
4. ✅ Read [README_AUTH.md](./README_AUTH.md)
5. ✅ Start building!

---

**Ready to go! Happy coding!** 🚀

*Last Updated: June 2026*
