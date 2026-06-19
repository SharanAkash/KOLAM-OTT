# 🚀 QA Environment Deployment - IN PROGRESS

**Started**: June 18, 2026 16:48 IST  
**Status**: Infrastructure Provisioning  
**Progress**: 45% Complete

---

## Current Status: Infrastructure Creation (Phase 1/3)

### ⏳ Running Now
Terraform is creating 55 AWS resources. This takes approximately 10-15 minutes.

**What's being created:**
1. ✅ S3 bucket for Terraform state
2. ✅ DynamoDB table for state locking
3. ⏳ VPC with public/private subnets
4. ⏳ NAT Gateways (2) and Internet Gateway
5. ⏳ Application Load Balancer
6. ⏳ RDS PostgreSQL database (takes ~7-10 min)
7. ⏳ S3 bucket for videos
8. ⏳ ECR repositories for Docker images
9. ⏳ ECS cluster
10. ⏳ Security groups and IAM roles
11. ⏳ CloudWatch log groups

### Monitor Progress
```bash
# Watch the deployment logs
cd infrastructure/terraform
tail -f terraform-apply.log

# Or check specific resource creation
grep "Creating..." terraform-apply.log
grep "Creation complete" terraform-apply.log
```

---

## Progress Timeline

| Phase | Task | Status | Duration |
|-------|------|--------|----------|
| 1 | Install Prerequisites | ✅ Complete | 5 min |
| 1 | Setup Terraform Backend | ✅ Complete | 2 min |
| 1 | Initialize Terraform | ✅ Complete | 1 min |
| 1 | Create Terraform Plan | ✅ Complete | 1 min |
| 1 | **Apply Infrastructure** | ⏳ **IN PROGRESS** | **~15 min** |
| 2 | Install Docker Desktop | ⏳ Waiting | - |
| 2 | Configure Environment Vars | ⏳ Pending | 5 min |
| 2 | Build Docker Images | ⏳ Pending | 10 min |
| 2 | Push to ECR | ⏳ Pending | 5 min |
| 3 | Deploy to ECS | ⏳ Pending | 10 min |
| 3 | Run Migrations | ⏳ Pending | 2 min |
| 3 | Verify Deployment | ⏳ Pending | 5 min |

**Total Progress**: 45% (Phase 1/3)

---

## What to Do While Waiting

### 1. Install Docker Desktop (Required for Phase 2)

**Download**: https://www.docker.com/products/docker-desktop

**Mac Instructions**:
1. Download Docker Desktop for Mac (Apple Silicon)
2. Open the `.dmg` file
3. Drag Docker.app to Applications folder
4. Launch Docker Desktop
5. Wait for Docker to start (whale icon in menu bar)
6. Verify: `docker --version && docker ps`

**Alternative (Colima)**:
```bash
brew install colima docker
colima start
```

### 2. Prepare Domain & SSL (Optional)

If you're using a custom domain:
- Have your domain name ready
- Get SSL certificate ARN from AWS Certificate Manager
- Prepare to update DNS records

### 3. Review Configuration Files

Check these files for any custom settings:
- `services/api/.env.qa`
- `apps/web/.env.qa`
- `apps/mobile/.env.qa`

---

## After Infrastructure Creation Completes

### Step 1: Retrieve Outputs
```bash
cd infrastructure/terraform

# Get all outputs
terraform output

# Get specific values
terraform output -raw db_endpoint
terraform output -raw s3_bucket_name
terraform output -raw alb_dns_name
```

### Step 2: Update Environment Files

The infrastructure will output:
- Database endpoint
- S3 bucket name
- S3 access credentials
- ALB DNS name
- ECR repository URLs

These need to be added to your `.env.qa` files.

### Step 3: Build and Deploy (Requires Docker)

Once Docker is installed:
```bash
# Return to project root
cd ../..

# Run deployment script
./infrastructure/scripts/deploy-qa.sh all
```

This will:
1. Build Docker images for API and Web
2. Push images to ECR
3. Create ECS task definitions
4. Deploy services
5. Run database migrations

---

## Resources Being Created

### Networking
- VPC (10.1.0.0/16)
- 2 Public Subnets
- 2 Private Subnets
- 2 NAT Gateways
- 1 Internet Gateway
- Route Tables
- VPC Flow Logs

### Compute
- ECS Cluster: kolam-ott-qa
- ECS Task Execution Role
- ECS Task Role
- Security Groups

### Database
- RDS PostgreSQL 15.5
- db.t3.micro instance
- 20GB gp3 storage
- 7-day automated backups
- Secrets Manager for credentials

### Storage
- S3: kolam-ott-qa-videos
- ECR: kolam-ott/qa/api
- ECR: kolam-ott/qa/web

### Load Balancing
- Application Load Balancer
- Target Groups (API + Web)
- HTTP Listener (Port 80)
- HTTPS Listener (Port 443) - if cert provided

### Monitoring
- CloudWatch Log Groups
  - /ecs/kolam-ott-qa-api
  - /ecs/kolam-ott-qa-web
  - /aws/vpc/kolam-ott-qa
- RDS Enhanced Monitoring
- RDS Performance Insights

---

## Estimated Costs

| Service | Monthly Cost |
|---------|--------------|
| NAT Gateway (2) | ~$64 |
| ECS Fargate | ~$30-50 |
| ALB | ~$25 |
| RDS db.t3.micro | ~$17 |
| S3 Storage | ~$5-20 |
| CloudWatch | ~$5-10 |
| **TOTAL** | **~$156-186** |

*Costs based on light QA usage. Actual costs may vary.*

---

## Troubleshooting

### If Terraform Apply Fails

```bash
# Check the error in logs
cd infrastructure/terraform
tail terraform-apply.log

# Common issues:
# 1. AWS quota limits - check AWS Service Quotas
# 2. VPC limit reached - delete unused VPCs
# 3. EIP limit - request limit increase
```

### Check Current State

```bash
# See what's been created
terraform state list

# Check specific resource
terraform state show aws_vpc.main
```

### Rollback (if needed)

```bash
# Destroy everything
terraform destroy -auto-approve

# This will clean up all resources and stop charges
```

---

## Next Steps After Infrastructure is Ready

1. ✅ Verify all resources created successfully
2. ✅ Retrieve infrastructure outputs
3. ✅ Install Docker Desktop
4. ✅ Update environment configuration files
5. ✅ Build and push Docker images
6. ✅ Deploy applications to ECS
7. ✅ Run database migrations
8. ✅ Test endpoints and functionality

---

## Useful Commands

```bash
# Check Terraform progress
cd infrastructure/terraform
tail -f terraform-apply.log

# Check AWS resources
aws ecs list-clusters
aws rds describe-db-instances
aws s3 ls

# Verify Docker is ready
docker --version
docker ps

# When ready to deploy apps
cd ../..
./infrastructure/scripts/deploy-qa.sh all
```

---

**Estimated Time Remaining**: ~10-12 minutes for infrastructure  
**Next Action**: Install Docker Desktop while infrastructure is being created  
**Documentation**: See [docs/QA_DEPLOYMENT.md](docs/QA_DEPLOYMENT.md) for full details
