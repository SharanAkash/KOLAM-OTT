# Cloud Video Upload Setup Guide

## Overview
Your KOLAM-OTT platform now supports uploading MP4 videos directly to AWS S3 cloud storage through the admin panel.

## Features
✅ Upload MP4/MPEG/MOV videos to AWS S3
✅ Upload thumbnail images (JPEG/PNG/WebP)
✅ Optional trailer video upload
✅ Real-time upload progress indicator
✅ Automatic cloud URL storage in database
✅ File size validation (max 5GB per video)
✅ Multi-genre selection
✅ Complete movie metadata management

## Setup Instructions

### 1. AWS S3 Configuration

#### Create an S3 Bucket:
1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click "Create bucket"
3. Bucket name: `kolam-ott-videos` (or your preferred name)
4. Region: `us-east-1` (or your preferred region)
5. Uncheck "Block all public access" (for public video streaming)
6. Enable "ACLs enabled" under Object Ownership
7. Create bucket

#### Configure Bucket Permissions:
Add this bucket policy (replace `kolam-ott-videos` with your bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::kolam-ott-videos/*"
    }
  ]
}
```

#### Create IAM User:
1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Users → Add users
3. Username: `kolam-ott-uploader`
4. Access type: Programmatic access
5. Attach policies: `AmazonS3FullAccess` (or create custom policy)
6. Copy the **Access Key ID** and **Secret Access Key**

### 2. Environment Configuration

Create `/services/api/.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/kolam_ott?schema=public"

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=AKIA...your_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=kolam-ott-videos

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### 3. Database Setup

Run Prisma migrations:

```bash
cd services/api
npm install
npx prisma generate
npx prisma migrate dev --name add_content_model
```

### 4. Start the Backend API

```bash
cd services/api
npm run dev
```

The API will run on `http://localhost:3002`

### 5. Start the Frontend

```bash
cd apps/web
npm run dev
```

The web app will run on `http://localhost:3001`

## How to Upload Movies

1. Navigate to [Admin Dashboard](http://localhost:3001/admin)
2. Click "**+ Add Movie**" button
3. Fill in the form:
   - **Movie Title**: Required (e.g., "CAT")
   - **Video File**: Required (MP4 file, max 5GB)
   - **Thumbnail Image**: Required (JPEG/PNG)
   - **Trailer Video**: Optional (MP4 file)
   - **Rating**: 1-5 stars
   - **Release Year**: e.g., 2024
   - **Duration**: In minutes (e.g., 120)
   - **Genres**: Select multiple (Action, Drama, etc.)
   - **Description**: Movie synopsis

4. Click "**Upload to Cloud**"
5. Wait for upload progress (shows percentage)
6. Movie will be automatically saved to:
   - Video: `s3://kolam-ott-videos/videos/{uuid}.mp4`
   - Thumbnail: `s3://kolam-ott-videos/images/{uuid}.jpg`
   - Database: PostgreSQL with all metadata

## API Endpoints

### Upload Endpoints
- `POST /upload/video` - Upload video file
- `POST /upload/image` - Upload image file

### Movie Endpoints
- `POST /movies` - Create movie with cloud URLs
- `GET /movies` - Get all movies
- `GET /movies/:id` - Get movie by ID

## File Structure

```
services/api/src/
├── config/
│   └── s3.config.ts       # AWS S3 configuration
├── upload/
│   ├── upload.module.ts
│   ├── upload.controller.ts
│   └── upload.service.ts  # S3 upload logic
├── movies/
│   ├── movies.module.ts
│   ├── movies.controller.ts
│   └── movies.service.ts  # Movie CRUD operations
├── prisma/
│   └── prisma.service.ts
├── app.module.ts
└── main.ts
```

## Cost Estimation (AWS S3)

### Storage:
- $0.023 per GB/month (Standard storage)
- 1000 movies @ 2GB each = 2TB = ~$47/month

### Data Transfer:
- First 100GB/month: FREE
- $0.09 per GB after that
- 10,000 views @ 2GB each = 20TB = ~$1,800/month

### Requests:
- PUT: $0.005 per 1,000 requests
- GET: $0.0004 per 1,000 requests

**Recommendation**: Use AWS CloudFront CDN to reduce costs and improve streaming performance.

## Troubleshooting

### Upload fails with "403 Forbidden"
- Check IAM user has S3 permissions
- Verify bucket policy allows public reads
- Check AWS credentials in `.env` file

### Upload fails with "File too large"
- Videos are limited to 5GB
- Consider using AWS MediaConvert for compression

### Videos don't play
- Ensure bucket policy allows public `GetObject`
- Check CORS configuration on S3 bucket
- Verify video file format (MP4 with H.264 codec recommended)

## Production Recommendations

1. **Use CloudFront CDN**: For faster video streaming globally
2. **Enable S3 Transfer Acceleration**: For faster uploads
3. **Implement Video Transcoding**: Use AWS MediaConvert to create multiple quality versions (360p, 720p, 1080p)
4. **Add Authentication**: Protect upload endpoints with JWT
5. **Implement Chunked Upload**: For files larger than 5GB
6. **Add Video Processing Queue**: Use AWS SQS/Lambda for async processing
7. **Enable S3 Versioning**: For backup and recovery
8. **Set up CloudWatch Monitoring**: Track storage and bandwidth usage

## Alternative Cloud Providers

You can easily switch to other providers by modifying `/services/api/src/config/s3.config.ts`:

- **Google Cloud Storage**: Use `@google-cloud/storage`
- **Azure Blob Storage**: Use `@azure/storage-blob`
- **DigitalOcean Spaces**: S3-compatible API
- **Cloudflare R2**: S3-compatible, zero egress fees

## Support

For issues or questions:
- Check AWS CloudWatch logs
- Review backend console logs
- Test endpoints with Postman
- Verify environment variables are set correctly
