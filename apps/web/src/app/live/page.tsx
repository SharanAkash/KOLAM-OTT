'use client';

import Navigation from '@/components/Navigation';

export default function LivePage() {
  // Mock data - TODO: Replace with API calls
  const liveChannels = [
    {
      id: '1',
      name: 'Sun TV',
      image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=300&fit=crop',
      isLive: true,
      currentShow: 'Tamil News @ 4 PM',
      viewers: '125K',
    },
    {
      id: '2',
      name: 'Star Vijay',
      image: 'https://images.unsplash.com/photo-1574267432644-f610bcb5b103?w=400&h=300&fit=crop',
      isLive: true,
      currentShow: 'Bigg Boss Tamil',
      viewers: '450K',
    },
    {
      id: '3',
      name: 'Zee Tamil',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=300&fit=crop',
      isLive: true,
      currentShow: 'Tamil Cinema Special',
      viewers: '89K',
    },
    {
      id: '4',
      name: 'Colors Tamil',
      image: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=300&fit=crop',
      isLive: true,
      currentShow: 'Evening Entertainment',
      viewers: '67K',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-surface">
      <Navigation />

      <main className="w-full px-margin-desktop pt-24 pb-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display-lg text-[48px] leading-[56px] tracking-[-0.02em] font-bold">
              Live TV
            </h1>
            <span className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span className="font-label-sm text-[12px] leading-[16px] font-semibold">LIVE</span>
            </span>
          </div>
          <p className="font-body-lg text-[18px] leading-[28px] text-on-surface-variant">
            Watch your favorite Tamil channels live
          </p>
        </div>

        {/* Live Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {liveChannels.map((channel) => (
            <a
              key={channel.id}
              href={`/live/${channel.id}`}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-surface-container-highest">
                <img
                  src={channel.image}
                  alt={channel.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Live Badge */}
                {channel.isLive && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-lg flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    <span className="font-label-sm text-[12px] leading-[16px] font-semibold">LIVE</span>
                  </div>
                )}

                {/* Viewers Count */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-white">
                    visibility
                  </span>
                  <span className="text-white font-label-sm text-[12px] leading-[16px] font-semibold">
                    {channel.viewers}
                  </span>
                </div>

                {/* Current Show */}
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-body-sm text-[14px] leading-[20px] line-clamp-1">
                    {channel.currentShow}
                  </p>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                  <div className="bg-primary-container text-on-primary-container p-4 rounded-full">
                    <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      play_arrow
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="font-headline-sm text-[16px] leading-[24px] font-semibold mb-1 group-hover:text-primary transition-colors duration-200">
                {channel.name}
              </h3>
            </a>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 p-8 bg-surface-container-high rounded-2xl text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-3 block">
            schedule
          </span>
          <h3 className="font-headline-lg text-[24px] leading-[32px] font-semibold mb-2">
            More Channels Coming Soon
          </h3>
          <p className="font-body-lg text-[16px] leading-[24px] text-on-surface-variant">
            We're adding more Tamil channels to give you the best live TV experience
          </p>
        </div>
      </main>
    </div>
  );
}
