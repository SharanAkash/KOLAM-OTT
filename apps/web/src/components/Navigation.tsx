'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { User, isAdmin } from '@/lib/auth';
import { API_ENDPOINTS } from '@/lib/api';

interface SearchResult {
  id: string;
  title: string;
  thumbnail: string;
  type: string;
  releaseYear: number;
  genres: string[];
}

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search with auto-suggestions
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If search query is empty, clear results
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Set searching state
    setIsSearching(true);

    // Debounce search API call by 300ms
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(API_ENDPOINTS.movies.search(searchQuery, 5));

        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const getLinkClassName = (path: string) => {
    const baseClasses = "font-label-sm text-[12px] leading-[16px] tracking-[0.05em] font-semibold pb-1 transition-all duration-300 relative group";

    if (isActive(path)) {
      return `${baseClasses} text-primary-fixed-dim border-b-2 border-primary-fixed-dim`;
    }

    return `${baseClasses} text-on-surface-variant hover:text-primary-fixed-dim border-b-2 border-transparent hover:border-primary-fixed-dim`;
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/30 backdrop-blur-xl shadow-sm">
      <div className="flex justify-between items-center px-4 md:px-margin-desktop py-4 max-w-[1920px] mx-auto">
        {/* Left Section */}
        <div className="flex items-center gap-4 md:gap-12">
          <Link href="/">
            <h1 className="font-display-lg text-[24px] md:text-[48px] leading-[32px] md:leading-[56px] tracking-tighter text-primary-fixed-dim font-bold">
              J S Tamil Cinemas
            </h1>
          </Link>
          <div className="hidden lg:flex gap-8">
            <Link href="/" className={getLinkClassName('/')}>
              Home
            </Link>
            <Link href="/movies" className={getLinkClassName('/movies')}>
              Movies
            </Link>
            <Link href="/series" className={getLinkClassName('/series')}>
              Series
            </Link>
            <Link href="/live" className={getLinkClassName('/live')}>
              Live TV
            </Link>
            <Link href="/my-list" className={getLinkClassName('/my-list')}>
              My List
            </Link>

            {/* Admin Link - Only visible to admin users */}
            {isLoggedIn && currentUser && isAdmin(currentUser) && (
              <Link href="/admin" className={`${getLinkClassName('/admin')} flex items-center gap-1`}>
                <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                Admin
              </Link>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Search Button */}
          <div className="hidden md:block relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              <span className="material-symbols-outlined">search</span>
            </button>

            {/* Search Dropdown */}
            {searchOpen && (
              <div className="absolute right-0 top-12 w-96 bg-surface-container-high rounded-xl shadow-2xl border border-outline-variant p-4 z-50">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-on-surface-variant">search</span>
                  <input
                    type="text"
                    placeholder="Search movies, series..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchResults.length > 0) {
                        const firstResult = searchResults[0];
                        router.push(`/movie/${firstResult.id}`);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }
                    }}
                    className="flex-1 bg-transparent text-on-surface outline-none text-sm"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="text-on-surface-variant hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  )}
                </div>

                {searchQuery ? (
                  <div className="space-y-2">
                    {isSearching ? (
                      <div className="text-sm text-on-surface-variant py-8 text-center flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="space-y-1 max-h-96 overflow-y-auto">
                        <p className="text-xs text-on-surface-variant mb-2">
                          Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                        </p>
                        {searchResults.map((result) => (
                          <Link
                            key={result.id}
                            href={`/movie/${result.id}`}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-highest transition-colors group"
                          >
                            <img
                              src={result.thumbnail}
                              alt={result.title}
                              className="w-12 h-16 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-on-surface font-medium truncate group-hover:text-primary-fixed-dim">
                                {result.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-on-surface-variant">
                                  {result.type} • {result.releaseYear}
                                </span>
                              </div>
                              {result.genres && result.genres.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {result.genres.slice(0, 2).map((genre, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] px-1.5 py-0.5 bg-surface-container rounded text-on-surface-variant"
                                    >
                                      {genre}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <span className="material-symbols-outlined text-on-surface-variant text-sm">
                              arrow_forward
                            </span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-on-surface-variant py-8 text-center">
                        No results found. Try different keywords.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-on-surface-variant mb-3">Popular Searches</p>
                    {['Action', 'Drama', 'Comedy', 'Thriller'].map((item) => (
                      <button
                        key={item}
                        onClick={() => setSearchQuery(item)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-container-highest transition-colors text-sm text-on-surface"
                      >
                        <span className="material-symbols-outlined text-xs mr-2">trending_up</span>
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <div className="hidden md:block relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="text-on-surface-variant hover:text-primary transition-colors duration-300 relative"
            >
              <span className="material-symbols-outlined">notifications</span>
              {/* Notification Badge */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-96 bg-surface-container-high rounded-xl shadow-2xl border border-outline-variant z-50 max-h-[500px] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-outline-variant flex justify-between items-center">
                  <h3 className="font-semibold text-on-surface">Notifications</h3>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-on-surface-variant hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>

                <div className="overflow-y-auto">
                  {/* Sample Notifications */}
                  <div className="divide-y divide-outline-variant">
                    <button className="w-full p-4 hover:bg-surface-container-highest transition-colors text-left">
                      <div className="flex gap-3">
                        <div className="w-2 h-2 bg-primary-fixed-dim rounded-full mt-1.5"></div>
                        <div className="flex-1">
                          <p className="text-sm text-on-surface font-medium mb-1">New Release: Vikram</p>
                          <p className="text-xs text-on-surface-variant">The latest action thriller is now available</p>
                          <p className="text-xs text-on-surface-variant mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </button>

                    <button className="w-full p-4 hover:bg-surface-container-highest transition-colors text-left">
                      <div className="flex gap-3">
                        <div className="w-2 h-2 bg-primary-fixed-dim rounded-full mt-1.5"></div>
                        <div className="flex-1">
                          <p className="text-sm text-on-surface font-medium mb-1">Subscription Expiring Soon</p>
                          <p className="text-xs text-on-surface-variant">Your premium plan expires in 5 days</p>
                          <p className="text-xs text-on-surface-variant mt-1">1 day ago</p>
                        </div>
                      </div>
                    </button>

                    <button className="w-full p-4 hover:bg-surface-container-highest transition-colors text-left">
                      <div className="flex gap-3">
                        <div className="w-2 h-2 bg-primary-fixed-dim rounded-full mt-1.5"></div>
                        <div className="flex-1">
                          <p className="text-sm text-on-surface font-medium mb-1">New Episodes Added</p>
                          <p className="text-xs text-on-surface-variant">3 new episodes of your favorite series</p>
                          <p className="text-xs text-on-surface-variant mt-1">2 days ago</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="p-3 border-t border-outline-variant">
                  <button className="w-full text-center text-sm text-primary-fixed-dim hover:text-primary font-semibold">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {isLoggedIn ? (
            <>
              <Link href="/profile" className="hidden md:block">
                <div className="relative group cursor-pointer flex items-center gap-3 bg-surface-container-high px-3 py-1.5 rounded-full border border-outline-variant hover:border-primary-fixed-dim transition-all">
                  <img
                    alt="User Profile"
                    className="w-8 h-8 rounded-full object-cover"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                  />
                  <div className="flex flex-col leading-none">
                    <span className="text-[10px] font-bold text-primary-fixed-dim tracking-widest uppercase">
                      {currentUser && isAdmin(currentUser) ? 'Admin' : 'Gold Member'}
                    </span>
                    <span className="font-label-sm text-[12px] leading-[16px] tracking-[0.05em] font-semibold">
                      {currentUser?.name || 'Akash R.'}
                    </span>
                  </div>
                </div>
              </Link>
              <Link href="/profile" className="md:hidden">
                <img
                  alt="User Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-primary-fixed-dim"
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                />
              </Link>
              {/* Subscribe Button - Hidden for admin users */}
              {!isAdmin(currentUser) && (
                <Link href="/subscribe" className="hidden md:block">
                  <button className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-label-sm text-[12px] leading-[16px] tracking-[0.05em] font-semibold hover:scale-95 transition-all duration-150 active:scale-90">
                    Subscribe
                  </button>
                </Link>
              )}
            </>
          ) : (
            <Link href="/login">
              <button className="bg-primary-container text-on-primary-container px-4 md:px-6 py-2 rounded-full font-label-sm text-[10px] md:text-[12px] leading-[16px] tracking-[0.05em] font-semibold hover:scale-95 transition-all duration-150 active:scale-90">
                Sign In
              </button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[28px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container backdrop-blur-xl border-t border-outline-variant">
          <div className="flex flex-col px-4 py-4 space-y-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`${getLinkClassName('/')} text-[14px] py-2`}
            >
              Home
            </Link>
            <Link
              href="/movies"
              onClick={() => setMobileMenuOpen(false)}
              className={`${getLinkClassName('/movies')} text-[14px] py-2`}
            >
              Movies
            </Link>
            <Link
              href="/series"
              onClick={() => setMobileMenuOpen(false)}
              className={`${getLinkClassName('/series')} text-[14px] py-2`}
            >
              Series
            </Link>
            <Link
              href="/live"
              onClick={() => setMobileMenuOpen(false)}
              className={`${getLinkClassName('/live')} text-[14px] py-2`}
            >
              Live TV
            </Link>
            <Link
              href="/my-list"
              onClick={() => setMobileMenuOpen(false)}
              className={`${getLinkClassName('/my-list')} text-[14px] py-2`}
            >
              My List
            </Link>
            {isLoggedIn && currentUser && isAdmin(currentUser) && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`${getLinkClassName('/admin')} text-[14px] py-2 flex items-center gap-2`}
              >
                <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                Admin
              </Link>
            )}
            <div className="pt-4 border-t border-outline-variant space-y-3">
              <button
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-on-surface-variant hover:text-primary transition-colors flex items-center gap-3 py-2"
              >
                <span className="material-symbols-outlined">search</span>
                <span className="text-[14px] font-semibold">Search</span>
              </button>
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-on-surface-variant hover:text-primary transition-colors flex items-center gap-3 py-2 relative"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="text-[14px] font-semibold">Notifications</span>
                <span className="ml-auto w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                  3
                </span>
              </button>
              {/* Subscribe Button - Hidden for admin users (Mobile) */}
              {isLoggedIn && !isAdmin(currentUser) && (
                <Link href="/subscribe" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full bg-primary-container text-on-primary-container px-6 py-3 rounded-full text-[14px] font-semibold hover:scale-95 transition-all">
                    Subscribe Now
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
