'use client';

import Navigation from '@/components/Navigation';
import Link from 'next/link';
import React from 'react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = React.useState('mylist');

  const handleLogout = () => {
    // Clear user from localStorage
    localStorage.removeItem('user');
    // Redirect to home page
    window.location.href = '/';
  };

  // Mock user data
  const user = {
    name: 'Akash R.',
    email: 'akash.r@example.com',
    memberSince: 'January 2023',
    plan: 'Gold Member',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
  };

  const watchHistory = [
    { id: '1', title: 'Ponniyin Selvan II', thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=300&fit=crop', progress: 75, watchedAt: '2 days ago' },
    { id: '2', title: 'Jailer', thumbnail: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=200&h=300&fit=crop', progress: 45, watchedAt: '1 week ago' },
    { id: '3', title: 'Vikram', thumbnail: 'https://images.unsplash.com/photo-1574267432644-f610bcb5b103?w=200&h=300&fit=crop', progress: 90, watchedAt: '2 weeks ago' },
    { id: '4', title: 'Leo', thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&h=300&fit=crop', progress: 60, watchedAt: '3 weeks ago' },
    { id: '5', title: 'Varisu', thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=300&fit=crop', progress: 100, watchedAt: '1 month ago' },
  ];

  const downloads = [
    { id: '1', title: 'Ponniyin Selvan II', thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=300&fit=crop', size: '1.2 GB', downloadedAt: 'Yesterday' },
    { id: '2', title: 'Jailer', thumbnail: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=200&h=300&fit=crop', size: '980 MB', downloadedAt: '3 days ago' },
    { id: '3', title: 'Vikram', thumbnail: 'https://images.unsplash.com/photo-1574267432644-f610bcb5b103?w=200&h=300&fit=crop', size: '1.5 GB', downloadedAt: '1 week ago' },
  ];

  return (
    <div className="w-full min-h-screen bg-black">
      <Navigation />

      <main className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="flex-shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-primary-fixed-dim"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="font-display-lg text-[40px] leading-[48px] tracking-[-0.02em] font-bold text-white">
                  {user.name}
                </h1>
                <span className="bg-primary-container text-on-primary-container px-4 py-1 rounded-full font-label-sm text-[12px] leading-[16px] tracking-[0.05em] font-semibold">
                  {user.plan}
                </span>
              </div>
              <p className="text-on-surface-variant font-body-md text-[16px] leading-[24px] mb-4">
                {user.email}
              </p>
              <p className="text-on-surface-variant font-body-md text-[14px] leading-[20px]">
                Member since {user.memberSince}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <Link href="/settings" className="w-full md:w-[130px]">
                <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-all w-full text-sm">
                  <span className="material-symbols-outlined text-[18px]">settings</span>
                  <span className="font-semibold">Settings</span>
                </button>
              </Link>
              <div className="w-full md:w-[130px]">
                <button
                  onClick={handleLogout}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-all w-full text-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span className="font-semibold">Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-outline-variant mb-8">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('mylist')}
                className={`font-label-sm text-[14px] leading-[20px] tracking-[0.05em] font-semibold pb-4 transition-colors ${
                  activeTab === 'mylist'
                    ? 'text-primary-fixed-dim border-b-2 border-primary-fixed-dim'
                    : 'text-on-surface-variant hover:text-on-surface border-b-2 border-transparent'
                }`}
              >
                My List
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`font-label-sm text-[14px] leading-[20px] tracking-[0.05em] font-semibold pb-4 transition-colors ${
                  activeTab === 'history'
                    ? 'text-primary-fixed-dim border-b-2 border-primary-fixed-dim'
                    : 'text-on-surface-variant hover:text-on-surface border-b-2 border-transparent'
                }`}
              >
                Watch History
              </button>
              <button
                onClick={() => setActiveTab('downloads')}
                className={`font-label-sm text-[14px] leading-[20px] tracking-[0.05em] font-semibold pb-4 transition-colors ${
                  activeTab === 'downloads'
                    ? 'text-primary-fixed-dim border-b-2 border-primary-fixed-dim'
                    : 'text-on-surface-variant hover:text-on-surface border-b-2 border-transparent'
                }`}
              >
                Downloads
              </button>
            </div>
          </div>

          {/* My List Tab */}
          {activeTab === 'mylist' && (
            <div>
              <h2 className="font-headline-md text-[24px] leading-[32px] font-semibold text-on-surface mb-6">
                My List
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <div key={i} className="group relative">
                    <Link href={`/movie/${i}`}>
                      <div className="relative aspect-[2/3] rounded-md md:rounded-lg overflow-hidden">
                        <img
                          src={`https://images.unsplash.com/photo-${1536440136628 + i * 1000}-849c177e76a1?w=300&h=450&fit=crop`}
                          alt={`Movie ${i}`}
                          className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Handle remove from list
                      }}
                      className="absolute top-1 right-1 z-10 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-red-600 rounded-full hover:bg-red-700 transition-all shadow-lg"
                    >
                      <span className="material-symbols-outlined text-white text-[12px] md:text-[14px] leading-none">
                        close
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Watch History Tab */}
          {activeTab === 'history' && (
            <div>
              <h2 className="font-headline-md text-[24px] leading-[32px] font-semibold text-on-surface mb-6">
                Watch History
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
                {watchHistory.map((item) => (
                  <div key={item.id} className="group">
                    <Link href={`/movie/${item.id}`}>
                      <div className="relative aspect-[2/3] rounded-md md:rounded-lg overflow-hidden mb-2">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity md:pointer-events-none">
                          <span className="material-symbols-outlined text-white text-[48px] md:text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            play_circle
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-container-high">
                          <div
                            className="h-full bg-primary-container"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </Link>
                    <h3 className="font-body-md text-[11px] md:text-[14px] leading-[16px] md:leading-[20px] text-on-surface group-hover:text-primary-fixed-dim transition-colors line-clamp-1 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-on-surface-variant text-[10px] md:text-[12px] line-clamp-1">
                      {item.progress}% • {item.watchedAt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Downloads Tab */}
          {activeTab === 'downloads' && (
            <div>
              <h2 className="font-headline-md text-[24px] leading-[32px] font-semibold text-on-surface mb-6">
                Downloads
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
                {downloads.map((item) => (
                  <div key={item.id} className="group relative">
                    <Link href={`/movie/${item.id}`}>
                      <div className="relative aspect-[2/3] rounded-md md:rounded-lg overflow-hidden mb-2">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity md:pointer-events-none">
                          <span className="material-symbols-outlined text-white text-[48px] md:text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            play_circle
                          </span>
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Handle delete download
                      }}
                      className="absolute top-1 right-1 z-10 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-red-600 rounded-full hover:bg-red-700 transition-all shadow-lg"
                    >
                      <span className="material-symbols-outlined text-white text-[12px] md:text-[14px] leading-none">
                        delete
                      </span>
                    </button>
                    <h3 className="font-body-md text-[11px] md:text-[14px] leading-[16px] md:leading-[20px] text-on-surface group-hover:text-primary-fixed-dim transition-colors line-clamp-1 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-on-surface-variant text-[10px] md:text-[12px] line-clamp-1">
                      {item.size} • {item.downloadedAt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
