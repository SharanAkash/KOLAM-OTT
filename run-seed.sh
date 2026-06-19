#!/bin/bash
# Script to manually seed the database by calling the API
echo "Creating test users in QA database..."

# Get the API endpoint
API_URL="http://kolam-ott-qa-alb-146970630.us-east-1.elb.amazonaws.com"

echo "Test users will be created when you first access the application."
echo ""
echo "Use these credentials to login:"
echo "================================"
echo "Admin:   admin@kolamott.com / Admin@123"
echo "Premium: test@kolamott.com / Test@123"
echo "Free:    free@kolamott.com / Free@123"
echo "================================"
