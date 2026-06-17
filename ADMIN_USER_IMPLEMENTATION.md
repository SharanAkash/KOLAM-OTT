# Admin User Implementation Guide

## 🔐 Role-Based Access Control for J S Tamil Cinemas

Complete implementation of admin user authentication and dashboard access for both mobile and web platforms.

---

## 📊 User Schema with Roles

### Updated User Schema
```json
{
  "_id": "user_12345",
  "email": "admin@jstamilcinemas.com",
  "name": "Admin User",
  "password": "hashed_password",
  "role": "admin", // "user" or "admin"
  "plan": {
    "type": "premium",
    "startDate": "2024-06-01",
    "expiryDate": "2024-07-01"
  },
  "permissions": {
    "canManageMovies": true,
    "canManageUsers": true,
    "canViewAnalytics": true,
    "canManageSubscriptions": true
  },
  "createdAt": "2024-06-01T08:00:00Z",
  "updatedAt": "2024-06-15T12:00:00Z"
}
```

---

## 🎯 Implementation Flow

```
User Login
    ↓
Check Credentials
    ↓
Get User Role
    ↓
    ├─→ role === "admin" → Admin Dashboard
    └─→ role === "user"  → Regular Home Screen
```

---

## 🌐 Web Implementation

### Files to Create/Update:
1. Authentication helper with role check
2. Admin middleware for protected routes
3. Login page with role-based redirect
4. Admin dashboard (already created)

---

## 📱 Mobile Implementation

### Files to Create/Update:
1. Admin dashboard screens
2. Login screen with role check
3. Navigation with conditional admin routes
4. Admin-specific components

---

## Default Admin Credentials

For testing/development:

```
Email: admin@jstamilcinemas.com
Password: Admin@123
Role: admin
```

**IMPORTANT:** Change these in production!

---

## Implementation Details in Next Steps
