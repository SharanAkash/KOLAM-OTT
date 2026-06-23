#!/bin/bash
set -e

echo "🔄 Running Prisma migrations in ECS standalone task..."

AWS_REGION="ap-south-1"
CLUSTER="JS-QA"
TASK_DEF="kolam-ott-mumbai-api"

# Get subnet and security group from running service
echo "📋 Getting network configuration from running service..."
NETWORK_CONFIG=$(aws ecs describe-services \
  --cluster ${CLUSTER} \
  --services kolam-ott-mumbai-api \
  --region ${AWS_REGION} \
  --query 'services[0].networkConfiguration.awsvpcConfiguration' \
  --output json)

SUBNETS=$(echo "$NETWORK_CONFIG" | jq -r '.subnets | join(",")')
SECURITY_GROUPS=$(echo "$NETWORK_CONFIG" | jq -r '.securityGroups | join(",")')

echo "Subnets: $SUBNETS"
echo "Security Groups: $SECURITY_GROUPS"

# Run standalone task to execute migrations
echo "🚀 Starting migration task..."
TASK_ARN=$(aws ecs run-task \
  --cluster ${CLUSTER} \
  --task-definition ${TASK_DEF} \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNETS],securityGroups=[$SECURITY_GROUPS],assignPublicIp=ENABLED}" \
  --overrides '{
    "containerOverrides": [{
      "name": "kolam-ott-api",
      "command": ["sh", "-c", "npx prisma migrate deploy && npm run seed:prod"]
    }]
  }' \
  --region ${AWS_REGION} \
  --query 'tasks[0].taskArn' \
  --output text)

echo "📦 Task ARN: $TASK_ARN"
TASK_ID=$(echo "$TASK_ARN" | rev | cut -d'/' -f1 | rev)
echo "📦 Task ID: $TASK_ID"

# Wait for task to complete
echo "⏳ Waiting for migrations to complete..."
aws ecs wait tasks-stopped \
  --cluster ${CLUSTER} \
  --tasks ${TASK_ID} \
  --region ${AWS_REGION}

# Get task exit code
EXIT_CODE=$(aws ecs describe-tasks \
  --cluster ${CLUSTER} \
  --tasks ${TASK_ID} \
  --region ${AWS_REGION} \
  --query 'tasks[0].containers[0].exitCode' \
  --output text)

echo ""
echo "📋 Migration task logs:"
aws logs tail /ecs/kolam-ott-mumbai-api \
  --region ${AWS_REGION} \
  --since 5m \
  --format short | grep -A 50 "prisma\|migration\|seed" || true

echo ""
if [ "$EXIT_CODE" == "0" ]; then
    echo "✅ Migrations and seeding completed successfully!"
else
    echo "❌ Migration task failed with exit code: $EXIT_CODE"
    exit 1
fi

echo ""
echo "Test Users Created:"
echo "==================="
echo "👑 Admin:   admin@kolamott.com / Admin@123"
echo "💎 Premium: premium@kolamott.com / Premium@123"
echo "🆓 Free:    free@kolamott.com / Free@123"
echo ""
echo "Login at: http://kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com/login"
