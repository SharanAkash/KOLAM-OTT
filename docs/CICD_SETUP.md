# CI/CD Setup Guide

## ✅ What's Been Configured

GitHub Actions workflows are now set up for automatic deployment:

1. **CI Pipeline** - Runs on every PR
2. **QA Deployment** - Auto-deploys when you push to `main`
3. **Database Seeding** - Manual workflow to create test users

## 🔐 Required Setup: GitHub Secrets

You need to add AWS credentials to GitHub so the workflows can deploy:

### Step 1: Go to GitHub Repository Settings

1. Open https://github.com/SharanAkash/KOLAM-OTT
2. Click **Settings** (top navigation)
3. In left sidebar: **Secrets and variables** → **Actions**
4. Click **New repository secret**

### Step 2: Add These Secrets

| Secret Name | Value | Where to Find |
|-------------|-------|---------------|
| `AWS_ACCESS_KEY_ID` | Your AWS access key | AWS IAM Console |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret key | AWS IAM Console |

### How to Get AWS Credentials

**Option 1: Use existing credentials**
```bash
# Check your local AWS credentials
cat ~/.aws/credentials
```

**Option 2: Create new IAM user for GitHub Actions**
1. Go to AWS Console → IAM
2. Create new user: `github-actions-deployer`
3. Attach policies:
   - `AmazonECS_FullAccess`
   - `AmazonEC2ContainerRegistryPowerUser`
   - `CloudWatchLogsReadOnlyAccess`
4. Create access key
5. Copy the keys to GitHub secrets

## 🚀 How It Works

### Automatic Deployment (on push to main)

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# GitHub Actions will automatically:
# 1. Build Docker images
# 2. Push to ECR
# 3. Deploy to ECS
# 4. Run database migrations
# 5. Seed database (if needed)
```

### Manual Database Seeding

If you need to re-seed the database:

1. Go to https://github.com/SharanAkash/KOLAM-OTT/actions
2. Click **Seed Database** workflow
3. Click **Run workflow**
4. Select environment: `qa`
5. Click **Run workflow**

This creates the test users:
- **Admin**: admin@kolamott.com / Admin@123
- **Premium**: test@kolamott.com / Test@123
- **Free**: free@kolamott.com / Free@123

## 📊 Monitoring Deployments

### Check Workflow Status

Go to: https://github.com/SharanAkash/KOLAM-OTT/actions

You'll see:
- ✅ Green checkmark = Success
- ❌ Red X = Failed
- 🟡 Yellow circle = In progress

### View Logs

Click on any workflow run to see:
- Build logs
- Deployment progress
- Migration results
- Error messages (if any)

### Test the Deployment

After deployment completes (2-5 minutes):
```bash
curl http://kolam-ott-qa-alb-146970630.us-east-1.elb.amazonaws.com/login
```

Or open in browser: http://kolam-ott-qa-alb-146970630.us-east-1.elb.amazonaws.com/login

## 🔧 Troubleshooting

### "Repository secret not found"

→ Add AWS credentials to GitHub Secrets (see above)

### "Unable to locate credentials"

→ Check that secret names match exactly:
- `AWS_ACCESS_KEY_ID` (not `AWS_ACCESS_KEY`)
- `AWS_SECRET_ACCESS_KEY` (not `AWS_SECRET`)

### Deployment stuck or failed

1. Check workflow logs in GitHub Actions
2. View ECS service events:
```bash
aws ecs describe-services \
  --cluster kolam-ott-qa \
  --services web api \
  --region us-east-1 \
  --query 'services[*].events[0:3]'
```

3. Check container logs:
```bash
aws logs tail /ecs/kolam-ott-qa-web --follow
aws logs tail /ecs/kolam-ott-qa-api --follow
```

## 🎯 Next Steps

1. ✅ Add AWS credentials to GitHub Secrets
2. ✅ Push a test commit to trigger deployment
3. ✅ Run manual seed workflow to create test users
4. ✅ Test login at the QA URL

## 📝 Deployment URL

**QA Environment:** http://kolam-ott-qa-alb-146970630.us-east-1.elb.amazonaws.com

**Test at:** /login

