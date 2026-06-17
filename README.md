# Kolam OTT Platform

A premium Tamil cinema streaming platform with Android and Web support.

## Project Structure

```
kolam-ott/
├── apps/
│   ├── mobile/          # React Native app (Android)
│   ├── web/             # Next.js web application
│   └── admin/           # Admin dashboard
├── packages/
│   ├── ui/              # Shared UI components
│   ├── api-client/      # API SDK
│   └── types/           # Shared TypeScript types
└── services/
    ├── api/             # NestJS backend API
    ├── video/           # Video transcoding service
    └── payment/         # Payment webhook handler
```

## Tech Stack

- **Frontend**: React Native, React Native Web, Next.js
- **Backend**: NestJS, PostgreSQL, Prisma
- **Video**: HLS streaming with adaptive bitrate
- **Payments**: Stripe/Razorpay
- **Deployment**: AWS/Vercel

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL
- Android Studio (for mobile development)
- AWS account (for video storage)

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start database
docker-compose up -d

# Run migrations
cd services/api && npx prisma migrate dev

# Start development servers
npm run dev
```

### Development Commands

```bash
# Run all services
npm run dev

# Run specific services
npm run api        # Backend API
npm run mobile     # Mobile app
npm run web        # Web app
npm run admin      # Admin dashboard

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

## Features

- ✅ User authentication (email/phone)
- ✅ Video streaming with HLS
- ✅ Content discovery and search
- ✅ Subscription management
- ✅ Payment integration
- ✅ Offline downloads (mobile)
- ✅ Watchlist and history
- ✅ Admin content management
- ✅ Multi-quality video playback
- ✅ Tamil + English UI

## Environment Variables

See `.env.example` for required environment variables.

## License

Proprietary - All rights reserved
