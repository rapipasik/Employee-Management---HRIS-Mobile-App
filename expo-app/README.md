# 📱 Expo Mobile App - Employee Management HRIS (NexaHR)

Ini adalah versi native **React Native / Expo** dari aplikasi HRIS Mobile yang siap dijalankan langsung di perangkat fisik iOS / Android menggunakan **Expo Go**, simulator, atau di-build menjadi APK standalone via EAS Build.

---

## 🚀 Cara Menjalankan di Expo Go (Quick Start)

### 1. Masuk ke Folder `expo-app`
Buka terminal dan navigasikan ke direktori ini:
```bash
cd expo-app
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Jalankan Server Expo Metro
```bash
npx expo start
```
Atau:
```bash
npm start
```

### 4. Buka di Perangkat Anda:
- **Android**: Buka aplikasi **Expo Go** dari Google Play Store, lalu pindai (*scan*) QR Code yang muncul di terminal Anda.
- **iOS (iPhone/iPad)**: Buka aplikasi **Kamera bawaan iOS**, arahkan ke QR Code di terminal, lalu ketuk banner untuk membukanya di **Expo Go** (unduh gratis dari App Store).
- **Android Emulator**: Tekan huruf `a` di terminal.
- **iOS Simulator (Mac)**: Tekan huruf `i` di terminal.
- **Web Browser**: Tekan huruf `w` di terminal.

---

## 🛠️ Fitur Native yang Diimplementasikan
- ✅ **Presensi Biometrik & GPS**: Validasi radius kantor Nexa Tower SCBD dan konfirmasi presensi masuk/pulang.
- ✅ **Pengajuan Cuti**: Pengurangan saldo cuti tahunan dan status review manajer.
- ✅ **Slip Gaji Digital**: Fitur sembunyikan/tampilkan nominal (*eye privacy toggle*), rincian pendapatan, dan potongan resmi (BPJS & PPh 21).
- ✅ **ID Badge Digital Karyawan**: Tampilan kartu identitas dengan QR Turnstile simulator.
- ✅ **Mode Reviewer / Manajer HR**: Opsi beralih wewenang persetujuan.

---

## 📦 Build Menjadi APK Android (EAS Build)

Untuk membuat file `.apk` yang bisa diinstal langsung ke HP tanpa Expo Go:
```bash
npm install -g eas-cli
npx eas login
npx eas build -p android --profile preview
```
