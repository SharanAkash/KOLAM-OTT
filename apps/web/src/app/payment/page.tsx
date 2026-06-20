'use client';

import Navigation from '@/components/Navigation';
import { useState, useEffect } from 'react';

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const plan = localStorage.getItem('selectedPlan');
    if (plan) {
      setSelectedPlan(JSON.parse(plan));
    } else {
      window.location.href = '/subscribe';
    }
  }, []);

  const handlePayment = async () => {
    if (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv)) {
      alert('Please fill in all card details');
      return;
    }

    if (paymentMethod === 'upi' && !upiId) {
      alert('Please enter your UPI ID');
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(async () => {
      setProcessing(false);

      // Store subscription in localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.subscription = selectedPlan?.name;
      localStorage.setItem('user', JSON.stringify(user));

      // Generate order ID
      const orderId = 'ORD' + Date.now().toString().slice(-8);
      const totalAmount = selectedPlan.price + Math.round(selectedPlan.price * 0.18);

      // Store order details for success page
      const orderDetails = {
        orderId: orderId,
        plan: selectedPlan.name,
        billingCycle: selectedPlan.billingCycle,
        amount: selectedPlan.price,
        gst: Math.round(selectedPlan.price * 0.18),
        totalAmount: totalAmount,
        paymentMethod: paymentMethod,
        date: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      };

      localStorage.setItem('completedOrder', JSON.stringify(orderDetails));

      // Send invoice email
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const emailData = {
        email: currentUser.email || 'customer@example.com',
        name: currentUser.name || 'Valued Customer',
        ...orderDetails,
      };

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const emailResponse = await fetch(`${apiUrl}/email/send-invoice`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });

        const emailResult = await emailResponse.json();
        console.log('Email sent:', emailResult);

        // Store email preview URL if available
        if (emailResult.previewUrl) {
          localStorage.setItem('invoicePreviewUrl', emailResult.previewUrl);
        }
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't block the success flow if email fails
      }

      // Redirect to success page
      window.location.href = '/payment-success';
    }, 2000);
  };

  if (!selectedPlan) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-surface">
      <Navigation />

      <main className="px-4 md:px-margin-desktop py-12 pt-24 md:pt-32 max-w-[1200px] mx-auto">
        <div className="mb-8">
          <h1 className="font-display-lg text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] font-bold mb-2">
            Complete Your Payment
          </h1>
          <p className="font-body-lg text-sm md:text-base text-on-surface-variant">
            Secure payment powered by trusted payment gateways
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <div className="bg-surface-container rounded-2xl p-6">
              <h2 className="font-headline-lg text-[24px] leading-[32px] font-semibold mb-6">
                Select Payment Method
              </h2>

              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-primary-fixed-dim bg-primary-container/20'
                      : 'border-outline-variant hover:border-primary-fixed-dim/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[32px] text-primary-fixed-dim mb-2 block">
                    credit_card
                  </span>
                  <p className="font-semibold">Card</p>
                </button>

                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-primary-fixed-dim bg-primary-container/20'
                      : 'border-outline-variant hover:border-primary-fixed-dim/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[32px] text-primary-fixed-dim mb-2 block">
                    payment
                  </span>
                  <p className="font-semibold">UPI</p>
                </button>

                <button
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-primary-fixed-dim bg-primary-container/20'
                      : 'border-outline-variant hover:border-primary-fixed-dim/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[32px] text-primary-fixed-dim mb-2 block">
                    account_balance
                  </span>
                  <p className="font-semibold">Net Banking</p>
                </button>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-surface-container rounded-2xl p-6">
              <h2 className="font-headline-lg text-[24px] leading-[32px] font-semibold mb-6">
                Payment Details
              </h2>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-on-surface font-semibold mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none"
                      maxLength={19}
                    />
                  </div>

                  <div>
                    <label className="block text-on-surface font-semibold mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-on-surface font-semibold mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none"
                        maxLength={5}
                      />
                    </div>

                    <div>
                      <label className="block text-on-surface font-semibold mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div>
                  <label className="block text-on-surface font-semibold mb-2">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none"
                  />
                  <p className="text-sm text-on-surface-variant mt-2">
                    You'll be redirected to your UPI app to complete payment
                  </p>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div>
                  <label className="block text-on-surface font-semibold mb-2">
                    Select Bank
                  </label>
                  <select className="w-full bg-surface-container-high text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none">
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                    <option>Punjab National Bank</option>
                  </select>
                </div>
              )}
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-primary-container text-on-primary-container px-8 py-4 rounded-xl font-headline-md text-[20px] leading-[28px] font-semibold hover:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">lock</span>
                  Pay ₹{selectedPlan.price}
                </>
              )}
            </button>

            <p className="text-center text-sm text-on-surface-variant">
              🔒 Your payment is secured with 256-bit SSL encryption
            </p>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface-container rounded-2xl p-6 sticky top-32">
              <h2 className="font-headline-lg text-[24px] leading-[32px] font-semibold mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4 p-4 bg-surface rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary-container">
                      workspace_premium
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-on-surface">{selectedPlan.name} Plan</p>
                    <p className="text-sm text-on-surface-variant">
                      {selectedPlan.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} billing
                    </p>
                  </div>
                </div>

                <div className="border-t border-outline-variant pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Subtotal</span>
                    <span className="font-semibold">₹{selectedPlan.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">GST (18%)</span>
                    <span className="font-semibold">₹{Math.round(selectedPlan.price * 0.18)}</span>
                  </div>
                  <div className="border-t border-outline-variant pt-3 flex justify-between">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-primary-fixed-dim text-xl">
                      ₹{selectedPlan.price + Math.round(selectedPlan.price * 0.18)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-primary-container/20 rounded-xl p-4 border border-primary-fixed-dim/40">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-fixed-dim">
                    check_circle
                  </span>
                  <div>
                    <p className="font-semibold text-sm mb-1">What you get:</p>
                    <ul className="text-xs text-on-surface-variant space-y-1">
                      <li>✓ Unlimited streaming</li>
                      <li>✓ Cancel anytime</li>
                      <li>✓ HD/4K quality</li>
                      <li>✓ Multiple devices</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
