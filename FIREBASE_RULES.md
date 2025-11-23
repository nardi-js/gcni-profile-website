# Firebase Security Rules

## Firestore Rules

Paste rules berikut di Firebase Console > Firestore Database > Rules:

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

## Storage Rules (Optional)

**Catatan:** Poster menggunakan Cloudinary, jadi Storage rules untuk poster tidak diperlukan.

Paste rules berikut di Firebase Console > Storage > Rules (jika menggunakan Storage untuk Berita):

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

## Cara Setup

1. Buka Firebase Console: https://console.firebase.google.com
2. Pilih project: backend-gcni
3. Untuk Firestore:
   - Klik "Firestore Database" di sidebar
   - Klik tab "Rules"
   - Paste rules Firestore di atas
   - Klik "Publish"
4. Untuk Storage:
   - Klik "Storage" di sidebar
   - Klik tab "Rules"
   - Paste rules Storage di atas
   - Klik "Publish"

## Testing

Setelah rules dipublish:
- Public user dapat membaca semua data
- Hanya admin yang login dapat menulis/edit/hapus data
- Upload file hanya bisa dilakukan oleh admin yang login

## Catatan Keamanan

Rules ini menggunakan authentication email sebagai penanda admin. Untuk keamanan lebih baik, Anda bisa:
1. Tambahkan custom claims di Firebase Auth
2. Buat collection khusus untuk daftar admin
3. Gunakan role-based access control (RBAC)
