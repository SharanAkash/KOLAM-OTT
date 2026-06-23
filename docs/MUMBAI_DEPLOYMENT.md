# Kolam OTT - Mumbai (ap-south-1) Deployment

## 📍 Overview

KOLAM-OTT service deployed in the **JS-QA** cluster in **Mumbai (ap-south-1)** region.

**Deployment Date:** 2026-06-23

---

## 🌐 Access URLs

| Service | URL |
|---------|-----|
| **Application** | http://kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com |
| **Admin Login** | http://kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com/login |
| **API Health** | http://kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com/api/health |

---

## 🏗️ Infrastructure Components

### 1. ECR Repositories
- **Web:** `637423656090.dkr.ecr.ap-south-1.amazonaws.com/kolam-ott/mumbai/web`
- **API:** `637423656090.dkr.ecr.ap-south-1.amazonaws.com/kolam-ott/mumbai/api`

### 2. Application Load Balancer
- **Name:** `kolam-ott-mumbai-alb`
- **DNS:** `kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com`
- **ARN:** `arn:aws:elasticloadbalancing:ap-south-1:637423656090:loadbalancer/app/kolam-ott-mumbai-alb/c7bed1ee095b2703`
- **Security Group:** `sg-0f890a9d8fa15d1eb`
- **Subnets:** 
  - `subnet-085b435bb844b93df` (ap-south-1a)
  - `subnet-04117ac74a533a525` (ap-south-1b)
  - `subnet-0d961d739bcce3797` (ap-south-1c)

### 3. Target Groups
- **Web TG:** `kolam-ott-mumbai-web-tg` (Port 3000)
  - ARN: `arn:aws:elasticloadbalancing:ap-south-1:637423656090:targetgroup/kolam-ott-mumbai-web-tg/239504e7020966a7`
  - Health Check: `/`
- **API TG:** `kolam-ott-mumbai-api-tg` (Port 3001)
  - ARN: `arn:aws:elasticloadbalancing:ap-south-1:637423656090:targetgroup/kolam-ott-mumbai-api-tg/9cad90812ce00eaf`
  - Health Check: `/health`

### 4. ALB Routing Rules
| Priority | Path Pattern | Target |
|----------|--------------|--------|
| Default | `*` | Web (Port 3000) |
| 10 | `/api/*` | API (Port 3001) |
| 20 | `/uploads/*` | API (Port 3001) |

### 5. Security Groups

#### ALB Security Group (`sg-0f890a9d8fa15d1eb`)
- **Name:** `kolam-ott-mumbai-alb-sg`
- **Inbound:**
  - Port 80 (HTTP) from `0.0.0.0/0`

#### ECS Security Group (`sg-02bbda4d00ad4ec7f`)
- **Name:** `kolam-ott-mumbai-ecs-sg`
- **Inbound:**
  - Port 3000 from ALB SG (`sg-0f890a9d8fa15d1eb`)
  - Port 3001 from ALB SG (`sg-0f890a9d8fa15d1eb`)

#### RDS Security Group (`sg-0a3d889fa6a13ff11`)
- **Name:** `kolam-ott-mumbai-rds-sg`
- **Inbound:**
  - Port 5432 from ECS SG (`sg-02bbda4d00ad4ec7f`)
  - Port 5432 from public IP (for migrations)

### 6. RDS PostgreSQL Database
- **Identifier:** `kolam-ott-mumbai`
- **Endpoint:** `kolam-ott-mumbai.cvu80qm40c37.ap-south-1.rds.amazonaws.com`
- **Port:** `5432`
- **Database:** `kolam_ott_mumbai`
- **Engine:** PostgreSQL 16.14
- **Username:** `kolam_mumbai`
- **Password:** `Mumbai2026KolamOTTSecureDB!#`
- **Instance Class:** `db.t3.micro`
- **Storage:** 20 GB (gp2)
- **Multi-AZ:** No
- **Publicly Accessible:** Yes
- **Backup Retention:** 7 days
- **Subnet Group:** `kolam-ott-mumbai-subnet-group`

**Connection String:**
```
postgres://<user>:<pass>@<host>:5432/<db>?schema=public
```

### 7. ECS Cluster & Services

#### Cluster
- **Name:** `JS-QA`
- **Region:** `ap-south-1` (Mumbai)

#### Services

##### API Service
- **Name:** `kolam-ott-mumbai-api`
- **Task Definition:** `kolam-ott-mumbai-api:2`
- **Desired Count:** 1
- **Launch Type:** Fargate
- **CPU:** 256
- **Memory:** 512 MB
- **Network Mode:** awsvpc
- **Container Port:** 3001
- **CloudWatch Logs:** `/ecs/kolam-ott-mumbai-api`

##### Web Service
- **Name:** `kolam-ott-mumbai-web`
- **Task Definition:** `kolam-ott-mumbai-web:1`
- **Desired Count:** 1
- **Launch Type:** Fargate
- **CPU:** 256
- **Memory:** 512 MB
- **Network Mode:** awsvpc
- **Container Port:** 3000
- **CloudWatch Logs:** `/ecs/kolam-ott-mumbai-web`

---

## 🔧 Configuration Files

### Environment Files
- **API:** [services/api/.env.mumbai](../services/api/.env.mumbai)
- **Web:** [apps/web/.env.mumbai](../apps/web/.env.mumbai)

### Task Definitions
- **API:** [infrastructure/ecs-mumbai-api-task-def.json](../infrastructure/ecs-mumbai-api-task-def.json)
- **Web:** [infrastructure/ecs-mumbai-web-task-def.json](../infrastructure/ecs-mumbai-web-task-def.json)

---

## 🚀 Deployment

### Deploy from Local Machine
```bash
./deploy-mumbai.sh
```

This script:
1. Builds Docker images for web and API
2. Pushes them to Mumbai ECR
3. Forces new ECS deployments
4. Updates both services

### Manual Deployment Steps

1. **Login to ECR:**
```bash
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin 637423656090.dkr.ecr.ap-south-1.amazonaws.com
```

2. **Build & Push API:**
```bash
cd services/api
cp .env.mumbai .env
docker build -t kolam-ott-mumbai-api .
docker tag kolam-ott-mumbai-api:latest 637423656090.dkr.ecr.ap-south-1.amazonaws.com/kolam-ott/mumbai/api:latest
docker push 637423656090.dkr.ecr.ap-south-1.amazonaws.com/kolam-ott/mumbai/api:latest
```

3. **Build & Push Web:**
```bash
cd apps/web
cp .env.mumbai .env.production
docker build -t kolam-ott-mumbai-web .
docker tag kolam-ott-mumbai-web:latest 637423656090.dkr.ecr.ap-south-1.amazonaws.com/kolam-ott/mumbai/web:latest
docker push 637423656090.dkr.ecr.ap-south-1.amazonaws.com/kolam-ott/mumbai/web:latest
```

4. **Update Services:**
```bash
aws ecs update-service \
  --cluster JS-QA \
  --service kolam-ott-mumbai-api \
  --force-new-deployment \
  --region ap-south-1

aws ecs update-service \
  --cluster JS-QA \
  --service kolam-ott-mumbai-web \
  --force-new-deployment \
  --region ap-south-1
```

---

## 🗃️ Database Management

### Run Migrations
Migrations are automatically run by the API container on startup via Prisma.

### Seed Database
To seed test users in Mumbai database:
```bash
cd services/api
cp .env.mumbai .env
npm run seed:prod
```

This creates:
- **Admin:** admin@kolamott.com / Admin@123
- **Premium:** premium@kolamott.com / Premium@123
- **Free:** free@kolamott.com / Free@123

---

## 📊 Monitoring & Logs

### Check Service Status
```bash
aws ecs describe-services \
  --cluster JS-QA \
  --services kolam-ott-mumbai-api kolam-ott-mumbai-web \
  --region ap-south-1 \
  --query 'services[*].[serviceName,runningCount,desiredCount,deployments[0].rolloutState]' \
  --output table
```

### View Logs
```bash
# API logs
aws logs tail /ecs/kolam-ott-mumbai-api --region ap-south-1 --follow

# Web logs
aws logs tail /ecs/kolam-ott-mumbai-web --region ap-south-1 --follow
```

### Check Target Health
```bash
# Web target group
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:ap-south-1:637423656090:targetgroup/kolam-ott-mumbai-web-tg/239504e7020966a7 \
  --region ap-south-1

# API target group
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:ap-south-1:637423656090:targetgroup/kolam-ott-mumbai-api-tg/9cad90812ce00eaf \
  --region ap-south-1
```

---

## 🔐 Admin Access

**Login URL:** http://kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com/login

**Credentials:**
- Email: `admin@kolamott.com`
- Password: `Admin@123`

**Admin Dashboard:** http://kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com/admin

---

## 📁 File Upload Configuration

- **Storage:** Local filesystem (container storage)
- **Upload Directory:** `/app/uploads/`
- **Max Video Size:** 5 GB
- **Max Trailer Size:** 500 MB
- **Accessible via:** `{ALB_URL}/uploads/{type}/{filename}`

**Note:** Files are stored in container filesystem. For production, consider:
- AWS EFS for persistent shared storage
- Switch to S3 by setting `USE_LOCAL_STORAGE=false`

---

## 🌍 Region Comparison

| Feature | US-East-1 (Virginia) | AP-South-1 (Mumbai) |
|---------|---------------------|---------------------|
| **Cluster** | kolam-ott-qa | JS-QA |
| **ALB URL** | kolam-ott-qa-alb-146970630.us-east-1.elb.amazonaws.com | kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com |
| **ECR Path** | kolam-ott/qa/* | kolam-ott/mumbai/* |
| **RDS Endpoint** | kolam-ott-qa.cojiu6662508.us-east-1.rds.amazonaws.com | kolam-ott-mumbai.cvu80qm40c37.ap-south-1.rds.amazonaws.com |
| **CI/CD** | GitHub Actions | Manual (no CI/CD yet) |

---

## 🎯 Next Steps

1. ✅ Infrastructure created in Mumbai
2. ✅ Docker images built and pushed
3. ✅ ECS services created and deploying
4. ⏳ **Waiting for services to become healthy**
5. 🔜 Test application access
6. 🔜 Seed database with test users
7. 🔜 Test admin file upload
8. 🔜 Set up CI/CD for Mumbai region (optional)

---

## 🆘 Troubleshooting

### Services not starting
```bash
# Check task status
aws ecs describe-tasks \
  --cluster JS-QA \
  --tasks $(aws ecs list-tasks --cluster JS-QA --service-name kolam-ott-mumbai-api --region ap-south-1 --query 'taskArns[0]' --output text) \
  --region ap-south-1

# Check logs
aws logs tail /ecs/kolam-ott-mumbai-api --region ap-south-1
```

### Database connection issues
- Verify RDS security group allows ECS SG on port 5432
- Check DATABASE_URL has URL-encoded password (%21 for !, %23 for #)
- Ensure `sslmode=require` is in connection string

### ALB not routing correctly
- Check target group health status
- Verify routing rules priority (default rule should be last)
- Ensure security groups allow ALB → ECS communication

---

## 📝 Console Links

- **ECS Cluster:** https://ap-south-1.console.aws.amazon.com/ecs/v2/clusters/JS-QA
- **API Service:** https://ap-south-1.console.aws.amazon.com/ecs/v2/clusters/JS-QA/services/kolam-ott-mumbai-api
- **Web Service:** https://ap-south-1.console.aws.amazon.com/ecs/v2/clusters/JS-QA/services/kolam-ott-mumbai-web
- **RDS Instance:** https://ap-south-1.console.aws.amazon.com/rds/home?region=ap-south-1#database:id=kolam-ott-mumbai
- **Load Balancer:** https://ap-south-1.console.aws.amazon.com/ec2/home?region=ap-south-1#LoadBalancers:search=kolam-ott-mumbai-alb
- **ECR Repositories:** https://ap-south-1.console.aws.amazon.com/ecr/repositories?region=ap-south-1

---

## 📞 Support

For issues or questions, check:
1. CloudWatch Logs for error messages
2. ECS service events for deployment issues
3. Target group health checks for connectivity problems
4. Security group rules for network access

---

**Last Updated:** 2026-06-23
