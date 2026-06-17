# KOLAM-OTT: Complete Build and Run Guide

This guide provides detailed instructions for building and running the KOLAM-OTT platform on your local machine.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Running the Backend API](#running-the-backend-api)
4. [Running the Web App](#running-the-web-app)
5. [Running the Mobile App in Emulator](#running-the-mobile-app-in-emulator)
6. [Running All Services Together](#running-all-services-together)
7. [Common Issues and Solutions](#common-issues-and-solutions)

---

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   ```bash
   # Check version
   node --version
   
   # Download from: https://nodejs.org/
   ```

2. **npm** (comes with Node.js)
   ```bash
   # Check version
   npm --version
   ```

3. **PostgreSQL** (v14 or higher)
   ```bash
   # Check version
   postgres --version
   
   # Download from: https://www.postgresql.org/download/
   ```

4. **Android Studio** (for mobile emulator)
   - Download from: https://developer.android.com/studio
   - Install Android SDK
   - Set up at least one Android Virtual Device (AVD)

5. **Java Development Kit (JDK)** (v17 or higher)
   ```bash
   # Check version
   java -version
   
   # Download from: https://www.oracle.com/java/technologies/downloads/
   ```

6. **Git**
   ```bash
   # Check version
   git --version
   ```

---

## Initial Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/SharanAkash/KOLAM-OTT.git

# Navigate to project directory
cd KOLAM-OTT
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install web app dependencies
cd apps/web
npm install
cd ../..

# Install mobile app dependencies
cd apps/mobile
npm install
cd ../..

# Install API dependencies
cd services/api
npm install
cd ../..
```

### 3. Set Up Environment Variables

#### Backend API (.env)

```bash
# Navigate to API directory
cd services/api

# Create .env file from example
cp .env.example .env

# Edit .env file
nano .env  # or use your preferred editor
```

Add the following configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/kolam_ott?schema=public"

# JWT Secret (generate a random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Port
PORT=3002

# Cloudinary (for image/video uploads)
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# AWS S3 (alternative to Cloudinary)
AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_S3_BUCKET="kolam-ott-uploads"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@kolamott.com"
```

#### Web App (.env.local)

```bash
# Navigate to web directory
cd ../../apps/web

# Create .env.local file
touch .env.local

# Edit .env.local
nano .env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

#### Mobile App (.env)

```bash
# Navigate to mobile directory
cd ../mobile

# Create .env file
touch .env

# Edit .env
nano .env
```

Add:

```env
API_URL=http://10.0.2.2:3002
EXPO_PUBLIC_API_URL=http://10.0.2.2:3002
```

**Note**: `10.0.2.2` is the special IP for Android emulator to access localhost.

### 4. Set Up Database

```bash
# Start PostgreSQL service (if not running)
# On macOS:
brew services start postgresql@14

# On Linux:
sudo systemctl start postgresql

# On Windows:
# Start PostgreSQL from Services

# Create database
createdb kolam_ott

# Or using psql:
psql -U postgres
CREATE DATABASE kolam_ott;
\q
```

### 5. Run Database Migrations

```bash
# Navigate to API directory
cd services/api

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database with sample data
npx prisma db seed
```

---

## Running the Backend API

### Method 1: Development Mode with Auto-Reload

```bash
# Navigate to API directory
cd services/api

# Start in development mode
npm run start:dev

# Output should show:
# 🚀 Kolam OTT API running on http://localhost:3002
```

### Method 2: Production Build

```bash
# Build the API
npm run build

# Start in production mode
npm run start:prod
```

### Verify API is Running

Open your browser and visit:
- **Health Check**: http://localhost:3002
- **API Endpoint**: http://localhost:3002/movies

You should see a response from the server.

---

## Running the Web App

### Method 1: Development Mode (Recommended)

```bash
# Open a new terminal window/tab

# Navigate to web app directory
cd apps/web

# Start development server
npm run dev

# Output should show:
# ▲ Next.js 16.2.9
# - Local:        http://localhost:3001
# - Network:      http://192.168.x.x:3001
```

### Access the Web App

Open your browser and visit:
- **Home Page**: http://localhost:3001
- **Login Page**: http://localhost:3001/login
- **Profile Page**: http://localhost:3001/profile
- **Admin Panel**: http://localhost:3001/admin

### Method 2: Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start

# App will run on http://localhost:3001
```

### Web App Features to Test

1. **Authentication**
   - Login: http://localhost:3001/login
   - Signup: http://localhost:3001/signup

2. **Browse Content**
   - Home: http://localhost:3001
   - Movies: http://localhost:3001/movies
   - Series: http://localhost:3001/series
   - Live TV: http://localhost:3001/live

3. **User Features**
   - My List: http://localhost:3001/my-list
   - Profile: http://localhost:3001/profile
   - Settings: http://localhost:3001/settings

4. **Subscription**
   - Plans: http://localhost:3001/subscribe
   - Payment: http://localhost:3001/payment

5. **Admin Panel** (requires admin login)
   - Dashboard: http://localhost:3001/admin
   - Analytics: http://localhost:3001/admin/analytics
   - Settings: http://localhost:3001/admin/settings

---

## Running the Mobile App in Emulator

### Step 1: Start Android Emulator

#### Option A: Using Android Studio

1. Open Android Studio
2. Click on "Device Manager" (phone icon)
3. Click "Create Device" if you don't have an AVD
4. Select a device (e.g., Pixel 5)
5. Select a system image (e.g., Android 13 - API 33)
6. Click "Finish"
7. Click the ▶️ (Play) button to start the emulator

#### Option B: Using Command Line

```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd Pixel_5_API_33

# Or start any available emulator
emulator @Pixel_5_API_33
```

### Step 2: Verify Emulator is Running

```bash
# Check connected devices
adb devices

# You should see something like:
# List of devices attached
# emulator-5554   device
```

### Step 3: Start Metro Bundler

```bash
# Open a new terminal

# Navigate to mobile app directory
cd apps/mobile

# Start Metro bundler
npm start

# Or use Expo CLI
npx expo start
```

### Step 4: Run on Android Emulator

After starting Metro, you'll see options:

```bash
› Press a │ open Android
› Press i │ open iOS simulator (macOS only)
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

**Press 'a'** to open the app in Android emulator.

Or use:

```bash
# Run on Android
npm run android

# Or with Expo
npx expo run:android
```

### Step 5: Verify App is Running

The app should launch on your emulator. You should see:
- Splash screen
- Login/Home screen
- Ability to browse and interact with the app

---

## Running All Services Together

For a complete local development environment, run all three services simultaneously.

### Option 1: Multiple Terminal Windows

**Terminal 1 - Backend API:**
```bash
cd services/api
npm run start:dev
```

**Terminal 2 - Web App:**
```bash
cd apps/web
npm run dev
```

**Terminal 3 - Mobile App:**
```bash
cd apps/mobile
npm start
```

### Option 2: Using npm-run-all (if configured)

```bash
# From project root
npm run dev:all
```

### Option 3: Using tmux (Advanced)

```bash
# Create new tmux session
tmux new -s kolam-ott

# Split panes
Ctrl+b then "    # Split horizontally
Ctrl+b then %    # Split vertically

# Navigate between panes
Ctrl+b then arrow keys

# In each pane, run a service
# Pane 1: cd services/api && npm run start:dev
# Pane 2: cd apps/web && npm run dev
# Pane 3: cd apps/mobile && npm start
```

---

## Common Issues and Solutions

### Issue 1: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
```bash
# Find process using port
lsof -ti:3001

# Kill the process
kill -9 $(lsof -ti:3001)

# Or change port in package.json
"dev": "next dev -p 3003"
```

### Issue 2: Database Connection Failed

**Error:**
```
Error: P1001: Can't reach database server at localhost:5432
```

**Solution:**
```bash
# Check if PostgreSQL is running
brew services list  # macOS
systemctl status postgresql  # Linux

# Start PostgreSQL
brew services start postgresql@14  # macOS
sudo systemctl start postgresql  # Linux

# Verify connection
psql -U postgres -d kolam_ott
```

### Issue 3: Module Not Found

**Error:**
```
Error: Cannot find module '@/components/Navigation'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma client (if backend)
cd services/api
npx prisma generate
```

### Issue 4: Emulator Not Detected

**Error:**
```
No connected devices found
```

**Solution:**
```bash
# Check ADB is working
adb devices

# Restart ADB server
adb kill-server
adb start-server

# Check emulator is running
emulator -list-avds

# Set ANDROID_HOME environment variable (if not set)
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
export ANDROID_HOME=$HOME/Android/Sdk  # Linux
export ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk  # Windows
```

### Issue 5: Metro Bundler Cache Issues

**Error:**
```
Unable to resolve module ... from ...
```

**Solution:**
```bash
# Clear Metro cache
cd apps/mobile
npx expo start --clear

# Or
npm start -- --reset-cache
```

### Issue 6: Prisma Client Not Generated

**Error:**
```
Cannot find module '@prisma/client'
```

**Solution:**
```bash
cd services/api
npx prisma generate
npm install
```

### Issue 7: Network Request Failed on Emulator

**Error:**
```
Network request failed - http://localhost:3002
```

**Solution:**

For Android emulator, use `10.0.2.2` instead of `localhost`:

```bash
# Update .env in mobile app
API_URL=http://10.0.2.2:3002

# Or update the API base URL in your code
const API_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:3002' 
  : 'http://localhost:3002';
```

---

## Testing the Complete Setup

### 1. Test Backend API

```bash
# Test health endpoint
curl http://localhost:3002

# Test movies endpoint
curl http://localhost:3002/movies

# Test search endpoint
curl "http://localhost:3002/movies/search?q=action&limit=5"
```

### 2. Test Web App

- Visit http://localhost:3001
- Try login/signup
- Browse movies and series
- Test search functionality
- Check profile and settings pages

### 3. Test Mobile App

- Open app in emulator
- Test login/signup
- Browse content
- Test video playback (if configured)
- Test search and filters

---

## Development Workflow

### Typical Day-to-Day Workflow

1. **Start all services:**
   ```bash
   # Terminal 1 - API
   cd services/api && npm run start:dev
   
   # Terminal 2 - Web
   cd apps/web && npm run dev
   
   # Terminal 3 - Mobile
   cd apps/mobile && npm start
   ```

2. **Make changes to code**
   - API changes auto-reload with Nest.js
   - Web changes auto-reload with Next.js hot reload
   - Mobile changes auto-reload with Expo fast refresh

3. **Test changes**
   - API: Use Postman or curl
   - Web: Refresh browser
   - Mobile: Press 'r' in Metro bundler to reload

4. **Commit changes:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin your-branch
   ```

---

## Performance Tips

### Speed Up Development

1. **Use TypeScript Incremental Build**
   - Already configured in tsconfig.json

2. **Enable React Fast Refresh**
   - Already enabled in Next.js and Expo

3. **Use Prisma Studio for Database**
   ```bash
   cd services/api
   npx prisma studio
   # Opens at http://localhost:5555
   ```

4. **Use React DevTools**
   - Install browser extension
   - Inspect components and performance

5. **Monitor API Performance**
   ```bash
   # Add to API startup
   npm install -g clinic
   clinic doctor -- node dist/main.js
   ```

---

## Next Steps

After successfully running the app:

1. **Read the API Documentation**
   - See `docs/BACKEND_ARCHITECTURE.md`

2. **Understand Authentication Flow**
   - See `docs/AUTHENTICATION_SETUP.md`

3. **Add Sample Data**
   ```bash
   cd services/api
   npx prisma db seed
   ```

4. **Configure Cloud Services**
   - See `docs/CLOUD_UPLOAD_SETUP.md`

5. **Deploy to Production**
   - See deployment guides (coming soon)

---

## Support

If you encounter issues not covered here:

1. Check existing documentation in `/docs` folder
2. Search GitHub issues: https://github.com/SharanAkash/KOLAM-OTT/issues
3. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)

---

## Quick Reference

### Common Commands

```bash
# Start API (development)
cd services/api && npm run start:dev

# Start Web (development)
cd apps/web && npm run dev

# Start Mobile (development)
cd apps/mobile && npm start

# Database commands
cd services/api
npx prisma migrate dev      # Create migration
npx prisma generate          # Generate client
npx prisma studio           # Open database GUI
npx prisma db seed          # Seed database

# Clear caches
rm -rf node_modules .next   # Next.js
rm -rf node_modules .expo   # Expo
```

### Default Ports

- **Backend API**: http://localhost:3002
- **Web App**: http://localhost:3001
- **Prisma Studio**: http://localhost:5555
- **Metro Bundler**: http://localhost:8081

### Test Credentials

```
Admin:
Email: admin@kolamott.com
Password: admin123

User:
Email: user@example.com
Password: user123
```

---

**Happy Coding! 🚀**
