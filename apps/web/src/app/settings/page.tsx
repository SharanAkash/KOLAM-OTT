'use client';

import Navigation from '@/components/Navigation';
import Link from 'next/link';
import React from 'react';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState('account');
  const [isEditingAccount, setIsEditingAccount] = React.useState(false);
  const [isEditingPassword, setIsEditingPassword] = React.useState(false);

  const [accountData, setAccountData] = React.useState({
    name: 'Akash R.',
    email: 'akash.r@example.com',
    phone: '+91 98765 43210',
  });

  const [tempAccountData, setTempAccountData] = React.useState(accountData);

  const [notifications, setNotifications] = React.useState({
    email: true,
    push: true,
    sms: false,
    newReleases: true,
    recommendations: true,
    watchReminders: false,
  });

  const [videoQuality, setVideoQuality] = React.useState('auto');
  const [autoplay, setAutoplay] = React.useState(true);
  const [subtitles, setSubtitles] = React.useState('off');

  const handleEditAccount = () => {
    setTempAccountData(accountData);
    setIsEditingAccount(true);
  };

  const handleSaveAccount = () => {
    setAccountData(tempAccountData);
    setIsEditingAccount(false);
  };

  const handleCancelAccount = () => {
    setTempAccountData(accountData);
    setIsEditingAccount(false);
  };

  return (
    <div className="w-full min-h-screen bg-black">
      <Navigation />

      <main className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/profile">
              <button className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[32px]">arrow_back</span>
              </button>
            </Link>
            <h1 className="font-display-lg text-[40px] leading-[48px] tracking-[-0.02em] font-bold text-white">
              Settings
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-surface-container rounded-xl p-4 space-y-2">
                <button
                  onClick={() => setActiveSection('account')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'account'
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">person</span>
                    <span className="font-semibold">Account</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveSection('playback')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'playback'
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">play_circle</span>
                    <span className="font-semibold">Playback</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveSection('notifications')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'notifications'
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="font-semibold">Notifications</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveSection('subscription')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'subscription'
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">card_membership</span>
                    <span className="font-semibold">Subscription</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveSection('privacy')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'privacy'
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">lock</span>
                    <span className="font-semibold">Privacy</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="md:col-span-3">
              {/* Account Section */}
              {activeSection === 'account' && (
                <div className="bg-surface-container rounded-xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-headline-md text-[24px] leading-[32px] font-semibold text-on-surface">
                      Account Information
                    </h2>
                    {!isEditingAccount && (
                      <button
                        onClick={handleEditAccount}
                        className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-semibold hover:scale-95 transition-all flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                        Edit
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-on-surface-variant text-sm mb-2">Name</label>
                      <input
                        type="text"
                        value={isEditingAccount ? tempAccountData.name : accountData.name}
                        onChange={(e) => isEditingAccount && setTempAccountData({ ...tempAccountData, name: e.target.value })}
                        readOnly={!isEditingAccount}
                        className={`w-full border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary-fixed-dim ${
                          isEditingAccount ? 'bg-surface-container-high' : 'bg-surface-container-highest cursor-not-allowed'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-on-surface-variant text-sm mb-2">Email</label>
                      <input
                        type="email"
                        value={isEditingAccount ? tempAccountData.email : accountData.email}
                        onChange={(e) => isEditingAccount && setTempAccountData({ ...tempAccountData, email: e.target.value })}
                        readOnly={!isEditingAccount}
                        className={`w-full border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary-fixed-dim ${
                          isEditingAccount ? 'bg-surface-container-high' : 'bg-surface-container-highest cursor-not-allowed'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-on-surface-variant text-sm mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={isEditingAccount ? tempAccountData.phone : accountData.phone}
                        onChange={(e) => isEditingAccount && setTempAccountData({ ...tempAccountData, phone: e.target.value })}
                        readOnly={!isEditingAccount}
                        className={`w-full border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary-fixed-dim ${
                          isEditingAccount ? 'bg-surface-container-high' : 'bg-surface-container-highest cursor-not-allowed'
                        }`}
                      />
                    </div>

                    {isEditingAccount && (
                      <div className="pt-4 flex gap-3">
                        <button
                          onClick={handleSaveAccount}
                          className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-semibold hover:scale-95 transition-all"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancelAccount}
                          className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-outline-variant pt-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-on-surface">Change Password</h3>
                      {!isEditingPassword && (
                        <button
                          onClick={() => setIsEditingPassword(true)}
                          className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-semibold hover:scale-95 transition-all flex items-center gap-2 text-sm"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                          Edit
                        </button>
                      )}
                    </div>

                    {isEditingPassword ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-on-surface-variant text-sm mb-2">Current Password</label>
                          <input
                            type="password"
                            className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary-fixed-dim"
                          />
                        </div>
                        <div>
                          <label className="block text-on-surface-variant text-sm mb-2">New Password</label>
                          <input
                            type="password"
                            className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary-fixed-dim"
                          />
                        </div>
                        <div>
                          <label className="block text-on-surface-variant text-sm mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary-fixed-dim"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setIsEditingPassword(false)}
                            className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-semibold hover:scale-95 transition-all"
                          >
                            Update Password
                          </button>
                          <button
                            onClick={() => setIsEditingPassword(false)}
                            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-on-surface-variant text-sm">
                        Click edit to change your password
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Playback Section */}
              {activeSection === 'playback' && (
                <div className="bg-surface-container rounded-xl p-6 space-y-6">
                  <h2 className="font-headline-md text-[24px] leading-[32px] font-semibold text-on-surface">
                    Playback Settings
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-on-surface font-semibold mb-3">Video Quality</label>
                      <div className="space-y-2">
                        {['auto', 'high', 'medium', 'low'].map((quality) => (
                          <label key={quality} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="quality"
                              value={quality}
                              checked={videoQuality === quality}
                              onChange={(e) => setVideoQuality(e.target.value)}
                              className="w-5 h-5 text-primary-fixed-dim"
                            />
                            <span className="text-on-surface capitalize">{quality}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-outline-variant pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-on-surface">Autoplay Next Episode</h3>
                          <p className="text-sm text-on-surface-variant">Automatically play the next episode</p>
                        </div>
                        <button
                          onClick={() => setAutoplay(!autoplay)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            autoplay ? 'bg-primary-fixed-dim' : 'bg-surface-container-highest'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white transition-transform ${
                              autoplay ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          ></div>
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-outline-variant pt-6">
                      <label className="block text-on-surface font-semibold mb-3">Default Subtitles</label>
                      <select
                        value={subtitles}
                        onChange={(e) => setSubtitles(e.target.value)}
                        className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary-fixed-dim"
                      >
                        <option value="off">Off</option>
                        <option value="english">English</option>
                        <option value="tamil">Tamil</option>
                        <option value="hindi">Hindi</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="bg-surface-container rounded-xl p-6 space-y-6">
                  <h2 className="font-headline-md text-[24px] leading-[32px] font-semibold text-on-surface">
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-outline-variant">
                      <div>
                        <h3 className="font-semibold text-on-surface">Email Notifications</h3>
                        <p className="text-sm text-on-surface-variant">Receive updates via email</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.email ? 'bg-primary-fixed-dim' : 'bg-surface-container-highest'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            notifications.email ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        ></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-outline-variant">
                      <div>
                        <h3 className="font-semibold text-on-surface">Push Notifications</h3>
                        <p className="text-sm text-on-surface-variant">Receive updates on your device</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.push ? 'bg-primary-fixed-dim' : 'bg-surface-container-highest'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            notifications.push ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        ></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-outline-variant">
                      <div>
                        <h3 className="font-semibold text-on-surface">SMS Notifications</h3>
                        <p className="text-sm text-on-surface-variant">Receive updates via text message</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, sms: !notifications.sms })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.sms ? 'bg-primary-fixed-dim' : 'bg-surface-container-highest'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            notifications.sms ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        ></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-outline-variant">
                      <div>
                        <h3 className="font-semibold text-on-surface">New Releases</h3>
                        <p className="text-sm text-on-surface-variant">Get notified about new content</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, newReleases: !notifications.newReleases })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.newReleases ? 'bg-primary-fixed-dim' : 'bg-surface-container-highest'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            notifications.newReleases ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        ></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-outline-variant">
                      <div>
                        <h3 className="font-semibold text-on-surface">Recommendations</h3>
                        <p className="text-sm text-on-surface-variant">Personalized content suggestions</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, recommendations: !notifications.recommendations })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.recommendations ? 'bg-primary-fixed-dim' : 'bg-surface-container-highest'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            notifications.recommendations ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        ></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h3 className="font-semibold text-on-surface">Watch Reminders</h3>
                        <p className="text-sm text-on-surface-variant">Remind me to finish watching</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, watchReminders: !notifications.watchReminders })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.watchReminders ? 'bg-primary-fixed-dim' : 'bg-surface-container-highest'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            notifications.watchReminders ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        ></div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Subscription Section */}
              {activeSection === 'subscription' && (
                <div className="bg-surface-container rounded-xl p-6 space-y-6">
                  <h2 className="font-headline-md text-[24px] leading-[32px] font-semibold text-on-surface">
                    Subscription Details
                  </h2>

                  <div className="bg-primary-container/20 border border-primary-fixed-dim rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-on-surface text-xl">Gold Member</h3>
                      <span className="bg-primary-container text-on-primary-container px-4 py-1 rounded-full text-sm font-semibold">
                        Active
                      </span>
                    </div>
                    <p className="text-on-surface-variant mb-4">
                      Next billing date: <span className="text-on-surface font-semibold">July 17, 2026</span>
                    </p>
                    <p className="text-on-surface-variant mb-6">
                      Amount: <span className="text-on-surface font-semibold">₹999/month</span>
                    </p>
                    <div className="flex gap-3">
                      <Link href="/subscribe">
                        <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-semibold hover:scale-95 transition-all">
                          Upgrade Plan
                        </button>
                      </Link>
                      <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all">
                        Cancel Subscription
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-outline-variant pt-6">
                    <h3 className="font-semibold text-on-surface mb-4">Payment Method</h3>
                    <div className="bg-surface-container-high rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-[40px] text-on-surface-variant">
                          credit_card
                        </span>
                        <div>
                          <p className="text-on-surface font-semibold">•••• •••• •••• 4242</p>
                          <p className="text-on-surface-variant text-sm">Expires 12/2027</p>
                        </div>
                      </div>
                      <button className="text-primary-fixed-dim font-semibold hover:underline">
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Section */}
              {activeSection === 'privacy' && (
                <div className="bg-surface-container rounded-xl p-6 space-y-6">
                  <h2 className="font-headline-md text-[24px] leading-[32px] font-semibold text-on-surface">
                    Privacy & Security
                  </h2>

                  <div className="space-y-4">
                    <div className="py-3 border-b border-outline-variant">
                      <h3 className="font-semibold text-on-surface mb-2">Watch History</h3>
                      <p className="text-sm text-on-surface-variant mb-3">
                        Control who can see what you've watched
                      </p>
                      <button className="text-primary-fixed-dim font-semibold hover:underline">
                        Clear Watch History
                      </button>
                    </div>

                    <div className="py-3 border-b border-outline-variant">
                      <h3 className="font-semibold text-on-surface mb-2">Download History</h3>
                      <p className="text-sm text-on-surface-variant mb-3">
                        Manage your downloaded content
                      </p>
                      <button className="text-primary-fixed-dim font-semibold hover:underline">
                        Clear Downloads
                      </button>
                    </div>

                    <div className="py-3 border-b border-outline-variant">
                      <h3 className="font-semibold text-on-surface mb-2">Data & Privacy</h3>
                      <p className="text-sm text-on-surface-variant mb-3">
                        Review how we use your data
                      </p>
                      <button className="text-primary-fixed-dim font-semibold hover:underline">
                        View Privacy Policy
                      </button>
                    </div>

                    <div className="py-3">
                      <h3 className="font-semibold text-on-surface mb-2">Delete Account</h3>
                      <p className="text-sm text-on-surface-variant mb-3">
                        Permanently delete your account and all data
                      </p>
                      <button className="text-red-500 font-semibold hover:underline">
                        Delete My Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
