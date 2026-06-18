# KOLAM-OTT Quick Start Guide

Get up and running in 5 minutes! ⚡

## Prerequisites

- Node.js v18+
- PostgreSQL v14+
- Android Studio (for mobile)

## Quick Setup

### 1. Install Dependencies (2 minutes)

```bash
# Clone and navigate
git clone https://github.com/SharanAkash/KOLAM-OTT.git
cd KOLAM-OTT

# Install all dependencies
npm install
cd apps/web && npm install && cd ../..
cd apps/mobile && npm install && cd ../..
cd services/api && npm install && cd ../..
```

### 2. Setup Database (1 minute)

```bash
# Create database
createdb kolam_ott

# Setup environment
cd services/api
cp .env.example .env

# Edit .env - Update DATABASE_URL:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/kolam_ott"

# Run migrations
npx prisma migrate dev
npx prisma generate
```

### 3. Start Services (1 minute)

**Terminal 1 - Backend API:**
```bash
cd services/api
npm run start:dev
```
✅ API running at: http://localhost:3002

**Terminal 2 - Web App:**
```bash
cd apps/web
npm run dev
```
✅ Web running at: http://localhost:3001

**Terminal 3 - Mobile App (Optional):**
```bash
cd apps/mobile
npm start
# Press 'a' to open in Android emulator
```

## Verify Setup

1. **Check API**: http://localhost:3002/movies
2. **Check Web**: http://localhost:3001
3. **Login**: Use admin@kolamott.com / admin123

## What's Next?

- 📖 Read the [Complete Build Guide](./BUILD_AND_RUN_GUIDE.md)
- 🔐 Setup [Authentication](./AUTHENTICATION_SETUP.md)
- 📦 Read [API Documentation](./BACKEND_ARCHITECTURE.md)

---

## Common Issues

### Port already in use
```bash
kill -9 $(lsof -ti:3001)  # Kill web
kill -9 $(lsof -ti:3002)  # Kill API
```

### Database connection failed
```bash
brew services start postgresql@14  # macOS
sudo systemctl start postgresql     # Linux
```

### Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

---

**Need help?** See [BUILD_AND_RUN_GUIDE.md](./BUILD_AND_RUN_GUIDE.md) for detailed instructions.
