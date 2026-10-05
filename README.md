# 📱 Employee Management HRIS Mobile App (NexaHR)

Aplikasi mobile Human Resource Information System (HRIS) modern untuk manajemen karyawan mandiri (Employee Self-Service), absensi berbasis biometrik wajah & radius GPS, pengajuan cuti & izin kerja, slip gaji digital resmi, kartu ID karyawan digital 3D dengan akses gerbang turnstile QR, serta klaim biaya operasional (*reimbursement*).

---

## 🚀 Fitur Utama Aplikasi

### 1. 🕒 Presensi Masuk & Pulang (Clock-In / Clock-Out)
- **Jam Digital Real-Time**: Penunjuk waktu akurat dalam zona WIB dengan shift reguler (08:30 – 17:30).
- **Verifikasi Wajah Biometrik (Selfie)**: Integrasi webcam langsung / kamera ponsel dengan pemandu bingkai wajah (*face guide oval*) untuk validasi presensi.
- **Geofence GPS**: Pengecekan radius lokasi kantor (Nexa Tower Lt. 18, SCBD Jakarta Selatan) dengan simulator lokasi (Area Kantor 14m, WFH Remote, atau Di Luar Radius 240m).
- **Riwayat Kehadiran Harian**: Rekap waktu masuk, pulang, durasi jam kerja, dan foto biometrik saat absensi.
- **Formulir Koreksi Presensi**: Pengajuan penyesuaian jam kerja jika lupa tap atau terkendala koneksi.

### 2. 🌴 Manajemen Cuti & Izin Kerja (Leave Management)
- **Saldo Cuti Dinamis**: Pemantauan sisa cuti tahunan, kuota cuti sakit, izin khusus (pernikahan/keluarga), dan kuota WFA (Work From Anywhere).
- **Formulir Pengajuan Cuti**: Perhitungan otomatis durasi hari kerja dan opsi unggah surat keterangan dokter.
- **Mode Manajer / Reviewer HR**: Opsi beralih peran untuk menyetujui (*Approve*) atau menolak (*Reject*) pengajuan cuti anggota tim secara langsung.

### 3. 💵 Slip Gaji Digital Resmi (Payroll & Payslips)
- **Take Home Pay**: Ringkasan penerimaan bersih dengan tombol privasi mata (*eye toggle*) untuk menyembunyikan/menampilkan nominal.
- **Rincian Kompensasi**: Gaji pokok, tunjangan jabatan, tunjangan makan & transport, serta bonus kinerja.
- **Potongan Resmi Regulasi Indonesia**:
  - BPJS Ketenagakerjaan (Jaminan Hari Tua & Jaminan Pensiun)
  - BPJS Kesehatan (Iuran wajib 1%)
  - Pajak Penghasilan (PPh 21 TER)
- **Cetak & Unduh Dokumen**: Tampilan slip gaji berstempel digital resmi dan tombol cetak/simpan PDF.

### 4. 🪪 Kartu ID Badge Digital Karyawan (Digital ID Card)
- **Kartu Identitas 3D Interaktif**: Animasi putar balik kartu (*flip card*) antara tampak depan dan tampak belakang.
- **Akses Gerbang Turnstile**: Kode QR dinamis dan Barcode untuk verifikasi akses gedung kantor.
- **Informasi Lengkap**: Nomor Induk Karyawan (`EMP-2022-042`), golongan darah, tanggal bergabung, status karyawan, dan indikator chip NFC.

### 5. 👥 Direktori Karyawan & Rekan Tim
- Pencarian cepat rekan kerja berdasarkan nama, jabatan, atau divisi.
- Integrasi tombol pintas untuk langsung mengirim pesan **WhatsApp** atau **Email** ke rekan kerja.

### 6. 🧾 Klaim Biaya Operasional (Reimbursement)
- Pengajuan klaim kategori Transport (taksi/GrabCar), Medis/Kesehatan, Internet & Pulsa WFH, dan Konsumsi Bisnis.
- Pratinjau status pengajuan (*Pending*, *Disetujui*, *Ditolak*) dan total klaim tahun berjalan.

### 7. 📱 Antarmuka Mobile Adaptif
- Tampilan bingkai ponsel (*iPhone 16 Pro mockup*) dengan *Dynamic Island* aktif dan *Status Bar*.
- Tombol pengganti *viewport* di bilah atas untuk menguji tampilan dalam skala **Mobile (390px)**, **Tablet (540px)**, atau **Full Screen**.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

- **Framework**: [React 19](https://react.dev/)
- **Bundler & Dev Server**: [Vite 8](https://vitejs.dev/)
- **Bahasa Pemrograman**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Animasi**: [Motion](https://motion.dev/)
- **Tipografi**: Plus Jakarta Sans & JetBrains Mono (Google Fonts)

---

## 📋 Prasyarat Sistem (Prerequisites)

Pastikan lingkungan komputer Anda telah terinstal:
- **Node.js**: Versi `18.x` atau lebih baru (disarankan Node.js `20+` LTS)
- **npm**: Versi `9.x` atau lebih baru (atau alternatif `pnpm` / `yarn`)

Untuk memeriksa versi yang terpasang pada komputer Anda:
```bash
node -v
npm -v
```

---

## 💻 Panduan Instalasi & Menjalankan Aplikasi

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di komputer lokal:

### 1. Masuk ke Direktori Proyek
Buka terminal dan arahkan ke folder proyek:
```bash
cd /path/ke/proyek
```

### 2. Instal Dependensi
Jalankan perintah berikut untuk mengunduh semua paket yang dibutuhkan:
```bash
npm install
```

### 3. Jalankan Server Pengembangan (Dev Server)
Mulai server lokal Vite:
```bash
npm run dev
```

Secara default, Vite akan menjalankan aplikasi pada:
```
http://localhost:3000
```
Buka URL tersebut pada browser Anda (Google Chrome, Safari, atau browser pilihan Anda).

---

## 📦 Skrip Perintah yang Tersedia (Scripts)

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pengembangan dengan hot-reload |
| `npm run build` | Melakukan kompilasi (*bundle*) aplikasi untuk tahap produksi ke folder `dist` |
| `npm run preview` | Menjalankan pratinjau hasil build produksi secara lokal |
| `npm run lint` | Melakukan pengecekan tipe data TypeScript dan sintaks kode |

---

## 📂 Struktur Direktori Proyek

```text
├── index.html                  # HTML entry point utama aplikasi
├── metadata.json               # Konfigurasi metadata aplikasi AI Studio
├── package.json                # Daftar dependensi dan scripts proyek
├── tsconfig.json               # Konfigurasi TypeScript compiler
├── vite.config.ts              # Konfigurasi bundler Vite & Tailwind CSS
└── src/
    ├── main.tsx                # Titik masuk React root rendering
    ├── App.tsx                 # Komponen utama pengatur state & routing aplikasi
    ├── index.css               # Styling global Tailwind CSS & utilitas font
    ├── types.ts                # Deklarasi antarmuka dan tipe data (TypeScript)
    ├── assets/
    │   └── images/             # Aset foto avatar dan banner beresolusi tinggi
    ├── data/
    │   └── mockData.ts         # Data awal karyawan, presensi, slip gaji, & klaim
    ├── utils/
    │   └── formatters.ts       # Format mata uang Rupiah (IDR) & tanggal Indonesia
    └── components/
        ├── MobileFrame.tsx     # Bingkai ponsel (iPhone shell) & switcher viewport
        ├── BottomTabBar.tsx    # Bilah navigasi bawah 5 tab native mobile
        ├── ClockInModal.tsx    # Modal presensi wajah kamera & validasi GPS
        ├── DigitalIdModal.tsx  # Modal ID Badge digital 3D flippable
        ├── LeaveRequestModal.tsx # Formulir pengajuan cuti & izin
        ├── PayslipDetailModal.tsx # Dokumen resmi slip gaji digital
        ├── ReimbursementModal.tsx # Pengajuan & riwayat klaim pengeluaran
        ├── EmployeeDirectoryModal.tsx # Direktori kontak tim & WhatsApp
        ├── NotificationDrawer.tsx # Laci notifikasi aktivitas HRIS
        └── tabs/
            ├── HomeTab.tsx     # Tampilan Beranda & ringkasan harian
            ├── AttendanceTab.tsx # Tampilan Presensi & log jam kerja
            ├── LeaveTab.tsx    # Tampilan Cuti & persetujuan manajer
            ├── PayslipTab.tsx  # Tampilan Slip Gaji & rincian tunjangan/potongan
            └── MoreTab.tsx     # Tampilan Menu Lainnya & profil akun
```

---

## 💡 Tips Pengujian Fitur di Browser

1. **Simulasi Clock-In / Clock-Out**:
   - Klik tombol **"Presensi Masuk (Clock In)"** pada Beranda atau tab Presensi.
   - Izinkan akses kamera atau gunakan simulasi biometrik wajah.
   - Anda dapat memilih tombol simulasi lokasi: **"🏢 Kantor (14m)"**, **"🏠 WFH (Remote)"**, atau **"📍 Luar (240m)"** untuk menguji aturan validasi radius kantor.
2. **Simulasi Mode Manajer (HR Approval)**:
   - Masuk ke tab **Lainnya** (*More*) lalu aktifkan tombol sakelar **"Mode Reviewer / Manajer HR"**.
   - Buka tab **Cuti**, sekarang tombol **"Setujui"** (*Approve*) dan **"Tolak"** (*Reject*) akan muncul di setiap pengajuan cuti anggota tim!
3. **Privasi Slip Gaji**:
   - Di tab **Slip Gaji**, klik ikon mata di pojok kanan atas untuk menyembunyikan atau menampilkan rincian nominal gaji bersih Anda.
   - Klik tombol **"Lihat & Unduh Slip Gaji Resmi (PDF)"** untuk melihat dokumen slip gaji resmi berstempel digital.
4. **Pembalikan Kartu ID Karyawan**:
   - Ketuk kartu ID Badge untuk membalikkan kartu dan melihat kode QR akses pintu gerbang putar kantor (*turnstile*).

---

## 📄 Lisensi
Hak Cipta © 2026 PT Nexa Tech Nusantara Sejahtera. Seluruh hak cipta dilindungi undang-undang.
