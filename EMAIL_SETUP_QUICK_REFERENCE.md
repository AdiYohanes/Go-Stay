# 📧 Email Setup - Quick Reference Card

## 🎯 Resend Settings

```
Dashboard: https://resend.com
API Key: re_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### SMTP Credentials

```
Host: smtp.resend.com
Port: 465
Username: resend
Password: [API KEY]
```

### Sender Email Options

**With Domain (Production):**

```
noreply@gostay.com
hello@gostay.com
team@gostay.com
```

**Without Domain (Testing):**

```
onboarding@resend.dev
```

---

## 🔧 Supabase SMTP Configuration

**Path:** Authentication → Providers → Email → SMTP Settings

```
Enable Custom SMTP: ON

SMTP Host: smtp.resend.com
SMTP Port: 465
SMTP Username: resend
SMTP Password: [RESEND API KEY]

Sender Email: noreply@yourdomain.com
Sender Name: Go-Stay Team
```

---

## ✅ Email Confirmation Settings

**Path:** Authentication → Providers → Email

```
☑ Confirm email: ON
☑ Enable email confirmations: ON
☑ Secure email change: ON
```

---

## 🌐 URL Configuration

**Path:** Authentication → URL Configuration

### Development

```
Site URL: http://localhost:3000

Redirect URLs:
http://localhost:3000/**
http://localhost:3000/auth/callback
```

### Production (After Deploy)

```
Site URL: https://your-app.vercel.app

Redirect URLs:
https://your-app.vercel.app/**
https://your-app.vercel.app/auth/callback
```

---

## 📝 DNS Records (If Using Custom Domain)

### SPF Record

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

### DKIM Record

```
Type: TXT
Name: resend._domainkey
Value: [provided by Resend]
```

### DMARC Record (Optional)

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
```

---

## 🧪 Testing Checklist

- [ ] Send test email from Resend dashboard
- [ ] Send test email from Supabase email templates
- [ ] Register new user → check confirmation email
- [ ] Click confirmation link → verify account activated
- [ ] Test forgot password → check reset email
- [ ] Click reset link → verify password changed
- [ ] Test login with new password

---

## 📊 Monitoring URLs

```
Resend Dashboard: https://resend.com/emails
Resend Logs: https://resend.com/logs
Supabase Auth Logs: [Your Project] → Authentication → Logs
```

---

## 🚨 Common Issues & Quick Fixes

### Email not sending?

```
1. Check API key is correct
2. Check SMTP settings in Supabase
3. Check Resend logs for errors
4. Verify sender email matches domain
```

### Email goes to spam?

```
1. Verify domain in Resend
2. Setup SPF, DKIM, DMARC records
3. Use professional sender name
4. Don't use onboarding@resend.dev in production
```

### Rate limit exceeded?

```
Free tier: 100 emails/day
Solution: Upgrade to Pro ($20/month)
```

### Link expired?

```
Confirmation: 24 hours
Reset password: 1 hour
Solution: User must request new link
```

---

## 💡 Pro Tips

1. **Always test in development first**
   - Use onboarding@resend.dev for testing
   - Switch to custom domain for production

2. **Monitor email delivery**
   - Check Resend dashboard daily
   - Watch for bounces and failures

3. **Customize email templates**
   - Add your branding
   - Use clear CTAs
   - Include support contact

4. **Setup alerts**
   - Resend can notify you of issues
   - Monitor bounce rates

5. **Keep API keys secure**
   - Never commit to git
   - Use environment variables
   - Rotate keys periodically

---

## 📞 Support

**Resend:**

- Docs: https://resend.com/docs
- Support: support@resend.com

**Supabase:**

- Docs: https://supabase.com/docs/guides/auth
- Discord: https://discord.supabase.com

---

## ⚡ Quick Commands

### Test email from terminal (optional)

```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your-email@gmail.com",
    "subject": "Test Email",
    "html": "<p>Hello from Resend!</p>"
  }'
```

### Check Supabase user confirmation status

```sql
SELECT email, email_confirmed_at, created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;
```

---

**Last Updated:** January 2025
**Version:** 1.0
