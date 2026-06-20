'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function PlatformSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'J S Tamil Cinemas',
    maintenanceMode: false,
    allowSignups: true,
    requireEmailVerification: true,
    maxDevicesPerUser: 3,
    videoQuality: '1080p',
    enableDownloads: true,
    enableSubtitles: true,
    defaultLanguage: 'Tamil',
    currency: 'INR',
    emailNotifications: true,
    pushNotifications: true,
  });

  const handleSave = () => {
    // TODO: Implement API call to save settings
    alert('Settings saved successfully!');
  };

  return (
    <div className="w-full min-h-screen bg-surface">
      <Navigation />

      <main className="px-margin-desktop py-12 pt-32 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary mb-4 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Dashboard
            </Link>
            <h1 className="font-display-lg text-[48px] leading-[56px] font-bold mb-2">
              Platform Settings
            </h1>
            <p className="font-body-lg text-on-surface-variant">
              Configure your KOLAM-OTT platform settings and preferences
            </p>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-surface-container rounded-2xl p-6">
            <h2 className="font-headline-lg text-[28px] leading-[36px] font-semibold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed-dim">tune</span>
              General Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-on-surface font-semibold mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-surface rounded-xl">
                <div>
                  <p className="font-semibold">Maintenance Mode</p>
                  <p className="text-sm text-on-surface-variant">Temporarily disable the platform for maintenance</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface rounded-xl">
                <div>
                  <p className="font-semibold">Allow New Signups</p>
                  <p className="text-sm text-on-surface-variant">Enable or disable new user registrations</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowSignups}
                    onChange={(e) => setSettings({ ...settings, allowSignups: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface rounded-xl">
                <div>
                  <p className="font-semibold">Require Email Verification</p>
                  <p className="text-sm text-on-surface-variant">Users must verify email before accessing content</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireEmailVerification}
                    onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Playback Settings */}
          <div className="bg-surface-container rounded-2xl p-6">
            <h2 className="font-headline-lg text-[28px] leading-[36px] font-semibold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed-dim">play_circle</span>
              Playback Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-on-surface font-semibold mb-2">
                  Max Devices Per User
                </label>
                <select
                  value={settings.maxDevicesPerUser}
                  onChange={(e) => setSettings({ ...settings, maxDevicesPerUser: parseInt(e.target.value) })}
                  className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none"
                >
                  <option value="1">1 Device</option>
                  <option value="2">2 Devices</option>
                  <option value="3">3 Devices</option>
                  <option value="5">5 Devices</option>
                  <option value="10">10 Devices</option>
                </select>
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-2">
                  Default Video Quality
                </label>
                <select
                  value={settings.videoQuality}
                  onChange={(e) => setSettings({ ...settings, videoQuality: e.target.value })}
                  className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none"
                >
                  <option value="360p">360p</option>
                  <option value="480p">480p</option>
                  <option value="720p">720p (HD)</option>
                  <option value="1080p">1080p (Full HD)</option>
                  <option value="4k">4K (Ultra HD)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface rounded-xl">
                <div>
                  <p className="font-semibold">Enable Downloads</p>
                  <p className="text-sm text-on-surface-variant">Allow users to download content for offline viewing</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableDownloads}
                    onChange={(e) => setSettings({ ...settings, enableDownloads: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface rounded-xl">
                <div>
                  <p className="font-semibold">Enable Subtitles</p>
                  <p className="text-sm text-on-surface-variant">Show subtitle options in video player</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableSubtitles}
                    onChange={(e) => setSettings({ ...settings, enableSubtitles: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Localization */}
          <div className="bg-surface-container rounded-2xl p-6">
            <h2 className="font-headline-lg text-[28px] leading-[36px] font-semibold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed-dim">language</span>
              Localization
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-on-surface font-semibold mb-2">
                  Default Language
                </label>
                <select
                  value={settings.defaultLanguage}
                  onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                  className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none"
                >
                  <option value="Tamil">Tamil</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Malayalam">Malayalam</option>
                </select>
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-2">
                  Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-surface-container rounded-2xl p-6">
            <h2 className="font-headline-lg text-[28px] leading-[36px] font-semibold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed-dim">notifications</span>
              Notifications
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface rounded-xl">
                <div>
                  <p className="font-semibold">Email Notifications</p>
                  <p className="text-sm text-on-surface-variant">Send email updates to users</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface rounded-xl">
                <div>
                  <p className="font-semibold">Push Notifications</p>
                  <p className="text-sm text-on-surface-variant">Send push notifications to user devices</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end gap-4">
          <Link href="/admin">
            <button className="px-6 py-3 rounded-xl font-semibold bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors">
              Cancel
            </button>
          </Link>
          <button
            onClick={handleSave}
            className="bg-primary-container text-on-primary-container px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform flex items-center gap-2"
          >
            <span className="material-symbols-outlined">save</span>
            Save Settings
          </button>
        </div>
      </main>
    </div>
  );
}
