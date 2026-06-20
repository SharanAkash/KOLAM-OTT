'use client';

import Navigation from '@/components/Navigation';
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage() {
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const order = localStorage.getItem('completedOrder');
    if (order) {
      setOrderDetails(JSON.parse(order));
    } else {
      window.location.href = '/subscribe';
    }
  }, []);

  if (!orderDetails) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-surface">
      <Navigation />

      <main className="px-4 md:px-margin-desktop py-12 pt-24 md:pt-32 max-w-[800px] mx-auto">
        <div className="bg-surface-container rounded-2xl p-8 md:p-12 text-center">
          {/* Success Animation */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-green-500 text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
          </div>

          <h1 className="font-display-lg text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] font-bold mb-4 text-green-500">
            Payment Successful! 🎉
          </h1>

          <p className="font-body-lg text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-on-surface-variant mb-8">
            Welcome to J S Tamil Cinemas <span className="text-primary-fixed-dim font-bold">{orderDetails.plan}</span> Plan!
          </p>

          {/* Order Details Card */}
          <div className="bg-surface rounded-xl p-6 mb-8 text-left">
            <h2 className="font-headline-lg text-[20px] leading-[28px] font-semibold mb-4 text-center">
              Order Details
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-outline-variant">
                <span className="text-on-surface-variant">Order ID</span>
                <span className="font-semibold">#{orderDetails.orderId}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-outline-variant">
                <span className="text-on-surface-variant">Plan</span>
                <span className="font-semibold">{orderDetails.plan}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-outline-variant">
                <span className="text-on-surface-variant">Billing Cycle</span>
                <span className="font-semibold capitalize">{orderDetails.billingCycle}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-outline-variant">
                <span className="text-on-surface-variant">Amount Paid</span>
                <span className="font-semibold text-primary-fixed-dim">
                  ₹{orderDetails.totalAmount}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-outline-variant">
                <span className="text-on-surface-variant">Payment Method</span>
                <span className="font-semibold capitalize">{orderDetails.paymentMethod}</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-on-surface-variant">Date</span>
                <span className="font-semibold">{orderDetails.date}</span>
              </div>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="bg-primary-container/20 rounded-xl p-6 mb-8 border border-primary-fixed-dim/40">
            <h3 className="font-headline-md text-[18px] leading-[24px] font-semibold mb-4 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed-dim">
                celebration
              </span>
              What's Next?
            </h3>

            <div className="text-left space-y-3">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary-fixed-dim flex-shrink-0">
                  check
                </span>
                <p className="text-sm text-on-surface-variant">
                  Your subscription is now active and ready to use
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary-fixed-dim flex-shrink-0">
                  check
                </span>
                <p className="text-sm text-on-surface-variant">
                  📧 Invoice email has been sent to your registered email address
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary-fixed-dim flex-shrink-0">
                  check
                </span>
                <p className="text-sm text-on-surface-variant">
                  Start watching unlimited movies and series right now!
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary-fixed-dim flex-shrink-0">
                  check
                </span>
                <p className="text-sm text-on-surface-variant">
                  Download the mobile app for watching on the go
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 bg-primary-container text-on-primary-container px-8 py-4 rounded-xl font-headline-md text-[18px] leading-[24px] font-semibold hover:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">play_arrow</span>
              Start Watching
            </button>

            <button
              onClick={() => window.location.href = '/receipt'}
              className="flex-1 bg-surface-container-high text-on-surface px-8 py-4 rounded-xl font-headline-md text-[18px] leading-[24px] font-semibold hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">receipt_long</span>
              View Receipt
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-outline-variant">
            <p className="text-sm text-on-surface-variant mb-2">
              Need help? Contact our support team
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <a href="mailto:support@jstamilcinemas.com" className="text-primary-fixed-dim hover:underline flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">email</span>
                Email Support
              </a>
              <span className="text-on-surface-variant">•</span>
              <a href="tel:+918888888888" className="text-primary-fixed-dim hover:underline flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">call</span>
                Call Us
              </a>
            </div>
          </div>
        </div>

        {/* Features Reminder */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-container rounded-xl p-4 text-center">
            <span className="material-symbols-outlined text-primary-fixed-dim text-[32px] mb-2 block">
              high_quality
            </span>
            <p className="font-semibold text-sm">HD/4K Quality</p>
            <p className="text-xs text-on-surface-variant mt-1">Crystal clear streaming</p>
          </div>

          <div className="bg-surface-container rounded-xl p-4 text-center">
            <span className="material-symbols-outlined text-primary-fixed-dim text-[32px] mb-2 block">
              download
            </span>
            <p className="font-semibold text-sm">Download & Watch</p>
            <p className="text-xs text-on-surface-variant mt-1">Offline viewing available</p>
          </div>

          <div className="bg-surface-container rounded-xl p-4 text-center">
            <span className="material-symbols-outlined text-primary-fixed-dim text-[32px] mb-2 block">
              devices
            </span>
            <p className="font-semibold text-sm">Multi-Device Access</p>
            <p className="text-xs text-on-surface-variant mt-1">Watch on all your devices</p>
          </div>
        </div>
      </main>
    </div>
  );
}
