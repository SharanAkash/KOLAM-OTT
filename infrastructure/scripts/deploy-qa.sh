#!/bin/bash

# QA Deployment Script for Kolam OTT Platform
# Usage: ./deploy-qa.sh [api|web|all]

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION=${AWS_REGION:-us-east-1}
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
PROJECT_NAME="kolam-ott"
ENVIRONMENT="qa"
TIMESTAMP=$(date +%Y%m%d%H%M%S)

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Kolam OTT - QA Deployment Script     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."

    command -v aws >/dev/null 2>&1 || error "AWS CLI is not installed"
    command -v docker >/dev/null 2>&1 || error "Docker is not installed"
    command -v jq >/dev/null 2>&1 || error "jq is not installed"

    aws sts get-caller-identity >/dev/null 2>&1 || error "AWS credentials not configured"

    log "✓ All prerequisites met"
}

# Build and push Docker image
build_and_push() {
    local service=$1
    local context_path=$2

    log "Building ${service} Docker image..."

    ECR_REPO="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${PROJECT_NAME}/${ENVIRONMENT}/${service}"
    IMAGE_TAG="${TIMESTAMP}"

    # Login to ECR
    aws ecr get-login-password --region ${AWS_REGION} | \
        docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

    # Build Docker image
    docker build -t ${ECR_REPO}:${IMAGE_TAG} \
        -t ${ECR_REPO}:latest \
        -f ${context_path}/Dockerfile \
        ${context_path}

    # Push to ECR
    log "Pushing ${service} image to ECR..."
    docker push ${ECR_REPO}:${IMAGE_TAG}
    docker push ${ECR_REPO}:latest

    log "✓ ${service} image pushed successfully"
    echo ${IMAGE_TAG}
}

# Update ECS service
update_ecs_service() {
    local service_name=$1
    local image_tag=$2

    log "Updating ECS service: ${service_name}..."

    # Get current task definition
    TASK_FAMILY="${PROJECT_NAME}-${ENVIRONMENT}-${service_name}"
    CURRENT_TASK_DEF=$(aws ecs describe-task-definition \
        --task-definition ${TASK_FAMILY} \
        --region ${AWS_REGION})

    # Create new task definition with updated image
    NEW_TASK_DEF=$(echo $CURRENT_TASK_DEF | jq --arg IMAGE "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${PROJECT_NAME}/${ENVIRONMENT}/${service_name}:${image_tag}" \
        '.taskDefinition |
        .containerDefinitions[0].image = $IMAGE |
        del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .compatibilities, .registeredAt, .registeredBy)')

    # Register new task definition
    NEW_TASK_INFO=$(aws ecs register-task-definition \
        --region ${AWS_REGION} \
        --cli-input-json "$NEW_TASK_DEF")

    NEW_REVISION=$(echo $NEW_TASK_INFO | jq -r '.taskDefinition.revision')

    # Update ECS service
    aws ecs update-service \
        --cluster ${PROJECT_NAME}-${ENVIRONMENT} \
        --service ${service_name} \
        --task-definition ${TASK_FAMILY}:${NEW_REVISION} \
        --region ${AWS_REGION} \
        --force-new-deployment \
        >/dev/null

    log "✓ ECS service updated to revision ${NEW_REVISION}"
}

# Wait for deployment to stabilize
wait_for_deployment() {
    local service_name=$1

    log "Waiting for ${service_name} deployment to stabilize..."

    aws ecs wait services-stable \
        --cluster ${PROJECT_NAME}-${ENVIRONMENT} \
        --services ${service_name} \
        --region ${AWS_REGION}

    log "✓ ${service_name} deployment completed successfully"
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."

    # Get the latest API task ARN
    TASK_ARN=$(aws ecs list-tasks \
        --cluster ${PROJECT_NAME}-${ENVIRONMENT} \
        --service-name api \
        --region ${AWS_REGION} \
        --query 'taskArns[0]' \
        --output text)

    if [ "$TASK_ARN" != "None" ]; then
        # Execute migration command
        aws ecs execute-command \
            --cluster ${PROJECT_NAME}-${ENVIRONMENT} \
            --task ${TASK_ARN} \
            --container api \
            --command "npx prisma migrate deploy" \
            --interactive \
            --region ${AWS_REGION}

        log "✓ Database migrations completed"
    else
        warning "No running API task found, skipping migrations"
    fi
}

# Deploy API
deploy_api() {
    log "Deploying API service..."
    IMAGE_TAG=$(build_and_push "api" "../../services/api")
    update_ecs_service "api" ${IMAGE_TAG}
    wait_for_deployment "api"
    run_migrations
    log "✓ API deployment completed"
}

# Deploy Web
deploy_web() {
    log "Deploying Web service..."
    IMAGE_TAG=$(build_and_push "web" "../../apps/web")
    update_ecs_service "web" ${IMAGE_TAG}
    wait_for_deployment "web"
    log "✓ Web deployment completed"
}

# Health check
health_check() {
    log "Running health checks..."

    ALB_DNS=$(aws elbv2 describe-load-balancers \
        --region ${AWS_REGION} \
        --query "LoadBalancers[?LoadBalancerName=='${PROJECT_NAME}-${ENVIRONMENT}-alb'].DNSName" \
        --output text)

    if [ -n "$ALB_DNS" ]; then
        log "API Health: https://api-qa.YOUR_DOMAIN.com/health"
        log "Web Health: https://qa.YOUR_DOMAIN.com"
        log "ALB DNS: ${ALB_DNS}"
    fi

    log "✓ Health check information provided"
}

# Main deployment logic
main() {
    check_prerequisites

    DEPLOY_TARGET=${1:-all}

    case $DEPLOY_TARGET in
        api)
            deploy_api
            ;;
        web)
            deploy_web
            ;;
        all)
            deploy_api
            deploy_web
            ;;
        *)
            error "Invalid deployment target. Use: api, web, or all"
            ;;
    esac

    health_check

    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  QA Deployment Completed Successfully  ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
}

# Run main function
main "$@"
