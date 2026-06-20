'use client';

import Link from 'next/link';

interface Movie {
  id: string;
  title: string;
  image: string;
  rating: number;
}

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
}

export default function MovieCarousel({ title, movies }: MovieCarouselProps) {
  return (
    <div className="space-y-2 md:space-y-4 w-full overflow-hidden">
      <h3 className="font-headline-md text-[16px] md:text-[24px] leading-[22px] md:leading-[32px] font-semibold text-on-surface px-0.5">
        {title}
      </h3>
      <div className="flex gap-2 md:gap-4 overflow-x-auto custom-scrollbar pb-3 md:pb-4 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="group flex-shrink-0 w-[120px] md:w-[280px] snap-start"
          >
            <div className="relative aspect-[2/3] rounded-md md:rounded-lg overflow-hidden movie-card-glow">
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
                  <h4 className="font-headline-md text-[12px] md:text-[18px] leading-[16px] md:leading-[24px] font-semibold text-white mb-1 md:mb-2 line-clamp-2">
                    {movie.title}
                  </h4>
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="flex items-center gap-0.5 md:gap-1 text-primary-fixed-dim">
                      <span className="material-symbols-outlined text-[14px] md:text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-label-sm text-[10px] md:text-[12px] leading-[14px] md:leading-[16px] tracking-[0.05em] font-semibold">
                        {movie.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
