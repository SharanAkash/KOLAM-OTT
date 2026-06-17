# Quick Start Guide

## Prerequisites
- Node.js 18+
- PostgreSQL database
- AWS S3 account (for video storage)

## 1. Database Setup

```bash
# Create PostgreSQL database
createdb kolam_ott

# Or using psql
psql -U postgres -c "CREATE DATABASE kolam_ott;"
```

## 2. Backend API Setup

```bash
# Navigate to API directory
cd services/api

# Install dependencies (if not already done)
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials:
# - DATABASE_URL
# - AWS credentials
# - JWT_SECRET

# Run Prisma migrations
npx prisma generate
npx prisma migrate dev

# Start the backend API
npm run dev
```

Backend will run on: **http://localhost:3002**

## 3. Frontend Web App

```bash
# Open new terminal
cd apps/web

# Install dependencies (if not already done)
npm install

# Start the web app
npm run dev
```

Frontend will run on: **http://localhost:3001**

## 4. Test the Upload Feature

1. Go to [http://localhost:3001/admin](http://localhost:3001/admin)
2. Click "**+ Add Movie**"
3. Upload:
   - Video file (MP4)
   - Thumbnail image
   - Fill in movie details
4. Click "**Upload to Cloud**"
5. Watch the progress bar
6. Movie will be stored in AWS S3!

## Troubleshooting

### "Cannot connect to database"
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env`
- Run: `npx prisma studio` to test connection

### "AWS upload failed"
- Verify AWS credentials in `.env`
- Check S3 bucket exists
- Verify bucket permissions (see CLOUD_UPLOAD_SETUP.md)

### "Port already in use"
- Backend (3002): `lsof -ti:3002 | xargs kill -9`
- Frontend (3001): `lsof -ti:3001 | xargs kill -9`
