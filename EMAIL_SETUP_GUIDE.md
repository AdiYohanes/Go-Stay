# 📧 Email Setup Guide - Resend + Supabase

Panduan lengkap setup email untuk authentication (register, login, reset password) menggunakan Resend dan Supabase.

---

## 📋 Prerequisites

- ✅ Akun Resend (sudah punya)
- ✅ Akun Supabase (sudah punya)
- ⏳ Domain (opsional, bisa pakai domain default Resend dulu)

---

## 🚀 Part 1: Setup Resend

### Step 1: Login ke Resend

1. Buka https://resend.com
2. Login dengan akun kamu
3. Masuk ke Dashboard

### Step 2: Dapatkan API Key

1. Di sidebar kiri, klik **API Keys**
2. Klik tombol **Create API Key**
3. Isi form:
   ```
   Name: Supabase Go-Stay
   Permission: Full Access (atau Sending Access)
   ```
4. Klik **Add**
5. **PENTING**: Copy API key yang muncul
   ```
   re_xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
6. Simpan di tempat aman (tidak akan muncul lagi!)

### Step 3: Verify Domain (Opsional - Untuk Production)

**Jika punya domain sendiri (misal: gostay.com):**

1. Di sidebar, klik **Domains**
2. Klik **Add Domain**
3. Masukkan domain: `gostay.com`
4. Klik **Add**

5. **Add DNS Records** ke domain provider kamu (Cloudflare, Namecheap, dll):

   **SPF Record:**

   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.resend.com ~all
   ```

   **DKIM Record:**

   ```
   Type: TXT
   Name: resend._domainkey
   Value: [akan diberikan oleh Resend]
   ```

   **DMARC Record (Opsional tapi recommended):**

   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:dmarc@gostay.com
   ```

6. Tunggu verifikasi (5-30 menit)
7. Status akan berubah jadi **Verified** ✅

**Jika belum punya domain:**

- Skip step ini
- Pakai domain default: `onboarding.resend.dev`
- Cocok untuk testing, tapi ada limit

### Step 4: Test Resend (Opsional)

1. Di sidebar, klik **Emails**
2. Klik **Send Test Email**
3. Isi:
   ```
   From: noreply@yourdomain.com (atau onboarding@resend.dev)
   To: email-kamu@gmail.com
   Subject: Test Email
   Body: Hello from Resend!
   ```
4. Klik **Send**
5. Cek inbox kamu

---

## 🔧 Part 2: Setup Supabase

### Step 1: Login ke Supabase

1. Buka https://supabase.com
2. Login
3. Pilih project **Go-Stay**

### Step 2: Buka Authentication Settings

1. Di sidebar kiri, klik **Authentication**
2. Klik tab **Providers**
3. Cari **Email** provider
4. Klik untuk expand

### Step 3: Enable Custom SMTP

Scroll ke bawah sampai ketemu **SMTP Settings**

1. Toggle **Enable Custom SMTP** → ON

2. Isi form dengan data Resend:

   ```
   SMTP Host: smtp.resend.com
   SMTP Port: 465
   SMTP Username: resend
   SMTP Password: [API KEY dari Resend - re_xxxxxxxxx]

   Sender Email: noreply@yourdomain.com
   (atau onboarding@resend.dev jika belum punya domain)

   Sender Name: Go-Stay Team
   ```

3. Klik **Save**

### Step 4: Enable Email Confirmation

Masih di halaman yang sama, scroll ke atas:

1. **Confirm email** → Toggle ON ✅
2. **Enable email confirmations** → Toggle ON ✅
3. **Secure email change** → Toggle ON ✅ (recommended)

### Step 5: Configure URL Settings

1. Klik tab **URL Configuration** (masih di Authentication)

2. Isi:

   ```
   Site URL: http://localhost:3000
   (nanti ganti ke production URL setelah deploy)

   Redirect URLs:
   http://localhost:3000/**
   http://localhost:3000/auth/callback
   ```

3. Setelah deploy, tambahkan:

   ```
   https://your-app.vercel.app/**
   https://your-app.vercel.app/auth/callback
   ```

4. Klik **Save**

---

## 📝 Part 3: Customize Email Templates

### Step 1: Buka Email Templates

1. Authentication → **Email Templates**
2. Kamu akan lihat 4 template:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password

### Step 2: Customize "Confirm Signup" Template

Klik **Confirm signup**, lalu edit:

```html
<h2>Selamat Datang di Go-Stay! 🏖️</h2>

<p>Halo,</p>

<p>
  Terima kasih telah mendaftar di Go-Stay, platform booking resort terbaik di
  Bali!
</p>

<p>Untuk mengaktifkan akun Anda, silakan klik tombol di bawah ini:</p>

<table role="presentation" style="margin: 30px 0;">
  <tr>
    <td
      style="background-color: #0ea5e9; border-radius: 8px; text-align: center;"
    >
      <a
        href="{{ .ConfirmationURL }}"
        style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-weight: bold;"
      >
        Konfirmasi Email Saya
      </a>
    </td>
  </tr>
</table>

<p>Atau copy dan paste link ini ke browser Anda:</p>
<p style="color: #64748b; word-break: break-all;">{{ .ConfirmationURL }}</p>

<p style="color: #64748b; font-size: 14px; margin-top: 30px;">
  Link ini akan kadaluarsa dalam 24 jam.<br />
  Jika Anda tidak mendaftar di Go-Stay, abaikan email ini.
</p>

<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />

<p style="color: #94a3b8; font-size: 12px;">
  © 2025 Go-Stay. All rights reserved.<br />
  Bali, Indonesia
</p>
```

Klik **Save**

### Step 3: Customize "Reset Password" Template

Klik **Reset Password**, lalu edit:

```html
<h2>Reset Password Anda</h2>

<p>Halo,</p>

<p>Kami menerima permintaan untuk reset password akun Go-Stay Anda.</p>

<p>Klik tombol di bawah untuk membuat password baru:</p>

<table role="presentation" style="margin: 30px 0;">
  <tr>
    <td
      style="background-color: #0ea5e9; border-radius: 8px; text-align: center;"
    >
      <a
        href="{{ .ConfirmationURL }}"
        style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-weight: bold;"
      >
        Reset Password
      </a>
    </td>
  </tr>
</table>

<p>Atau copy dan paste link ini ke browser Anda:</p>
<p style="color: #64748b; word-break: break-all;">{{ .ConfirmationURL }}</p>

<p style="color: #64748b; font-size: 14px; margin-top: 30px;">
  Link ini akan kadaluarsa dalam 1 jam.<br />
  Jika Anda tidak meminta reset password, abaikan email ini dan password Anda
  tidak akan berubah.
</p>

<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />

<p style="color: #94a3b8; font-size: 12px;">
  © 2025 Go-Stay. All rights reserved.<br />
  Bali, Indonesia
</p>
```

Klik **Save**

### Step 4: Customize "Change Email" Template

Klik **Change Email Address**, lalu edit:

```html
<h2>Konfirmasi Perubahan Email</h2>

<p>Halo,</p>

<p>Kami menerima permintaan untuk mengubah email akun Go-Stay Anda.</p>

<p>Klik tombol di bawah untuk mengkonfirmasi email baru Anda:</p>

<table role="presentation" style="margin: 30px 0;">
  <tr>
    <td
      style="background-color: #0ea5e9; border-radius: 8px; text-align: center;"
    >
      <a
        href="{{ .ConfirmationURL }}"
        style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-weight: bold;"
      >
        Konfirmasi Email Baru
      </a>
    </td>
  </tr>
</table>

<p>Atau copy dan paste link ini ke browser Anda:</p>
<p style="color: #64748b; word-break: break-all;">{{ .ConfirmationURL }}</p>

<p style="color: #64748b; font-size: 14px; margin-top: 30px;">
  Jika Anda tidak meminta perubahan email, segera hubungi kami.
</p>

<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />

<p style="color: #94a3b8; font-size: 12px;">
  © 2025 Go-Stay. All rights reserved.<br />
  Bali, Indonesia
</p>
```

Klik **Save**

---

## ✅ Part 4: Testing

### Test 1: Send Test Email dari Supabase

1. Authentication → Email Templates
2. Pilih template (misal: Confirm signup)
3. Klik **Send test email**
4. Masukkan email kamu
5. Klik **Send**
6. Cek inbox (dan spam folder)

### Test 2: Test Register dari Aplikasi

1. Jalankan aplikasi: `npm run dev`
2. Buka http://localhost:3000/register
3. Register dengan email asli
4. Cek inbox untuk email konfirmasi
5. Klik link konfirmasi
6. Coba login

### Test 3: Test Reset Password

1. Buka http://localhost:3000/forgot-password
2. Masukkan email
3. Cek inbox untuk email reset
4. Klik link reset
5. Buat password baru
6. Coba login dengan password baru

---

## 🔍 Troubleshooting

### Problem 1: Email Tidak Terkirim

**Cek:**

- ✅ API key Resend benar
- ✅ SMTP settings di Supabase benar
- ✅ Sender email sesuai domain verified
- ✅ Resend Dashboard → Logs untuk error

**Solution:**

- Cek Resend logs: https://resend.com/emails
- Cek Supabase logs: Authentication → Logs

### Problem 2: Email Masuk Spam

**Cek:**

- ✅ Domain sudah verified di Resend
- ✅ SPF, DKIM records sudah setup
- ✅ Sender name professional (bukan "noreply")

**Solution:**

- Setup DMARC record
- Gunakan domain verified (bukan onboarding.resend.dev)
- Tambahkan unsubscribe link

### Problem 3: Rate Limit Exceeded

**Resend Free Tier Limits:**

- 100 emails/day
- 3,000 emails/month

**Solution:**

- Upgrade ke paid plan ($20/month untuk 50k emails)
- Atau gunakan email provider lain

### Problem 4: Link Konfirmasi Expired

**Default expiry:**

- Confirm email: 24 jam
- Reset password: 1 jam

**Solution:**

- User harus request ulang
- Atau adjust expiry di Supabase settings

---

## 📊 Monitoring

### Resend Dashboard

**Emails Tab:**

- Lihat semua email terkirim
- Status: delivered, bounced, failed
- Open rate, click rate

**Logs Tab:**

- Debug errors
- Lihat response codes
- Filter by date, status

**Analytics Tab:**

- Email performance
- Delivery rate
- Engagement metrics

### Supabase Dashboard

**Authentication → Logs:**

- User registrations
- Login attempts
- Password resets
- Email confirmations

---

## 🎯 Production Checklist

Sebelum deploy ke production:

- [ ] Domain verified di Resend
- [ ] SPF, DKIM, DMARC records setup
- [ ] SMTP settings tested
- [ ] Email templates customized
- [ ] Test emails sent successfully
- [ ] Production URL added to Supabase redirect URLs
- [ ] Sender email professional (bukan onboarding@resend.dev)
- [ ] Rate limits checked (upgrade jika perlu)

---

## 💰 Pricing

### Resend Pricing

**Free Tier:**

- 100 emails/day
- 3,000 emails/month
- 1 domain
- Email API access

**Pro Plan ($20/month):**

- 50,000 emails/month
- Unlimited domains
- Priority support
- Advanced analytics

### Supabase Pricing

**Free Tier:**

- 50,000 monthly active users
- Unlimited API requests
- Custom SMTP (free!)

---

## 📝 Summary

Setup lengkap:

1. ✅ Resend account + API key
2. ✅ Domain verified (opsional)
3. ✅ Supabase SMTP configured
4. ✅ Email templates customized
5. ✅ Testing completed

Sekarang aplikasi Go-Stay bisa:

- ✉️ Kirim email konfirmasi registrasi
- 🔐 Kirim email reset password
- 📧 Kirim email change email
- 🎉 Professional email branding

---

## 🚀 Next Steps

Setelah email setup:

1. Deploy aplikasi ke Vercel
2. Update Supabase redirect URLs dengan production URL
3. Test email di production
4. Monitor email delivery di Resend dashboard
5. (Opsional) Setup booking confirmation emails

---

**Need help?**

- Resend Docs: https://resend.com/docs
- Supabase Docs: https://supabase.com/docs/guides/auth
- Resend Support: support@resend.com
