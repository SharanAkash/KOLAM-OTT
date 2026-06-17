# 🎥 Cloudinary Free Cloud Setup for Video Upload

## ✅ Already Configured with Demo Account!

Your app is now using **Cloudinary's free tier** for testing video uploads.

**No setup needed** - You can start uploading videos right away!

---

## 📦 What You Get (FREE)

- ✅ **25 GB** storage
- ✅ **25 GB** bandwidth per month
- ✅ **Video** and **image** uploads
- ✅ **Automatic optimization**
- ✅ **CDN** delivery worldwide
- ✅ No credit card required

---

## 🚀 Test Video Upload NOW

1. Go to: https://metal-badgers-repair.loca.lt/admin
2. Click "**+ Add Movie**"
3. Upload:
   - Video file (MP4, MOV, AVI)
   - Thumbnail image (JPG, PNG)
4. Fill in movie details
5. Click "**Upload to Cloud**"

Your videos will be stored on **Cloudinary's free cloud** and accessible worldwide!

---

## 🔑 Get Your Own Cloudinary Account (Optional)

If you want your own dedicated storage:

### Step 1: Sign Up (FREE)
Go to: https://cloudinary.com/users/register/free

### Step 2: Get Credentials
1. After signup, go to: https://console.cloudinary.com/
2. Copy these three values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Step 3: Update Environment Variables
Edit `/Users/sharan.j/kolam-ott/services/api/.env`:

```env
# Replace with your credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 4: Restart Backend
```bash
cd /Users/sharan.j/kolam-ott/services/api
npm run dev
```

---

## 📊 Monitor Your Usage

Check usage at: https://console.cloudinary.com/console/usage

---

## 🎬 Video Features

Cloudinary automatically:
- ✅ Converts videos to optimal formats
- ✅ Creates thumbnails
- ✅ Streams via CDN
- ✅ Compresses for faster loading
- ✅ Works on all devices

---

## 💡 Why Cloudinary?

**vs AWS S3:**
- ✅ No credit card needed
- ✅ Free tier is actually free
- ✅ Easier setup (3 credentials vs 5+)
- ✅ Built-in video optimization
- ✅ CDN included (AWS charges extra)

**Perfect for:**
- ✅ Testing and development
- ✅ Small production apps
- ✅ MVP launches
- ✅ Learning projects

---

## 🔒 Security

Current setup uses demo credentials for testing. For production:
1. Create your own account
2. Use environment variables (already configured)
3. Never commit credentials to Git (`.env` is in `.gitignore`)

---

## 📈 Need More?

**Free Tier Limits:**
- Storage: 25 GB
- Bandwidth: 25 GB/month
- Transformations: 25 credits/month

**Upgrade Plans:** Starting at $89/month for 90 GB storage

For most testing and small apps, the free tier is enough!

---

## ✨ Current Status

- ✅ Cloudinary SDK installed
- ✅ Video upload service updated
- ✅ Image upload service updated
- ✅ Demo credentials configured
- ✅ Backend API running

**You're ready to upload videos!**

---

## 🆘 Troubleshooting

### Upload fails with "Invalid credentials"
- Sign up for your own account
- Update `.env` with your credentials
- Restart backend API

### Upload timeout
- Video files over 100MB may take time
- Free tier has upload limits
- Consider compressing large videos

### "Resource not found" error
- Check your CLOUDINARY_CLOUD_NAME is correct
- Ensure all 3 credentials are set
- Restart the API after changing `.env`

---

**Demo Ready!** Just go to admin panel and start uploading: https://metal-badgers-repair.loca.lt/admin
