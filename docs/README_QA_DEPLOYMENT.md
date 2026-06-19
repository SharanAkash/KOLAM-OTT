# 🚀 QA Environment Deployment - Quick Start

## Current Status: Infrastructure Deploying ⏳

**Started**: June 18, 2026  
**Progress**: 50% (Infrastructure creation in progress)  
**ETA**: 10-12 minutes

---

## What's Happening Now

✅ **Terraform is creating your AWS infrastructure** (55 resources)
- VPC, subnets, NAT gateways
- RDS PostgreSQL database (~7-10 min)
- S3 bucket for videos
- ECS cluster
- Application Load Balancer
- ECR repositories
- Security groups, IAM roles, monitoring

⏳ **Waiting for**: Docker Desktop installation

---

## Quick Commands

### Check Deployment Status
```bash
# From project root
./check-deployment-status.sh
```

### Watch Live Progress
```bash
cd infrastructure/terraform
tail -f terraform-apply.log
```

### Manual Status Check
```bash
cd infrastructure/terraform
grep -c "Creation complete" terraform-apply.log
# Shows: X / 55 resources created
```

---

## What To Do Next

### 1. Install Docker Desktop (Do This Now!)

While infrastructure is deploying, install Docker:

**Download**: https://www.docker.com/products/docker-desktop

**Mac Steps**:
1. Download Docker Desktop for Mac (Apple Silicon)
2. Open `.dmg` file and drag to Applications
3. Launch Docker Desktop
4. Wait for whale icon in menu bar
5. Verify: `docker --version && docker ps`

**Quick Alternative**:
```bash
brew install colima docker
colima start
```

### 2. After Infrastructure Completes (~15 min from start)

**Check completion**:
```bash
cd infrastructure/terraform
tail terraform-apply.log
# Look for: "Apply complete! Resources: 55 added, 0 changed, 0 destroyed."
```

**Get outputs**:
```bash
terraform output > ../infrastructure-outputs.txt
cat ../infrastructure-outputs.txt
```

You'll see:
- Database endpoint
- S3 bucket name
- S3 credentials
- ALB DNS name
- ECR repository URLs

### 3. Update Environment Files

Update these files with the outputs from step 2:

**API**: `services/api/.env.qa`
```bash
DATABASE_URL="postgresql://kolam_qa:PASSWORD@DB_ENDPOINT:5432/kolam_ott_qa"
AWS_S3_BUCKET=kolam-ott-qa-videos
AWS_ACCESS_KEY_ID=<from terraform output>
AWS_SECRET_ACCESS_KEY=<from terraform output>
JWT_SECRET=<generate with: openssl rand -base64 64>
```

**Web**: `apps/web/.env.qa`
```bash
NEXT_PUBLIC_API_URL=http://ALB_DNS_NAME
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
```

**Mobile**: `apps/mobile/.env.qa`
```bash
API_URL=http://ALB_DNS_NAME
```

### 4. Deploy Applications (Requires Docker)

```bash
# From project root
./infrastructure/scripts/deploy-qa.sh all
```

This will:
1. Build API and Web Docker images
2. Push to ECR
3. Create ECS task definitions
4. Deploy services
5. Run database migrations

---

## Complete Workflow

```bash
# Step 1: Check deployment status
./check-deployment-status.sh

# Step 2: Once infrastructure is complete, get outputs
cd infrastructure/terraform
terraform output

# Step 3: Update environment files
# (Edit .env.qa files with values from outputs)

# Step 4: Generate secrets
openssl rand -base64 64  # JWT_SECRET
openssl rand -base64 32  # NEXTAUTH_SECRET

# Step 5: Deploy applications (after Docker is installed)
cd ../..
./infrastructure/scripts/deploy-qa.sh all

# Step 6: Verify deployment
curl http://ALB_DNS_NAME/health
```

---

## Monitoring Progress

### Infrastructure Creation

**Fastest way**:
```bash
./check-deployment-status.sh
```

**Detailed view**:
```bash
cd infrastructure/terraform
tail -f terraform-apply.log | grep -E "Creating|Creation complete|Still creating"
```

**AWS Console**:
- VPC: https://console.aws.amazon.com/vpc
- RDS: https://console.aws.amazon.com/rds
- ECS: https://console.aws.amazon.com/ecs
- S3: https://console.aws.amazon.com/s3

### Application Deployment (later)

```bash
# ECS services
aws ecs describe-services --cluster kolam-ott-qa --services api web

# Check logs
aws logs tail /ecs/kolam-ott-qa-api --follow
```

---

## Estimated Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Prerequisites Setup | 5 min | ✅ Done |
| Terraform Init & Plan | 2 min | ✅ Done |
| Infrastructure Apply | 10-15 min | ⏳ Running |
| Docker Installation | 5 min | ⏳ Waiting |
| Config Update | 5 min | ⏳ Pending |
| App Build & Deploy | 15 min | ⏳ Pending |
| Verification | 5 min | ⏳ Pending |
| **TOTAL** | **45-50 min** | **50% Done** |

---

## Troubleshooting

### Terraform Apply Fails

```bash
cd infrastructure/terraform

# Check error
tail -50 terraform-apply.log

# Common issues:
# - AWS quota limits → Request increase in Service Quotas
# - VPC limit → Delete unused VPCs
# - EIP limit → Request increase

# Rollback if needed
terraform destroy -auto-approve
```

### Docker Issues

```bash
# Check if running
docker ps

# Restart Docker Desktop
# From Applications folder, quit and relaunch Docker

# Alternative: Use Colima
brew install colima docker
colima start
```

### Deployment Script Issues

```bash
# Check AWS credentials
aws sts get-caller-identity

# Check ECR access
aws ecr get-login-password --region us-east-1

# Manual build/push
cd services/api
docker build -t api:latest .
```

---

## Cost Management

**Monthly Cost**: ~$156-186

**To reduce costs**:

```bash
# Stop everything when not in use
aws ecs update-service --cluster kolam-ott-qa --service api --desired-count 0
aws ecs update-service --cluster kolam-ott-qa --service web --desired-count 0
aws rds stop-db-instance --db-instance-identifier kolam-ott-qa

# Restart when needed
aws rds start-db-instance --db-instance-identifier kolam-ott-qa
aws ecs update-service --cluster kolam-ott-qa --service api --desired-count 1
aws ecs update-service --cluster kolam-ott-qa --service web --desired-count 1
```

**To completely remove**:
```bash
cd infrastructure/terraform
terraform destroy -auto-approve
```

---

## Files & Documentation

- 📖 **Full Guide**: [docs/QA_DEPLOYMENT.md](docs/QA_DEPLOYMENT.md)
- 📊 **Deployment Plan**: [DEPLOYMENT_PLAN.md](DEPLOYMENT_PLAN.md)
- 🔍 **Current Status**: [DEPLOYMENT_IN_PROGRESS.md](DEPLOYMENT_IN_PROGRESS.md)
- ⚙️ **Status Checker**: [check-deployment-status.sh](check-deployment-status.sh)

---

## Support & Help

### Quick Checks
```bash
# Infrastructure status
./check-deployment-status.sh

# AWS resources
aws ecs list-clusters
aws rds describe-db-instances --query 'DBInstances[?DBName==`kolam_ott_qa`]'
aws s3 ls | grep kolam-ott

# Terraform state
cd infrastructure/terraform
terraform state list
```

### Getting Help
- Check logs: `infrastructure/terraform/terraform-apply.log`
- AWS CloudWatch: https://console.aws.amazon.com/cloudwatch
- ECS Console: https://console.aws.amazon.com/ecs

---

## After Successful Deployment

### Access Your QA Environment

**API**: `http://ALB_DNS_NAME/api/health`  
**Web**: `http://ALB_DNS_NAME`

*Note: Without SSL certificate, using HTTP. Add certificate for HTTPS.*

### Test Endpoints

```bash
# Get ALB DNS
cd infrastructure/terraform
ALB_DNS=$(terraform output -raw alb_dns_name)

# Test API
curl http://$ALB_DNS/health

# Test Web
curl http://$ALB_DNS
```

### Next Steps

1. Configure custom domain (optional)
2. Setup SSL certificate
3. Run smoke tests
4. Invite QA team
5. Setup CI/CD for automatic deployments

---

## Pro Tips

1. **Save outputs**: `terraform output > outputs.txt`
2. **Use status checker**: Run `./check-deployment-status.sh` regularly
3. **Watch specific resource**: `grep "aws_db_instance" terraform-apply.log`
4. **Background deployment**: Already running in background!
5. **Install Docker now**: Save time by installing while infrastructure deploys

---

**Current Action**: Installing Docker Desktop (infrastructure deploying in background)  
**Next Action**: Update environment files when infrastructure completes  
**Time to completion**: ~10-12 minutes

---

*Last updated: June 18, 2026 16:50 IST*
