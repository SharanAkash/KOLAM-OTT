# 🎉 QA Environment - Ready for Application Deployment!

**Status**: Infrastructure Complete, Ready for Apps  
**Progress**: 70% Complete  
**Time**: June 18, 2026

---

## ✅ What's Been Completed

### 1. Infrastructure (100% Complete)
- ✅ VPC with public/private subnets
- ✅ NAT Gateways and Internet Gateway
- ✅ Application Load Balancer
- ✅ RDS PostgreSQL database
- ✅ S3 bucket for videos
- ✅ ECR repositories
- ✅ ECS cluster
- ✅ Security groups and IAM roles
- ✅ CloudWatch logging

### 2. Configuration (100% Complete)
- ✅ Environment files generated with actual credentials
- ✅ Database connection strings
- ✅ S3 access keys
- ✅ JWT secrets generated
- ✅ NextAuth secrets generated
- ✅ ALB endpoints configured

---

## 🚀 Final Steps: Deploy Applications

### Prerequisites Check

**Required**: Docker Desktop

**Status**: ⏳ Not Installed

**Action Required**: Install Docker Desktop

---

## Step 1: Install Docker Desktop

### Download & Install

**Mac (Apple Silicon)**:
1. Download: https://www.docker.com/products/docker-desktop
2. Open the `.dmg` file
3. Drag Docker.app to Applications
4. Launch Docker Desktop
5. Wait for whale icon in menu bar (Docker running)

**Verify Installation**:
```bash
docker --version
docker ps
```

You should see:
```
Docker version 24.x.x
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

### Alternative: Colima (Faster, Lighter)

```bash
brew install colima docker
colima start
docker ps  # Verify it works
```

---

## Step 2: Deploy Applications (After Docker is Installed)

### Quick Deploy (Recommended)

```bash
cd /Users/sharan.j/kolam-ott
./infrastructure/scripts/deploy-qa.sh all
```

This single command will:
1. Login to AWS ECR
2. Build API Docker image
3. Build Web Docker image
4. Push both images to ECR
5. Create/update ECS task definitions
6. Deploy API service to ECS
7. Deploy Web service to ECS
8. Run Prisma database migrations
9. Verify deployment

**Estimated Time**: 15-20 minutes

### Manual Deploy (If Script Fails)

#### 1. Login to ECR
```bash
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  637423656090.dkr.ecr.us-east-1.amazonaws.com
```

#### 2. Build and Push API
```bash
cd services/api
docker build -t 637423656090.dkr.ecr.us-east-1.amazonaws.com/kolam-ott/qa/api:latest .
docker push 637423656090.dkr.ecr.us-east-1.amazonaws.com/kolam-ott/qa/api:latest
```

#### 3. Build and Push Web
```bash
cd ../../apps/web
docker build -t 637423656090.dkr.ecr.us-east-1.amazonaws.com/kolam-ott/qa/web:latest .
docker push 637423656090.dkr.ecr.us-east-1.amazonaws.com/kolam-ott/qa/web:latest
```

#### 4. Create ECS Task Definitions

**API Task Definition** (`api-task-definition.json`):
```json
{
  "family": "kolam-ott-qa-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::637423656090:role/kolam-ott-qa-ecs-task-execution",
  "taskRoleArn": "arn:aws:iam::637423656090:role/kolam-ott-qa-ecs-task",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "637423656090.dkr.ecr.us-east-1.amazonaws.com/kolam-ott/qa/api:latest",
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "qa"}
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:637423656090:secret:kolam-ott-qa-api-env"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/kolam-ott-qa-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

Register:
```bash
aws ecs register-task-definition --cli-input-json file://api-task-definition.json
```

#### 5. Create/Update ECS Services
```bash
# API Service
aws ecs create-service \
  --cluster kolam-ott-qa \
  --service-name api \
  --task-definition kolam-ott-qa-api \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-0c246e74c6c2cc444,subnet-0ce194cc0171752fa],securityGroups=[sg-XXXXXXXXX],assignPublicIp=DISABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:637423656090:targetgroup/kolam-ott-qa-api/b1cd28aab987079b,containerName=api,containerPort=3001"

# Web Service
aws ecs create-service \
  --cluster kolam-ott-qa \
  --service-name web \
  --task-definition kolam-ott-qa-web \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-0c246e74c6c2cc444,subnet-0ce194cc0171752fa],securityGroups=[sg-XXXXXXXXX],assignPublicIp=DISABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:637423656090:targetgroup/kolam-ott-qa-web/4ccd1bbe35424bd3,containerName=web,containerPort=3000"
```

---

## Step 3: Verify Deployment

### Check ECS Services
```bash
aws ecs describe-services \
  --cluster kolam-ott-qa \
  --services api web
```

### Wait for Services to Stabilize
```bash
aws ecs wait services-stable \
  --cluster kolam-ott-qa \
  --services api web
```

### Test Endpoints

**API Health Check**:
```bash
curl http://kolam-ott-qa-alb-146970630.us-east-1.elb.amazonaws.com/health
```

Expected response:
```json
{"status": "ok"}
```

**Web Application**:
```bash
curl http://kolam-ott-qa-alb-146970630.us-east-1.elb.amazonaws.com
```

Or open in browser:
```
http://kolam-ott-qa-alb-146970630.us-east-1.elb.amazonaws.com
```

### Check Logs
```bash
# API logs
aws logs tail /ecs/kolam-ott-qa-api --follow

# Web logs
aws logs tail /ecs/kolam-ott-qa-web --follow
```

---

## 📊 Deployment Progress

| Phase | Status | Time |
|-------|--------|------|
| Prerequisites | ✅ Complete | 5 min |
| Terraform Backend | ✅ Complete | 2 min |
| Infrastructure | ✅ Complete | 15 min |
| Configuration | ✅ Complete | 2 min |
| **Docker Install** | **⏳ Pending** | **5 min** |
| **App Build** | **⏳ Pending** | **10 min** |
| **ECS Deploy** | **⏳ Pending** | **10 min** |
| **Verification** | **⏳ Pending** | **5 min** |

**Current**: 70% Complete  
**Remaining**: ~30 minutes

---

## 🔧 Troubleshooting

### Docker Build Fails

```bash
# Check Docker is running
docker ps

# Check disk space
df -h

# Clean up old images
docker system prune -a
```

### ECR Push Fails

```bash
# Re-authenticate
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  637423656090.dkr.ecr.us-east-1.amazonaws.com

# Check repository exists
aws ecr describe-repositories
```

### ECS Service Won't Start

```bash
# Check task logs
aws ecs describe-tasks \
  --cluster kolam-ott-qa \
  --tasks $(aws ecs list-tasks --cluster kolam-ott-qa --service-name api --query 'taskArns[0]' --output text)

# Check target health
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:us-east-1:637423656090:targetgroup/kolam-ott-qa-api/b1cd28aab987079b
```

### Database Connection Issues

```bash
# Test from ECS task
aws ecs execute-command \
  --cluster kolam-ott-qa \
  --task TASK_ARN \
  --container api \
  --command "/bin/sh" \
  --interactive
  
# Inside container:
nc -zv kolam-ott-qa.cojiu6662508.us-east-1.rds.amazonaws.com 5432
```

---

## 📝 Quick Reference

### Infrastructure Outputs
```bash
cd /Users/sharan.j/kolam-ott/infrastructure/terraform
terraform output
```

### All Credentials
See: [INFRASTRUCTURE_COMPLETE.md](INFRASTRUCTURE_COMPLETE.md)

### Environment Files
- API: `services/api/.env.qa`
- Web: `apps/web/.env.qa`
- Mobile: `apps/mobile/.env.qa`

### Key Endpoints
- **ALB**: `kolam-ott-qa-alb-146970630.us-east-1.elb.amazonaws.com`
- **API**: `http://kolam-ott-qa-alb-146970630.us-east-1.elb.amazonaws.com/api`
- **Web**: `http://kolam-ott-qa-alb-146970630.us-east-1.elb.amazonaws.com`

---

## 🎯 Current Task

**Install Docker Desktop**

Once installed, run:
```bash
cd /Users/sharan.j/kolam-ott
./infrastructure/scripts/deploy-qa.sh all
```

That's it! Everything else is automated.

---

## 💰 Cost Reminder

**Monthly**: ~$156-186

To stop when not in use:
```bash
# Stop services (saves ~$30-50/month)
aws ecs update-service --cluster kolam-ott-qa --service api --desired-count 0
aws ecs update-service --cluster kolam-ott-qa --service web --desired-count 0

# Stop database (saves ~$17/month)
aws rds stop-db-instance --db-instance-identifier kolam-ott-qa
```

To completely remove:
```bash
cd infrastructure/terraform
terraform destroy -auto-approve
```

---

## 📚 Documentation

- ✅ **Complete Guide**: [docs/QA_DEPLOYMENT.md](docs/QA_DEPLOYMENT.md)
- ✅ **Infrastructure Details**: [INFRASTRUCTURE_COMPLETE.md](INFRASTRUCTURE_COMPLETE.md)
- ✅ **Deployment Plan**: [DEPLOYMENT_PLAN.md](DEPLOYMENT_PLAN.md)

---

**Next Action**: Install Docker Desktop  
**Then Run**: `./infrastructure/scripts/deploy-qa.sh all`  
**ETA to Complete**: 30 minutes

---

*Ready to deploy applications - June 18, 2026*
