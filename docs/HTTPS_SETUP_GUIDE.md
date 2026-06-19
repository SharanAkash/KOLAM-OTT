# 🔒 HTTPS Setup Guide for Kolam OTT QA

## Current Status
- ❌ Site is using HTTP (not secure)
- ✅ Infrastructure ready for HTTPS
- ⏳ Waiting for domain name

## Get Free Domain (2 minutes)

### Option 1: DuckDNS (Recommended - Easiest)

1. Go to: https://www.duckdns.org
2. Sign in with Google/GitHub/Twitter/Reddit
3. Enter subdomain name: `kolamott-qa` (or any name you like)
4. Click "add domain"
5. In the "current ip" field, paste:
   ```
   kolam-ott-qa-alb-146970630.us-east-1.elb.amazonaws.com
   ```
6. Click "update ip"
7. Your domain: `kolamott-qa.duckdns.org` ✅

### Option 2: No-IP

1. Go to: https://www.noip.com/sign-up
2. Create free account
3. Create hostname: `kolamott.ddns.net`
4. Point to: `kolam-ott-qa-alb-146970630.us-east-1.elb.amazonaws.com`

### Option 3: Freenom (Real Domain)

1. Go to: https://www.freenom.com
2. Search: `kolamott.tk` or `kolamott.ml`
3. Register free for 12 months
4. Point to: `kolam-ott-qa-alb-146970630.us-east-1.elb.amazonaws.com`

---

## After Getting Domain

### Step 1: Update Terraform Variables

Edit: `infrastructure/terraform/terraform.tfvars`

```hcl
domain_name = "kolamott-qa.duckdns.org"  # Your domain here
```

### Step 2: Request SSL Certificate

```bash
cd infrastructure/terraform
terraform apply -target=aws_acm_certificate.main
```

This will:
- Request a free SSL certificate from AWS
- Show you DNS validation records

### Step 3: Add DNS Validation Record

AWS will show you something like:
```
Name:  _xxxxx.kolamott-qa.duckdns.org
Type:  CNAME
Value: _xxxxx.acm-validations.aws.
```

For DuckDNS:
1. Go back to DuckDNS.org
2. You'll need to use their TXT record feature or email support
3. OR wait ~10 minutes and AWS will auto-validate via DNS

For Freenom/No-IP:
1. Go to DNS management
2. Add the CNAME record shown by AWS
3. Wait 5-10 minutes for validation

### Step 4: Apply Full Configuration

```bash
terraform apply
```

This will:
- Configure ALB with HTTPS
- Set up auto-redirect HTTP → HTTPS
- Enable port 443

### Step 5: Update ECS Services

```bash
# Update API to use new domain
aws ecs update-service \
  --cluster kolam-ott-qa \
  --service api \
  --force-new-deployment \
  --region us-east-1

# Update Web to use new domain
aws ecs update-service \
  --cluster kolam-ott-qa \
  --service web \
  --force-new-deployment \
  --region us-east-1
```

### Step 6: Test

Visit: `https://kolamott-qa.duckdns.org` (or your domain)

You should see:
- 🔒 Secure padlock in browser
- No security warnings
- HTTP automatically redirects to HTTPS

---

## Quick Alternative: Accept HTTP Warning

For internal QA testing, you can skip HTTPS:

1. Click "Advanced" in the security warning
2. Click "Proceed to site (unsafe)"
3. Bookmark the page so you don't see the warning again

This is **OK for QA** but **NOT for production**.

---

## Troubleshooting

### Certificate Validation Stuck?
- Check DNS records are correct
- Wait 10-15 minutes
- Try: `dig _xxxxx.yourdomain.com` to verify DNS propagation

### Site Not Loading?
- Clear browser cache
- Try incognito/private mode
- Check ALB listener rules are configured

### Still HTTP After Setup?
- Ensure certificate_arn variable is set
- Run `terraform apply` again
- Check ALB listeners in AWS Console

---

Need help? Run:
```bash
cd infrastructure/terraform
terraform output certificate_validation_records
```
