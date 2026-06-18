# 🎬 KOLAM-OTT Platform

> Complete OTT (Over-The-Top) streaming platform with web, mobile, and backend services.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/SharanAkash/KOLAM-OTT.git
cd KOLAM-OTT

# Install dependencies
npm install

# Start all services
npm run dev
```

**📖 For detailed setup instructions, see:**
- [Quick Start Guide](./docs/QUICK_START.md) - Get running in 5 minutes
- [Complete Build & Run Guide](./docs/BUILD_AND_RUN_GUIDE.md) - Comprehensive instructions

## 📁 Project Structure

```
kolam-ott/
├── apps/
│   ├── web/          # Next.js web application
│   └── mobile/       # React Native mobile app
├── services/
│   └── api/          # NestJS backend API
├── docs/             # 📚 Complete documentation
└── package.json      # Root workspace config
```

## 🎯 Features

### Platform Features
- ✅ **Multi-Platform**: Web, iOS, Android
- ✅ **Authentication**: JWT-based auth with role management
- ✅ **Subscriptions**: Multiple subscription plans
- ✅ **Admin Panel**: Content management system
- ✅ **Video Upload**: Cloud-based video storage
- ✅ **Email Service**: User notifications
- ✅ **Responsive Design**: Mobile-first approach

### User Roles
- 👑 **Admin**: Full access without subscription required
- ⭐ **Premium User**: Access to all premium content
- 👤 **Free User**: Limited access

## 📚 Documentation

All documentation has been moved to the [docs](./docs/) folder:

### 🔐 Authentication
- [README_AUTH.md](./docs/README_AUTH.md) - Authentication overview
- [TEST_CREDENTIALS.md](./docs/TEST_CREDENTIALS.md) - Test user credentials
- [QUICK_START_AUTH.md](./docs/QUICK_START_AUTH.md) - Quick auth setup
- [AUTHENTICATION_SETUP.md](./docs/AUTHENTICATION_SETUP.md) - Complete auth guide
- [FRONTEND_AUTH_INTEGRATION.md](./docs/FRONTEND_AUTH_INTEGRATION.md) - Frontend integration

### ⚙️ Setup Guides
- [🚀 QUICK_START.md](./docs/QUICK_START.md) - **Get started in 5 minutes**
- [📖 BUILD_AND_RUN_GUIDE.md](./docs/BUILD_AND_RUN_GUIDE.md) - **Complete build & run instructions**
- [SETUP_COMPLETE.md](./docs/SETUP_COMPLETE.md) - Complete setup guide
- [QUICK_START_BACKEND.md](./docs/QUICK_START_BACKEND.md) - Backend quick start
- [START_SERVICES.md](./docs/START_SERVICES.md) - Service management

### 🎨 Features & Configuration
- [CLOUDINARY_SETUP.md](./docs/CLOUDINARY_SETUP.md) - Media storage setup
- [EMAIL_SETUP.md](./docs/EMAIL_SETUP.md) - Email service configuration
- [RESPONSIVE_DESIGN.md](./docs/RESPONSIVE_DESIGN.md) - Responsive design guide
- [BACKEND_ARCHITECTURE.md](./docs/BACKEND_ARCHITECTURE.md) - Backend structure

### 📱 Mobile
- [APK_BUILD_SUCCESS.md](./docs/APK_BUILD_SUCCESS.md) - Android build guide
- [EMULATOR_QUICK_GUIDE.md](./docs/EMULATOR_QUICK_GUIDE.md) - Emulator setup

### 👑 Admin Features
- [WEB_ADMIN_READY.md](./docs/WEB_ADMIN_READY.md) - Admin panel guide
- [ADMIN_LOGIN_COMPLETE.md](./docs/ADMIN_LOGIN_COMPLETE.md) - Admin login setup

## 🛠️ Tech Stack

### Frontend
- **Web**: Next.js 14, React, TypeScript, Tailwind CSS
- **Mobile**: React Native, Expo

### Backend
- **API**: NestJS, Prisma, PostgreSQL
- **Auth**: JWT, Passport.js
- **Storage**: AWS S3 / Cloudinary
- **Email**: Nodemailer

### DevOps
- **Version Control**: Git
- **Package Manager**: npm
- **Monorepo**: npm workspaces

## 🎯 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cd services/api
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up database**
   ```bash
   cd services/api
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed  # Creates test users
   ```

4. **Start services**
   ```bash
   # From root directory
   npm run dev

   # Or start individually:
   npm run dev:web      # Web app
   npm run dev:api      # Backend API
   npm run dev:mobile   # Mobile app
   ```

## 👥 Test Users

Three test users are available after running the seed:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| 👑 Admin | admin@kolamott.com | Admin@123 | Full access (no subscription) |
| ⭐ Premium | test@kolamott.com | Test@123 | Premium content |
| 👤 Free | free@kolamott.com | Free@123 | Limited access |

See [TEST_CREDENTIALS.md](./docs/TEST_CREDENTIALS.md) for details.

## 🌐 Service URLs

| Service | Development URL | Default Port |
|---------|----------------|--------------|
| Web App | http://localhost:3001 | 3001 |
| Backend API | http://localhost:3002 | 3002 |
| Mobile | Expo app | 8081 |
| Prisma Studio | http://localhost:5555 | 5555 |

## 📖 Key Documentation

**New to the project?** Start here:
1. [🚀 QUICK_START.md](./docs/QUICK_START.md) - **Get running in 5 minutes**
2. [📖 BUILD_AND_RUN_GUIDE.md](./docs/BUILD_AND_RUN_GUIDE.md) - **Complete build & run guide**
3. [TEST_CREDENTIALS.md](./docs/TEST_CREDENTIALS.md) - Get test login credentials
4. [QUICK_START_AUTH.md](./docs/QUICK_START_AUTH.md) - Set up authentication

**Setting up features:**
- [Backend Setup](./docs/QUICK_START_BACKEND.md)
- [Admin Panel](./docs/WEB_ADMIN_READY.md)
- [Email Service](./docs/EMAIL_SETUP.md)
- [Cloud Upload](./docs/CLOUDINARY_SETUP.md)

## 🔒 Security

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Subscription validation
- Admin privileges

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

[Your License Here]

## 📞 Support

For issues and questions:
- Check the [docs](./docs/) folder
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ for KOLAM-OTT**

*See [docs/README.md](./docs/README.md) for complete documentation index*
