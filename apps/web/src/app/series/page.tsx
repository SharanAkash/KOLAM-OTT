'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';

export default function SeriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  // Mock data - TODO: Replace with API calls
  const allSeries = [
    {
      id: '1',
      title: 'Suzhal: The Vortex',
      image: 'https://images.unsplash.com/photo-1574267432644-f610bcb5b103?w=300&h=450&fit=crop',
      rating: 4.7,
      genre: 'thriller',
      year: 2022,
      seasons: 1,
      episodes: 8,
    },
    {
      id: '2',
      title: 'Tamil Rockerz',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
      rating: 4.5,
      genre: 'drama',
      year: 2022,
      seasons: 1,
      episodes: 8,
    },
    {
      id: '3',
      title: 'Triples',
      image: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=300&h=450&fit=crop',
      rating: 4.6,
      genre: 'comedy',
      year: 2020,
      seasons: 2,
      episodes: 10,
    },
    {
      id: '4',
      title: 'November Story',
      image: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=300&h=450&fit=crop',
      rating: 4.4,
      genre: 'thriller',
      year: 2021,
      seasons: 1,
      episodes: 7,
    },
    {
      id: '5',
      title: 'Vadhandhi',
      image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=300&h=450&fit=crop',
      rating: 4.8,
      genre: 'thriller',
      year: 2022,
      seasons: 1,
      episodes: 8,
    },
    {
      id: '6',
      title: 'Fingertip',
      image: 'https://images.unsplash.com/photo-1574267432644-f610bcb5b103?w=300&h=450&fit=crop',
      rating: 4.3,
      genre: 'thriller',
      year: 2019,
      seasons: 2,
      episodes: 16,
    },
  ];

  const genres = [
    { id: 'all', name: 'All Genres' },
    { id: 'action', name: 'Action' },
    { id: 'drama', name: 'Drama' },
    { id: 'thriller', name: 'Thriller' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'romance', name: 'Romance' },
  ];

  const filteredSeries = allSeries.filter((series) => {
    const matchesSearch = series.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || series.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="w-full min-h-screen bg-surface">
      <Navigation />

      <main className="w-full px-margin-desktop pt-24 pb-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display-lg text-[48px] leading-[56px] tracking-[-0.02em] font-bold mb-2">
            Web Series
          </h1>
          <p className="font-body-lg text-[18px] leading-[28px] text-on-surface-variant">
            Binge-watch the best Tamil web series
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              placeholder="Search series..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-highest text-on-surface pl-12 pr-4 py-4 rounded-xl border border-outline-variant focus:border-primary focus:outline-none font-body-lg text-[16px] leading-[24px]"
            />
          </div>

          {/* Genre Filter */}
          <div className="flex gap-3 flex-wrap">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`px-6 py-2 rounded-full font-label-lg text-[14px] leading-[20px] tracking-[0.01em] font-semibold transition-all duration-200 ${
                  selectedGenre === genre.id
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* Series Grid */}
        {filteredSeries.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredSeries.map((series) => (
              <a
                key={series.id}
                href={`/series/${series.id}`}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-surface-container-highest">
                  <img
                    src={series.image}
                    alt={series.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="text-white font-label-sm text-[12px] leading-[16px] font-semibold">
                      {series.rating}
                    </span>
                  </div>

                  {/* Series Info Badge */}
                  <div className="absolute top-3 left-3 bg-primary-container/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <span className="text-on-primary-container font-label-sm text-[12px] leading-[16px] font-semibold">
                      S{series.seasons} • {series.episodes} EP
                    </span>
                  </div>

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-primary-container text-on-primary-container p-4 rounded-full">
                      <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        play_arrow
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="font-headline-sm text-[16px] leading-[24px] font-semibold mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                  {series.title}
                </h3>
                <p className="font-body-sm text-[14px] leading-[20px] text-on-surface-variant">
                  {series.year} • {series.seasons} Season{series.seasons > 1 ? 's' : ''}
                </p>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant mb-4 block">
              tv
            </span>
            <h3 className="font-headline-lg text-[24px] leading-[32px] font-semibold mb-2">
              No series found
            </h3>
            <p className="font-body-lg text-[16px] leading-[24px] text-on-surface-variant">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
