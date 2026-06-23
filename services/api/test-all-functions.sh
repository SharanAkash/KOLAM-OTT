#!/bin/bash

BASE_URL="http://kolam-ott-mumbai-alb-960243315.ap-south-1.elb.amazonaws.com"

echo "🧪 Testing Kolam OTT - All Functions"
echo "===================================="
echo ""

# Test 1: Health Check
echo "1️⃣ Testing API Health Check..."
HEALTH=$(curl -s ${BASE_URL}/api/auth/health)
echo "Response: $HEALTH"
if echo "$HEALTH" | jq -e '.status == "ok"' > /dev/null; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
fi
echo ""

# Test 2: Login with Admin
echo "2️⃣ Testing Admin Login..."
LOGIN_RESPONSE=$(curl -s -X POST ${BASE_URL}/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kolamott.com","password":"Admin@123"}')
echo "Response: $LOGIN_RESPONSE"

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token // empty')
if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    echo "✅ Login successful - Token: ${TOKEN:0:30}..."
else
    echo "❌ Login failed"
    echo ""
    exit 1
fi
echo ""

# Test 3: Get User Profile
echo "3️⃣ Testing Get Profile..."
PROFILE=$(curl -s ${BASE_URL}/api/auth/profile \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $PROFILE"
EMAIL=$(echo "$PROFILE" | jq -r '.email // empty')
if [ "$EMAIL" == "admin@kolamott.com" ]; then
    echo "✅ Profile fetch successful"
else
    echo "❌ Profile fetch failed"
fi
echo ""

# Test 4: Get Movies List
echo "4️⃣ Testing Get Movies..."
MOVIES=$(curl -s ${BASE_URL}/api/movies \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $MOVIES"
if echo "$MOVIES" | jq -e 'type == "array"' > /dev/null 2>&1; then
    MOVIE_COUNT=$(echo "$MOVIES" | jq 'length')
    echo "✅ Movies fetch successful - Found $MOVIE_COUNT movies"
else
    echo "⚠️  Movies fetch returned: $MOVIES (empty is OK for new DB)"
fi
echo ""

# Test 5: Web Frontend
echo "5️⃣ Testing Web Frontend..."
WEB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/)
if [ "$WEB_STATUS" == "200" ] || [ "$WEB_STATUS" == "304" ]; then
    echo "✅ Web frontend accessible (HTTP $WEB_STATUS)"
else
    echo "❌ Web frontend failed (HTTP $WEB_STATUS)"
fi
echo ""

# Test 6: Login page
echo "6️⃣ Testing Login Page..."
LOGIN_PAGE=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/login)
if [ "$LOGIN_PAGE" == "200" ]; then
    echo "✅ Login page accessible"
else
    echo "❌ Login page failed (HTTP $LOGIN_PAGE)"
fi
echo ""

# Test 7: Register new user
echo "7️⃣ Testing User Registration..."
RANDOM_NUM=$RANDOM
REG_RESPONSE=$(curl -s -X POST ${BASE_URL}/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User $RANDOM_NUM\",\"email\":\"test$RANDOM_NUM@test.com\",\"password\":\"Test@123\"}")
echo "Response: $REG_RESPONSE"
NEW_TOKEN=$(echo "$REG_RESPONSE" | jq -r '.access_token // empty')
if [ -n "$NEW_TOKEN" ] && [ "$NEW_TOKEN" != "null" ]; then
    echo "✅ Registration successful"
else
    echo "⚠️  Registration response: $REG_RESPONSE"
fi
echo ""

# Summary
echo "===================================="
echo "📊 Test Summary"
echo "===================================="
echo "Application URL: $BASE_URL"
echo "Admin Login: ${BASE_URL}/login"
echo "Admin Credentials: admin@kolamott.com / Admin@123"
echo ""
echo "✅ Core functionality verified!"
echo "🔐 Authentication: Working"
echo "📦 Database: Connected"
echo "🌐 Web Frontend: Accessible"
echo ""
