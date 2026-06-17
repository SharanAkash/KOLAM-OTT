import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // Using Ethereal Email for testing (fake SMTP service)
    // For production, replace with real SMTP (Gmail, SendGrid, etc.)
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'ethereal.pass',
      },
    });
  }

  async sendInvoice(orderDetails: {
    email: string;
    name: string;
    orderId: string;
    plan: string;
    billingCycle: string;
    amount: number;
    gst: number;
    totalAmount: number;
    paymentMethod: string;
    date: string;
  }) {
    const htmlContent = this.generateInvoiceHTML(orderDetails);

    const mailOptions = {
      from: '"J S Tamil Cinemas" <noreply@jstamilcinemas.com>',
      to: orderDetails.email,
      subject: `Invoice #${orderDetails.orderId} - J S Tamil Cinemas ${orderDetails.plan} Plan`,
      html: htmlContent,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      return { success: true, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
    } catch (error) {
      console.error('Email error:', error);
      return { success: false, error: error.message };
    }
  }

  private generateInvoiceHTML(orderDetails: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      padding: 40px 30px;
      color: #000;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 32px;
      font-weight: bold;
    }
    .header p {
      margin: 0;
      opacity: 0.9;
      font-size: 14px;
    }
    .content {
      padding: 30px;
    }
    .success-badge {
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 30px;
      font-weight: bold;
    }
    .order-info {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .order-info h2 {
      margin: 0 0 15px 0;
      font-size: 18px;
      color: #111;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #6b7280;
      font-size: 14px;
    }
    .info-value {
      font-weight: 600;
      color: #111;
      font-size: 14px;
    }
    .plan-details {
      background: #fef3c7;
      border: 2px solid #fbbf24;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .plan-details h3 {
      margin: 0 0 10px 0;
      color: #92400e;
      font-size: 16px;
    }
    .pricing-table {
      margin: 20px 0;
    }
    .pricing-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .pricing-row.total {
      border-top: 2px solid #333;
      border-bottom: none;
      padding-top: 15px;
      font-size: 18px;
      font-weight: bold;
      color: #f59e0b;
    }
    .button {
      display: inline-block;
      background: #fbbf24;
      color: #000;
      padding: 14px 30px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      background: #f9fafb;
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .footer a {
      color: #f59e0b;
      text-decoration: none;
    }
    .features {
      margin: 20px 0;
    }
    .feature-item {
      padding: 10px 0;
      font-size: 14px;
    }
    .feature-item::before {
      content: "✓";
      color: #10b981;
      font-weight: bold;
      margin-right: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>J S Tamil Cinemas</h1>
      <p>Premium Tamil Entertainment Platform</p>
    </div>

    <div class="content">
      <div class="success-badge">
        ✓ Payment Successful - Subscription Activated!
      </div>

      <p>Dear ${orderDetails.name},</p>

      <p>Thank you for subscribing to J S Tamil Cinemas! Your payment has been processed successfully and your <strong>${orderDetails.plan} Plan</strong> is now active.</p>

      <div class="order-info">
        <h2>Order Details</h2>
        <div class="info-row">
          <span class="info-label">Order ID</span>
          <span class="info-value">#${orderDetails.orderId}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Date</span>
          <span class="info-value">${orderDetails.date}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Payment Method</span>
          <span class="info-value">${orderDetails.paymentMethod.toUpperCase()}</span>
        </div>
      </div>

      <div class="plan-details">
        <h3>${orderDetails.plan} Plan - ${orderDetails.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} Subscription</h3>
        <p style="margin: 5px 0; color: #92400e;">Unlimited streaming of movies, series, and live TV</p>
      </div>

      <div class="pricing-table">
        <div class="pricing-row">
          <span>Subtotal</span>
          <span>₹${orderDetails.amount}</span>
        </div>
        <div class="pricing-row">
          <span>GST (18%)</span>
          <span>₹${orderDetails.gst}</span>
        </div>
        <div class="pricing-row total">
          <span>Total Amount Paid</span>
          <span>₹${orderDetails.totalAmount}</span>
        </div>
      </div>

      <div class="features">
        <h3 style="margin-bottom: 15px;">What You Get:</h3>
        <div class="feature-item">Unlimited streaming on all your devices</div>
        <div class="feature-item">HD/4K quality with HDR support</div>
        <div class="feature-item">Download and watch offline</div>
        <div class="feature-item">Ad-free experience</div>
        <div class="feature-item">Cancel anytime, no questions asked</div>
      </div>

      <center>
        <a href="https://jstamilcinemas.com" class="button">Start Watching Now</a>
      </center>

      <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
        <strong>Need Help?</strong><br>
        Contact our support team at <a href="mailto:support@jstamilcinemas.com" style="color: #f59e0b;">support@jstamilcinemas.com</a> or call +91 88888 88888
      </p>
    </div>

    <div class="footer">
      <p>J S Tamil Cinemas Pvt. Ltd.<br>
      #123, Cinema Street, Chennai, Tamil Nadu - 600001<br>
      GSTIN: 33AABCU9603R1ZX | CIN: U74999TN2024PTC123456</p>
      <p style="margin-top: 15px;">
        <a href="https://jstamilcinemas.com">Website</a> |
        <a href="mailto:support@jstamilcinemas.com">Support</a> |
        <a href="https://jstamilcinemas.com/terms">Terms</a> |
        <a href="https://jstamilcinemas.com/privacy">Privacy</a>
      </p>
      <p style="margin-top: 10px; font-size: 11px;">
        This is an automated email. Please do not reply to this message.
      </p>
    </div>
  </div>
</body>
</html>
    `;
  }
}
