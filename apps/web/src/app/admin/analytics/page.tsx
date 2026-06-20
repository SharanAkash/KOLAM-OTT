'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState('week');

  // Mock data - replace with real API calls
  const metrics = {
    totalViews: 145892,
    activeUsers: 12453,
    totalRevenue: 892456,
    avgWatchTime: 47,
    viewsChange: 12.5,
    usersChange: 8.3,
    revenueChange: 15.7,
    watchTimeChange: -3.2,
  };

  const topContent = [
    { title: 'Master', views: 45231, revenue: 125000, rating: 4.8 },
    { title: 'Vikram', views: 38920, revenue: 98000, rating: 4.9 },
    { title: 'Varisu', views: 32145, revenue: 87000, rating: 4.5 },
    { title: 'Ponniyin Selvan 2', views: 28976, revenue: 76000, rating: 4.7 },
    { title: 'Leo', views: 25834, revenue: 65000, rating: 4.6 },
  ];

  const userActivity = [
    { time: 'Mon', views: 18234 },
    { time: 'Tue', views: 22145 },
    { time: 'Wed', views: 19876 },
    { time: 'Thu', views: 24532 },
    { time: 'Fri', views: 28234 },
    { time: 'Sat', views: 32145 },
    { time: 'Sun', views: 29876 },
  ];

  const genrePerformance = [
    { genre: 'Action', views: 45234, percentage: 31 },
    { genre: 'Drama', views: 38920, percentage: 27 },
    { genre: 'Comedy', views: 29876, percentage: 20 },
    { genre: 'Thriller', views: 18234, percentage: 13 },
    { genre: 'Romance', views: 13628, percentage: 9 },
  ];

  return (
    <div className="w-full min-h-screen bg-surface">
      <Navigation />

      <main className="px-margin-desktop py-12 pt-32 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary mb-4 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display-lg text-[48px] leading-[56px] font-bold mb-2">
                Analytics Dashboard
              </h1>
              <p className="font-body-lg text-on-surface-variant">
                Track your platform performance and user engagement
              </p>
            </div>

            {/* Time Period Filter */}
            <div className="flex gap-2 bg-surface-container rounded-xl p-1">
              {['day', 'week', 'month', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={`px-4 py-2 rounded-lg font-semibold capitalize transition-colors ${
                    timePeriod === period
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface-container rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-on-surface-variant font-semibold">Total Views</p>
              <span className="material-symbols-outlined text-primary-fixed-dim">visibility</span>
            </div>
            <p className="text-[36px] font-bold mb-1">{metrics.totalViews.toLocaleString()}</p>
            <div className="flex items-center gap-1">
              <span className={`material-symbols-outlined text-sm ${metrics.viewsChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {metrics.viewsChange > 0 ? 'trending_up' : 'trending_down'}
              </span>
              <p className={`text-sm font-semibold ${metrics.viewsChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(metrics.viewsChange)}% from last {timePeriod}
              </p>
            </div>
          </div>

          <div className="bg-surface-container rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-on-surface-variant font-semibold">Active Users</p>
              <span className="material-symbols-outlined text-primary-fixed-dim">people</span>
            </div>
            <p className="text-[36px] font-bold mb-1">{metrics.activeUsers.toLocaleString()}</p>
            <div className="flex items-center gap-1">
              <span className={`material-symbols-outlined text-sm ${metrics.usersChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {metrics.usersChange > 0 ? 'trending_up' : 'trending_down'}
              </span>
              <p className={`text-sm font-semibold ${metrics.usersChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(metrics.usersChange)}% from last {timePeriod}
              </p>
            </div>
          </div>

          <div className="bg-surface-container rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-on-surface-variant font-semibold">Total Revenue</p>
              <span className="material-symbols-outlined text-primary-fixed-dim">paid</span>
            </div>
            <p className="text-[36px] font-bold mb-1">₹{metrics.totalRevenue.toLocaleString()}</p>
            <div className="flex items-center gap-1">
              <span className={`material-symbols-outlined text-sm ${metrics.revenueChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {metrics.revenueChange > 0 ? 'trending_up' : 'trending_down'}
              </span>
              <p className={`text-sm font-semibold ${metrics.revenueChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(metrics.revenueChange)}% from last {timePeriod}
              </p>
            </div>
          </div>

          <div className="bg-surface-container rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-on-surface-variant font-semibold">Avg Watch Time</p>
              <span className="material-symbols-outlined text-primary-fixed-dim">schedule</span>
            </div>
            <p className="text-[36px] font-bold mb-1">{metrics.avgWatchTime} min</p>
            <div className="flex items-center gap-1">
              <span className={`material-symbols-outlined text-sm ${metrics.watchTimeChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {metrics.watchTimeChange > 0 ? 'trending_up' : 'trending_down'}
              </span>
              <p className={`text-sm font-semibold ${metrics.watchTimeChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(metrics.watchTimeChange)}% from last {timePeriod}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Activity Chart */}
          <div className="bg-surface-container rounded-2xl p-6">
            <h2 className="font-headline-lg text-[24px] leading-[32px] font-semibold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed-dim">bar_chart</span>
              User Activity
            </h2>
            <div className="space-y-4">
              {userActivity.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-on-surface-variant font-semibold w-12">{day.time}</span>
                  <div className="flex-1 bg-surface-container-high rounded-lg overflow-hidden">
                    <div
                      className="bg-primary-container h-8 flex items-center justify-end px-3 transition-all"
                      style={{ width: `${(day.views / 35000) * 100}%` }}
                    >
                      <span className="text-on-primary-container font-semibold text-sm">
                        {day.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Genre Performance */}
          <div className="bg-surface-container rounded-2xl p-6">
            <h2 className="font-headline-lg text-[24px] leading-[32px] font-semibold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed-dim">pie_chart</span>
              Genre Performance
            </h2>
            <div className="space-y-4">
              {genrePerformance.map((genre, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-on-surface font-semibold">{genre.genre}</span>
                    <span className="text-on-surface-variant font-semibold">
                      {genre.views.toLocaleString()} views
                    </span>
                  </div>
                  <div className="bg-surface-container-high rounded-lg overflow-hidden h-3">
                    <div
                      className="bg-primary-container h-full transition-all"
                      style={{ width: `${genre.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Content Table */}
        <div className="bg-surface-container rounded-2xl p-6">
          <h2 className="font-headline-lg text-[24px] leading-[32px] font-semibold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed-dim">star</span>
            Top Performing Content
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="text-left py-4 px-4 text-on-surface-variant font-semibold">Rank</th>
                  <th className="text-left py-4 px-4 text-on-surface-variant font-semibold">Title</th>
                  <th className="text-left py-4 px-4 text-on-surface-variant font-semibold">Views</th>
                  <th className="text-left py-4 px-4 text-on-surface-variant font-semibold">Revenue</th>
                  <th className="text-left py-4 px-4 text-on-surface-variant font-semibold">Rating</th>
                </tr>
              </thead>
              <tbody>
                {topContent.map((content, index) => (
                  <tr key={index} className="border-b border-outline-variant hover:bg-surface transition-colors">
                    <td className="py-4 px-4">
                      <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                        <span className="font-bold text-on-primary-container">{index + 1}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-on-surface">{content.title}</td>
                    <td className="py-4 px-4 text-on-surface-variant">{content.views.toLocaleString()}</td>
                    <td className="py-4 px-4 text-on-surface-variant">₹{content.revenue.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-yellow-500 text-[20px]">star</span>
                        <span className="font-semibold text-on-surface">{content.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-8 flex justify-end">
          <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform flex items-center gap-2">
            <span className="material-symbols-outlined">download</span>
            Export Report
          </button>
        </div>
      </main>
    </div>
  );
}
