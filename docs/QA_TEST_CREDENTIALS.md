# 🔐 QA Environment Test Credentials

## Access URL
```
http://kolam-ott-qa-alb-146970630.us-east-1.elb.amazonaws.com
```

## Test Accounts

### 1. Admin Account (Full Access)
- **Email:** `admin@kolamott.com`
- **Password:** `Admin@123`
- **Role:** ADMIN
- **Features:** 
  - Full admin panel access
  - No subscription required
  - Can manage all content, users, and settings

---

### 2. Premium User (Active Subscription)
- **Email:** `test@kolamott.com`
- **Password:** `Test@123`
- **Role:** USER
- **Subscription:** Premium Plan (30 days)
- **Features:**
  - 4K video quality
  - Watch on 4 devices
  - Download content
  - No ads

---

### 3. Free User (No Subscription)
- **Email:** `free@kolamott.com`
- **Password:** `Free@123`
- **Role:** USER
- **Subscription:** None
- **Use Case:** Test subscription purchase flow

---

## ⚠️ Important Notes

1. **First Time Setup:** These users need to be created in the database
2. **Database Access:** The database is in a private subnet for security
3. **Creating Users:** 
   - Option A: Use the signup feature on the web app
   - Option B: Run the seed script from within the ECS container
   - Option C: Use Prisma Studio to manually create users

## 🔄 Running Database Seed

To populate the database with test users, connect to the API container and run:

```bash
# Get the running task ID
TASK_ID=$(aws ecs list-tasks --cluster kolam-ott-qa --service-name api --region us-east-1 --query 'taskArns[0]' --output text)

# Run seed (requires ECS Exec to be enabled)
aws ecs execute-command \
  --cluster kolam-ott-qa \
  --task $TASK_ID \
  --container api \
  --interactive \
  --command "npm run prisma:seed"
```

## 📊 Subscription Plans

### Basic Plan - ₹199/month
- HD quality
- 2 devices
- Downloads enabled
- No ads

### Premium Plan - ₹399/month  
- 4K quality
- 4 devices
- Downloads enabled
- No ads

---

**Need help?** Contact the DevOps team or check the main README.md
