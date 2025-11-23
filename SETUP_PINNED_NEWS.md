# Setup Fitur Pin Berita ke Homepage

## 📋 Langkah-langkah Setup

### 1. **Buat Berita di Admin Panel**

1. Login ke Admin Panel: `/admin/login`
2. Masuk ke menu **Kelola Berita**
3. Klik **Tambah Berita** atau edit berita yang sudah ada
4. **Centang checkbox** "Pin berita ini ke halaman beranda"
5. Klik **Simpan Berita**

### 2. **Firestore Index (Opsional - untuk performa optimal)**

Jika muncul error di console browser tentang Firestore index, ikuti langkah berikut:

#### Cara 1: Otomatis via Error Link
1. Buka browser console (F12)
2. Cari error yang berisi link seperti:
   ```
   https://console.firebase.google.com/v1/r/project/YOUR_PROJECT/firestore/indexes?create_composite=...
   ```
3. Klik link tersebut
4. Klik **Create Index**
5. Tunggu beberapa menit hingga index selesai dibuat

#### Cara 2: Manual via Firebase Console
1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih project Anda
3. Masuk ke **Firestore Database** → **Indexes** tab
4. Klik **Create Index**
5. Isi form:
   - **Collection ID**: `news`
   - **Fields to index**:
     - Field: `isPinned`, Order: `Ascending`
     - Field: `date`, Order: `Descending`
   - **Query scope**: `Collection`
6. Klik **Create**

**CATATAN**: Aplikasi tetap berfungsi tanpa index (menggunakan client-side filtering), tapi dengan index akan lebih cepat.

### 3. **Verifikasi di Homepage**

1. Buka homepage: `/`
2. Scroll ke bawah setelah section **Video Gallery**
3. Section **"Berita Terkini"** akan muncul jika ada berita yang di-pin
4. Maksimal 3 berita terbaru yang di-pin akan ditampilkan

## 🎯 Cara Menggunakan Fitur Pin

### Di Admin Panel

#### **Pin Berita** (2 cara):
1. **Via Form**: Centang checkbox saat create/edit berita
2. **Via Tombol**: Klik tombol pin (📌) di daftar berita

#### **Unpin Berita**:
- Klik tombol pin (📌) yang berwarna kuning
- Atau edit berita dan uncheck checkbox

### Indikator Berita yang Di-pin:
- Badge **"Pinned"** berwarna kuning di daftar berita
- Tombol pin berwarna **kuning** (aktif) atau **abu-abu** (tidak aktif)

## 🔍 Troubleshooting

### Berita tidak muncul di homepage?

1. **Cek apakah berita sudah di-pin:**
   - Masuk Admin Panel → Kelola Berita
   - Pastikan ada badge "Pinned" di berita yang ingin ditampilkan

2. **Cek browser console (F12):**
   - Buka homepage
   - Lihat console untuk log:
     ```
     🔄 Loading pinned news...
     📰 Pinned news result: {...}
     ✅ Loaded X pinned news
     ```
   - Jika ada error, ikuti instruksi di console

3. **Cek Firestore Rules:**
   - Pastikan rules mengizinkan read untuk collection `news`:
     ```javascript
     match /news/{newsId} {
       allow read: if true;
       allow create, update, delete: if isAdmin();
     }
     ```

4. **Clear cache browser:**
   - Tekan `Ctrl + Shift + R` (Windows/Linux)
   - Tekan `Cmd + Shift + R` (Mac)

### Section berita tidak muncul sama sekali?

Ini **normal** jika belum ada berita yang di-pin. Section akan otomatis muncul setelah ada minimal 1 berita yang di-pin.

## 📊 Batasan & Ketentuan

- **Maksimal berita di homepage**: 3 berita terbaru
- **Urutan**: Berdasarkan tanggal berita (terbaru dulu)
- **Auto-hide**: Section tidak muncul jika tidak ada berita yang di-pin
- **Responsive**: Tampilan otomatis menyesuaikan mobile/desktop

## 🎨 Kustomisasi

Jika ingin mengubah jumlah berita yang ditampilkan, edit file:
- `src/components/NewsSection.jsx` → line 22: `getPinnedNews(3)` 
- Ubah angka `3` sesuai kebutuhan

## 📞 Support

Jika masih ada masalah, cek:
1. Browser console untuk error messages
2. Firebase Console → Firestore untuk data berita
3. Network tab untuk request yang gagal
