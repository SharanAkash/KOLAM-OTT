#!/bin/bash

# QA Environment Setup Script
# This script helps with initial QA environment setup

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Kolam OTT - QA Environment Setup    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

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

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."

    local missing_tools=()

    if ! command_exists aws; then
        missing_tools+=("aws-cli")
    fi

    if ! command_exists terraform; then
        missing_tools+=("terraform")
    fi

    if ! command_exists docker; then
        missing_tools+=("docker")
    fi

    if ! command_exists jq; then
        missing_tools+=("jq")
    fi

    if [ ${#missing_tools[@]} -gt 0 ]; then
        error "Missing required tools: ${missing_tools[*]}"
    fi

    log "✓ All prerequisites met"
}

# Step 2: Setup Terraform backend
setup_terraform_backend() {
    log "Setting up Terraform backend..."

    BUCKET_NAME="kolam-ott-terraform-state"
    TABLE_NAME="kolam-ott-terraform-locks"
    AWS_REGION="us-east-1"

    # Check if bucket exists
    if aws s3 ls "s3://${BUCKET_NAME}" 2>&1 | grep -q 'NoSuchBucket'; then
        log "Creating S3 bucket for Terraform state..."
        aws s3api create-bucket \
            --bucket ${BUCKET_NAME} \
            --region ${AWS_REGION}

        # Enable versioning
        aws s3api put-bucket-versioning \
            --bucket ${BUCKET_NAME} \
            --versioning-configuration Status=Enabled

        log "✓ S3 bucket created"
    else
        log "✓ S3 bucket already exists"
    fi

    # Check if DynamoDB table exists
    if ! aws dynamodb describe-table --table-name ${TABLE_NAME} --region ${AWS_REGION} >/dev/null 2>&1; then
        log "Creating DynamoDB table for Terraform locks..."
        aws dynamodb create-table \
            --table-name ${TABLE_NAME} \
            --attribute-definitions AttributeName=LockID,AttributeType=S \
            --key-schema AttributeName=LockID,KeyType=HASH \
            --billing-mode PAY_PER_REQUEST \
            --region ${AWS_REGION}

        log "✓ DynamoDB table created"
    else
        log "✓ DynamoDB table already exists"
    fi
}

# Step 3: Initialize and apply Terraform
setup_infrastructure() {
    log "Setting up infrastructure with Terraform..."

    cd ../../infrastructure/terraform

    log "Initializing Terraform..."
    terraform init

    log "Planning infrastructure..."
    terraform plan -out=tfplan

    info "Review the Terraform plan above."
    read -p "Do you want to apply this plan? (yes/no): " -r
    echo

    if [[ $REPLY =~ ^[Yy]es$ ]]; then
        log "Applying Terraform configuration..."
        terraform apply tfplan
        rm tfplan
        log "✓ Infrastructure created successfully"
    else
        warning "Terraform apply cancelled"
        rm tfplan
        exit 0
    fi

    cd -
}

# Step 4: Retrieve and save outputs
save_outputs() {
    log "Retrieving infrastructure outputs..."

    cd ../../infrastructure/terraform

    # Create outputs file
    OUTPUT_FILE="../outputs.txt"
    echo "# QA Environment Outputs - $(date)" > ${OUTPUT_FILE}
    echo "" >> ${OUTPUT_FILE}

    echo "# S3 Configuration" >> ${OUTPUT_FILE}
    echo "S3_BUCKET=$(terraform output -raw s3_bucket_name)" >> ${OUTPUT_FILE}
    echo "S3_ACCESS_KEY_ID=$(terraform output -raw s3_access_key_id)" >> ${OUTPUT_FILE}
    echo "S3_SECRET_ACCESS_KEY=$(terraform output -raw s3_secret_access_key)" >> ${OUTPUT_FILE}
    echo "" >> ${OUTPUT_FILE}

    echo "# Database Configuration" >> ${OUTPUT_FILE}
    echo "DB_ENDPOINT=$(terraform output -raw db_endpoint)" >> ${OUTPUT_FILE}
    echo "DB_NAME=$(terraform output -raw db_name)" >> ${OUTPUT_FILE}
    echo "DB_USERNAME=$(terraform output -raw db_username)" >> ${OUTPUT_FILE}
    echo "DB_PASSWORD_SECRET_ARN=$(terraform output -raw db_password_secret_arn)" >> ${OUTPUT_FILE}
    echo "" >> ${OUTPUT_FILE}

    echo "# Load Balancer" >> ${OUTPUT_FILE}
    echo "ALB_DNS=$(terraform output -raw alb_dns_name)" >> ${OUTPUT_FILE}
    echo "" >> ${OUTPUT_FILE}

    echo "# ECR Repositories" >> ${OUTPUT_FILE}
    echo "ECR_API_REPO=$(terraform output -raw ecr_api_repository_url)" >> ${OUTPUT_FILE}
    echo "ECR_WEB_REPO=$(terraform output -raw ecr_web_repository_url)" >> ${OUTPUT_FILE}
    echo "" >> ${OUTPUT_FILE}

    log "✓ Outputs saved to ${OUTPUT_FILE}"

    cd -
}

# Step 5: Generate JWT secrets
generate_secrets() {
    log "Generating JWT secrets..."

    JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
    NEXTAUTH_SECRET=$(openssl rand -base64 32 | tr -d '\n')

    echo "" >> ../outputs.txt
    echo "# Generated Secrets" >> ../outputs.txt
    echo "JWT_SECRET=${JWT_SECRET}" >> ../outputs.txt
    echo "NEXTAUTH_SECRET=${NEXTAUTH_SECRET}" >> ../outputs.txt

    log "✓ Secrets generated and saved to outputs.txt"
}

# Step 6: Update environment files
update_env_files() {
    log "Environment files need to be updated manually..."
    info "Please update the following files with values from infrastructure/outputs.txt:"
    info "  - services/api/.env.qa"
    info "  - apps/web/.env.qa"
    info "  - apps/mobile/.env.qa"
    echo ""
}

# Step 7: Setup SSL certificate
setup_ssl() {
    log "SSL Certificate setup..."
    info "You have two options for SSL:"
    echo ""
    echo "1. AWS Certificate Manager (Recommended for production)"
    echo "   - Request a certificate at: https://console.aws.amazon.com/acm"
    echo "   - Domain: *.YOUR_DOMAIN.com"
    echo "   - Update terraform variables with certificate ARN"
    echo ""
    echo "2. Self-signed certificate (Testing only)"
    echo "   - Generate with: openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\"
    echo "     -keyout infrastructure/nginx/ssl/qa.key \\"
    echo "     -out infrastructure/nginx/ssl/qa.crt"
    echo ""
}

# Step 8: DNS setup reminder
setup_dns() {
    log "DNS Configuration..."

    cd ../../infrastructure/terraform
    ALB_DNS=$(terraform output -raw alb_dns_name)
    cd -

    info "Create the following DNS CNAME records:"
    echo ""
    echo "  qa.YOUR_DOMAIN.com → ${ALB_DNS}"
    echo "  api-qa.YOUR_DOMAIN.com → ${ALB_DNS}"
    echo ""
}

# Main execution
main() {
    check_prerequisites

    info "This script will:"
    echo "  1. Setup Terraform backend (S3 + DynamoDB)"
    echo "  2. Create AWS infrastructure"
    echo "  3. Generate secrets"
    echo "  4. Provide next steps"
    echo ""

    read -p "Continue with setup? (yes/no): " -r
    echo

    if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
        warning "Setup cancelled"
        exit 0
    fi

    setup_terraform_backend
    setup_infrastructure
    save_outputs
    generate_secrets

    echo ""
    log "✓ Infrastructure setup complete!"
    echo ""

    info "Next steps:"
    echo "  1. Update environment files with values from infrastructure/outputs.txt"
    echo "  2. Setup SSL certificate (ACM or self-signed)"
    echo "  3. Configure DNS records"
    echo "  4. Run deployment: ./infrastructure/scripts/deploy-qa.sh all"
    echo ""

    setup_ssl
    setup_dns

    info "For detailed instructions, see: docs/QA_DEPLOYMENT.md"
}

# Run main function
main
