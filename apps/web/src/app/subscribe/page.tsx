'use client';

import Navigation from '@/components/Navigation';
import { useState } from 'react';

export default function SubscribePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('Gold');

  const handleSubscribe = (planName: string, price: number) => {
    // Store selected plan in localStorage
    localStorage.setItem('selectedPlan', JSON.stringify({
      name: planName,
      price: price,
      billingCycle: billingCycle,
    }));
    // Navigate to payment page
    window.location.href = '/payment';
  };

  const plans = [
    {
      name: 'Basic',
      price: billingCycle === 'monthly' ? 199 : 1990,
      features: [
        '720p Resolution',
        '1 Device',
        'Ads supported',
        'Limited downloads',
        'Access to movies & series',
      ],
      popular: false,
    },
    {
      name: 'Gold',
      price: billingCycle === 'monthly' ? 399 : 3990,
      features: [
        '1080p HD Resolution',
        '2 Devices simultaneously',
        'Ad-free experience',
        'Unlimited downloads',
        'Early access to new releases',
        'Exclusive premium content',
      ],
      popular: true,
    },
    {
      name: 'Premium',
      price: billingCycle === 'monthly' ? 599 : 5990,
      features: [
        '4K Ultra HD + HDR',
        '4 Devices simultaneously',
        'Ad-free experience',
        'Unlimited downloads',
        'Early access & behind-the-scenes',
        'All exclusive content',
        'Live event streaming',
        '24/7 Priority support',
      ],
      popular: false,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-black">
      <Navigation />

      <main className="pt-24 md:pt-32 pb-20 px-4 md:px-margin-desktop">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="font-display-lg text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] tracking-[-0.02em] font-bold text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="font-body-lg text-[14px] md:text-[18px] leading-[22px] md:leading-[28px] text-on-surface-variant max-w-2xl mx-auto">
              Unlimited Tamil cinema. Watch anywhere, anytime. Cancel anytime.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`font-body-md text-[16px] leading-[24px] ${billingCycle === 'monthly' ? 'text-on-surface' : 'text-on-surface-variant'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 bg-surface-container-high rounded-full transition-colors duration-300"
              style={{
                backgroundColor: billingCycle === 'yearly' ? 'var(--color-primary-container)' : undefined,
              }}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                  billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`font-body-md text-[16px] leading-[24px] ${billingCycle === 'yearly' ? 'text-on-surface' : 'text-on-surface-variant'}`}>
              Yearly
              <span className="ml-2 text-primary-fixed-dim text-[12px] font-semibold">Save 17%</span>
            </span>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                onClick={() => setSelectedPlan(plan.name)}
                className={`relative bg-surface-container-low rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 cursor-pointer flex flex-col ${
                  selectedPlan === plan.name
                    ? 'border-primary-fixed-dim shadow-2xl shadow-primary-fixed-dim/20'
                    : 'border-outline-variant'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-container text-on-primary-container px-4 py-1 rounded-full font-label-sm text-[12px] leading-[16px] tracking-[0.05em] font-semibold">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="font-headline-md text-[24px] leading-[32px] font-semibold text-on-surface mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-primary-fixed-dim font-display-lg text-[48px] leading-[56px] tracking-[-0.02em] font-bold">
                      ₹{plan.price}
                    </span>
                    <span className="text-on-surface-variant font-body-md text-[16px] leading-[24px]">
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span
                        className="material-symbols-outlined text-primary-fixed-dim flex-shrink-0"
                        style={{ fontVariationSettings: "'FILL' 1", fontSize: '20px' }}
                      >
                        check_circle
                      </span>
                      <span className="font-body-md text-[16px] leading-[24px] text-on-surface-variant">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubscribe(plan.name, plan.price);
                  }}
                  className={`w-full py-3 rounded-full font-headline-md text-[20px] leading-[28px] font-semibold transition-all duration-300 cursor-pointer mt-auto ${
                    selectedPlan === plan.name
                      ? 'bg-primary-container text-on-primary-container hover:scale-[0.98] active:scale-95'
                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <span className="material-symbols-outlined text-primary-fixed-dim text-[48px] mb-4 block">
                devices
              </span>
              <h4 className="font-headline-md text-[20px] leading-[28px] font-semibold text-on-surface mb-2">
                Watch Anywhere
              </h4>
              <p className="text-on-surface-variant font-body-md text-[16px] leading-[24px]">
                Stream on your phone, tablet, laptop, and TV
              </p>
            </div>

            <div className="text-center">
              <span className="material-symbols-outlined text-primary-fixed-dim text-[48px] mb-4 block">
                download
              </span>
              <h4 className="font-headline-md text-[20px] leading-[28px] font-semibold text-on-surface mb-2">
                Download & Go
              </h4>
              <p className="text-on-surface-variant font-body-md text-[16px] leading-[24px]">
                Watch offline without internet connection
              </p>
            </div>

            <div className="text-center">
              <span className="material-symbols-outlined text-primary-fixed-dim text-[48px] mb-4 block">
                cancel
              </span>
              <h4 className="font-headline-md text-[20px] leading-[28px] font-semibold text-on-surface mb-2">
                Cancel Anytime
              </h4>
              <p className="text-on-surface-variant font-body-md text-[16px] leading-[24px]">
                No contracts, no cancellation fees
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
