'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';

export default function MyListPage() {
  // Mock data - TODO: Replace with API calls
  const [myList] = useState([
    {
      id: '1',
      title: 'Ponniyin Selvan II',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
      rating: 4.8,
      year: 2023,
      addedDate: '2026-06-10',
    },
    {
      id: '3',
      title: 'Vikram',
      image: 'https://images.unsplash.com/photo-1574267432644-f610bcb5b103?w=300&h=450&fit=crop',
      rating: 4.9,
      year: 2022,
      addedDate: '2026-06-08',
    },
    {
      id: '7',
      title: 'Master',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
      rating: 4.6,
      year: 2021,
      addedDate: '2026-06-05',
    },
  ]);

  return (
    <div className="w-full min-h-screen bg-surface">
      <Navigation />

      <main className="w-full px-margin-desktop pt-24 pb-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display-lg text-[48px] leading-[56px] tracking-[-0.02em] font-bold mb-2">
            My List
          </h1>
          <p className="font-body-lg text-[18px] leading-[28px] text-on-surface-variant">
            Your personally curated collection
          </p>
        </div>

        {/* Content */}
        {myList.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {myList.map((item) => (
              <a
                key={item.id}
                href={`/movie/${item.id}`}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-surface-container-highest">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="text-white font-label-sm text-[12px] leading-[16px] font-semibold">
                      {item.rating}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    className="absolute top-3 left-3 bg-red-600/80 hover:bg-red-600 backdrop-blur-sm p-2 rounded-lg transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      // TODO: Implement remove functionality
                    }}
                  >
                    <span className="material-symbols-outlined text-white text-sm">
                      close
                    </span>
                  </button>

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
                  {item.title}
                </h3>
                <p className="font-body-sm text-[14px] leading-[20px] text-on-surface-variant">
                  {item.year}
                </p>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant mb-4 block">
              playlist_remove
            </span>
            <h3 className="font-headline-lg text-[24px] leading-[32px] font-semibold mb-2">
              Your list is empty
            </h3>
            <p className="font-body-lg text-[16px] leading-[24px] text-on-surface-variant mb-6">
              Start adding movies and series to your list
            </p>
            <a
              href="/movies"
              className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-label-lg text-[14px] leading-[20px] font-semibold hover:scale-105 transition-transform duration-200"
            >
              Browse Movies
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
