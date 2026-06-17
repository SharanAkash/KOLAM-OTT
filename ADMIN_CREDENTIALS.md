# Admin Credentials - J S Tamil Cinemas

## 🔐 Admin User Access

### Admin User 1 (Test Account)
```
Email: admin@jstamilcinemas.com
Password: Admin@123
Name: Admin User
Role: admin
```

### Admin User 2 (Main Admin - Sharan J S)
```
Email: akashsharan5544@gmail.com
Password: 5Sharan$55
Mobile: 9994168334
Name: Sharan J S
Role: admin
```

### Regular User (Test Account)
```
Email: user@example.com
Password: User@123
Name: Regular User
Role: user
```

---

## 🌐 How to Login

### Web Application
1. Go to: http://localhost:3001/login
2. Enter email and password from above
3. Click "Sign In"
4. Admin users will be redirected to: http://localhost:3001/admin
5. Regular users will be redirected to: http://localhost:3001

### Mobile Application
1. Start app: `cd apps/mobile && npx expo start`
2. Press 'a' for Android or 'i' for iOS
3. Enter email and password from above
4. Tap "Sign In"
5. Admin users will see Admin Dashboard
6. Regular users will see Home Screen

---

## ✅ Both Admin Accounts Have Full Access To:

- 📊 View platform statistics
- 👥 Manage users
- 🎬 Manage movies and content
- 💰 View subscription and revenue data
- 📈 Access analytics dashboard
- ⚙️ Platform settings and configuration

---

## ⚠️ IMPORTANT SECURITY NOTES

### For Development/Testing:
✅ Credentials are stored in plain text (mock authentication)
✅ Both accounts work on web and mobile
✅ No database connection required yet

### For Production:
⚠️ **NEVER store passwords in plain text**
⚠️ **Use proper authentication with JWT tokens**
⚠️ **Hash passwords with bcrypt**
⚠️ **Store in secure database (MongoDB/PostgreSQL)**
⚠️ **Enable 2FA for admin accounts**
⚠️ **Use environment variables for secrets**

---

## 📱 Files Where Admin Users Are Stored

### Web App:
```
apps/web/src/lib/auth.ts
  - Line 10-35: MOCK_USERS array
```

### Mobile App:
```
apps/mobile/src/screens/LoginScreen.tsx
  - Line 16-35: MOCK_USERS array
```

---

## 🔄 To Add More Admin Users

### Web (apps/web/src/lib/auth.ts):
```typescript
{
  id: 'admin_3',
  email: 'newadmin@example.com',
  password: 'SecurePassword123',
  name: 'New Admin Name',
  phone: '1234567890',
  role: 'admin' as UserRole,
  avatar: 'https://images.unsplash.com/photo-xxx',
},
```

### Mobile (apps/mobile/src/screens/LoginScreen.tsx):
```typescript
{
  email: 'newadmin@example.com',
  password: 'SecurePassword123',
  name: 'New Admin Name',
  phone: '1234567890',
  role: 'admin',
},
```

---

## 🚀 Quick Test Login

### Test on Web:
```bash
# Open browser
open http://localhost:3001/login

# Enter credentials:
Email: akashsharan5544@gmail.com
Password: 5Sharan$55

# You'll be redirected to admin dashboard!
```

### Test on Mobile:
```bash
# Start app
cd apps/mobile
npx expo start

# Press 'a' for Android
# Enter same credentials
# Admin dashboard opens!
```

---

## 📊 Admin Dashboard Access

### Web Dashboard URL:
```
http://localhost:3001/admin
```

### Features Available:
- ✅ View total users: 15,234
- ✅ View active subscriptions: 8,456
- ✅ View total movies: 1,247
- ✅ View revenue: ₹45,67,890
- ✅ Manage recent users
- ✅ Manage recent movies
- ✅ Quick actions panel

### Mobile Dashboard:
- ✅ Native admin interface
- ✅ All same features as web
- ✅ Optimized for touch
- ✅ Scrollable lists

---

## 🔒 Password Requirements (Current)

**For Testing:**
- No restrictions currently
- Any password works

**For Production:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character
- Passwords must be hashed with bcrypt

---

## 📝 User Roles Explained

### Admin Role
**Permissions:**
- Full access to admin dashboard
- Can manage all users
- Can add/edit/delete movies
- Can view all analytics
- Can manage subscriptions
- Can configure platform settings

**Access:**
- Web: `/admin` route
- Mobile: `AdminDashboard` screen

### User Role
**Permissions:**
- Access to streaming content
- Can manage own profile
- Can create watchlist
- Can view movies
- Can subscribe to plans

**Access:**
- Web: `/` home route
- Mobile: `MainTabs` (Home, Search, Profile)

---

## ✅ Verification Checklist

Test both admin accounts:

### Web App
- [ ] Login with akashsharan5544@gmail.com works
- [ ] Redirects to /admin
- [ ] Dashboard displays correctly
- [ ] Can see all statistics
- [ ] All sections load properly

### Mobile App
- [ ] Login with same email works
- [ ] Opens AdminDashboard screen
- [ ] All statistics display
- [ ] Can scroll through lists
- [ ] Logout returns to login

---

## 🎯 Next Steps

1. **Test both accounts** on web and mobile
2. **Verify admin dashboard access**
3. **Check all features work**
4. **Plan database integration** for production
5. **Implement JWT authentication** when ready
6. **Add more admin features** as needed

---

**Created:** June 17, 2026  
**Status:** ✅ Active  
**Environment:** Development/Testing  
**Admin Count:** 2 accounts  

---

**IMPORTANT:** Change these passwords before production deployment!
