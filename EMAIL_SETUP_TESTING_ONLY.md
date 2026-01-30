# 📧 Email Setup - Testing Only (No Domain)

Panduan cepat setup email untuk testing tanpa domain sendiri.

---

## 🚀 Quick Setup (5 Menit)

### Step 1: Dapatkan API Key dari Resend

1. Login ke https://resend.com
2. Sidebar → **API Keys**
3. Klik **Create API Key**
4. Name: `Supabase Testing`
5. Permission: **Full Access**
6. Klik **Add**
7. **Copy API key** (simpan, tidak muncul lagi!)
   ```
   re_xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

### Step 2: Setup Supabase SMTP

1. Login ke https://supabase.com
2. Pilih project **Go-Stay**
3. Sidebar → **Authentication** → **Providers**
4. Klik **Email** untuk expand

**Scroll ke bawah ke "SMTP Settings":**

5. Toggle **Enable Custom SMTP** → **ON**

6. Isi form:

   ```
   SMTP Host: smtp.resend.com
   SMTP Port: 465
   SMTP Username: resend
   SMTP Password: [PASTE API KEY dari Step 1]

   Sender Email: onboarding@resend.dev
   Sender Name: Go-Stay
   ```

7. Klik **Save**

---

### Step 3: Enable Email Confirmation

Masih di halaman yang sama, scroll ke atas:

1. **Confirm email** → Toggle **ON** ✅
2. **Enable email confirmations** → Toggle **ON** ✅

3. Klik **Save**

---

### Step 4: Configure Redirect URLs

1. Klik tab **URL Configuration**

2. Isi:

   ```
   Site URL: http://localhost:3000

   Redirect URLs (add each one):
   http://localhost:3000/**
   http://localhost:3000/auth/callback
   ```

3. Klik **Save**

---

## ✅ Testing

### Test 1: Send Test Email dari Supabase

1. Authentication → **Email Templates**
2. Pilih **Confirm signup**
3. Klik **Send test email**
4. Masukkan email kamu (Gmail, Yahoo, dll)
5. Klik **Send**
6. **Cek inbox** (dan spam folder!)

### Test 2: Register dari Aplikasi

1. Jalankan app: `npm run dev`
2. Buka http://localhost:3000/register
3. Register dengan email asli
4. Cek inbox untuk email konfirmasi
5. Klik link "Konfirmasi Email"
6. Coba login

---

## 🎯 Summary

Setup selesai! Sekarang kamu punya:

- ✅ Email confirmation saat register
- ✅ Email reset password
- ✅ Email change email

**Sender:** `onboarding@resend.dev`

**Limits:**

- 100 emails/day (cukup untuk testing)
- 3,000 emails/month

---

## 🚨 Important Notes

### ⚠️ Untuk Testing Only!

`onboarding@resend.dev` hanya untuk testing:

- ❌ Jangan pakai di production
- ❌ Email bisa masuk spam
- ❌ Tidak professional

### ✅ Untuk Production Nanti:

Kalau mau deploy production, harus:

1. Punya domain sendiri (misal: gostay.com)
2. Verify domain di Resend
3. Ganti sender email: `noreply@gostay.com`
4. Setup DNS records (SPF, DKIM)

---

## 🐛 Troubleshooting

### Email tidak terkirim?

**Cek:**

1. API key benar di Supabase SMTP settings
2. Sender email: `onboarding@resend.dev` (exact!)
3. Resend dashboard → Logs untuk error

### Email masuk spam?

**Normal untuk testing!**

- `onboarding@resend.dev` sering masuk spam
- Cek spam folder
- Mark as "Not Spam"

### Rate limit exceeded?

**Free tier: 100 emails/day**

- Tunggu 24 jam
- Atau gunakan email lain untuk testing
- Atau upgrade Resend ($20/month)

---

## 📊 Monitor Emails

**Resend Dashboard:**

- https://resend.com/emails
- Lihat semua email terkirim
- Status: delivered, bounced, failed

**Supabase Logs:**

- Authentication → Logs
- Lihat user registrations
- Email confirmations

---

## 🎉 Done!

Email setup selesai untuk testing. Sekarang bisa:

- ✉️ Register user baru
- 🔐 Reset password
- 📧 Change email
- ✅ Email confirmation works

**Next:** Deploy aplikasi ke Vercel!

---

## 📝 Configuration Summary

Copy ini untuk reference:

```
RESEND:
API Key: re_xxxxxxxxxxxxxxxxxxxxxxxxxx
Dashboard: https://resend.com

SUPABASE SMTP:
Host: smtp.resend.com
Port: 465
Username: resend
Password: [API KEY]
Sender: onboarding@resend.dev
Name: Go-Stay

LIMITS:
100 emails/day
3,000 emails/month
```

---

**Ready to test? Go register a user! 🚀**
