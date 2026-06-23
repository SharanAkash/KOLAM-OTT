'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateUser, getRedirectPath } from '@/lib/auth';
import { loginMockUser, mockUsers } from '@/lib/mockUsers';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const quickLoginMock = (mockEmail: string, mockPassword: string) => {
    const result = loginMockUser(mockEmail, mockPassword);
    if (result.success && result.user) {
      const redirectPath = result.user.role === 'admin' ? '/admin' : '/';
      window.location.href = redirectPath;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call the real API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        // Store user and token in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.access_token);

        // Redirect based on role - Admins go to admin dashboard
        const redirectPath = data.user.role === 'ADMIN' ? '/admin' : '/';
        router.push(redirectPath);
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/">
            <h1 className="font-display-lg text-[48px] leading-[56px] tracking-tighter text-primary-fixed-dim font-bold">
              J S Tamil Cinemas
            </h1>
          </Link>
          <h2 className="font-display-lg-mobile text-[32px] leading-[40px] font-bold text-white mt-4">
            Dive Back In
          </h2>
        </div>

        {/* Quick Login Buttons for Testing */}
        <div className="mb-6 space-y-2">
          <button
            onClick={() => {
              setEmail('admin@kolamott.com');
              setPassword('Admin@123');
            }}
            className="w-full bg-primary-container/20 border border-primary-fixed-dim px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-container/30 transition-colors text-primary-fixed-dim"
          >
            👑 Quick Login - Admin (No Subscribe Button)
          </button>
          <button
            onClick={() => {
              setEmail('test@kolamott.com');
              setPassword('Test@123');
            }}
            className="w-full bg-surface-container-high border border-outline-variant px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface-container-highest transition-colors"
          >
            ⭐ Quick Login - Premium User
          </button>
          <button
            onClick={() => {
              setEmail('free@kolamott.com');
              setPassword('Free@123');
            }}
            className="w-full bg-surface-container-high border border-outline-variant px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface-container-highest transition-colors"
          >
            👤 Quick Login - Free User
          </button>
        </div>

        {/* Login Form */}
        <div className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/40 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block font-body-md text-[16px] leading-[24px] text-on-surface mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-surface-container-high text-on-surface pl-12 pr-4 py-3 rounded-lg border border-outline-variant focus:border-primary-fixed-dim focus:outline-none font-body-md text-[16px] leading-[24px]"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block font-body-md text-[16px] leading-[24px] text-on-surface"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="font-label-sm text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-primary-fixed-dim hover:text-primary transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-high text-on-surface pl-12 pr-12 py-3 rounded-lg border border-outline-variant focus:border-primary-fixed-dim focus:outline-none font-body-md text-[16px] leading-[24px]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container text-on-primary-container py-3 rounded-full font-headline-md text-[20px] leading-[28px] font-semibold hover:scale-[0.98] transition-transform duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Social Login */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface-container-low text-on-surface-variant font-body-md text-[14px] leading-[20px]">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-surface-container-high border border-outline-variant px-4 py-3 rounded-lg hover:bg-surface-container-highest transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                  />
                  <path
                    fill="#34A853"
                    d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1818182,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                  />
                </svg>
                <span className="font-label-sm text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface">
                  Google
                </span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-surface-container-high border border-outline-variant px-4 py-3 rounded-lg hover:bg-surface-container-highest transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span className="font-label-sm text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface">
                  Apple
                </span>
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-on-surface-variant font-body-md text-[14px] leading-[20px]">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-primary-fixed-dim font-semibold hover:text-primary transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
