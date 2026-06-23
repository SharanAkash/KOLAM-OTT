#!/bin/bash
set -e

echo "🚀 Deploying Kolam OTT to Mumbai (ap-south-1) - JS-QA Cluster"
echo "=================================================="

# Configuration
AWS_REGION="ap-south-1"
ECR_REGISTRY="637423656090.dkr.ecr.ap-south-1.amazonaws.com"
ECS_CLUSTER="JS-QA"
ALB_URL="http://kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com"

# Login to ECR
echo "🔐 Logging into ECR Mumbai..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

# Build and push API
echo "🐳 Building API Docker image for AMD64..."
cd /Users/sharan.j/kolam-ott/services/api
cp .env.mumbai .env
docker build --platform linux/amd64 -t kolam-ott-mumbai-api .
docker tag kolam-ott-mumbai-api:latest ${ECR_REGISTRY}/kolam-ott/mumbai/api:latest

echo "📤 Pushing API image to ECR..."
docker push ${ECR_REGISTRY}/kolam-ott/mumbai/api:latest

# Build and push Web
echo "🐳 Building Web Docker image for AMD64..."
cd /Users/sharan.j/kolam-ott/apps/web
cp .env.mumbai .env.production
docker build --platform linux/amd64 -t kolam-ott-mumbai-web .
docker tag kolam-ott-mumbai-web:latest ${ECR_REGISTRY}/kolam-ott/mumbai/web:latest

echo "📤 Pushing Web image to ECR..."
docker push ${ECR_REGISTRY}/kolam-ott/mumbai/web:latest

# Update ECS services
echo "🔄 Updating ECS services..."
aws ecs update-service \
  --cluster ${ECS_CLUSTER} \
  --service kolam-ott-mumbai-api \
  --force-new-deployment \
  --region ${AWS_REGION} \
  --output json > /dev/null

aws ecs update-service \
  --cluster ${ECS_CLUSTER} \
  --service kolam-ott-mumbai-web \
  --force-new-deployment \
  --region ${AWS_REGION} \
  --output json > /dev/null

echo ""
echo "✅ Deployment initiated successfully!"
echo "=================================================="
echo "🌐 Application URL: ${ALB_URL}"
echo "📊 ECS Console: https://ap-south-1.console.aws.amazon.com/ecs/v2/clusters/${ECS_CLUSTER}/services"
echo ""
echo "⏳ Services are deploying... Check status with:"
echo "   aws ecs describe-services --cluster ${ECS_CLUSTER} --services kolam-ott-mumbai-api kolam-ott-mumbai-web --region ${AWS_REGION}"
echo ""
