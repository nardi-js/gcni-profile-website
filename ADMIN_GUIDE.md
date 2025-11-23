# Panduan Admin - GCNI Website

## 🚨 PENTING: Setup Firebase Terlebih Dahulu!

Sebelum menggunakan admin panel, **WAJIB** setup Firebase Rules terlebih dahulu!

**Baca file:** `SETUP_FIREBASE.md` untuk instruksi lengkap.

Jika tidak setup, akan muncul error:
- ❌ "Missing or insufficient permissions"
- ❌ "ERR_BLOCKED_BY_CLIENT"

---

## Admin Panel Navigation (Sidebar)

Admin panel sekarang menggunakan **sidebar navigation** yang responsive:

### Desktop View:
- Sidebar tetap terlihat di sebelah kiri
- Semua menu dapat diakses langsung

### Mobile View:
- Sidebar tersembunyi secara default
- Klik tombol hamburger (☰) untuk membuka sidebar
- Klik overlay atau tombol X untuk menutup

### Menu Items:
1. **Kelola Berita** - Manage artikel & berita
2. **Pesan Kontak** - Lihat pesan dari form kontak (dengan badge unread)
3. **Kelola Video** - Manage YouTube, Shorts, Reels
4. **Kelola Poster** - Manage poster slideshow

---

## Fitur Admin Panel

### 1. Admin Videos (Kelola Gallery Video)
**URL:** `/admin/videos`

Fitur ini memungkinkan admin untuk menambahkan dan mengelola video dari YouTube, YouTube Shorts, dan Instagram Reels yang akan ditampilkan di halaman Gallery.

#### Cara Menambah Video:
1. Login ke admin panel
2. Klik menu "Videos" atau akses `/admin/videos`
3. Klik tombol "Tambah Video"
4. Pilih tipe video (YouTube, Shorts, atau Reels)
5. Masukkan judul video
6. Paste URL lengkap video:
   - YouTube: `https://youtube.com/watch?v=VIDEO_ID`
   - Shorts: `https://youtube.com/shorts/VIDEO_ID`
   - Reels: `https://instagram.com/reel/REEL_ID`
7. Tambahkan deskripsi (opsional)
8. **Centang "Pin ke Home Page"** jika ingin video muncul di halaman utama (max 6 video)
9. Klik "Simpan Video"

#### Cara PIN/UNPIN Video:
- Klik ikon 📌 (thumbtack) di pojok kanan atas video card
- Video yang di-pin akan muncul di Home page
- Maksimal 6 video yang bisa di-pin
- Badge "Pinned" akan muncul pada video yang di-pin

#### Cara Edit/Hapus Video:
- Klik tombol "Edit" pada video yang ingin diubah
- Klik tombol "Hapus" untuk menghapus video (akan ada konfirmasi)

---

### 2. Admin Posters (Kelola Poster Slideshow)
**URL:** `/admin/posters`

Fitur ini memungkinkan admin untuk mengelola poster yang ditampilkan di slideshow halaman utama.

#### Cara Menambah Poster:
1. Login ke admin panel
2. Klik menu "Posters" atau akses `/admin/posters`
3. Klik tombol "Tambah Poster"
4. **Upload gambar ke Cloudinary terlebih dahulu:**
   - Buka https://cloudinary.com
   - Login ke akun Cloudinary
   - Upload gambar poster
   - Copy URL gambar (klik kanan > Copy Image Address)
5. Paste URL Cloudinary ke field "URL Gambar Poster"
6. Preview gambar akan muncul otomatis jika URL valid
7. Masukkan judul poster
8. Tambahkan deskripsi (opsional)
9. Klik "Simpan Poster"

**Catatan:** Poster menggunakan URL Cloudinary, TIDAK upload ke Firebase Storage.

#### Cara Mengatur Urutan Poster:
- Gunakan tombol panah atas/bawah pada setiap poster untuk mengubah urutan tampilan
- Poster akan berganti otomatis setiap 5 detik di halaman utama

#### Cara Edit/Hapus Poster:
- Klik tombol "Edit" untuk mengubah judul, deskripsi, atau mengganti URL gambar
- Klik tombol "Hapus" untuk menghapus poster dari database

---

### 3. Halaman Gallery Video
**URL:** `/gallery`

Halaman publik yang menampilkan semua video yang telah ditambahkan oleh admin.

**Fitur:**
- Filter berdasarkan tipe (Semua, YouTube, Shorts, Reels)
- Video embed langsung dari platform
- Responsive design untuk semua perangkat

---

## Struktur Firebase

### Collection: `videos`
```javascript
{
  title: string,          // Judul video
  description: string,    // Deskripsi (opsional)
  url: string,           // URL lengkap video
  type: string,          // 'youtube' | 'shorts' | 'reels'
  isPinned: boolean,     // True jika di-pin ke Home page
  createdAt: timestamp,  // Waktu dibuat
  updatedAt: timestamp   // Waktu update terakhir
}
```

### Collection: `posters`
```javascript
{
  title: string,         // Judul poster
  description: string,   // Deskripsi (opsional)
  imageUrl: string,      // URL gambar dari Cloudinary
  order: number,         // Urutan tampilan (0, 1, 2, ...)
  createdAt: timestamp,  // Waktu dibuat
  updatedAt: timestamp   // Waktu update terakhir
}
```

---

## Akses Admin Panel

1. Login melalui `/admin/login`
2. Gunakan kredensial admin yang telah dikonfigurasi
3. Setelah login, Anda dapat mengakses:
   - `/admin/news` - Kelola Berita
   - `/admin/messages` - Kelola Pesan Kontak
   - `/admin/videos` - Kelola Video Gallery
   - `/admin/posters` - Kelola Poster Slideshow

---

## Tips & Best Practices

### Untuk Video:
- Pastikan URL video valid dan dapat diakses publik
- Gunakan judul yang deskriptif dan menarik
- Tambahkan deskripsi untuk memberikan konteks
- Kategorikan dengan benar (YouTube, Shorts, atau Reels)

### Untuk Poster:
- Upload gambar ke Cloudinary terlebih dahulu
- Gunakan gambar berkualitas tinggi (minimal 1920x1080px)
- Format yang disarankan: PNG atau JPG
- Copy URL lengkap dari Cloudinary
- Pastikan URL dapat diakses public
- Atur urutan poster sesuai prioritas/relevansi
- Gunakan judul yang jelas dan singkat
- Poster akan berganti otomatis setiap 5 detik

---

## Troubleshooting

### Video tidak muncul di Gallery:
- Pastikan URL video benar dan dapat diakses
- Cek apakah video sudah tersimpan di Firebase
- Refresh halaman Gallery

### Poster tidak muncul di Slideshow:
- Pastikan URL Cloudinary valid dan dapat diakses
- Cek apakah gambar sudah public di Cloudinary
- Coba buka URL di browser untuk memastikan gambar dapat dimuat
- Pastikan URL sudah tersimpan di Firebase

### Error saat menyimpan poster:
- Cek koneksi internet
- Pastikan URL valid (harus dimulai dengan https://)
- Pastikan sudah login ke admin panel
- Coba refresh halaman dan input ulang

---

## Kontak Support

Jika mengalami kendala, hubungi tim IT GCNI.
