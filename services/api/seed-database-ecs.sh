#!/bin/bash
set -e

echo "🌱 Seeding database via ECS task..."

AWS_REGION="ap-south-1"
CLUSTER="JS-QA"
TASK_DEF="kolam-ott-mumbai-api"

# Get network config
NETWORK_CONFIG=$(aws ecs describe-services \
  --cluster ${CLUSTER} \
  --services kolam-ott-mumbai-api \
  --region ${AWS_REGION} \
  --query 'services[0].networkConfiguration.awsvpcConfiguration' \
  --output json)

SUBNETS=$(echo "$NETWORK_CONFIG" | jq -r '.subnets | join(",")')
SECURITY_GROUPS=$(echo "$NETWORK_CONFIG" | jq -r '.securityGroups | join(",")')

# Run seeding task
echo "🚀 Starting seed task..."
TASK_ARN=$(aws ecs run-task \
  --cluster ${CLUSTER} \
  --task-definition ${TASK_DEF} \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNETS],securityGroups=[$SECURITY_GROUPS],assignPublicIp=ENABLED}" \
  --overrides '{
    "containerOverrides": [{
      "name": "kolam-ott-api",
      "command": ["node", "seed-prod.js"]
    }]
  }' \
  --region ${AWS_REGION} \
  --query 'tasks[0].taskArn' \
  --output text)

TASK_ID=$(echo "$TASK_ARN" | rev | cut -d'/' -f1 | rev)
echo "📦 Task ID: $TASK_ID"

# Wait for completion
echo "⏳ Waiting for seeding to complete..."
aws ecs wait tasks-stopped \
  --cluster ${CLUSTER} \
  --tasks ${TASK_ID} \
  --region ${AWS_REGION}

# Check result
EXIT_CODE=$(aws ecs describe-tasks \
  --cluster ${CLUSTER} \
  --tasks ${TASK_ID} \
  --region ${AWS_REGION} \
  --query 'tasks[0].containers[0].exitCode' \
  --output text)

echo ""
echo "📋 Seed task logs:"
aws logs tail /ecs/kolam-ott-mumbai-api \
  --region ${AWS_REGION} \
  --since 3m \
  --format short | grep -A 20 "Seeding\|Created\|seed" || true

echo ""
if [ "$EXIT_CODE" == "0" ]; then
    echo "✅ Database seeded successfully!"
    echo ""
    echo "Test Users Created:"
    echo "==================="
    echo "👑 Admin:   admin@kolamott.com / Admin@123"
    echo "💎 Premium: premium@kolamott.com / Premium@123"
    echo "🆓 Free:    free@kolamott.com / Free@123"
else
    echo "❌ Seed task failed with exit code: $EXIT_CODE"
    exit 1
fi
