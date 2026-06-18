# AWS S3 Upload Guide - KOLAM-OTT

Complete guide for video and image uploads using AWS S3.

## ✅ Setup Complete

Your KOLAM-OTT platform is now configured to upload videos and images to AWS S3!

### S3 Bucket Details

- **Bucket Name**: `kolam-ott-videos`
- **Region**: `ap-south-1` (Mumbai)
- **Console URL**: https://s3.console.aws.amazon.com/s3/buckets/kolam-ott-videos
- **Public URL Pattern**: `https://kolam-ott-videos.s3.ap-south-1.amazonaws.com/{path}`

---

## 📁 Folder Structure

Your uploads are organized in S3:

```
kolam-ott-videos/
├── videos/           # Full movies and episodes
├── trailers/         # Movie trailers
├── thumbnails/       # Video thumbnails
└── images/           # General images (posters, banners)
```

---

## 🚀 How It Works

### 1. Upload Flow

```
User uploads file → Backend API → AWS S3 → Public URL returned
```

### 2. Upload Endpoints

All endpoints are available at: `http://localhost:3002/upload/`

#### Upload Video (Full Movie/Episode)
```bash
POST /upload/video
Content-Type: multipart/form-data
Field name: video

# Supported formats: MP4, MPEG, MOV
# Max size: 5GB
```

#### Upload Trailer
```bash
POST /upload/trailer
Content-Type: multipart/form-data
Field name: trailer

# Supported formats: MP4, MPEG, MOV
# Max size: 500MB
```

#### Upload Thumbnail
```bash
POST /upload/thumbnail
Content-Type: multipart/form-data
Field name: thumbnail

# Supported formats: JPEG, PNG, WebP
# Max size: 10MB (default)
```

#### Upload Image
```bash
POST /upload/image
Content-Type: multipart/form-data
Field name: image

# Supported formats: JPEG, PNG, WebP
# Max size: 10MB (default)
```

---

## 🧪 Testing Uploads

### Method 1: Using cURL

```bash
# Upload a video
curl -X POST http://localhost:3002/upload/video \
  -F "video=@/path/to/your/video.mp4" \
  -H "Content-Type: multipart/form-data"

# Response:
# {
#   "url": "https://kolam-ott-videos.s3.ap-south-1.amazonaws.com/videos/uuid-video.mp4"
# }

# Upload a thumbnail
curl -X POST http://localhost:3002/upload/thumbnail \
  -F "thumbnail=@/path/to/thumbnail.jpg"

# Upload a trailer
curl -X POST http://localhost:3002/upload/trailer \
  -F "trailer=@/path/to/trailer.mp4"
```

### Method 2: Using Postman

1. Open Postman
2. Create a new POST request: `http://localhost:3002/upload/video`
3. Go to "Body" tab
4. Select "form-data"
5. Add a key: `video` (type: File)
6. Choose your video file
7. Click "Send"

### Method 3: Using Test Script

```bash
# Run the test script
./test-s3-upload.sh
```

---

## 📝 Example: Adding a Movie with Upload

### Step 1: Upload Video

```bash
curl -X POST http://localhost:3002/upload/video \
  -F "video=@ponniyin-selvan.mp4" \
  > video-response.json

# Save the returned URL
```

### Step 2: Upload Thumbnail

```bash
curl -X POST http://localhost:3002/upload/thumbnail \
  -F "thumbnail=@ponniyin-selvan-thumb.jpg" \
  > thumb-response.json
```

### Step 3: Upload Trailer (Optional)

```bash
curl -X POST http://localhost:3002/upload/trailer \
  -F "trailer=@ponniyin-selvan-trailer.mp4" \
  > trailer-response.json
```

### Step 4: Create Movie Entry

```bash
curl -X POST http://localhost:3002/movies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "title": "Ponniyin Selvan II",
    "description": "Epic historical drama",
    "videoUrl": "https://kolam-ott-videos.s3.ap-south-1.amazonaws.com/videos/xxx.mp4",
    "thumbnail": "https://kolam-ott-videos.s3.ap-south-1.amazonaws.com/thumbnails/xxx.jpg",
    "trailerUrl": "https://kolam-ott-videos.s3.ap-south-1.amazonaws.com/trailers/xxx.mp4",
    "rating": 4.8,
    "genres": ["Historical", "Drama", "Action"],
    "releaseYear": 2023,
    "duration": 164
  }'
```

---

## 🖥️ Frontend Integration

### React/Next.js Upload Component

```typescript
// components/VideoUpload.tsx
'use client';

import { useState } from 'react';

export default function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await fetch('http://localhost:3002/upload/video', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setVideoUrl(data.url);
      alert('Video uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Upload Video</h2>
      
      <input
        type="file"
        accept="video/mp4,video/mpeg,video/quicktime"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-blue-500 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload Video'}
      </button>

      {videoUrl && (
        <div className="mt-4">
          <p className="text-green-600">✅ Uploaded!</p>
          <a href={videoUrl} target="_blank" className="text-blue-500 underline">
            {videoUrl}
          </a>
        </div>
      )}
    </div>
  );
}
```

### React Native Upload

```typescript
// screens/UploadScreen.tsx
import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';

export default function UploadScreen() {
  const [uploading, setUploading] = useState(false);

  const pickAndUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'video/*',
    });

    if (result.type === 'success') {
      setUploading(true);

      const formData = new FormData();
      formData.append('video', {
        uri: result.uri,
        name: result.name,
        type: 'video/mp4',
      } as any);

      try {
        const response = await fetch('http://10.0.2.2:3002/upload/video', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const data = await response.json();
        alert('Upload successful: ' + data.url);
      } catch (error) {
        alert('Upload failed');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Button
      title={uploading ? 'Uploading...' : 'Upload Video'}
      onPress={pickAndUpload}
      disabled={uploading}
    />
  );
}
```

---

## 🔧 Advanced Features

### 1. Upload Progress Tracking

To track upload progress, you can modify the service to return progress:

```typescript
// Add to upload.service.ts
const upload = new Upload({
  client: this.s3Client,
  params: { /* ... */ },
});

upload.on('httpUploadProgress', (progress) => {
  console.log(`Uploaded: ${progress.loaded} / ${progress.total}`);
});

await upload.done();
```

### 2. Generate Signed URLs (Private Videos)

For premium content that should be private:

```typescript
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

async getSignedUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: this.bucketName,
    Key: key,
  });

  // URL expires in 1 hour
  return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
}
```

### 3. Video Transcoding (Future)

Consider using AWS MediaConvert for:
- Multiple quality versions (480p, 720p, 1080p, 4K)
- HLS streaming format
- Adaptive bitrate streaming

---

## 📊 Monitoring Uploads

### View All Uploads

```bash
# List all videos
aws s3 ls s3://kolam-ott-videos/videos/ --human-readable

# List all thumbnails
aws s3 ls s3://kolam-ott-videos/thumbnails/ --human-readable

# Check total storage used
aws s3 ls s3://kolam-ott-videos --recursive --human-readable --summarize
```

### S3 Console

View uploads in AWS Console:
https://s3.console.aws.amazon.com/s3/buckets/kolam-ott-videos?region=ap-south-1&tab=objects

---

## 💰 Cost Estimation

### S3 Storage Costs (ap-south-1)

- **Storage**: ₹0.025 per GB/month
- **Upload**: Free
- **Download**: ₹0.11 per GB (first 10TB/month)

### Example Costs

| Storage | Monthly Cost |
|---------|-------------|
| 100 GB (≈25 movies) | ₹2.50 |
| 500 GB (≈125 movies) | ₹12.50 |
| 1 TB (≈250 movies) | ₹25.00 |
| 5 TB (≈1250 movies) | ₹125.00 |

---

## 🔒 Security Best Practices

### 1. Rotate AWS Credentials

```bash
# Create new access key in IAM Console
# Update .env file
# Delete old access key
```

### 2. Use IAM Roles (Production)

Instead of access keys, use IAM roles when deploying to:
- EC2 instances
- ECS containers
- Lambda functions

### 3. Enable S3 Bucket Versioning

```bash
aws s3api put-bucket-versioning \
  --bucket kolam-ott-videos \
  --versioning-configuration Status=Enabled
```

### 4. Set Up CloudFront CDN

For faster video delivery worldwide:
- Create CloudFront distribution
- Point to S3 bucket
- Enable HTTPS
- Set up caching rules

---

## 🐛 Troubleshooting

### Upload Fails: "Access Denied"

```bash
# Check AWS credentials
aws sts get-caller-identity

# Verify bucket permissions
aws s3api get-bucket-policy --bucket kolam-ott-videos
```

### Upload Fails: "Network Error"

```bash
# Check API is running
curl http://localhost:3002

# Check .env configuration
cat services/api/.env | grep AWS
```

### Uploaded File Not Accessible

```bash
# Check file exists
aws s3 ls s3://kolam-ott-videos/videos/

# Check public access
aws s3api get-public-access-block --bucket kolam-ott-videos

# Test public URL
curl -I https://kolam-ott-videos.s3.ap-south-1.amazonaws.com/test/test-upload.txt
```

---

## 📚 Related Documentation

- [BUILD_AND_RUN_GUIDE.md](./BUILD_AND_RUN_GUIDE.md) - Setup instructions
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) - API documentation
- [AWS S3 Official Docs](https://docs.aws.amazon.com/s3/)

---

## ✅ Summary

Your KOLAM-OTT platform now has:

✅ AWS S3 bucket configured  
✅ Upload endpoints for videos, trailers, thumbnails, and images  
✅ Public access for streaming  
✅ CORS configured for web/mobile access  
✅ File validation (type and size)  
✅ Organized folder structure  

**Next Steps:**
1. Start the API: `cd services/api && npm run start:dev`
2. Test uploads with the provided scripts
3. Integrate upload components in your admin panel
4. Consider adding CloudFront CDN for better performance

---

**Happy Uploading! 🎬**
