# Frontend Authentication Integration Guide

## Overview
This guide shows how to integrate the authentication system with your React/Next.js frontend.

## API Endpoints

Base URL: `http://localhost:3001`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | User login | No |
| POST | `/auth/register` | User registration | No |
| GET | `/auth/profile` | Get user profile | Yes |

### Movie Endpoints (Example)

| Method | Endpoint | Description | Auth Required | Subscription Required |
|--------|----------|-------------|---------------|---------------------|
| GET | `/movies` | List all movies | No | No |
| GET | `/movies/:id` | Get movie details | Yes | Yes (Admin bypass) |
| POST | `/movies` | Create movie | Yes (Admin only) | N/A |

## Frontend Implementation

### 1. Auth Context/Store

```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  hasActiveSubscription: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  hasSubscription: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Load from localStorage on mount
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    
    setToken(data.access_token);
    setUser(data.user);
    
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAdmin = user?.role === 'ADMIN';
  const hasSubscription = user?.hasActiveSubscription || false;

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isAdmin,
      hasSubscription 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### 2. Login Component

```typescript
// components/LoginForm.tsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  // Quick login buttons for testing
  const quickLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>

      {/* Quick test login buttons */}
      <div className="quick-login">
        <h4>Quick Test Login:</h4>
        <button onClick={() => quickLogin('admin@kolamott.com', 'Admin@123')}>
          Login as Admin
        </button>
        <button onClick={() => quickLogin('test@kolamott.com', 'Test@123')}>
          Login as Test User
        </button>
        <button onClick={() => quickLogin('free@kolamott.com', 'Free@123')}>
          Login as Free User
        </button>
      </div>
    </div>
  );
}
```

### 3. Protected Route Component

```typescript
// components/ProtectedRoute.tsx
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
  adminOnly?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireSubscription = false,
  adminOnly = false 
}: ProtectedRouteProps) {
  const { user, isAdmin, hasSubscription } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (adminOnly && !isAdmin) {
      router.push('/');
      return;
    }

    // Note: Admins bypass subscription requirement
    if (requireSubscription && !hasSubscription && !isAdmin) {
      router.push('/subscribe');
      return;
    }
  }, [user, isAdmin, hasSubscription, adminOnly, requireSubscription, router]);

  if (!user) return null;
  if (adminOnly && !isAdmin) return null;
  if (requireSubscription && !hasSubscription && !isAdmin) return null;

  return <>{children}</>;
}
```

### 4. API Utility Function

```typescript
// utils/api.ts
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`http://localhost:3001${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (response.status === 403) {
    const data = await response.json();
    if (data.message?.includes('subscription')) {
      // Redirect to subscription page
      window.location.href = '/subscribe';
    }
    throw new Error(data.message);
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}
```

### 5. Example Usage: Movie Page

```typescript
// pages/movies/[id].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { apiRequest } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

function MoviePage() {
  const router = useRouter();
  const { id } = router.query;
  const { isAdmin, hasSubscription } = useAuth();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    apiRequest(`/movies/${id}`)
      .then(setMovie)
      .catch((err) => {
        if (err.message?.includes('subscription')) {
          setError('This content requires an active subscription');
        } else {
          setError('Failed to load movie');
        }
      });
  }, [id]);

  if (error) {
    return (
      <div className="error-page">
        <h2>{error}</h2>
        {!hasSubscription && !isAdmin && (
          <a href="/subscribe">Subscribe Now</a>
        )}
      </div>
    );
  }

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="movie-page">
      <h1>{movie.title}</h1>
      <p>{movie.description}</p>
      
      {/* Show admin badge */}
      {isAdmin && (
        <div className="admin-badge">
          Admin Access (No Subscription Required)
        </div>
      )}
      
      {/* Show subscription status */}
      {!isAdmin && hasSubscription && (
        <div className="subscription-badge">
          Premium Member
        </div>
      )}
      
      {/* Video player */}
      <video src={movie.videoUrl} controls />
    </div>
  );
}

export default function MoviePageWithAuth() {
  return (
    <ProtectedRoute requireSubscription={true}>
      <MoviePage />
    </ProtectedRoute>
  );
}
```

### 6. Admin Panel Example

```typescript
// pages/admin/movies.tsx
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { apiRequest } from '../../utils/api';
import { useState } from 'react';

function AdminMoviesPage() {
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleCreateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await apiRequest('/movies', {
        method: 'POST',
        body: JSON.stringify({
          title,
          videoUrl,
          thumbnail: 'placeholder.jpg',
          duration: 120,
        }),
      });
      
      alert('Movie created successfully!');
      setTitle('');
      setVideoUrl('');
    } catch (err) {
      alert('Failed to create movie');
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin: Create Movie</h1>
      <form onSubmit={handleCreateMovie}>
        <input
          type="text"
          placeholder="Movie Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          required
        />
        <button type="submit">Create Movie</button>
      </form>
    </div>
  );
}

export default function AdminMoviesPageWithAuth() {
  return (
    <ProtectedRoute adminOnly={true}>
      <AdminMoviesPage />
    </ProtectedRoute>
  );
}
```

## UI Components

### Subscription Badge/Banner

```typescript
// components/SubscriptionBanner.tsx
import { useAuth } from '../contexts/AuthContext';

export function SubscriptionBanner() {
  const { user, isAdmin, hasSubscription } = useAuth();

  if (!user) return null;
  if (isAdmin) {
    return (
      <div className="banner admin">
        👑 Admin Access - Full Platform Access
      </div>
    );
  }
  
  if (hasSubscription) {
    return (
      <div className="banner subscribed">
        ⭐ Premium Member
      </div>
    );
  }

  return (
    <div className="banner free">
      Limited Access - <a href="/subscribe">Subscribe for Premium Content</a>
    </div>
  );
}
```

## Testing in Development

1. Start the API: `cd services/api && npm run dev`
2. Login with test credentials:
   - **Admin**: admin@kolamott.com / Admin@123
   - **Premium User**: test@kolamott.com / Test@123
   - **Free User**: free@kolamott.com / Free@123

3. Test different scenarios:
   - ✅ Admin can access everything without subscription
   - ✅ Premium user can access premium content
   - ❌ Free user gets blocked from premium content

## Summary

- **Admins**: Full access, no subscription needed
- **Regular users with subscription**: Access to premium content
- **Regular users without subscription**: Limited access, redirected to subscribe page
- The frontend respects the `hasActiveSubscription` flag from the backend
- Backend enforces the actual access control via guards
