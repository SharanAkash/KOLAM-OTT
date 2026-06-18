#!/bin/bash

echo "🎬 Testing KOLAM-OTT S3 Upload"
echo "================================"
echo ""

# Create a test image
echo "📸 Creating test image..."
convert -size 1920x1080 -background '#1a1a1a' -fill '#f59e0b' \
  -gravity center -pointsize 72 label:'KOLAM-OTT\nTest Upload' \
  /tmp/test-thumbnail.jpg 2>/dev/null || \
  echo "Test Image Content" > /tmp/test-thumbnail.txt

echo "✅ Test file created"
echo ""

# Upload to video endpoint
echo "🎥 Testing video upload endpoint..."
curl -X POST http://localhost:3002/upload/video \
  -F "video=@/tmp/test-thumbnail.txt" \
  -H "Content-Type: multipart/form-data" \
  2>/dev/null || echo "❌ Video upload failed (API might be down)"

echo ""
echo ""

# Upload to image endpoint
echo "🖼️  Testing image upload endpoint..."
curl -X POST http://localhost:3002/upload/image \
  -F "image=@/tmp/test-thumbnail.txt" \
  -H "Content-Type: multipart/form-data" \
  2>/dev/null || echo "❌ Image upload failed (API might be down)"

echo ""
echo ""

# List S3 bucket contents
echo "📦 Current S3 bucket contents:"
aws s3 ls s3://kolam-ott-videos/ --recursive --human-readable --summarize

echo ""
echo "✅ Test complete!"
echo ""
echo "To test manually:"
echo "1. Start the API: cd services/api && npm run start:dev"
echo "2. Upload a video:"
echo "   curl -X POST http://localhost:3002/upload/video -F 'video=@your-video.mp4'"
echo ""
