# 🚀 Deployment Checklist - Go-Stay

## ✅ Pre-Deployment Checklist

### 1. Environment Variables

- [x] `.env.local` ada dan terisi
- [x] `.env.example` sudah update
- [ ] Siapkan environment variables untuk production:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://nasxjhmddvbguhchxfrl.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_uQ9Itac1MnKw4SKBtD1eNg_NIkn8gPi
  ```

### 2. Database

- [x] Supabase project sudah setup
- [x] Migrations sudah dijalankan
- [x] Database sudah di-seed dengan data resort
- [x] RLS (Row Level Security) sudah aktif
- [ ] **PENTING**: Untuk production, disable email confirmation sementara atau setup SMTP

### 3. Code Quality

- [x] Build berhasil tanpa error
- [x] Tidak ada console.error di production
- [x] Images menggunakan Next.js Image component
- [x] Remote image patterns sudah dikonfigurasi

### 4. Performance

- [x] Image optimization enabled (AVIF, WebP)
- [x] Package imports optimized
- [x] React strict mode enabled
- [x] Console logs removed di production

### 5. Security

- [x] Environment variables tidak di-commit
- [x] `.env.local` ada di `.gitignore`
- [x] API keys aman
- [x] RLS policies aktif di Supabase

---

## 🎯 Platform Deployment

### Option 1: Vercel (Recommended - Easiest)

**Kenapa Vercel?**

- Dibuat oleh Next.js team
- Zero config deployment
- Automatic HTTPS
- Global CDN
- Free tier generous

**Steps:**

1. **Push ke GitHub** ✅ (Sudah done)

2. **Connect ke Vercel:**
   - Login ke https://vercel.com
   - Klik "Add New Project"
   - Import dari GitHub: `AdiYohanes/Go-Stay`
   - Klik "Import"

3. **Configure Project:**

   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build (auto-detected)
   Output Directory: .next (auto-detected)
   Install Command: npm install (auto-detected)
   ```

4. **Add Environment Variables:**
   - Klik "Environment Variables"
   - Add:
     ```
     NEXT_PUBLIC_SUPABASE_URL = https://nasxjhmddvbguhchxfrl.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_uQ9Itac1MnKw4SKBtD1eNg_NIkn8gPi
     ```
   - Pilih: Production, Preview, Development (all)

5. **Deploy:**
   - Klik "Deploy"
   - Tunggu 2-3 menit
   - Done! 🎉

6. **Custom Domain (Opsional):**
   - Settings → Domains
   - Add domain kamu
   - Update DNS records

**URL Production:**

- Default: `https://go-stay-xxx.vercel.app`
- Custom: `https://gostay.com` (jika punya domain)

---

### Option 2: Netlify

**Steps:**

1. **Connect ke Netlify:**
   - Login ke https://netlify.com
   - "Add new site" → "Import from Git"
   - Pilih GitHub repo

2. **Build Settings:**

   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables:**
   - Site settings → Environment variables
   - Add sama seperti Vercel

4. **Deploy:**
   - Klik "Deploy site"

---

### Option 3: Railway

**Steps:**

1. **Connect ke Railway:**
   - Login ke https://railway.app
   - "New Project" → "Deploy from GitHub"

2. **Add Environment Variables:**
   - Variables tab
   - Add Supabase credentials

3. **Deploy:**
   - Automatic deployment

---

## 🔧 Post-Deployment Tasks

### 1. Verify Deployment

- [ ] Homepage loads correctly
- [ ] Images load (check Unsplash images)
- [ ] Search functionality works
- [ ] Property details page works
- [ ] Authentication works (register/login)
- [ ] Favorites works
- [ ] Cart works

### 2. Setup Supabase for Production

**A. Update Supabase URL Whitelist:**

- Supabase Dashboard → Authentication → URL Configuration
- Add production URL:
  ```
  Site URL: https://your-app.vercel.app
  Redirect URLs: https://your-app.vercel.app/**
  ```

**B. Email Configuration (Temporary):**

- Authentication → Providers → Email
- **Disable** "Confirm email" untuk testing
- Atau setup SMTP dengan Resend (nanti)

### 3. Test Production

- [ ] Register user baru
- [ ] Login
- [ ] Browse properties
- [ ] Add to favorites
- [ ] Add to cart
- [ ] Search & filter

### 4. Monitor

- [ ] Check Vercel Analytics
- [ ] Check Supabase logs
- [ ] Monitor errors

---

## 🐛 Common Issues & Solutions

### Issue 1: Images Not Loading

**Problem:** Unsplash images blocked
**Solution:**

- Check `next.config.ts` remote patterns
- Verify images.unsplash.com allowed

### Issue 2: Authentication Not Working

**Problem:** Redirect URL mismatch
**Solution:**

- Update Supabase redirect URLs
- Add production URL to whitelist

### Issue 3: Environment Variables Not Working

**Problem:** Variables undefined
**Solution:**

- Redeploy after adding env vars
- Check variable names (NEXT*PUBLIC* prefix)

### Issue 4: Build Failed

**Problem:** TypeScript errors
**Solution:**

- Run `npm run build` locally first
- Fix all errors before deploy

### Issue 5: Database Connection Failed

**Problem:** Supabase credentials wrong
**Solution:**

- Double check URL and anon key
- Verify no extra spaces

---

## 📊 Performance Optimization (After Deploy)

### 1. Enable Vercel Analytics

- Dashboard → Analytics → Enable

### 2. Setup Vercel Speed Insights

- Dashboard → Speed Insights → Enable

### 3. Monitor Core Web Vitals

- Check LCP, FID, CLS scores
- Optimize if needed

### 4. Enable Caching

- Already configured in `next.config.ts`
- Vercel handles automatically

---

## 🎉 Success Criteria

Deployment berhasil jika:

- ✅ Build success tanpa error
- ✅ Homepage load < 3 detik
- ✅ Images load correctly
- ✅ Authentication works
- ✅ Database queries work
- ✅ No console errors
- ✅ Mobile responsive
- ✅ HTTPS enabled

---

## 📝 Next Steps After Deployment

1. **Share URL** dengan team/client
2. **Gather feedback** dari users
3. **Setup monitoring** (Sentry, LogRocket)
4. **Setup email** dengan Resend
5. **Add booking functionality** (payment gateway)
6. **SEO optimization** (meta tags, sitemap)
7. **Performance tuning** based on analytics

---

## 🚀 Quick Deploy Command

Untuk deploy ulang setelah perubahan:

```bash
git add .
git commit -m "feat: your changes"
git push
```

Vercel akan auto-deploy setiap push ke main branch!

---

## 📞 Support

Jika ada masalah:

1. Check Vercel deployment logs
2. Check Supabase logs
3. Check browser console
4. Check Network tab

---

**Ready to deploy? Let's go! 🚀**
