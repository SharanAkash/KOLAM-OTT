import Navigation from '@/components/Navigation';
import Link from 'next/link';

interface MovieDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailsPage({ params }: MovieDetailsProps) {
  const { id } = await params;

  // Mock data - TODO: Fetch from API
  const movie = {
    id,
    title: 'Ponniyin Selvan II',
    description:
      'The story continues in this epic historical drama as Arulmozhi Varman fights for the throne of the Chola Empire. With breathtaking visuals and a stellar cast, this sequel takes viewers deeper into the world of ancient Tamil kingdoms.',
    rating: 4.8,
    year: 2023,
    duration: '164 min',
    genre: ['Action', 'Drama', 'Historical'],
    cast: ['Vikram', 'Aishwarya Rai', 'Karthi', 'Jayam Ravi'],
    director: 'Mani Ratnam',
    backdrop: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=1920&h=1080&fit=crop',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
  };

  return (
    <div className="w-full min-h-screen bg-black">
      <Navigation />

      {/* Backdrop Section */}
      <div className="relative h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
        </div>

        {/* Movie Info */}
        <div className="relative z-10 h-full flex items-end px-margin-desktop pb-16">
          <div className="flex gap-8 max-w-7xl">
            {/* Poster */}
            <div className="flex-shrink-0 w-[280px]">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full rounded-lg shadow-2xl"
              />
            </div>

            {/* Details */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-primary-fixed-dim/20 text-primary-fixed-dim border border-primary-fixed-dim/40 px-3 py-1 rounded-sm text-[12px] font-bold tracking-widest">
                  PREMIUM
                </span>
                <span className="flex items-center text-primary-fixed-dim gap-1">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="font-label-sm text-[12px] leading-[16px] tracking-[0.05em] font-semibold">
                    {movie.rating}/5
                  </span>
                </span>
              </div>

              <h1 className="font-display-lg text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-white">
                {movie.title}
              </h1>

              <div className="flex items-center gap-4 text-on-surface-variant font-body-md text-[16px] leading-[24px]">
                <span>{movie.year}</span>
                <span>•</span>
                <span>{movie.duration}</span>
                <span>•</span>
                <div className="flex gap-2">
                  {movie.genre.map((g) => (
                    <span
                      key={g}
                      className="bg-surface-container-high px-3 py-1 rounded-full text-[14px]"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <p className="font-body-lg text-[18px] leading-[28px] text-on-surface-variant max-w-3xl">
                {movie.description}
              </p>

              <div className="space-y-2">
                <p className="text-on-surface-variant">
                  <span className="text-primary-fixed-dim font-semibold">Director:</span> {movie.director}
                </p>
                <p className="text-on-surface-variant">
                  <span className="text-primary-fixed-dim font-semibold">Cast:</span> {movie.cast.join(', ')}
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button className="bg-primary-container text-on-primary-container px-8 py-4 rounded-xl flex items-center gap-2 font-headline-md text-[24px] leading-[32px] font-semibold hover:scale-105 transition-transform duration-300">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    play_arrow
                  </span>
                  Watch Now
                </button>
                <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-4 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-all duration-300">
                  <span className="material-symbols-outlined">add</span>
                  My List
                </button>
                <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-4 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-all duration-300">
                  <span className="material-symbols-outlined">share</span>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="px-margin-desktop py-16">
        <h3 className="font-headline-md text-[24px] leading-[32px] font-semibold text-on-surface mb-6">
          More Like This
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Link key={i} href={`/movie/${i}`} className="group">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden movie-card-glow">
                <img
                  src={`https://images.unsplash.com/photo-${1536440136628 + i * 1000}-849c177e76a1?w=300&h=450&fit=crop`}
                  alt={`Movie ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
