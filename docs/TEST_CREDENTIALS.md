# 🔑 Test Credentials - Quick Reference

## Mock User Accounts

### 👑 Admin User
```
Email:    admin@kolamott.com
Password: Admin@123
Role:     ADMIN

✨ Special Powers:
   • Full access to all content WITHOUT subscription
   • Can create/edit/delete movies
   • Bypasses all subscription checks automatically
   • hasActiveSubscription: always true
```

### ⭐ Premium User
```
Email:    test@kolamott.com
Password: Test@123
Role:     USER

Subscription: Premium Plan
   • Status: ACTIVE
   • Duration: 30 days
   • Video Quality: 4K
   • Max Devices: 4
   • hasActiveSubscription: true
```

### 👤 Free User
```
Email:    free@kolamott.com
Password: Free@123
Role:     USER

Subscription: NONE
   • Limited access only
   • Cannot access premium content
   • Gets 403 error on premium endpoints
   • hasActiveSubscription: false
```

---

## Quick Test Commands

### Login as Admin
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kolamott.com",
    "password": "Admin@123"
  }'
```

### Login as Premium User
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@kolamott.com",
    "password": "Test@123"
  }'
```

### Login as Free User
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "free@kolamott.com",
    "password": "Free@123"
  }'
```

---

## Expected Responses

### Admin Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "admin@kolamott.com",
    "name": "Admin User",
    "role": "ADMIN",
    "avatar": null,
    "hasActiveSubscription": true  ← Always true for admins!
  }
}
```

### Premium User Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "test@kolamott.com",
    "name": "Test User",
    "role": "USER",
    "avatar": null,
    "hasActiveSubscription": true  ← True because has subscription
  }
}
```

### Free User Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "free@kolamott.com",
    "name": "Free User",
    "role": "USER",
    "avatar": null,
    "hasActiveSubscription": false  ← False - no subscription
  }
}
```

---

## Access Matrix

| Endpoint Type | Public | Authenticated | Premium Content | Admin Only |
|--------------|--------|---------------|-----------------|------------|
| **Admin User** | ✅ | ✅ | ✅ (bypass) | ✅ |
| **Premium User** | ✅ | ✅ | ✅ | ❌ |
| **Free User** | ✅ | ✅ | ❌ | ❌ |
| **Anonymous** | ✅ | ❌ | ❌ | ❌ |

---

## Setup Required

Before testing, ensure you've run:

```bash
cd services/api
npm run prisma:seed
```

This creates all three test users in your database.

---

## Frontend Quick Login Buttons

Add these to your login page for easy testing:

```jsx
<button onClick={() => login('admin@kolamott.com', 'Admin@123')}>
  👑 Login as Admin
</button>

<button onClick={() => login('test@kolamott.com', 'Test@123')}>
  ⭐ Login as Premium User
</button>

<button onClick={() => login('free@kolamott.com', 'Free@123')}>
  👤 Login as Free User
</button>
```

---

## Testing Scenarios

### ✅ Scenario 1: Admin Can Access Everything
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kolamott.com","password":"Admin@123"}' \
  | jq -r .access_token)

# Access premium content (should work)
curl http://localhost:3001/movies/123 \
  -H "Authorization: Bearer $TOKEN"

# Result: ✅ SUCCESS (Admin bypasses subscription)
```

### ✅ Scenario 2: Premium User Can Access Content
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@kolamott.com","password":"Test@123"}' \
  | jq -r .access_token)

# Access premium content (should work)
curl http://localhost:3001/movies/123 \
  -H "Authorization: Bearer $TOKEN"

# Result: ✅ SUCCESS (Has active subscription)
```

### ❌ Scenario 3: Free User Cannot Access Premium Content
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"free@kolamott.com","password":"Free@123"}' \
  | jq -r .access_token)

# Try to access premium content (should fail)
curl http://localhost:3001/movies/123 \
  -H "Authorization: Bearer $TOKEN"

# Result: ❌ 403 Forbidden
# {
#   "statusCode": 403,
#   "message": "Active subscription required. Please subscribe to access premium content."
# }
```

---

## Pro Tips

1. **Save tokens to environment variables** for easier testing:
   ```bash
   export ADMIN_TOKEN="your-admin-token"
   export USER_TOKEN="your-user-token"
   ```

2. **Use jq to extract tokens automatically**:
   ```bash
   TOKEN=$(curl ... | jq -r .access_token)
   ```

3. **Check token expiry** (7 days default):
   ```bash
   echo $TOKEN | cut -d. -f2 | base64 -d 2>/dev/null | jq .exp
   ```

4. **Test with Postman/Insomnia**:
   - Import the collection
   - Set up environment variables
   - Save tokens automatically

---

**Remember**: These are TEST credentials only. Never use these in production!
