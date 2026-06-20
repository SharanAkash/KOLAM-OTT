import Navigation from '@/components/Navigation';
import MovieCarousel from '@/components/MovieCarousel';

export default function HomePage() {
  // Mock data - TODO: Replace with API calls
  const trendingMovies = [
    {
      id: '1',
      title: 'Ponniyin Selvan II',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
      rating: 4.8,
    },
    {
      id: '2',
      title: 'Jailer',
      image: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=300&h=450&fit=crop',
      rating: 4.7,
    },
    {
      id: '3',
      title: 'Vikram',
      image: 'https://images.unsplash.com/photo-1574267432644-f610bcb5b103?w=300&h=450&fit=crop',
      rating: 4.9,
    },
    {
      id: '4',
      title: 'Varisu',
      image: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=300&h=450&fit=crop',
      rating: 4.5,
    },
    {
      id: '5',
      title: 'Thunivu',
      image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=300&h=450&fit=crop',
      rating: 4.6,
    },
  ];

  return (
    <div className="w-full">
      <Navigation />

      <main className="w-full overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative h-[450px] md:h-[972px] w-full overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=1920&h=1080&fit=crop"
              alt="Hero Background"
            />
            <div className="absolute inset-0 cinema-gradient"></div>
            <div className="absolute inset-0 hero-vignette"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex flex-col justify-end pb-8 md:pb-32 px-4 md:px-margin-desktop max-w-4xl">
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
                <span className="bg-primary-fixed-dim/20 text-primary-fixed-dim border border-primary-fixed-dim/40 px-2 md:px-3 py-0.5 md:py-1 rounded-sm text-[9px] md:text-[12px] font-bold tracking-widest">
                  PREMIUM
                </span>
                <span className="flex items-center text-primary-fixed-dim gap-1">
                  <span className="material-symbols-outlined text-[14px] md:text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="font-label-sm text-[10px] md:text-[12px] leading-[16px] tracking-[0.05em] font-semibold">
                    4.9/5
                  </span>
                </span>
              </div>

              <h2 className="font-display-lg text-[20px] md:text-[48px] leading-[26px] md:leading-[56px] tracking-[-0.02em] font-bold mb-2 md:mb-4">
                VEERAN: THE LEGEND OF THE KINGDOM
              </h2>

              <p className="font-body-lg text-[12px] md:text-[18px] leading-[18px] md:leading-[28px] text-on-surface-variant mb-4 md:mb-8 line-clamp-2 md:line-clamp-3 max-w-2xl">
                Experience the untold story of the Chola Empire&apos;s greatest unsung warrior. A visual
                masterpiece of Tamil cinema, directed by the visionary Master K. Rajan, featuring a
                soul-stirring score by global icons.
              </p>

              <div className="flex gap-2 md:gap-4">
                <button className="bg-primary-container text-on-primary-container px-4 md:px-8 py-2 md:py-4 rounded-lg md:rounded-xl flex items-center gap-1 md:gap-2 font-headline-md text-[14px] md:text-[24px] leading-[20px] md:leading-[32px] font-semibold hover:scale-105 transition-transform duration-300">
                  <span className="material-symbols-outlined text-[18px] md:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    play_arrow
                  </span>
                  <span className="hidden md:inline">Watch Now</span>
                  <span className="md:hidden">Play</span>
                </button>
                <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 md:px-8 py-2 md:py-4 rounded-lg md:rounded-xl flex items-center gap-1 md:gap-2 font-headline-md text-[14px] md:text-[24px] leading-[20px] md:leading-[32px] font-semibold hover:bg-white/20 transition-all duration-300">
                  <span className="material-symbols-outlined text-[18px] md:text-[24px]">info</span>
                  <span className="hidden md:inline">More Info</span>
                  <span className="md:hidden">Info</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <div className="relative z-20 mt-6 md:-mt-32 px-4 md:px-margin-desktop pb-12 md:pb-20 space-y-6 md:space-y-12">
          <MovieCarousel title="Trending Now" movies={trendingMovies} />
          <MovieCarousel title="New Releases" movies={trendingMovies} />
          <MovieCarousel title="Tamil Classics" movies={trendingMovies} />
          <MovieCarousel title="Kollywood Blockbusters" movies={trendingMovies} />
        </div>
      </main>
    </div>
  );
}
