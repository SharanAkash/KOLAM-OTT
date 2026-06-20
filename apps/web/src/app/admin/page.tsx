'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';

export default function AdminDashboard() {
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    rating: '',
    genres: [] as string[],
    releaseYear: '',
    duration: '',
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [trailerFile, setTrailerFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Mock data for admin dashboard
  const stats = {
    totalUsers: 15234,
    activeSubscriptions: 8456,
    totalMovies: 1247,
    totalRevenue: '₹45,67,890',
  };

  const recentUsers = [
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com', plan: 'Premium', joined: '2024-06-15' },
    { id: 2, name: 'Priya Sharma', email: 'priya@example.com', plan: 'Basic', joined: '2024-06-14' },
    { id: 3, name: 'Arjun Reddy', email: 'arjun@example.com', plan: 'Premium', joined: '2024-06-13' },
    { id: 4, name: 'Lakshmi Menon', email: 'lakshmi@example.com', plan: 'Basic', joined: '2024-06-12' },
  ];

  const [recentMovies, setRecentMovies] = useState([
    { id: 1, title: 'Ponniyin Selvan II', views: 45678, rating: 4.8, status: 'Published' },
    { id: 2, title: 'Jailer', views: 67890, rating: 4.7, status: 'Published' },
    { id: 3, title: 'Vikram', views: 89012, rating: 4.9, status: 'Published' },
    { id: 4, title: 'Leo', views: 34567, rating: 4.6, status: 'Draft' },
  ]);

  const handleAddMovie = async () => {
    if (!newMovie.title) {
      alert('Please enter a movie title');
      return;
    }

    if (!videoFile) {
      alert('Please select a video file');
      return;
    }

    if (!thumbnailFile) {
      alert('Please select a thumbnail image');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

      // Upload video
      setUploadProgress(10);
      const videoFormData = new FormData();
      videoFormData.append('video', videoFile);

      let videoResponse;
      try {
        videoResponse = await fetch(`${API_BASE}/upload/video`, {
          method: 'POST',
          body: videoFormData,
        });
      } catch (fetchError) {
        throw new Error('Backend API not running. Please start the API server on port 3002 and ensure PostgreSQL is running. See SETUP_COMPLETE.md for instructions.');
      }

      if (!videoResponse.ok) {
        throw new Error('Video upload failed');
      }

      const { url: videoUrl } = await videoResponse.json();
      setUploadProgress(40);

      // Upload thumbnail
      const thumbnailFormData = new FormData();
      thumbnailFormData.append('image', thumbnailFile);

      const thumbnailResponse = await fetch(`${API_BASE}/upload/image`, {
        method: 'POST',
        body: thumbnailFormData,
      });

      if (!thumbnailResponse.ok) {
        throw new Error('Thumbnail upload failed');
      }

      const { url: thumbnailUrl } = await thumbnailResponse.json();
      setUploadProgress(60);

      // Upload trailer if exists
      let trailerUrl = '';
      if (trailerFile) {
        const trailerFormData = new FormData();
        trailerFormData.append('video', trailerFile);

        const trailerResponse = await fetch(`${API_BASE}/upload/video`, {
          method: 'POST',
          body: trailerFormData,
        });

        if (trailerResponse.ok) {
          const data = await trailerResponse.json();
          trailerUrl = data.url;
        }
      }
      setUploadProgress(80);

      // Create movie
      const movieData = {
        title: newMovie.title,
        description: newMovie.description,
        videoUrl,
        thumbnail: thumbnailUrl,
        trailerUrl,
        rating: parseFloat(newMovie.rating) || 0,
        genres: newMovie.genres,
        releaseYear: parseInt(newMovie.releaseYear) || new Date().getFullYear(),
        duration: parseInt(newMovie.duration) || 0,
      };

      const createResponse = await fetch(`${API_BASE}/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData),
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create movie');
      }

      const createdMovie = await createResponse.json();
      setUploadProgress(100);

      // Add to local list
      const movie = {
        id: recentMovies.length + 1,
        title: newMovie.title,
        views: 0,
        rating: parseFloat(newMovie.rating) || 0,
        status: 'Published',
      };

      setRecentMovies([movie, ...recentMovies]);

      // Reset form
      setNewMovie({
        title: '',
        description: '',
        rating: '',
        genres: [],
        releaseYear: '',
        duration: '',
      });
      setVideoFile(null);
      setThumbnailFile(null);
      setTrailerFile(null);
      setUploadProgress(0);
      setIsUploading(false);
      setShowAddMovieModal(false);

      alert(`Movie "${newMovie.title}" uploaded successfully to cloud!`);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Upload failed'}`);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleGenreToggle = (genre: string) => {
    if (newMovie.genres.includes(genre)) {
      setNewMovie({
        ...newMovie,
        genres: newMovie.genres.filter((g) => g !== genre),
      });
    } else {
      setNewMovie({
        ...newMovie,
        genres: [...newMovie.genres, genre],
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <Navigation />

      <main className="px-4 md:px-margin-desktop py-12 pt-24 md:pt-32 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="font-display-lg text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] font-bold mb-2">
            Admin Dashboard
          </h1>
          <p className="font-body-lg text-sm md:text-base text-on-surface-variant">
            Manage your J S Tamil Cinemas platform content and users
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon="group"
            onClick={() => alert('Users management coming soon!')}
          />
          <StatCard
            title="Active Subscriptions"
            value={stats.activeSubscriptions.toLocaleString()}
            icon="card_membership"
            onClick={() => alert('Subscriptions page coming soon!')}
          />
          <StatCard
            title="Total Movies"
            value={stats.totalMovies.toLocaleString()}
            icon="movie"
            onClick={() => window.location.href = '/movies'}
          />
          <StatCard
            title="Revenue (MTD)"
            value={stats.totalRevenue}
            icon="payments"
            onClick={() => window.location.href = '/admin/analytics'}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Recent Users */}
          <div className="bg-surface-container rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline-lg text-[32px] leading-[40px] font-semibold">
                Recent Users
              </h2>
              <button className="text-primary-fixed-dim hover:text-primary font-semibold">
                View All →
              </button>
            </div>

            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-surface rounded-xl hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-primary-container">person</span>
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-on-surface-variant">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary-container/20 text-primary-fixed-dim border border-primary-fixed-dim/40">
                      {user.plan}
                    </span>
                    <p className="text-xs text-on-surface-variant mt-1">{user.joined}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Movies */}
          <div className="bg-surface-container rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline-lg text-[32px] leading-[40px] font-semibold">
                Recent Movies
              </h2>
              <button
                onClick={() => setShowAddMovieModal(true)}
                className="text-primary-fixed-dim hover:text-primary font-semibold"
              >
                + Add Movie
              </button>
            </div>

            <div className="space-y-4">
              {recentMovies.map((movie) => (
                <div key={movie.id} className="flex items-center justify-between p-4 bg-surface rounded-xl hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-primary-container">movie</span>
                    </div>
                    <div>
                      <p className="font-semibold">{movie.title}</p>
                      <p className="text-sm text-on-surface-variant">
                        {movie.views.toLocaleString()} views • ⭐ {movie.rating}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      movie.status === 'Published'
                        ? 'bg-green-500/20 text-green-400 border border-green-400/40'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/40'
                    }`}>
                      {movie.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <ActionCard
            icon="add_circle"
            title="Add New Movie"
            description="Upload and publish new content"
            action="Add Movie"
            onClick={() => setShowAddMovieModal(true)}
          />
          <ActionCard
            icon="settings"
            title="Platform Settings"
            description="Configure app settings and preferences"
            action="Settings"
            onClick={() => window.location.href = '/admin/settings'}
          />
          <ActionCard
            icon="analytics"
            title="View Analytics"
            description="See detailed reports and insights"
            action="Analytics"
            onClick={() => window.location.href = '/admin/analytics'}
          />
        </div>
      </main>

      {/* Add Movie Modal */}
      {showAddMovieModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display-lg text-[32px] leading-[40px] font-bold">
                Add New Movie
              </h2>
              <button
                onClick={() => setShowAddMovieModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[32px]">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-on-surface font-semibold mb-2">
                  Movie Title *
                </label>
                <input
                  type="text"
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  placeholder="e.g., CAT"
                  disabled={isUploading}
                  className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none disabled:opacity-50"
                />
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-on-surface font-semibold mb-2">
                  Video File (MP4) *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="video/mp4,video/mpeg,video/quicktime"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    disabled={isUploading}
                    className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary-container/80 disabled:opacity-50"
                  />
                  {videoFile && (
                    <p className="mt-2 text-sm text-on-surface-variant">
                      Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-on-surface font-semibold mb-2">
                  Thumbnail Image *
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  disabled={isUploading}
                  className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary-container/80 disabled:opacity-50"
                />
                {thumbnailFile && (
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Selected: {thumbnailFile.name}
                  </p>
                )}
              </div>

              {/* Trailer Upload (Optional) */}
              <div>
                <label className="block text-on-surface font-semibold mb-2">
                  Trailer Video (Optional)
                </label>
                <input
                  type="file"
                  accept="video/mp4,video/mpeg,video/quicktime"
                  onChange={(e) => setTrailerFile(e.target.files?.[0] || null)}
                  disabled={isUploading}
                  className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary-container/80 disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-on-surface font-semibold mb-2">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={newMovie.rating}
                    onChange={(e) => setNewMovie({ ...newMovie, rating: e.target.value })}
                    placeholder="4.5"
                    disabled={isUploading}
                    className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-on-surface font-semibold mb-2">
                    Release Year
                  </label>
                  <input
                    type="number"
                    value={newMovie.releaseYear}
                    onChange={(e) => setNewMovie({ ...newMovie, releaseYear: e.target.value })}
                    placeholder="2024"
                    disabled={isUploading}
                    className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={newMovie.duration}
                  onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })}
                  placeholder="120"
                  disabled={isUploading}
                  className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-2">
                  Genres (Select multiple)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Action', 'Drama', 'Thriller', 'Comedy', 'Romance', 'Horror', 'Sci-Fi'].map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => handleGenreToggle(genre)}
                      disabled={isUploading}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 ${
                        newMovie.genres.includes(genre)
                          ? 'bg-primary-container text-on-primary-container'
                          : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={newMovie.description}
                  onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                  placeholder="Movie description..."
                  rows={4}
                  disabled={isUploading}
                  className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none disabled:opacity-50"
                />
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="bg-surface-container-high p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-on-surface font-semibold">Uploading to Cloud...</span>
                    <span className="text-primary-fixed-dim font-semibold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2">
                    <div
                      className="bg-primary-container h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-on-surface-variant mt-2">
                    Please wait while we upload your video to AWS S3...
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleAddMovie}
                disabled={isUploading}
                className="flex-1 bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">cloud_upload</span>
                    Upload to Cloud
                  </>
                )}
              </button>
              <button
                onClick={() => setShowAddMovieModal(false)}
                disabled={isUploading}
                className="px-6 py-3 rounded-xl font-semibold bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, onClick }: { title: string; value: string; icon: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface-container rounded-2xl p-4 md:p-6 hover:bg-surface-container-high transition-all ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
    >
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <span className="material-symbols-outlined text-primary-fixed-dim text-3xl md:text-4xl">
          {icon}
        </span>
        {onClick && (
          <span className="material-symbols-outlined text-on-surface-variant text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            arrow_forward
          </span>
        )}
      </div>
      <p className="text-on-surface-variant font-body-sm text-xs md:text-sm mb-1">{title}</p>
      <p className="font-display-md text-[24px] md:text-[36px] leading-[32px] md:leading-[44px] font-bold">{value}</p>
    </div>
  );
}

function ActionCard({ icon, title, description, action, onClick }: { icon: string; title: string; description: string; action: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-surface-container rounded-2xl p-6 hover:bg-surface-container-high transition-all hover:scale-105 cursor-pointer"
    >
      <div className="mb-4">
        <span className="material-symbols-outlined text-primary-fixed-dim text-5xl">
          {icon}
        </span>
      </div>
      <h3 className="font-headline-md text-[24px] leading-[32px] font-semibold mb-2">
        {title}
      </h3>
      <p className="text-on-surface-variant font-body-md mb-4">
        {description}
      </p>
      <button className="text-primary-fixed-dim font-semibold flex items-center gap-1 hover:gap-2 transition-all">
        {action}
        <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </button>
    </div>
  );
}
