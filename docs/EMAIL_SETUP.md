# 📧 Email Invoice Setup Guide

## ✅ Email Service Configured!

After successful payment, the system automatically sends a professional invoice email to the customer's registered email address.

---

## 🎨 Email Features

✅ **Beautiful HTML Email Template**
- Company branding with yellow gradient header
- Success badge with green checkmark
- Complete order details table
- Pricing breakdown with GST
- "Start Watching Now" CTA button
- What You Get section with feature list
- Support contact information
- Professional footer with company details

✅ **Auto-Generated Content**
- Order ID
- Purchase date
- Plan details (Basic/Gold/Premium)
- Billing cycle (Monthly/Yearly)
- Payment method
- Amount breakdown (Subtotal + GST)
- Total amount paid

---

## ⚙️ Current Setup (Testing Mode)

Currently using **Ethereal Email** - a fake SMTP service for testing that doesn't send real emails but shows you previews.

### How to See Test Emails:
1. Check the API console logs after payment
2. Look for: `Preview URL: https://ethereal.email/message/...`
3. Open that URL to see the email preview

---

## 🚀 Setup for Production (Real Emails)

### Option 1: Gmail SMTP (Free)

1. **Enable 2-Step Verification** in your Google Account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Generate password

3. **Update `.env` file**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

4. **Restart API**: `npm run dev`

**Limits**: 500 emails/day (free)

---

### Option 2: SendGrid (Recommended for Production)

1. **Sign Up**: https://signup.sendgrid.com/
   - Free tier: 100 emails/day

2. **Create API Key**:
   - Dashboard → Settings → API Keys
   - Create API Key with "Mail Send" permission
   - Copy the key

3. **Install SendGrid SDK**:
```bash
cd services/api
npm install @sendgrid/mail
```

4. **Update email service** to use SendGrid:
```typescript
// In email.service.ts
import * as sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async sendInvoice(orderDetails) {
  const msg = {
    to: orderDetails.email,
    from: 'noreply@jstamilcinemas.com', // Must be verified in SendGrid
    subject: `Invoice #${orderDetails.orderId}`,
    html: this.generateInvoiceHTML(orderDetails),
  };
  
  await sgMail.send(msg);
}
```

5. **Update `.env`**:
```env
SENDGRID_API_KEY=SG.your-api-key-here
```

---

### Option 3: Amazon SES (Scalable)

1. **Sign Up**: https://aws.amazon.com/ses/
2. **Verify Email/Domain**
3. **Get SMTP Credentials**
4. **Update `.env`**:
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-username
SMTP_PASS=your-ses-password
```

**Cost**: $0.10 per 1,000 emails

---

### Option 4: Resend (Modern & Simple)

1. **Sign Up**: https://resend.com/
   - Free tier: 100 emails/day, 3,000/month

2. **Get API Key** from dashboard

3. **Install Resend**:
```bash
npm install resend
```

4. **Update service**:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async sendInvoice(orderDetails) {
  await resend.emails.send({
    from: 'J S Tamil Cinemas <onboarding@resend.dev>',
    to: orderDetails.email,
    subject: `Invoice #${orderDetails.orderId}`,
    html: this.generateInvoiceHTML(orderDetails),
  });
}
```

---

## 📊 Email Sending Statistics

### Current Flow:
1. User completes payment → Payment page
2. Frontend calls `/email/send-invoice` API
3. Backend sends HTML email with invoice
4. User receives email instantly
5. Success page shows confirmation

### What Gets Emailed:
- Order ID & Date
- Plan name (Basic/Gold/Premium)
- Billing cycle
- Payment method
- Amount breakdown
- GST calculation
- Total paid
- Company details (GSTIN, CIN)
- Support contact info

---

## 🧪 Testing Email Flow

### Test with Ethereal (Current Setup):
```bash
# Make a payment on the website
# Check API logs:
cd services/api
npm run dev

# Look for:
# "Email sent: <message-id>"
# "Preview URL: https://ethereal.email/message/..."
```

### Test with Real Email:
1. Set up Gmail SMTP (see Option 1 above)
2. Make a test payment
3. Check your inbox!

---

## 🎯 Email Template Customization

To customize the email, edit:
`/services/api/src/email/email.service.ts`

Look for the `generateInvoiceHTML()` function.

**You can change:**
- Colors (currently yellow/gold theme)
- Logo/branding
- Footer text
- Support contact info
- Feature list
- Button text and links

---

## 🔒 Security Best Practices

✅ **Never commit SMTP credentials to Git**
- Already in `.gitignore`
- Use environment variables only

✅ **Use App Passwords** (Gmail)
- Don't use your actual password
- Generate app-specific passwords

✅ **Verify Sender Domains** (Production)
- Set up SPF, DKIM, DMARC records
- Prevents emails going to spam

✅ **Rate Limiting**
- Implement email sending limits
- Prevent abuse

---

## 📈 Monitoring

### Track Email Delivery:
- **SendGrid**: Built-in analytics dashboard
- **Amazon SES**: CloudWatch metrics
- **Gmail**: Sent folder

### Log Email Events:
```typescript
// API logs show:
console.log('Email sent:', info.messageId);
console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
```

---

## ❓ Troubleshooting

### "Authentication failed"
- Check SMTP credentials in `.env`
- For Gmail: Use app password, not account password
- Verify 2-step verification is enabled

### Email goes to spam
- Set up sender domain verification
- Add SPF/DKIM records
- Use professional "from" address

### Email not received
- Check spam/junk folder
- Verify recipient email is correct
- Check API logs for errors
- Test with Ethereal first

### Port blocked
- Try port 465 (SSL) instead of 587
- Check firewall settings
- Some ISPs block SMTP ports

---

## 📚 Documentation

- **Nodemailer**: https://nodemailer.com/
- **SendGrid**: https://docs.sendgrid.com/
- **Gmail SMTP**: https://support.google.com/mail/answer/7126229
- **Amazon SES**: https://docs.aws.amazon.com/ses/

---

## ✨ Current Status

✅ Email service installed and configured
✅ Invoice email template created
✅ API endpoint ready: `POST /email/send-invoice`
✅ Frontend integrated with payment flow
✅ Testing mode active (Ethereal Email)

**Next Step**: Set up production SMTP (Gmail/SendGrid) to send real emails!

---

For questions: support@jstamilcinemas.com
