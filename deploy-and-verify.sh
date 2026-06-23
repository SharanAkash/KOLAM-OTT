#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION="ap-south-1"
ECR_REGISTRY="637423656090.dkr.ecr.ap-south-1.amazonaws.com"
ECS_CLUSTER="JS-QA"
ALB_URL="http://kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com"
LOG_FILE="deployment-$(date +%Y%m%d-%H%M%S).log"

# Function to log with timestamp
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] INFO:${NC} $1" | tee -a "$LOG_FILE"
}

# Function to verify command success
verify_step() {
    if [ $? -eq 0 ]; then
        log "✅ $1 - SUCCESS"
    else
        log_error "❌ $1 - FAILED"
        exit 1
    fi
}

echo ""
log "🚀 Starting Kolam OTT Deployment to Mumbai (ap-south-1)"
log "============================================================"
log "Deployment log: $LOG_FILE"
echo ""

# Step 1: Login to ECR
log_info "Step 1: Logging into ECR Mumbai..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY} >> "$LOG_FILE" 2>&1
verify_step "ECR Login"

# Step 2: Build and push API
log_info "Step 2: Building API Docker image for AMD64..."
cd /Users/sharan.j/kolam-ott/services/api
cp .env.mumbai .env
docker build --platform linux/amd64 -t kolam-ott-mumbai-api . >> "$LOG_FILE" 2>&1
verify_step "API Docker Build"

docker tag kolam-ott-mumbai-api:latest ${ECR_REGISTRY}/kolam-ott/mumbai/api:latest
log_info "Pushing API image to ECR..."
docker push ${ECR_REGISTRY}/kolam-ott/mumbai/api:latest >> "$LOG_FILE" 2>&1
verify_step "API Docker Push"

# Step 3: Build and push Web
log_info "Step 3: Building Web Docker image for AMD64..."
cd /Users/sharan.j/kolam-ott/apps/web
if [ -f .env.mumbai ]; then
    cp .env.mumbai .env.production
else
    log_warning "Web .env.mumbai not found, using default configuration"
fi
docker build --platform linux/amd64 -t kolam-ott-mumbai-web . >> "$LOG_FILE" 2>&1
verify_step "Web Docker Build"

docker tag kolam-ott-mumbai-web:latest ${ECR_REGISTRY}/kolam-ott/mumbai/web:latest
log_info "Pushing Web image to ECR..."
docker push ${ECR_REGISTRY}/kolam-ott/mumbai/web:latest >> "$LOG_FILE" 2>&1
verify_step "Web Docker Push"

# Step 4: Update ECS services
log_info "Step 4: Updating ECS services..."
cd /Users/sharan.j/kolam-ott

log_info "Updating API service..."
aws ecs update-service \
  --cluster ${ECS_CLUSTER} \
  --service kolam-ott-mumbai-api \
  --force-new-deployment \
  --region ${AWS_REGION} \
  --output json >> "$LOG_FILE" 2>&1
verify_step "API Service Update"

log_info "Updating Web service..."
aws ecs update-service \
  --cluster ${ECS_CLUSTER} \
  --service kolam-ott-mumbai-web \
  --force-new-deployment \
  --region ${AWS_REGION} \
  --output json >> "$LOG_FILE" 2>&1
verify_step "Web Service Update"

echo ""
log "✅ Deployment initiated successfully!"
log "============================================================"
echo ""

# Step 5: Monitor deployment status
log_info "Step 5: Monitoring deployment status..."
echo ""

MAX_WAIT=300  # 5 minutes
ELAPSED=0
INTERVAL=10

while [ $ELAPSED -lt $MAX_WAIT ]; do
    log_info "Checking service status (${ELAPSED}s / ${MAX_WAIT}s)..."

    # Get service status
    STATUS=$(aws ecs describe-services \
        --cluster ${ECS_CLUSTER} \
        --services kolam-ott-mumbai-api kolam-ott-mumbai-web \
        --region ${AWS_REGION} \
        --query 'services[*].[serviceName,runningCount,desiredCount,deployments[0].rolloutState]' \
        --output text 2>&1)

    echo "$STATUS" | tee -a "$LOG_FILE"

    # Check if both services are running
    API_RUNNING=$(echo "$STATUS" | grep "kolam-ott-mumbai-api" | awk '{print $2}')
    API_DESIRED=$(echo "$STATUS" | grep "kolam-ott-mumbai-api" | awk '{print $3}')
    WEB_RUNNING=$(echo "$STATUS" | grep "kolam-ott-mumbai-web" | awk '{print $2}')
    WEB_DESIRED=$(echo "$STATUS" | grep "kolam-ott-mumbai-web" | awk '{print $3}')

    if [ "$API_RUNNING" == "$API_DESIRED" ] && [ "$WEB_RUNNING" == "$WEB_DESIRED" ] && [ "$API_RUNNING" -gt 0 ]; then
        log "✅ Both services are running (API: $API_RUNNING/$API_DESIRED, Web: $WEB_RUNNING/$WEB_DESIRED)"
        break
    else
        log_warning "Services not ready yet (API: $API_RUNNING/$API_DESIRED, Web: $WEB_RUNNING/$WEB_DESIRED)"
    fi

    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
done

echo ""

# Step 6: Verify health endpoints
log_info "Step 6: Verifying health endpoints..."
echo ""

# Test API health
log_info "Testing API health endpoint..."
API_HEALTH=$(curl -s -w "\n%{http_code}" ${ALB_URL}/api/auth/health 2>&1)
HTTP_CODE=$(echo "$API_HEALTH" | tail -1)
RESPONSE=$(echo "$API_HEALTH" | head -1)

echo "$RESPONSE" | tee -a "$LOG_FILE"

if [ "$HTTP_CODE" == "200" ]; then
    log "✅ API health check - SUCCESS (HTTP $HTTP_CODE)"
else
    log_error "API health check - FAILED (HTTP $HTTP_CODE)"
fi

# Test Web
log_info "Testing Web frontend..."
WEB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" ${ALB_URL}/ 2>&1)
if [ "$WEB_STATUS" == "200" ] || [ "$WEB_STATUS" == "304" ]; then
    log "✅ Web frontend - SUCCESS (HTTP $WEB_STATUS)"
else
    log_warning "Web frontend - Response code: $WEB_STATUS (may still be loading)"
fi

echo ""

# Step 7: Check target health
log_info "Step 7: Checking target group health..."
echo ""

log_info "API target group health:"
aws elbv2 describe-target-health \
    --target-group-arn arn:aws:elasticloadbalancing:ap-south-1:637423656090:targetgroup/kolam-ott-mumbai-api-tg/9cad90812ce00eaf \
    --region ${AWS_REGION} \
    --query 'TargetHealthDescriptions[*].[Target.Id,TargetHealth.State,TargetHealth.Reason]' \
    --output table | tee -a "$LOG_FILE"

log_info "Web target group health:"
aws elbv2 describe-target-health \
    --target-group-arn arn:aws:elasticloadbalancing:ap-south-1:637423656090:targetgroup/kolam-ott-mumbai-web-tg/239504e7020966a7 \
    --region ${AWS_REGION} \
    --query 'TargetHealthDescriptions[*].[Target.Id,TargetHealth.State,TargetHealth.Reason]' \
    --output table | tee -a "$LOG_FILE"

echo ""

# Step 8: Check CloudWatch logs for errors
log_info "Step 8: Checking recent logs for errors..."
echo ""

log_info "Recent API logs (last 5 minutes):"
aws logs tail /ecs/kolam-ott-mumbai-api \
    --region ${AWS_REGION} \
    --since 5m \
    --format short 2>&1 | tail -20 | tee -a "$LOG_FILE"

echo ""

log_info "Recent Web logs (last 5 minutes):"
aws logs tail /ecs/kolam-ott-mumbai-web \
    --region ${AWS_REGION} \
    --since 5m \
    --format short 2>&1 | tail -20 | tee -a "$LOG_FILE"

echo ""

# Summary
log "============================================================"
log "📊 DEPLOYMENT SUMMARY"
log "============================================================"
log "🌐 Application URL: ${ALB_URL}"
log "🔐 Admin Login: ${ALB_URL}/login"
log "🏥 API Health: ${ALB_URL}/api/auth/health"
log "📋 Full logs saved to: $LOG_FILE"
echo ""
log "📖 Next Steps:"
log "   1. Verify login works: ${ALB_URL}/login"
log "   2. Test credentials: admin@kolamott.com / Admin@123"
log "   3. If needed, seed database: ./seed-mumbai.sh"
log "   4. Test file upload in admin dashboard"
echo ""
log "📊 Monitor with:"
log "   aws logs tail /ecs/kolam-ott-mumbai-api --region ${AWS_REGION} --follow"
log "   aws logs tail /ecs/kolam-ott-mumbai-web --region ${AWS_REGION} --follow"
echo ""
log "✅ Deployment completed!"
log "============================================================"
