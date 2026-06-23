# Kolam OTT Mumbai Deployment Status

**Date:** 2026-06-23  
**Region:** ap-south-1 (Mumbai)  
**Cluster:** JS-QA

---

## ✅ Successfully Created

### Infrastructure
- ✅ ECR Repositories (web & API)
- ✅ Application Load Balancer (`kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com`)
- ✅ Target Groups (web: port 3000, API: port 3001)
- ✅ Security Groups (ALB, ECS, RDS)
- ✅ RDS PostgreSQL Database (`kolam-ott-mumbai.cvu80qm40c37.ap-south-1.rds.amazonaws.com`)
- ✅ CloudWatch Log Groups

### Docker Images
- ✅ API image built with AMD64 platform
- ✅ Web image built with AMD64 platform
- ✅ Both images pushed to Mumbai ECR

### Services
- ✅ API Service: **RUNNING** (1/1) - Health checks passing
- 🔄 Web Service: **IN PROGRESS** (0/1) - Being recreated

---

## ✅ Working Components

### API Service (`kolam-ott-mumbai-api`)
- **Status:** Healthy and running
- **Task Definition:** `kolam-ott-mumbai-api:2`
- **Health Endpoint:** `/api/auth/health` ✅ **Working**
- **Test:** 
  ```bash
  curl http://kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com/api/auth/health
  # {"status":"ok","timestamp":"2026-06-23T14:31:00.952Z"}
  ```

### Key Fixes Applied
1. ✅ Added health endpoint at `/api/auth/health`
2. ✅ Updated target group health check path
3. ✅ Added global API prefix (`/api`)
4. ✅ Rebuilt images for AMD64 platform (was ARM)

---

## 🔄 In Progress

### Web Service (`kolam-ott-mumbai-web`)
- **Status:** Service recreated, tasks starting
- **Issue:** Previous service had stalled deployments
- **Action Taken:** Deleted and recreated service
- **Current:** Waiting for tasks to start (0/1 running)

---

## 📋 Pending Tasks

### 1. Verify Web Service
```bash
# Wait for web to become healthy
aws ecs describe-services --cluster JS-QA --services kolam-ott-mumbai-web --region ap-south-1 --query 'services[0].[runningCount,desiredCount]'

# Test web access
curl http://kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com/
```

### 2. Seed Database
Once API is confirmed working:
```bash
cd /Users/sharan.j/kolam-ott
./seed-mumbai.sh
```

This will create:
- Admin: admin@kolamott.com / Admin@123
- Premium: premium@kolamott.com / Premium@123
- Free: free@kolamott.com / Free@123

### 3. Test Complete Application
- [ ] Access web UI
- [ ] Login as admin
- [ ] Upload test movie/video
- [ ] Verify file upload to local storage

---

## 🌐 Access URLs

| Service | URL | Status |
|---------|-----|--------|
| **Web App** | http://kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com | 🔄 Deploying |
| **API Health** | http://kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com/api/auth/health | ✅ Working |
| **Admin Login** | http://kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com/login | 🔄 After web |
| **ECS Console** | https://ap-south-1.console.aws.amazon.com/ecs/v2/clusters/JS-QA/services | - |

---

## 🔧 Key Configuration

### Environment Variables (API)
```
DATABASE_URL=postgres://<user>:<pass>@<host>:5432/<db>?schema=public
USE_LOCAL_STORAGE=true
PUBLIC_URL=http://kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com
```

### ALB Routing Rules
- Default (all paths) → Web (port 3000)
- `/api/*` → API (port 3001)  
- `/uploads/*` → API (port 3001)

### Health Checks
- **API:** `/api/auth/health` (interval: 30s, timeout: 5s)
- **Web:** `/` (interval: 30s, timeout: 5s)

---

## 📊 Monitoring Commands

```bash
# Service status
aws ecs describe-services \
  --cluster JS-QA \
  --services kolam-ott-mumbai-api kolam-ott-mumbai-web \
  --region ap-south-1 \
  --query 'services[*].[serviceName,runningCount,desiredCount,deployments[0].rolloutState]' \
  --output table

# API logs
aws logs tail /ecs/kolam-ott-mumbai-api --region ap-south-1 --follow

# Web logs
aws logs tail /ecs/kolam-ott-mumbai-web --region ap-south-1 --follow

# Target health
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:ap-south-1:637423656090:targetgroup/kolam-ott-mumbai-api-tg/9cad90812ce00eaf \
  --region ap-south-1

aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:ap-south-1:637423656090:targetgroup/kolam-ott-mumbai-web-tg/239504e7020966a7 \
  --region ap-south-1
```

---

## 🚀 Deployment Scripts

| Script | Purpose |
|--------|---------|
| `deploy-mumbai.sh` | Build and deploy both services to Mumbai |
| `seed-mumbai.sh` | Seed database with test users |
| `run-migrations-mumbai.sh` | Run Prisma migrations (from local) |

---

## 📖 Documentation

- [MUMBAI_DEPLOYMENT.md](docs/MUMBAI_DEPLOYMENT.md) - Complete infrastructure guide
- [ADMIN_FILE_UPLOAD.md](docs/ADMIN_FILE_UPLOAD.md) - File upload configuration

---

## ⏭️ Next Steps

1. **Wait 2-3 minutes** for web service to start
2. **Verify web is accessible:** `curl http://kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com/`
3. **Seed database:** Run `./seed-mumbai.sh` (may need to run from inside ECS task if local connection fails)
4. **Test login:** admin@kolamott.com / Admin@123
5. **Test file upload:** Upload a video from admin dashboard

---

## 🔍 Troubleshooting

### If web doesn't start after 5 minutes
```bash
# Check events
aws ecs describe-services --cluster JS-QA --services kolam-ott-mumbai-web --region ap-south-1 --query 'services[0].events[0:5]'

# Check task status
aws ecs list-tasks --cluster JS-QA --service-name kolam-ott-mumbai-web --region ap-south-1
```

### If database seed fails from local
Run from within API container:
```bash
# Get task ID
TASK_ID=$(aws ecs list-tasks --cluster JS-QA --service-name kolam-ott-mumbai-api --region ap-south-1 --query 'taskArns[0]' --output text | rev | cut -d'/' -f1 | rev)

# Execute seed in container
aws ecs execute-command \
  --cluster JS-QA \
  --task $TASK_ID \
  --container kolam-ott-api \
  --region ap-south-1 \
  --command "node seed-prod.js" \
  --interactive
```

---

**Status updated:** 2026-06-23 at 14:35 UTC
