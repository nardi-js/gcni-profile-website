# 🚀 Deployment Guide - GCNI Website

## 📋 Prerequisites

1. **Node.js** installed (v18 or higher)
2. **Firebase CLI** installed globally:
   ```bash
   npm install -g firebase-tools
   ```
3. **Firebase Project** setup (backend-gcni)
4. **Logged in to Firebase**:
   ```bash
   firebase login
   ```

---

## 🏗️ Build & Deploy

### **Option 1: Quick Deploy (Recommended)**

```bash
npm run deploy
```

This will:
1. Build the project (optimized for production)
2. Deploy to Firebase Hosting

### **Option 2: Manual Steps**

#### Step 1: Build
```bash
npm run build
```

#### Step 2: Preview (Optional)
```bash
npm run preview
```
Open http://localhost:4173 to preview production build locally

#### Step 3: Deploy
```bash
firebase deploy --only hosting
```

---

## 📦 Build Optimization Features

### **1. Code Splitting**
- React vendor bundle (react, react-dom, react-router-dom)
- Firebase vendor bundle (firebase/app, firestore, auth)
- Framer Motion vendor bundle
- Automatic code splitting per route

### **2. Minification**
- JavaScript minified with Terser
- CSS minified
- All console.log removed in production
- Comments removed

### **3. Asset Optimization**
- Images < 4KB inlined as base64
- Organized asset structure:
  - `assets/images/` - Image files
  - `assets/fonts/` - Font files
  - `assets/js/` - JavaScript bundles
- Hashed filenames for cache busting

### **4. Caching Strategy**
- Static assets (images, JS, CSS, fonts): 1 year cache
- index.html: No cache (always fresh)
- Clean URLs enabled
- No trailing slashes

---

## 🔧 Build Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (fast) |
| `npm run build:full` | Build with sitemap generation |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Build + Deploy to Firebase |

---

## 📊 Build Output

After running `npm run build`, you'll see:

```
dist/
├── assets/
│   ├── images/
│   ├── js/
│   │   ├── react-vendor-[hash].js
│   │   ├── firebase-vendor-[hash].js
│   │   ├── motion-vendor-[hash].js
│   │   └── index-[hash].js
│   └── index-[hash].css
├── index.html
├── favicon.ico
├── robots.txt
├── sitemap.xml
└── sitemap-news.xml
```

---

## 🌐 Firebase Hosting Configuration

### **Current Setup:**
- **Project**: backend-gcni
- **Public Directory**: dist
- **Single Page App**: Yes (all routes → index.html)
- **Clean URLs**: Enabled
- **Trailing Slash**: Disabled

### **Cache Headers:**
- **Static Assets**: 1 year (31536000 seconds)
- **HTML Files**: No cache (always fresh)

---

## ✅ Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Firebase config updated (if needed)
- [ ] Environment variables set (if any)
- [ ] Build completes without errors
- [ ] Preview build looks correct
- [ ] Firebase project selected: `firebase use backend-gcni`

---

## 🔍 Troubleshooting

### **Build fails with "Service account key not found"**
- This is normal if you don't have `serviceAccountKey.json`
- Use `npm run build` instead of `npm run build:full`
- Sitemap generation is optional

### **Deploy fails with "Not logged in"**
```bash
firebase login
```

### **Wrong Firebase project**
```bash
firebase use backend-gcni
```

### **Build is too large**
- Check bundle analyzer: `npm run build -- --report`
- Consider lazy loading more routes
- Optimize images before uploading to Cloudinary

---

## 📈 Performance Tips

### **1. Image Optimization**
- Use WebP format when possible
- Compress images before upload
- Use Cloudinary transformations for responsive images

### **2. Code Optimization**
- Lazy load routes that aren't frequently accessed
- Use React.memo for expensive components
- Minimize re-renders with useMemo/useCallback

### **3. Firebase Optimization**
- Use Firestore indexes for complex queries
- Limit query results
- Cache frequently accessed data

---

## 🎯 Production URLs

After deployment, your site will be available at:
- **Firebase Hosting**: https://backend-gcni.web.app
- **Custom Domain** (if configured): https://gcnischool.or.id

---

## 📝 Post-Deployment

1. **Test all pages** on production
2. **Check console** for errors
3. **Test mobile responsiveness**
4. **Verify Firebase data** is loading correctly
5. **Check Google Analytics** (if configured)

---

## 🔄 Continuous Deployment (Optional)

For automatic deployment on git push, set up GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: backend-gcni
```

---

## 📞 Support

If you encounter issues:
1. Check Firebase Console for errors
2. Review build logs
3. Test locally with `npm run preview`
4. Check browser console on production

---

**Last Updated**: November 2025  
**Version**: 1.0.0
