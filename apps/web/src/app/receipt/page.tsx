'use client';

import Navigation from '@/components/Navigation';
import { useEffect, useState } from 'react';

export default function ReceiptPage() {
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const order = localStorage.getItem('completedOrder');
    if (order) {
      setOrderDetails(JSON.parse(order));
    } else {
      window.location.href = '/subscribe';
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Receipt download feature coming soon! For now, please use Print to save as PDF.');
  };

  if (!orderDetails) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-surface">
      <Navigation />

      <main className="px-4 md:px-margin-desktop py-12 pt-24 md:pt-32 max-w-[900px] mx-auto">
        {/* Action Buttons - Hidden when printing */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <button
            onClick={() => window.location.href = '/'}
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Home
          </button>

          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="bg-surface-container-high text-on-surface px-4 py-2 rounded-lg font-semibold hover:bg-surface-container-highest transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined">print</span>
              Print
            </button>
            <button
              onClick={handleDownload}
              className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform flex items-center gap-2"
            >
              <span className="material-symbols-outlined">download</span>
              Download PDF
            </button>
          </div>
        </div>

        {/* Receipt Card */}
        <div className="bg-white text-black rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-8 text-black">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="font-display-lg text-[32px] md:text-[40px] leading-[40px] md:leading-[48px] font-bold mb-2">
                  J S Tamil Cinemas
                </h1>
                <p className="text-sm opacity-90">Premium Tamil Entertainment Platform</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold mb-1">RECEIPT</p>
                <p className="text-xs opacity-90">Tax Invoice</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-black/20">
              <div>
                <p className="text-xs font-semibold mb-1">Order ID</p>
                <p className="text-lg font-bold">#{orderDetails.orderId}</p>
              </div>
              <div className="md:text-right">
                <p className="text-xs font-semibold mb-1">Date</p>
                <p className="text-lg font-bold">{orderDetails.date}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {/* Company Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase">From</h3>
                <p className="font-semibold text-lg mb-1">J S Tamil Cinemas Pvt. Ltd.</p>
                <p className="text-sm text-gray-600">
                  #123, Cinema Street<br />
                  Chennai, Tamil Nadu - 600001<br />
                  India
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold">GSTIN:</span> 33AABCU9603R1ZX<br />
                  <span className="font-semibold">CIN:</span> U74999TN2024PTC123456
                </p>
              </div>

              <div className="md:text-right">
                <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Bill To</h3>
                <p className="font-semibold text-lg mb-1">
                  {JSON.parse(localStorage.getItem('user') || '{}').name || 'Valued Customer'}
                </p>
                <p className="text-sm text-gray-600">
                  {JSON.parse(localStorage.getItem('user') || '{}').email || 'customer@example.com'}
                </p>
              </div>
            </div>

            {/* Order Details Table */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase">Order Details</h3>

              <table className="w-full">
                <thead className="border-b-2 border-gray-300">
                  <tr>
                    <th className="text-left py-3 text-sm font-semibold text-gray-700">Description</th>
                    <th className="text-center py-3 text-sm font-semibold text-gray-700">Qty</th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-4">
                      <p className="font-semibold text-base mb-1">
                        {orderDetails.plan} Plan - {orderDetails.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} Subscription
                      </p>
                      <p className="text-sm text-gray-600">
                        Unlimited streaming of movies, series, and live TV
                      </p>
                    </td>
                    <td className="text-center py-4 text-gray-700">1</td>
                    <td className="text-right py-4 font-semibold">₹{orderDetails.amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pricing Breakdown */}
            <div className="flex justify-end mb-8">
              <div className="w-full md:w-1/2 space-y-3">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{orderDetails.amount}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-semibold">₹{orderDetails.gst}</span>
                </div>

                <div className="flex justify-between py-3 border-t-2 border-gray-300">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-xl font-bold text-yellow-600">₹{orderDetails.totalAmount}</span>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="font-semibold text-sm">Payment Successful</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    via {orderDetails.paymentMethod.toUpperCase()} • {orderDetails.date}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Notes */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase">Important Notes</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-gray-400 mt-0.5">
                    check
                  </span>
                  Your subscription is now active and will auto-renew on {new Date(Date.now() + (orderDetails.billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-gray-400 mt-0.5">
                    check
                  </span>
                  You can cancel anytime from your profile settings with no cancellation fees
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-gray-400 mt-0.5">
                    check
                  </span>
                  For support, contact us at support@jstamilcinemas.com or call +91 88888 88888
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-gray-400 mt-0.5">
                    check
                  </span>
                  This is a computer-generated receipt and does not require a physical signature
                </li>
              </ul>
            </div>

            {/* Thank You Message */}
            <div className="mt-8 text-center p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl">
              <p className="text-2xl font-bold text-gray-800 mb-2">Thank You for Your Subscription! 🎬</p>
              <p className="text-sm text-gray-600">
                Enjoy unlimited Tamil cinema entertainment. Happy watching!
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 px-8 py-4 text-center border-t border-gray-200">
            <p className="text-xs text-gray-500">
              J S Tamil Cinemas • www.jstamilcinemas.com • support@jstamilcinemas.com • +91 88888 88888
            </p>
          </div>
        </div>

        {/* Print Styles */}
        <style jsx global>{`
          @media print {
            body {
              background: white;
            }
            nav {
              display: none;
            }
            .print\\:hidden {
              display: none !important;
            }
          }
        `}</style>
      </main>
    </div>
  );
}
