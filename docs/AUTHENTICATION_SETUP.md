# Authentication & Mock Users Setup

## Overview
Authentication system with role-based access control (RBAC) and subscription management. **Admin users automatically bypass subscription requirements**.

## Mock Test Users

Three test users are created via the seed script:

### 1. Admin User (No Subscription Required)
```
Email: admin@kolamott.com
Password: Admin@123
Role: ADMIN
Features:
  - Full access to all content without subscription
  - Can create/edit/delete movies
  - Bypass all subscription checks
```

### 2. Test User (With Active Subscription)
```
Email: test@kolamott.com
Password: Test@123
Role: USER
Subscription: Premium Plan (30 days active)
Features:
  - Access to all premium content
  - 4K video quality
  - 4 devices
```

### 3. Free User (No Subscription)
```
Email: free@kolamott.com
Password: Free@123
Role: USER
Subscription: None
Features:
  - Limited access (non-premium content only)
  - Cannot access premium movies
```

## Running the Seed Script

```bash
cd services/api
npm run prisma:seed
```

This will create the mock users and subscription plans in your database.

## Authentication Flow

### 1. Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@kolamott.com",
  "password": "Admin@123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@kolamott.com",
    "name": "Admin User",
    "role": "ADMIN",
    "hasActiveSubscription": true
  }
}
```

### 2. Register
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "Password123!",
  "name": "New User",
  "phone": "+919876543213"
}
```

### 3. Get Profile
```bash
GET /auth/profile
Authorization: Bearer <access_token>

Response:
{
  "id": "uuid",
  "email": "admin@kolamott.com",
  "name": "Admin User",
  "role": "ADMIN",
  "hasActiveSubscription": true,
  "currentSubscription": null,  // null for admin users
  ...
}
```

## Guards & Decorators

### 1. JwtAuthGuard
Validates JWT token and authenticates the user.

```typescript
@UseGuards(JwtAuthGuard)
@Get('protected')
async protectedRoute() {
  return 'This requires authentication';
}
```

### 2. SubscriptionGuard
**Automatically bypasses admin users**. Regular users need an active subscription.

```typescript
@UseGuards(JwtAuthGuard, SubscriptionGuard)
@Get('premium-content')
async premiumContent() {
  return 'This requires authentication + subscription (or ADMIN role)';
}
```

### 3. RolesGuard
Restricts access to specific user roles.

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Post('admin-only')
async adminOnly() {
  return 'Only admins can access this';
}
```

## Implementation Details

### Admin Subscription Bypass

The `SubscriptionGuard` automatically allows admins:

```typescript
// In subscription.guard.ts
async canActivate(context: ExecutionContext): Promise<boolean> {
  const user = request.user;

  // ADMIN users don't need a subscription
  if (user.role === UserRole.ADMIN) {
    return true;
  }

  // Regular users need active subscription
  const activeSubscription = await this.prisma.subscription.findFirst({
    where: {
      userId: user.userId,
      status: 'ACTIVE',
      endDate: { gte: new Date() },
    },
  });

  if (!activeSubscription) {
    throw new ForbiddenException('Active subscription required');
  }

  return true;
}
```

### hasActiveSubscription Flag

Both auth service methods return a `hasActiveSubscription` flag that's true for:
- Admin users (always)
- Regular users with an active subscription

```typescript
hasActiveSubscription: user.role === UserRole.ADMIN || user.subscriptions.length > 0
```

## Usage Examples

### Example 1: Protect Premium Movie Access
```typescript
@Controller('movies')
export class MoviesController {
  
  // Anyone can list movies
  @Get()
  async getAllMovies() {
    return this.moviesService.getAllMovies();
  }

  // Requires auth + subscription (admins auto-pass)
  @Get(':id')
  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  async getMovieById(@Param('id') id: string) {
    return this.moviesService.getMovieById(id);
  }

  // Only admins can create
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createMovie(@Body() data: any) {
    return this.moviesService.createMovie(data);
  }
}
```

### Example 2: Content Streaming Endpoint
```typescript
@Controller('stream')
export class StreamController {
  
  // Free preview (no auth needed)
  @Get('preview/:id')
  async getPreview(@Param('id') id: string) {
    return this.streamService.getPreview(id);
  }

  // Full movie (auth + subscription, admins bypass)
  @Get('movie/:id')
  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  async streamMovie(@Param('id') id: string, @Request() req) {
    return this.streamService.streamMovie(id, req.user);
  }
}
```

## Testing

### Test as Admin (No Subscription Needed)
```bash
# Login as admin
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kolamott.com","password":"Admin@123"}'

# Access premium content (will work even without subscription)
curl -X GET http://localhost:3001/movies/some-movie-id \
  -H "Authorization: Bearer <admin_token>"
```

### Test as Regular User (Needs Subscription)
```bash
# Login as test user (has subscription)
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@kolamott.com","password":"Test@123"}'

# Access premium content (will work - has subscription)
curl -X GET http://localhost:3001/movies/some-movie-id \
  -H "Authorization: Bearer <test_token>"

# Login as free user (no subscription)
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"free@kolamott.com","password":"Free@123"}'

# Access premium content (will FAIL - no subscription)
curl -X GET http://localhost:3001/movies/some-movie-id \
  -H "Authorization: Bearer <free_token>"
# Response: 403 Forbidden - "Active subscription required..."
```

## Environment Variables

Add to your `.env` file:
```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
DATABASE_URL=postgresql://user:password@localhost:5432/kolam_ott
```

## Next Steps

1. Run database migrations: `npm run prisma:migrate`
2. Run seed script: `npm run prisma:seed`
3. Start the API: `npm run dev`
4. Test with the mock users above
5. Integrate with frontend login/registration pages
