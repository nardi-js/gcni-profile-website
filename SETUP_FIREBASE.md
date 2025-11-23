# Setup Firebase - Panduan Lengkap

## ⚠️ PENTING: Error "Missing or insufficient permissions"

Error ini terjadi karena Firebase Security Rules belum dikonfigurasi. Ikuti langkah-langkah berikut untuk memperbaiki:

---

## 1. Setup Firestore Rules

### Langkah-langkah:

1. **Buka Firebase Console**
   - URL: https://console.firebase.google.com
   - Login dengan akun Google Anda

2. **Pilih Project**
   - Pilih project: `backend-gcni`

3. **Buka Firestore Database**
   - Klik "Firestore Database" di sidebar kiri
   - Klik tab "Rules" di bagian atas

4. **Paste Rules Berikut:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function untuk cek admin
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email != null;
    }
    
    // Collection: news (berita)
    match /news/{newsId} {
      allow read: if true; // Public read
      allow write: if isAdmin(); // Admin only write
    }
    
    // Collection: messages (pesan kontak)
    match /messages/{messageId} {
      allow create: if true; // Anyone can create
      allow read, update, delete: if isAdmin(); // Admin only
    }
    
    // Collection: videos (gallery video)
    match /videos/{videoId} {
      allow read: if true; // Public read
      allow write: if isAdmin(); // Admin only write
    }
    
    // Collection: posters (slideshow poster)
    match /posters/{posterId} {
      allow read: if true; // Public read
      allow write: if isAdmin(); // Admin only write
    }
  }
}
```

5. **Publish Rules**
   - Klik tombol "Publish" di bagian atas
   - Tunggu hingga muncul notifikasi "Rules published successfully"

---

## 2. Setup Storage Rules (Optional)

**Catatan:** Poster menggunakan Cloudinary, jadi Storage rules untuk poster tidak diperlukan.

### Langkah-langkah (Jika menggunakan Storage untuk Berita):

1. **Buka Storage**
   - Di Firebase Console, klik "Storage" di sidebar kiri
   - Klik tab "Rules" di bagian atas

2. **Paste Rules Berikut:**

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper function untuk cek admin
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email != null;
    }
    
    // Folder: news (gambar berita)
    match /news/{allPaths=**} {
      allow read: if true; // Public read
      allow write: if isAdmin(); // Admin only write
    }
  }
}
```

3. **Publish Rules**
   - Klik tombol "Publish"
   - Tunggu hingga muncul notifikasi "Rules published successfully"

---

## 3. Verifikasi Setup

### Test Firestore:
1. Login ke admin panel: http://localhost:5174/admin/login
2. Coba tambah video baru di `/admin/videos`
3. Coba tambah poster baru di `/admin/posters`
4. Jika berhasil, berarti rules sudah bekerja dengan baik

### Test Public Access:
1. Buka halaman Gallery: http://localhost:5174/gallery
2. Buka halaman Home dan lihat slideshow poster
3. Jika data muncul, berarti public read access sudah bekerja

---

## 4. Troubleshooting

### Error: "Missing or insufficient permissions"

**Penyebab:**
- Firebase rules belum dipublish
- User belum login saat mencoba write data
- Rules tidak sesuai dengan struktur collection

**Solusi:**
1. Pastikan rules sudah dipublish (cek di Firebase Console)
2. Pastikan sudah login ke admin panel
3. Cek console browser untuk error detail
4. Refresh halaman dan coba lagi

### Error: "ERR_BLOCKED_BY_CLIENT"

**Penyebab:**
- Ad blocker atau extension browser memblokir request Firebase

**Solusi:**
1. Disable ad blocker untuk localhost
2. Coba di browser mode incognito
3. Whitelist domain firestore.googleapis.com

### Data tidak muncul di Gallery/Slideshow

**Penyebab:**
- Belum ada data di Firebase
- Collection name salah
- Rules read tidak allow public

**Solusi:**
1. Tambah data melalui admin panel terlebih dahulu
2. Cek nama collection di Firebase Console (harus: `videos`, `posters`)
3. Pastikan rules read: `if true` untuk public access

---

## 5. Struktur Collections

### Collection: `videos`
```
videos/
  └── {videoId}/
      ├── title: string
      ├── description: string
      ├── url: string
      ├── type: 'youtube' | 'shorts' | 'reels'
      ├── createdAt: timestamp
      └── updatedAt: timestamp
```

### Collection: `posters`
```
posters/
  └── {posterId}/
      ├── title: string
      ├── description: string
      ├── imageUrl: string (URL dari Cloudinary)
      ├── order: number
      ├── createdAt: timestamp
      └── updatedAt: timestamp
```

---

## 6. Admin Panel Features

### Sidebar Navigation (Responsive)
- **Desktop:** Sidebar tetap terlihat di kiri
- **Mobile:** Sidebar tersembunyi, buka dengan tombol hamburger
- **Menu Items:**
  - Kelola Berita
  - Pesan Kontak (dengan badge unread count)
  - Kelola Video
  - Kelola Poster

### Akses Admin Panel:
- Login: `/admin/login`
- News: `/admin/news`
- Messages: `/admin/messages`
- Videos: `/admin/videos`
- Posters: `/admin/posters`

---

## 7. Keamanan

### Best Practices:
1. **Jangan share Firebase config** di repository public
2. **Gunakan environment variables** untuk sensitive data
3. **Enable App Check** untuk production
4. **Audit rules** secara berkala
5. **Monitor usage** di Firebase Console

### Upgrade Security (Optional):
Untuk keamanan lebih baik, tambahkan custom claims:

```javascript
// Di Firebase Functions
admin.auth().setCustomUserClaims(uid, { admin: true });

// Update rules
function isAdmin() {
  return request.auth != null && 
         request.auth.token.admin == true;
}
```

---

## 8. Deployment Checklist

Sebelum deploy ke production:

- [ ] Firebase rules sudah dipublish
- [ ] Test semua fitur CRUD (Create, Read, Update, Delete)
- [ ] Test responsive design di mobile
- [ ] Test login/logout admin
- [ ] Backup data Firebase
- [ ] Setup Firebase App Check
- [ ] Monitor Firebase usage & billing

---

## Support

Jika masih ada masalah:
1. Cek Firebase Console > Usage & Billing
2. Cek Firebase Console > Firestore > Data (pastikan collections ada)
3. Cek browser console untuk error detail
4. Hubungi tim IT GCNI

---

**Last Updated:** November 2025
