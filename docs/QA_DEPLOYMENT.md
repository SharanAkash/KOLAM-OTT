# QA Environment Deployment Guide

## Overview

This document provides comprehensive instructions for setting up and deploying the Kolam OTT platform to the QA environment on AWS.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Initial Infrastructure Setup](#initial-infrastructure-setup)
4. [Configuration](#configuration)
5. [Deployment Methods](#deployment-methods)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance](#maintenance)

## Prerequisites

### Required Tools

- **AWS CLI** (v2.x or later)
- **Terraform** (v1.5.0 or later)
- **Docker** (v20.x or later)
- **Node.js** (v18.x or later)
- **jq** (for JSON processing)

### AWS Account Setup

1. AWS account with appropriate permissions
2. IAM user with programmatic access
3. Following AWS services access:
   - ECS (Elastic Container Service)
   - ECR (Elastic Container Registry)
   - RDS (PostgreSQL)
   - S3
   - VPC
   - Application Load Balancer
   - CloudWatch
   - Secrets Manager

### AWS Credentials Configuration

```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and region (us-east-1)
```

## Architecture Overview

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Internet                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Application Load Balancer                       │
│  • HTTPS (443) → API & Web                                  │
│  • SSL Termination                                          │
└──────────────┬───────────────────────────┬──────────────────┘
               │                           │
               ▼                           ▼
┌──────────────────────────┐  ┌──────────────────────────────┐
│   ECS Service - API      │  │   ECS Service - Web          │
│   • Port: 3001           │  │   • Port: 3000               │
│   • NestJS Backend       │  │   • Next.js Frontend         │
└──────────────┬───────────┘  └──────────────────────────────┘
               │
               ▼
┌──────────────────────────┐  ┌──────────────────────────────┐
│   RDS PostgreSQL         │  │   AWS S3                     │
│   • db.t3.micro          │  │   • Video Storage            │
│   • Multi-AZ: No (QA)    │  │   • Image Storage            │
└──────────────────────────┘  └──────────────────────────────┘
```

### Network Architecture

- **VPC**: 10.1.0.0/16
- **Public Subnets**: 2 AZs (for ALB)
- **Private Subnets**: 2 AZs (for ECS, RDS)
- **NAT Gateways**: 2 (one per AZ)

## Initial Infrastructure Setup

### Step 1: Create Terraform Backend (One-time setup)

```bash
# Create S3 bucket for Terraform state
aws s3api create-bucket \
  --bucket kolam-ott-terraform-state \
  --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket kolam-ott-terraform-state \
  --versioning-configuration Status=Enabled

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name kolam-ott-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### Step 2: Initialize Terraform

```bash
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Review the plan
terraform plan

# Apply the infrastructure
terraform apply
```

**Note**: Terraform will create:
- VPC with public/private subnets
- RDS PostgreSQL instance
- S3 bucket for videos
- ECR repositories
- ECS cluster
- Application Load Balancer
- Security groups and IAM roles

### Step 3: Retrieve Infrastructure Outputs

```bash
# Get S3 credentials
terraform output -raw s3_access_key_id
terraform output -raw s3_secret_access_key

# Get RDS endpoint
terraform output db_endpoint

# Get DB password from Secrets Manager
aws secretsmanager get-secret-value \
  --secret-id kolam-ott-qa-db-password \
  --query SecretString \
  --output text | jq -r .password
```

## Configuration

### Step 1: Update Environment Files

Replace placeholders in the following files with actual values:

#### 1. API Environment ([services/api/.env.qa](../services/api/.env.qa))

```bash
# Update with actual values:
DATABASE_URL="postgresql://kolam_qa:ACTUAL_PASSWORD@RDS_ENDPOINT:5432/kolam_ott_qa?schema=public"
AWS_ACCESS_KEY_ID=ACTUAL_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=ACTUAL_SECRET_KEY
AWS_S3_BUCKET=kolam-ott-qa-videos
JWT_SECRET=GENERATE_SECURE_JWT_SECRET
```

**Generate JWT Secret:**
```bash
openssl rand -base64 64
```

#### 2. Web Environment ([apps/web/.env.qa](../apps/web/.env.qa))

```bash
# Update with actual values:
NEXT_PUBLIC_API_URL=https://api-qa.YOUR_DOMAIN.com
NEXT_PUBLIC_WEB_URL=https://qa.YOUR_DOMAIN.com
NEXTAUTH_URL=https://qa.YOUR_DOMAIN.com
NEXTAUTH_SECRET=GENERATE_SECURE_SECRET
```

#### 3. Mobile Environment ([apps/mobile/.env.qa](../apps/mobile/.env.qa))

```bash
# Update with actual values:
API_URL=https://api-qa.YOUR_DOMAIN.com
```

### Step 2: SSL Certificate Setup

#### Option A: Using AWS Certificate Manager (Recommended)

```bash
# Request certificate
aws acm request-certificate \
  --domain-name "*.YOUR_DOMAIN.com" \
  --validation-method DNS \
  --region us-east-1

# Get certificate ARN and update Terraform variables
```

#### Option B: Using Self-Signed Certificate (Testing only)

```bash
# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout infrastructure/nginx/ssl/qa.key \
  -out infrastructure/nginx/ssl/qa.crt
```

### Step 3: DNS Configuration

Create DNS records pointing to the ALB:

```bash
# Get ALB DNS name
terraform output alb_dns_name

# Create CNAME records:
# qa.YOUR_DOMAIN.com → ALB_DNS_NAME
# api-qa.YOUR_DOMAIN.com → ALB_DNS_NAME
```

## Deployment Methods

### Method 1: Manual Deployment (Script-based)

```bash
# Make script executable
chmod +x infrastructure/scripts/deploy-qa.sh

# Deploy everything
./infrastructure/scripts/deploy-qa.sh all

# Deploy only API
./infrastructure/scripts/deploy-qa.sh api

# Deploy only Web
./infrastructure/scripts/deploy-qa.sh web
```

### Method 2: GitHub Actions CI/CD

#### Setup GitHub Secrets

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add the following secrets:

```
AWS_ROLE_ARN=arn:aws:iam::ACCOUNT_ID:role/github-actions-role
```

#### Automatic Deployment

The GitHub Actions workflow ([.github/workflows/deploy-qa.yml](../.github/workflows/deploy-qa.yml)) automatically deploys when:

- Code is pushed to `dev` or `qa` branch
- Manual workflow dispatch is triggered

#### Manual Workflow Dispatch

1. Go to Actions tab in GitHub
2. Select "Deploy to QA Environment"
3. Click "Run workflow"
4. Choose service to deploy (api, web, or all)

### Method 3: Docker Compose (Local Testing)

For local QA environment testing:

```bash
# Set environment variables
export QA_DB_PASSWORD=your_secure_password

# Start services
docker-compose -f docker-compose.qa.yml up -d

# View logs
docker-compose -f docker-compose.qa.yml logs -f

# Stop services
docker-compose -f docker-compose.qa.yml down
```

## Post-Deployment

### 1. Database Migrations

```bash
# SSH into API container or run via ECS Exec
npx prisma migrate deploy

# Seed initial data (if needed)
npx prisma db seed
```

### 2. Verification Checklist

- [ ] API health check: `https://api-qa.YOUR_DOMAIN.com/health`
- [ ] Web application: `https://qa.YOUR_DOMAIN.com`
- [ ] Database connectivity
- [ ] S3 upload/download functionality
- [ ] User registration and login
- [ ] Video upload and streaming

### 3. Smoke Tests

```bash
# API health check
curl https://api-qa.YOUR_DOMAIN.com/health

# Test user registration (example)
curl -X POST https://api-qa.YOUR_DOMAIN.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "name": "Test User"
  }'
```

### 4. Monitoring Setup

1. **CloudWatch Logs**: Check logs for errors
   ```bash
   aws logs tail /ecs/kolam-ott-qa-api --follow
   ```

2. **ECS Service Status**:
   ```bash
   aws ecs describe-services \
     --cluster kolam-ott-qa \
     --services api web
   ```

3. **RDS Monitoring**: Check CloudWatch metrics for database performance

## Troubleshooting

### Common Issues

#### 1. ECS Tasks Failing to Start

**Symptoms**: Tasks immediately stop after starting

**Solutions**:
```bash
# Check task logs
aws ecs describe-tasks \
  --cluster kolam-ott-qa \
  --tasks TASK_ARN

# Check CloudWatch logs
aws logs tail /ecs/kolam-ott-qa-api --follow
```

Common causes:
- Database connection issues
- Missing environment variables
- Image pull errors from ECR

#### 2. Database Connection Issues

**Symptoms**: API returns 500 errors, logs show database connection timeout

**Solutions**:
- Verify security group allows traffic from ECS tasks to RDS
- Check DATABASE_URL is correct
- Verify RDS instance is running

```bash
# Test connectivity from ECS task
aws ecs execute-command \
  --cluster kolam-ott-qa \
  --task TASK_ARN \
  --container api \
  --command "nc -zv RDS_ENDPOINT 5432" \
  --interactive
```

#### 3. S3 Upload Failures

**Symptoms**: Video/image uploads fail

**Solutions**:
- Verify IAM credentials have S3 permissions
- Check S3 bucket CORS configuration
- Verify bucket policy allows uploads

```bash
# Test S3 access
aws s3 ls s3://kolam-ott-qa-videos
```

#### 4. SSL Certificate Issues

**Symptoms**: HTTPS not working, certificate warnings

**Solutions**:
- Verify ACM certificate is issued and validated
- Check ALB listener has correct certificate ARN
- Verify DNS records point to ALB

### Debug Commands

```bash
# View ECS service events
aws ecs describe-services \
  --cluster kolam-ott-qa \
  --services api \
  --query 'services[0].events' \
  --output table

# Get running task IDs
aws ecs list-tasks \
  --cluster kolam-ott-qa \
  --service-name api

# Execute command in running container
aws ecs execute-command \
  --cluster kolam-ott-qa \
  --task TASK_ARN \
  --container api \
  --command "/bin/sh" \
  --interactive

# Check ALB target health
aws elbv2 describe-target-health \
  --target-group-arn TARGET_GROUP_ARN
```

## Maintenance

### Regular Tasks

#### Daily
- Monitor CloudWatch logs for errors
- Check ECS service status

#### Weekly
- Review RDS performance metrics
- Check S3 storage usage and costs
- Review ALB access logs

#### Monthly
- Update Docker base images
- Apply security patches
- Review and optimize costs

### Backup and Recovery

#### Database Backups

RDS automated backups are configured with 7-day retention.

```bash
# Create manual snapshot
aws rds create-db-snapshot \
  --db-instance-identifier kolam-ott-qa \
  --db-snapshot-identifier kolam-ott-qa-manual-$(date +%Y%m%d)

# List snapshots
aws rds describe-db-snapshots \
  --db-instance-identifier kolam-ott-qa
```

#### S3 Backups

S3 versioning is enabled for the videos bucket.

```bash
# List object versions
aws s3api list-object-versions \
  --bucket kolam-ott-qa-videos
```

### Scaling

#### Scale ECS Services

```bash
# Scale API service
aws ecs update-service \
  --cluster kolam-ott-qa \
  --service api \
  --desired-count 3

# Scale Web service
aws ecs update-service \
  --cluster kolam-ott-qa \
  --service web \
  --desired-count 2
```

#### Upgrade RDS Instance

```bash
# Modify RDS instance class
aws rds modify-db-instance \
  --db-instance-identifier kolam-ott-qa \
  --db-instance-class db.t3.small \
  --apply-immediately
```

### Cost Optimization

1. **Stop environment during non-working hours** (optional for QA):
   ```bash
   # Stop ECS services
   aws ecs update-service --cluster kolam-ott-qa --service api --desired-count 0
   aws ecs update-service --cluster kolam-ott-qa --service web --desired-count 0
   
   # Stop RDS instance
   aws rds stop-db-instance --db-instance-identifier kolam-ott-qa
   ```

2. **Review S3 lifecycle policies**: Old videos automatically move to cheaper storage tiers

3. **Monitor unused resources**: Use AWS Cost Explorer to identify optimization opportunities

## Security Best Practices

1. **Rotate credentials regularly**:
   - Database passwords
   - JWT secrets
   - AWS access keys

2. **Enable MFA** for AWS account

3. **Review security groups** periodically

4. **Enable AWS CloudTrail** for audit logging

5. **Use AWS Secrets Manager** for sensitive data

6. **Enable VPC Flow Logs** for network monitoring

## Support and Resources

- **AWS Documentation**: https://docs.aws.amazon.com
- **Terraform Documentation**: https://www.terraform.io/docs
- **ECS Best Practices**: https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide

## Rollback Procedure

If deployment issues occur:

```bash
# Rollback to previous task definition
aws ecs update-service \
  --cluster kolam-ott-qa \
  --service api \
  --task-definition kolam-ott-qa-api:PREVIOUS_REVISION

# Or rollback database migrations
npx prisma migrate resolve --rolled-back MIGRATION_NAME
```

## Contact

For deployment issues or questions, contact the DevOps team or refer to the project documentation.
