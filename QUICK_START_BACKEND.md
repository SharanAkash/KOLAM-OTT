# Quick Start: Backend Setup for J S Tamil Cinemas

## 🚀 Get Your Backend Running in 30 Minutes

Follow these steps to set up database and cloud storage for your OTT platform.

---

## Step 1: Choose Your Free Tier Stack

### Recommended for MVP (All Free!):

1. **Database:** MongoDB Atlas (Free 512 MB)
2. **Storage:** Cloudinary (Free 25 GB)  
3. **API:** Next.js API Routes (Already have it!)
4. **Auth:** NextAuth.js (Already installed!)
5. **Hosting:** Vercel (Free tier)

---

## Step 2: Set Up MongoDB Atlas

### A. Create Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with email
3. Choose **FREE** M0 cluster
4. Select region: **Mumbai** (closest to India)
5. Cluster name: `js-tamil-cinemas`

### B. Get Connection String
1. Click "Connect" on your cluster
2. Choose "Drivers" → "Node.js"
3. Copy connection string:
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password

### C. Create Database
1. Click "Browse Collections"
2. "Add My Own Data"
3. Database name: `js_tamil_cinemas`
4. Collections to create:
   - `users`
   - `movies`
   - `subscriptions`
   - `analytics`

---

## Step 3: Set Up Cloudinary

### A. Create Account
1. Go to https://cloudinary.com/users/register/free
2. Sign up (free 25 GB)
3. Verify email

### B. Get Credentials
From your dashboard, copy:
- **Cloud Name:** `your-cloud-name`
- **API Key:** `123456789012345`
- **API Secret:** `abcdefghijklmnopqrstuvwxyz`

### C. Enable Video Upload
1. Go to Settings → Upload
2. Enable "Large file support" (up to 100 MB)
3. Set upload preset: `js_tamil_videos`

---

## Step 4: Configure Environment Variables

### Create `.env.local` in `apps/web/`

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/js_tamil_cinemas?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_SECRET=generate-random-32-char-string-here
NEXTAUTH_URL=http://localhost:3001

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz

# App
NODE_ENV=development
```

### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

---

## Step 5: Install Dependencies

```bash
cd /Users/sharan.j/kolam-ott/apps/web

# MongoDB client
npm install mongodb mongoose

# Cloudinary SDK
npm install cloudinary

# Form handling
npm install formidable

# Video player (for web)
npm install video.js
```

---

## Step 6: Create Database Connection

### Create `apps/web/src/lib/mongodb.ts`

```typescript
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production, create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
```

---

## Step 7: Create API Routes

### A. Movies API: `apps/web/src/app/api/movies/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET all movies
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('js_tamil_cinemas');
    
    const movies = await db
      .collection('movies')
      .find({ status: 'published' })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ success: true, movies });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}

// POST create movie (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('js_tamil_cinemas');
    
    const movie = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft',
      metadata: {
        views: 0,
        likes: 0,
        featured: false,
      }
    };

    const result = await db.collection('movies').insertOne(movie);

    return NextResponse.json({
      success: true,
      movieId: result.insertedId,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create movie' },
      { status: 500 }
    );
  }
}
```

### B. Single Movie API: `apps/web/src/app/api/movies/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db('js_tamil_cinemas');
    
    const movie = await db
      .collection('movies')
      .findOne({ _id: new ObjectId(params.id) });

    if (!movie) {
      return NextResponse.json(
        { success: false, error: 'Movie not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, movie });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch movie' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('js_tamil_cinemas');
    
    await db.collection('movies').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ...body, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update movie' },
      { status: 500 }
    );
  }
}
```

### C. Upload API: `apps/web/src/app/api/upload/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'js-tamil-cinemas/movies',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
```

---

## Step 8: Test Your Backend

### A. Test Database Connection

Create `apps/web/src/app/api/test-db/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('js_tamil_cinemas');
    
    // Try to count movies
    const count = await db.collection('movies').countDocuments();
    
    return NextResponse.json({
      success: true,
      message: 'Database connected!',
      moviesCount: count,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

**Test:** http://localhost:3001/api/test-db

### B. Add Sample Movie

Use this curl command or Postman:

```bash
curl -X POST http://localhost:3001/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ponniyin Selvan II",
    "titleTamil": "பொன்னியின் செல்வன் II",
    "description": "Epic historical drama",
    "year": 2023,
    "duration": 9840,
    "rating": 4.8,
    "genres": ["Action", "Drama", "Historical"],
    "media": {
      "poster": "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
      "backdrop": "https://images.unsplash.com/photo-1533928298208-27ff66555d8d"
    }
  }'
```

### C. Fetch Movies

**Test:** http://localhost:3001/api/movies

---

## Step 9: Update Frontend to Use Real Data

### Update `apps/web/src/app/page.tsx`

Replace mock data with API call:

```typescript
export default async function HomePage() {
  // Fetch real data from API
  const res = await fetch('http://localhost:3001/api/movies', {
    cache: 'no-store'
  });
  const data = await res.json();
  const movies = data.movies || [];

  return (
    <div className="w-full">
      <Navigation />
      {/* Your existing UI */}
      <MovieCarousel title="All Movies" movies={movies} />
    </div>
  );
}
```

---

## Step 10: Deploy to Production

### A. Deploy to Vercel

```bash
cd /Users/sharan.j/kolam-ott/apps/web

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### B. Add Environment Variables in Vercel

1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Add all variables from `.env.local`
4. Redeploy

---

## 🎯 You're Done!

Your backend is now:
- ✅ Connected to MongoDB for data storage
- ✅ Using Cloudinary for video/image storage
- ✅ Has API routes for movies, users, uploads
- ✅ Ready to scale

---

## 📚 What's Next?

1. **Add Authentication** - Implement login/signup
2. **User Profiles** - Watchlist, history
3. **Admin Panel** - Full CRUD operations
4. **Payment Integration** - Razorpay/Stripe
5. **Video Streaming** - HLS adaptive streaming
6. **Mobile API** - Connect React Native app

---

## 💡 Pro Tips

### Database Indexes (Add in MongoDB Atlas)
```javascript
// Users collection
{ email: 1 } // unique
{ plan.type: 1 }

// Movies collection
{ status: 1, createdAt: -1 }
{ genres: 1 }
{ slug: 1 } // unique
```

### Caching Strategy
```typescript
// Add to API routes
export const revalidate = 3600; // Cache for 1 hour
```

### Error Logging
```bash
npm install @sentry/nextjs
```

---

## 🆘 Troubleshooting

### Can't connect to MongoDB?
- Check if IP is whitelisted (allow 0.0.0.0/0 for development)
- Verify password has no special characters
- Check connection string format

### Cloudinary upload fails?
- Check file size (free tier: 100 MB max)
- Verify API credentials
- Check upload preset is created

### API routes not working?
- Restart Next.js server
- Check .env.local file exists
- Verify environment variables loaded

---

**Ready to implement? Let me know which part you want to set up first!**
