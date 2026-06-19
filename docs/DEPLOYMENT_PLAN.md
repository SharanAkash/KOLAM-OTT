# QA Environment Deployment Plan

## Status: Ready to Deploy Infrastructure

**Date**: June 18, 2026  
**AWS Account**: 637423656090  
**Region**: us-east-1

---

## Infrastructure Components

### 1. Networking (VPC)
- **VPC**: 10.1.0.0/16
- **Public Subnets**: 2 (us-east-1a, us-east-1b) - for ALB
- **Private Subnets**: 2 (us-east-1a, us-east-1b) - for ECS tasks and RDS
- **NAT Gateways**: 2 (one per AZ for HA)
- **Internet Gateway**: 1
- **VPC Flow Logs**: Enabled (CloudWatch)

### 2. Database
- **Type**: RDS PostgreSQL 15.5
- **Instance**: db.t3.micro
- **Storage**: 20GB gp3 (encrypted)
- **Multi-AZ**: No (cost-saving for QA)
- **Backups**: 7-day retention
- **Monitoring**: Enhanced monitoring enabled

### 3. Storage
- **S3 Bucket**: kolam-ott-qa-videos
- **Versioning**: Enabled
- **Encryption**: AES256
- **Lifecycle Policies**:
  - 90 days → STANDARD_IA
  - 180 days → GLACIER
- **CORS**: Configured for QA domains

### 4. Container Registry
- **ECR Repositories**: 
  - kolam-ott/qa/api
  - kolam-ott/qa/web
- **Image Scanning**: Enabled
- **Lifecycle**: Keep last 10 images

### 5. Compute (ECS)
- **Cluster**: kolam-ott-qa
- **Container Insights**: Enabled
- **API Service**:
  - CPU: 512 units (0.5 vCPU)
  - Memory: 1024 MB
- **Web Service**:
  - CPU: 256 units (0.25 vCPU)
  - Memory: 512 MB

### 6. Load Balancer
- **Type**: Application Load Balancer
- **Scheme**: Internet-facing
- **HTTP**: Port 80 (redirects to HTTPS if cert provided)
- **HTTPS**: Port 443 (if certificate ARN provided)
- **Health Checks**: Enabled

### 7. Security
- **Security Groups**: Configured for least-privilege access
- **Secrets Manager**: Database credentials stored securely
- **IAM Roles**: ECS task execution and task roles
- **S3 Bucket**: Public access blocked

### 8. Monitoring
- **CloudWatch Logs**: 7-day retention
  - VPC Flow Logs
  - ECS API logs
  - ECS Web logs
- **RDS Enhanced Monitoring**: 60-second intervals
- **Performance Insights**: Enabled

---

## Estimated Monthly Costs

### Compute & Networking
- **NAT Gateway**: ~$64/month (2 x $32)
- **ECS Fargate**: ~$30-50/month (based on usage)
- **ALB**: ~$25/month

### Database & Storage
- **RDS db.t3.micro**: ~$17/month
- **S3 Storage**: ~$5-20/month (based on content)
- **RDS Backups**: ~$5/month

### Monitoring & Logs
- **CloudWatch Logs**: ~$5/month
- **VPC Flow Logs**: ~$5/month

**Total Estimated**: ~$156-186/month

*Note: Costs vary based on usage, data transfer, and storage. This is an estimate for light QA usage.*

---

## Cost Optimization Tips

1. **Stop environment after hours**: Stop ECS tasks and RDS instance when not in use
2. **Use single NAT Gateway**: Reduce to 1 NAT Gateway for QA ($32/month savings)
3. **Reduce log retention**: Use 3-day retention instead of 7 ($2-3/month savings)
4. **S3 lifecycle**: Aggressively move to cheaper storage tiers

---

## Deployment Steps

### Current Progress: ✅ 40% Complete

- ✅ AWS credentials configured
- ✅ Terraform installed
- ✅ S3 backend created
- ✅ DynamoDB lock table created
- ✅ Terraform initialized
- ✅ Configuration validated
- ⏳ Terraform plan created
- ⏳ Waiting for Docker Desktop
- ⏳ Infrastructure apply pending
- ⏳ Container images build pending
- ⏳ Application deployment pending

### Next Steps

1. **Review Terraform Plan** (Current)
   - Verify resources to be created
   - Confirm costs are acceptable

2. **Apply Infrastructure** (~15 minutes)
   ```bash
   terraform apply tfplan
   ```

3. **Install Docker Desktop**
   - Required for building container images
   - Download from: https://www.docker.com/products/docker-desktop

4. **Configure Environment Variables**
   - Update database connection strings
   - Add S3 credentials
   - Generate JWT secrets

5. **Build & Push Docker Images** (~10 minutes)
   ```bash
   cd ../..
   ./infrastructure/scripts/deploy-qa.sh all
   ```

6. **Verify Deployment** (~5 minutes)
   - Check health endpoints
   - Test basic functionality

---

## Security Checklist

- [ ] Database password stored in Secrets Manager
- [ ] S3 bucket encryption enabled
- [ ] Security groups configured (least-privilege)
- [ ] VPC Flow Logs enabled
- [ ] IAM roles follow least-privilege
- [ ] JWT secrets generated securely
- [ ] SSL certificate configured (if using custom domain)
- [ ] CORS properly configured

---

## Post-Deployment Configuration

### DNS Setup (if using custom domain)
```
# Create these CNAME records:
qa.YOUR_DOMAIN.com → [ALB-DNS-NAME]
api-qa.YOUR_DOMAIN.com → [ALB-DNS-NAME]
```

### Environment Files to Update
1. `services/api/.env.qa`
2. `apps/web/.env.qa`
3. `apps/mobile/.env.qa`

### Database Migrations
```bash
# After deployment, run:
npx prisma migrate deploy
```

---

## Rollback Plan

If deployment fails or issues occur:

```bash
# Rollback infrastructure
cd infrastructure/terraform
terraform destroy

# Clean up backend
aws s3 rm s3://kolam-ott-terraform-state --recursive
aws dynamodb delete-table --table-name kolam-ott-terraform-locks
```

---

## Support Resources

- **AWS Console**: https://console.aws.amazon.com
- **Deployment Guide**: [docs/QA_DEPLOYMENT.md](docs/QA_DEPLOYMENT.md)
- **Terraform Docs**: https://registry.terraform.io/providers/hashicorp/aws/latest/docs

---

**Ready to proceed?** Once the Terraform plan is complete and Docker is installed, we can apply the infrastructure and deploy the applications.
