# 🍽️ Flavoria App

**Aplikasi Resep Makanan Berbasis React Native (Expo)**

---

## 📌 Deskripsi Aplikasi

Flavoria adalah aplikasi mobile berbasis **React Native (Expo)** yang digunakan untuk menampilkan dan mengelola informasi resep makanan dari berbagai negara. Data resep diperoleh melalui **API eksternal** dan disajikan dalam bentuk antarmuka yang interaktif dan mudah digunakan. Aplikasi ini dikembangkan sekaligus sebagai studi kasus **optimasi dan debugging** pada aplikasi mobile React Native, dengan fokus pada stabilitas aplikasi, penanganan error saat runtime, serta pencegahan terjadinya crash pada perangkat Android.

---

## ✨ Fitur Aplikasi

* 🌍 Menampilkan daftar resep makanan dari berbagai negara
* 📄 Menampilkan detail resep makanan (bahan dan cara memasak)
* ⭐ Menandai resep sebagai favorit
* 👤 Halaman profil pengguna
* 🔄 Navigasi antar halaman yang smooth
* 🛠️ Penanganan error dan optimasi render komponen

---

## 🚀 List Optimasi (Sudah Diterapkan)

Untuk meningkatkan performa dan pengalaman pengguna, berikut beberapa teknik optimasi yang telah diterapkan dalam aplikasi:

* **useMemo**: Digunakan untuk memproses filtrasi data resep dari API agar aplikasi tidak melakukan komputasi berat secara berulang pada setiap proses render.

* **useCallback**: Digunakan untuk me-memoize handler pencarian dan fungsi navigasi sehingga fungsi tidak dibuat ulang setiap kali komponen mengalami render ulang.

* **React.memo**: Diterapkan pada komponen reusable seperti kartu resep atau tombol untuk mencegah re-render yang tidak diperlukan ketika nilai props tidak berubah.

* **Try-Catch Error Handling**: Digunakan pada setiap pemanggilan API untuk memastikan aplikasi tidak mengalami force close ketika terjadi kegagalan server atau masalah jaringan.

* **Optimasi Gambar**: Menerapkan penanganan error pada komponen `<Image>` agar aplikasi tetap stabil meskipun URL gambar dari API tidak valid atau rusak.

---

## 🔍 List Testing & Debugging

Proses pengembangan aplikasi ini melibatkan beberapa metode testing dan debugging, antara lain:

* **Console.log**: Digunakan untuk melacak aliran data dari API dan memastikan state aplikasi tersimpan dengan benar.

* **Metro Bundler**: Digunakan untuk memantau log error dan peringatan secara real-time selama proses pengembangan pada emulator maupun perangkat fisik.

* **Expo DevTools**: Digunakan untuk memonitor performa aplikasi serta mengecek network request.

* **Error Handling dengan Alert**: Menampilkan notifikasi yang user-friendly menggunakan komponen `Alert` ketika terjadi kegagalan koneksi atau data tidak ditemukan.

---

## 🐞 Permasalahan yang Ditemukan

Pada tahap pengujian awal, aplikasi mengalami crash saat dijalankan di perangkat Android dengan pesan error berikut:

> **“Text strings must be rendered within a `<Text>` component”**

Error ini terjadi akibat penggunaan operator logika `&&` pada proses render, misalnya:

`{data.length && <Component />}`

Kondisi tersebut menyebabkan nilai numerik `0` dirender langsung di luar komponen `<Text>`, sehingga memicu crash pada aplikasi.

---

## 🔧 Solusi Perbaikan

Langkah-langkah perbaikan yang dilakukan untuk mengatasi permasalahan tersebut adalah sebagai berikut:

* Mengganti operator logika `&&` dengan **ternary operator**, misalnya:
  `{data.length > 0 ? <Component /> : null}`
* Memastikan setiap kondisi yang tidak terpenuhi menghasilkan nilai `null`
* Melakukan validasi data dari API sebelum data ditampilkan pada antarmuka aplikasi

Dengan perbaikan tersebut, aplikasi dapat berjalan lebih stabil tanpa mengalami error render.

---

## 🛠️ Teknologi yang Digunakan

* ⚛️ React Native (Expo)
* 🌐 **TheMealDB API** (Sumber data resep makanan)
* 📱 Android Device Testing
* 🧠 JavaScript / TypeScript

---

## 👩‍💻 Author

**Nama**: Salwa Aprilia Santi

**NIM**: 20230040141

**Kelas**: TI23F

**Dosen**: Nugraha, M.Kom
