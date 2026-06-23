# Admin File Upload - Local Storage Configuration

## 📁 Overview

The admin dashboard now supports **local filesystem storage** for movie and video uploads. Files are stored directly on the container's filesystem instead of AWS S3.

---

## 🎯 What's Configured

### Storage Locations

Files are saved in the following directories:

```
/app/uploads/
├── videos/          # Full movie files (up to 5GB)
├── images/          # Movie posters and images
├── thumbnails/      # Thumbnail images
└── trailers/        # Movie trailers (up to 500MB)
```

### Access URLs

Uploaded files are accessible via HTTP:

```
http://kolam-ott-qa-alb-146970630.us-east-1.elb.amazonaws.com/uploads/{type}/{filename}

Examples:
- Videos: /uploads/videos/abc123-movie.mp4
- Images: /uploads/images/def456-poster.jpg
- Thumbnails: /uploads/thumbnails/ghi789-thumb.png
- Trailers: /uploads/trailers/jkl012-trailer.mp4
```

---

## 🚀 How to Use (Admin Dashboard)

### 1. Login as Admin

**URL:** http://kolam-ott-qa-alb-146970630.us-east-1.elb.amazonaws.com/login

**Credentials:**
- Email: `admin@kolamott.com`
- Password: `Admin@123`

### 2. Access Admin Dashboard

After login, you'll be at: `/admin`

### 3. Add Movie

1. Click **"Add Movie"** button
2. Fill in movie details:
   - Title
   - Description
   - Rating
   - Genres
   - Release Year
   - Duration

3. Upload files:
   - **Video File** (required) - MP4, MPEG, MOV up to 5GB
   - **Thumbnail** (required) - JPEG, PNG, WebP
   - **Trailer** (optional) - MP4, MPEG, MOV up to 500MB

4. Click **"Upload Movie"**

### 4. Files are Saved Locally

- Files save to `/app/uploads/` inside the container
- URLs returned: `http://alb-url/uploads/{type}/{uuid}-filename.ext`
- Movie record created in database with file URLs

---

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `USE_LOCAL_STORAGE` | `true` | Enable local filesystem storage |
| `UPLOAD_DIR` | `/app/uploads` | Directory for uploaded files |
| `PUBLIC_URL` | ALB URL | Base URL for file access |
| `AWS_S3_BUCKET` | N/A | S3 bucket (when local storage disabled) |

### Switching to S3 Storage

To use AWS S3 instead of local storage:

```bash
# Update environment variable
USE_LOCAL_STORAGE=false

# Or remove it (defaults to false)
# Files will upload to S3 bucket: kolam-ott-qa-videos
```

---

## 📊 File Limits

| File Type | Max Size | Allowed Formats |
|-----------|----------|-----------------|
| **Video (Movie)** | 5GB | MP4, MPEG, MOV |
| **Trailer** | 500MB | MP4, MPEG, MOV |
| **Image** | No limit | JPEG, PNG, WebP |
| **Thumbnail** | No limit | JPEG, PNG, WebP |

---

## 🔍 Technical Details

### Upload Flow

1. **Admin uploads file** via browser form
2. **Frontend sends** file to API: `POST /upload/{type}`
3. **API validates** file type and size
4. **File saved** to `/app/uploads/{type}/{uuid}-{filename}`
5. **URL returned**: `{PUBLIC_URL}/uploads/{type}/{uuid}-{filename}`
6. **Movie created** in database with file URLs

### File Serving

Static file serving configured in `main.ts`:

```typescript
app.useStaticAssets(uploadDir, {
  prefix: '/uploads/',
});
```

This makes `/app/uploads/` accessible at `/uploads/` URL path.

### File Naming

Files are saved with UUIDs to prevent collisions:

```
Format: {uuid}-{original-filename}
Example: a1b2c3d4-5678-90ab-cdef-1234567890ab-movie-name.mp4
```

---

## ⚠️ Important Notes

### Persistence

- **Container filesystem is ephemeral** - files are lost if container restarts
- For production, consider:
  1. **EFS (Elastic File System)** - Persistent shared storage
  2. **S3 Storage** - Set `USE_LOCAL_STORAGE=false`
  3. **Volume Mounts** - Docker volumes for persistence

### Current Limitation

Files uploaded to one container are not accessible from other container instances. For multi-instance deployments, use S3 or EFS.

### Testing

Files persist during normal operation but **will be lost** when:
- Container is stopped/restarted
- New deployment rolls out
- Service scales down/up

---

## 🛠️ Troubleshooting

### "Upload failed" Error

**Check:**
1. File size within limits
2. File format is allowed
3. API logs: `aws logs tail /ecs/kolam-ott-qa-api --follow`

### Files not accessible

**Check:**
1. URL format: `{ALB_URL}/uploads/{type}/{filename}`
2. File was successfully uploaded (check API response)
3. Container has permissions to `/app/uploads/`

### Upload succeeds but movie not visible

**Check:**
1. Movie was created in database
2. File URLs are correct in database
3. Frontend is fetching movies correctly

---

## 📝 Code References

- **Upload Service:** [services/api/src/upload/upload.service.ts](../services/api/src/upload/upload.service.ts)
- **Upload Controller:** [services/api/src/upload/upload.controller.ts](../services/api/src/upload/upload.controller.ts)
- **Main Configuration:** [services/api/src/main.ts](../services/api/src/main.ts)
- **Admin Dashboard:** [apps/web/src/app/admin/page.tsx](../apps/web/src/app/admin/page.tsx)

---

## 🎯 Summary

✅ **Local storage enabled** - Files save to container filesystem  
✅ **Admin can upload** - Movies, videos, images, thumbnails  
✅ **Files accessible via HTTP** - `/uploads/` endpoint  
✅ **Automatic cleanup** - UUID-based filenames prevent collisions  
✅ **Production ready** - Switch to S3 by setting `USE_LOCAL_STORAGE=false`  

**Admin Dashboard:** http://kolam-ott-qa-alb-146970630.us-east-1.elb.amazonaws.com/admin
