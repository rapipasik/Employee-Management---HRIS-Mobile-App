import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

// Types
type TabType = 'home' | 'attendance' | 'leave' | 'payslip' | 'more';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isClockedIn, setIsClockedIn] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('08:45:00 WIB');
  const [isAmountVisible, setIsAmountVisible] = useState<boolean>(false);
  const [isClockInModalOpen, setIsClockInModalOpen] = useState<boolean>(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);
  const [isIdBadgeModalOpen, setIsIdBadgeModalOpen] = useState<boolean>(false);
  const [isManagerMode, setIsManagerMode] = useState<boolean>(false);

  // Leave State
  const [leaveDaysLeft, setLeaveDaysLeft] = useState(9);
  const [leaveReason, setLeaveReason] = useState('');

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockInOut = () => {
    setIsClockedIn(!isClockedIn);
    setIsClockInModalOpen(false);
    Alert.alert(
      isClockedIn ? 'Clock-Out Berhasil' : 'Clock-In Berhasil',
      isClockedIn
        ? 'Presensi pulang berhasil dicatat. Selamat beristirahat!'
        : 'Presensi masuk berhasil di Nexa Tower SCBD (Radius 14m).'
    );
  };

  const handleLeaveSubmit = () => {
    if (!leaveReason.trim()) {
      Alert.alert('Perhatian', 'Harap isi alasan pengajuan cuti.');
      return;
    }
    setLeaveDaysLeft((prev) => Math.max(0, prev - 2));
    setLeaveReason('');
    setIsLeaveModalOpen(false);
    Alert.alert('Berhasil', 'Pengajuan cuti 2 hari berhasil dikirim ke manajer.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Main Content Area */}
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AP</Text>
              <View style={styles.onlineBadge} />
            </View>
            <View>
              <Text style={styles.greetingText}>Selamat Datang Kembali 👋</Text>
              <Text style={styles.userName}>Alex Pratama, S.Kom</Text>
              <Text style={styles.userRole}>Senior Frontend Engineer</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.badgeButton}
            onPress={() => setIsIdBadgeModalOpen(true)}
          >
            <Ionicons name="card-outline" size={20} color="#2563eb" />
          </TouchableOpacity>
        </View>

        {/* Dynamic Island Status Pill */}
        <View style={styles.dynamicIslandBanner}>
          <View style={styles.pulseDot} />
          <Text style={styles.dynamicIslandText}>
            {isClockedIn ? 'Presensi Masuk: 08:24 WIB (SCBD 14m)' : 'Belum Presensi Hari Ini'}
          </Text>
        </View>

        {/* TAB 1: BERANDA */}
        {activeTab === 'home' && (
          <View style={styles.tabContent}>
            {/* Clock-In Hero Card */}
            <View style={styles.heroCard}>
              <View style={styles.shiftRow}>
                <Ionicons name="time-outline" size={16} color="#60a5fa" />
                <Text style={styles.shiftText}>Shift Reguler (08:30 - 17:30 WIB)</Text>
              </View>
              <Text style={styles.clockTime}>{currentTime}</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>
                  {isClockedIn ? '● Sedang Bekerja (Tepat Waktu)' : '○ Menunggu Clock-In'}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.clockButton, isClockedIn ? styles.clockOutBtn : styles.clockInBtn]}
                onPress={() => setIsClockInModalOpen(true)}
              >
                <Ionicons name="finger-print-outline" size={20} color="#fff" />
                <Text style={styles.clockButtonText}>
                  {isClockedIn ? 'PRESENSI PULANG (CLOCK OUT)' : 'PRESENSI MASUK (CLOCK IN)'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quick Menu Grid */}
            <Text style={styles.sectionTitle}>Layanan Utama HRIS</Text>
            <View style={styles.menuGrid}>
              <TouchableOpacity
                style={styles.menuCard}
                onPress={() => setActiveTab('attendance')}
              >
                <View style={[styles.menuIconBg, { backgroundColor: '#eff6ff' }]}>
                  <Ionicons name="calendar-outline" size={22} color="#2563eb" />
                </View>
                <Text style={styles.menuTitle}>Presensi</Text>
                <Text style={styles.menuSubtitle}>Riwayat GPS</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuCard}
                onPress={() => setIsLeaveModalOpen(true)}
              >
                <View style={[styles.menuIconBg, { backgroundColor: '#ecfdf5' }]}>
                  <Ionicons name="airplane-outline" size={22} color="#059669" />
                </View>
                <Text style={styles.menuTitle}>Ajukan Cuti</Text>
                <Text style={styles.menuSubtitle}>Sisa {leaveDaysLeft} Hari</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuCard}
                onPress={() => setActiveTab('payslip')}
              >
                <View style={[styles.menuIconBg, { backgroundColor: '#faf5ff' }]}>
                  <Ionicons name="document-text-outline" size={22} color="#9333ea" />
                </View>
                <Text style={styles.menuTitle}>Slip Gaji</Text>
                <Text style={styles.menuSubtitle}>Sep 2026</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuCard}
                onPress={() => setIsIdBadgeModalOpen(true)}
              >
                <View style={[styles.menuIconBg, { backgroundColor: '#eef2ff' }]}>
                  <Ionicons name="id-card-outline" size={22} color="#4f46e5" />
                </View>
                <Text style={styles.menuTitle}>ID Badge</Text>
                <Text style={styles.menuSubtitle}>QR Gate</Text>
              </TouchableOpacity>
            </View>

            {/* Monthly Attendance Mini Stats */}
            <View style={styles.statsCard}>
              <Text style={styles.statsCardTitle}>Ringkasan Bulan Ini (Oktober)</Text>
              <View style={styles.statsRow}>
                <View style={styles.statCol}>
                  <Text style={styles.statLabel}>Hadir</Text>
                  <Text style={[styles.statValue, { color: '#059669' }]}>21</Text>
                </View>
                <View style={styles.statCol}>
                  <Text style={styles.statLabel}>Terlambat</Text>
                  <Text style={[styles.statValue, { color: '#d97706' }]}>1</Text>
                </View>
                <View style={styles.statCol}>
                  <Text style={styles.statLabel}>Sisa Cuti</Text>
                  <Text style={[styles.statValue, { color: '#7c3aed' }]}>{leaveDaysLeft}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* TAB 2: PRESENSI */}
        {activeTab === 'attendance' && (
          <View style={styles.tabContent}>
            <Text style={styles.pageTitle}>Rekap Presensi & Log Jam Kerja</Text>
            <View style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDay}>Senin, 05 Okt 2026</Text>
                <Text style={[styles.tagBadge, { backgroundColor: '#ecfdf5', color: '#059669' }]}>
                  Hadir
                </Text>
              </View>
              <Text style={styles.historyTime}>Masuk: 08:24 WIB • Pulang: Sedang Berjalan</Text>
              <Text style={styles.historyLoc}>📍 Nexa Tower SCBD Lt. 18 (Radius 14m)</Text>
            </View>

            <View style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDay}>Jumat, 02 Okt 2026</Text>
                <Text style={[styles.tagBadge, { backgroundColor: '#ecfdf5', color: '#059669' }]}>
                  Hadir
                </Text>
              </View>
              <Text style={styles.historyTime}>Masuk: 08:28 WIB • Pulang: 17:34 WIB (9j 6m)</Text>
              <Text style={styles.historyLoc}>📍 Nexa Tower SCBD Lt. 18 (Radius 18m)</Text>
            </View>

            <View style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDay}>Kamis, 01 Okt 2026</Text>
                <Text style={[styles.tagBadge, { backgroundColor: '#fffbeb', color: '#d97706' }]}>
                  Terlambat
                </Text>
              </View>
              <Text style={styles.historyTime}>Masuk: 08:42 WIB • Pulang: 17:50 WIB (9j 8m)</Text>
              <Text style={styles.historyLoc}>📍 Nexa Tower SCBD Lt. 18 (Radius 22m)</Text>
            </View>
          </View>
        )}

        {/* TAB 3: CUTI */}
        {activeTab === 'leave' && (
          <View style={styles.tabContent}>
            <Text style={styles.pageTitle}>Saldo Cuti & Permohonan Izin</Text>
            <View style={styles.leaveBalanceCard}>
              <Text style={styles.leaveBalanceTitle}>Cuti Tahunan 2026</Text>
              <Text style={styles.leaveBalanceValue}>{leaveDaysLeft} Hari Tersisa</Text>
              <TouchableOpacity
                style={styles.applyLeaveBtn}
                onPress={() => setIsLeaveModalOpen(true)}
              >
                <Text style={styles.applyLeaveBtnText}>+ Ajukan Permohonan Cuti</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Riwayat Cuti Terkini</Text>
            <View style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDay}>Cuti Tahunan (3 Hari)</Text>
                <Text style={[styles.tagBadge, { backgroundColor: '#fffbeb', color: '#d97706' }]}>
                  Pending
                </Text>
              </View>
              <Text style={styles.historyTime}>12 Okt 2026 - 14 Okt 2026</Text>
              <Text style={styles.historyLoc}>"Keperluan liburan keluarga tahunan"</Text>
            </View>
          </View>
        )}

        {/* TAB 4: SLIP GAJI */}
        {activeTab === 'payslip' && (
          <View style={styles.tabContent}>
            <View style={styles.payslipHeaderRow}>
              <Text style={styles.pageTitle}>Slip Gaji Periode Sep 2026</Text>
              <TouchableOpacity onPress={() => setIsAmountVisible(!isAmountVisible)}>
                <Ionicons
                  name={isAmountVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#2563eb"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.salaryCard}>
              <Text style={styles.salaryLabel}>Take Home Pay (Gaji Bersih)</Text>
              <Text style={styles.salaryAmount}>
                {isAmountVisible ? 'Rp 21.180.000' : 'Rp ••••••••'}
              </Text>
              <Text style={styles.salaryNotice}>Ditransfer via BCA • 25 September 2026</Text>
            </View>

            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownSection}>A. Pendapatan</Text>
              <View style={styles.breakdownRow}>
                <Text style={styles.itemLabel}>Gaji Pokok</Text>
                <Text style={styles.itemValue}>{isAmountVisible ? 'Rp 16.500.000' : '••••'}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.itemLabel}>Tunjangan Jabatan</Text>
                <Text style={styles.itemValue}>{isAmountVisible ? 'Rp 2.500.000' : '••••'}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.itemLabel}>Tunjangan Transport & Makan</Text>
                <Text style={styles.itemValue}>{isAmountVisible ? 'Rp 1.800.000' : '••••'}</Text>
              </View>

              <Text style={[styles.breakdownSection, { marginTop: 12 }]}>B. Potongan</Text>
              <View style={styles.breakdownRow}>
                <Text style={styles.itemLabel}>BPJS Ketenagakerjaan</Text>
                <Text style={[styles.itemValue, { color: '#e11d48' }]}>
                  {isAmountVisible ? '-Rp 330.000' : '••••'}
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.itemLabel}>BPJS Kesehatan</Text>
                <Text style={[styles.itemValue, { color: '#e11d48' }]}>
                  {isAmountVisible ? '-Rp 165.000' : '••••'}
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.itemLabel}>PPh 21 Pajak</Text>
                <Text style={[styles.itemValue, { color: '#e11d48' }]}>
                  {isAmountVisible ? '-Rp 825.000' : '••••'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* TAB 5: LAINNYA */}
        {activeTab === 'more' && (
          <View style={styles.tabContent}>
            <Text style={styles.pageTitle}>Menu & Pengaturan</Text>
            <TouchableOpacity
              style={styles.moreMenuItem}
              onPress={() => setIsIdBadgeModalOpen(true)}
            >
              <Ionicons name="card-outline" size={22} color="#2563eb" />
              <View style={styles.moreMenuText}>
                <Text style={styles.moreMenuTitle}>Kartu ID Badge Digital</Text>
                <Text style={styles.moreMenuSubtitle}>Akses gerbang turnstile QR & NFC</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moreMenuItem}
              onPress={() => Alert.alert('Jadwal Shift', 'Senin - Jumat: 08:30 - 17:30 WIB')}
            >
              <Ionicons name="calendar-outline" size={22} color="#059669" />
              <View style={styles.moreMenuText}>
                <Text style={styles.moreMenuTitle}>Jadwal Shift Kerja</Text>
                <Text style={styles.moreMenuSubtitle}>Pola kerja hybrid WFO/WFA</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moreMenuItem}
              onPress={() => {
                setIsManagerMode(!isManagerMode);
                Alert.alert(
                  !isManagerMode ? 'Mode Manajer Aktif' : 'Mode Karyawan Aktif',
                  !isManagerMode
                    ? 'Anda sekarang memiliki wewenang untuk mereview cuti tim.'
                    : 'Kembali ke mode staf karyawan reguler.'
                );
              }}
            >
              <Ionicons name="shield-checkmark-outline" size={22} color="#7c3aed" />
              <View style={styles.moreMenuText}>
                <Text style={styles.moreMenuTitle}>Mode Reviewer / Manajer</Text>
                <Text style={styles.moreMenuSubtitle}>
                  {isManagerMode ? 'Status: AKTIF' : 'Status: NON-AKTIF'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
        >
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={22}
            color={activeTab === 'home' ? '#2563eb' : '#64748b'}
          />
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>
            Beranda
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('attendance')}
        >
          <Ionicons
            name={activeTab === 'attendance' ? 'time' : 'time-outline'}
            size={22}
            color={activeTab === 'attendance' ? '#2563eb' : '#64748b'}
          />
          <Text style={[styles.navText, activeTab === 'attendance' && styles.navTextActive]}>
            Presensi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('leave')}
        >
          <Ionicons
            name={activeTab === 'leave' ? 'calendar' : 'calendar-outline'}
            size={22}
            color={activeTab === 'leave' ? '#2563eb' : '#64748b'}
          />
          <Text style={[styles.navText, activeTab === 'leave' && styles.navTextActive]}>
            Cuti
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('payslip')}
        >
          <Ionicons
            name={activeTab === 'payslip' ? 'document-text' : 'document-text-outline'}
            size={22}
            color={activeTab === 'payslip' ? '#2563eb' : '#64748b'}
          />
          <Text style={[styles.navText, activeTab === 'payslip' && styles.navTextActive]}>
            Slip Gaji
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('more')}
        >
          <Ionicons
            name={activeTab === 'more' ? 'menu' : 'menu-outline'}
            size={22}
            color={activeTab === 'more' ? '#2563eb' : '#64748b'}
          />
          <Text style={[styles.navText, activeTab === 'more' && styles.navTextActive]}>
            Lainnya
          </Text>
        </TouchableOpacity>
      </View>

      {/* CLOCK-IN MODAL */}
      <Modal visible={isClockInModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Verifikasi Presensi Biometrik</Text>
            <Text style={styles.modalSubtitle}>Posisikan wajah Anda pada area bingkai kamera</Text>

            <View style={styles.cameraBox}>
              <Ionicons name="camera-outline" size={48} color="#94a3b8" />
              <Text style={styles.cameraNotice}>Wajah Terverifikasi 99.2%</Text>
            </View>

            <View style={styles.locationPill}>
              <Ionicons name="location-outline" size={16} color="#059669" />
              <Text style={styles.locationText}>Nexa Tower SCBD (Radius 14m - Valid)</Text>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleClockInOut}>
              <Text style={styles.submitBtnText}>
                {isClockedIn ? 'Konfirmasi Clock-Out' : 'Konfirmasi Clock-In'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setIsClockInModalOpen(false)}
            >
              <Text style={styles.cancelBtnText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* LEAVE MODAL */}
      <Modal visible={isLeaveModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Pengajuan Cuti / Izin</Text>
            <Text style={styles.modalSubtitle}>Sisa kuota tahunan: {leaveDaysLeft} hari</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Alasan pengajuan cuti..."
              value={leaveReason}
              onChangeText={setLeaveReason}
              multiline
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleLeaveSubmit}>
              <Text style={styles.submitBtnText}>Kirim Permohonan Cuti</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setIsLeaveModalOpen(false)}
            >
              <Text style={styles.cancelBtnText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ID BADGE MODAL */}
      <Modal visible={isIdBadgeModalOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: '#0f172a' }]}>
            <Text style={[styles.modalTitle, { color: '#fff' }]}>PT NEXA TECH NUSANTARA</Text>
            <Text style={[styles.modalSubtitle, { color: '#94a3b8' }]}>ID Karyawan Digital</Text>

            <View style={styles.idPhoto}>
              <Text style={styles.idPhotoText}>AP</Text>
            </View>

            <Text style={styles.idName}>Alex Pratama, S.Kom</Text>
            <Text style={styles.idRole}>Senior Frontend Engineer</Text>
            <Text style={styles.idEmpNumber}>EMP-2022-042</Text>

            <View style={styles.qrSimulation}>
              <Ionicons name="qr-code-outline" size={72} color="#0f172a" />
              <Text style={styles.qrNote}>Akses Gerbang Turnstile SCBD</Text>
            </View>

            <TouchableOpacity
              style={[styles.cancelBtn, { marginTop: 16 }]}
              onPress={() => setIsIdBadgeModalOpen(false)}
            >
              <Text style={[styles.cancelBtnText, { color: '#94a3b8' }]}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  onlineBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    position: 'absolute',
    bottom: -2,
    right: -2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  greetingText: {
    fontSize: 11,
    color: '#64748b',
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  userRole: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  badgeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dynamicIslandBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'center',
    gap: 8,
    marginBottom: 16,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  dynamicIslandText: {
    color: '#e2e8f0',
    fontSize: 11,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  heroCard: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  shiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  shiftText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  clockTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    fontVariant: ['tabular-nums'],
    marginVertical: 4,
  },
  statusPill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  statusPillText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  clockButton: {
    width: '100%',
    height: 48,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  clockInBtn: {
    backgroundColor: '#2563eb',
  },
  clockOutBtn: {
    backgroundColor: '#d97706',
  },
  clockButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  menuCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  menuIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statsCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCol: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  historyDay: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  tagBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  historyTime: {
    fontSize: 12,
    color: '#334155',
    marginBottom: 4,
  },
  historyLoc: {
    fontSize: 11,
    color: '#64748b',
  },
  leaveBalanceCard: {
    backgroundColor: '#2563eb',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  leaveBalanceTitle: {
    color: '#bfdbfe',
    fontSize: 12,
  },
  leaveBalanceValue: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  applyLeaveBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  applyLeaveBtnText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 13,
  },
  payslipHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salaryCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    marginVertical: 12,
  },
  salaryLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },
  salaryAmount: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  salaryNotice: {
    color: '#64748b',
    fontSize: 11,
  },
  breakdownCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  breakdownSection: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  itemLabel: {
    fontSize: 12,
    color: '#475569',
  },
  itemValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  moreMenuItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  moreMenuText: {
    flex: 1,
  },
  moreMenuTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  moreMenuSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 3,
  },
  navTextActive: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
  },
  cameraBox: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cameraNotice: {
    fontSize: 10,
    color: '#059669',
    fontWeight: 'bold',
    marginTop: 4,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  modalInput: {
    width: '100%',
    height: 80,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#f8fafc',
    fontSize: 12,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  submitBtn: {
    width: '100%',
    height: 44,
    backgroundColor: '#2563eb',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  cancelBtn: {
    marginTop: 10,
    padding: 8,
  },
  cancelBtnText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  idPhoto: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  idPhotoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  idName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  idRole: {
    color: '#60a5fa',
    fontSize: 12,
    marginTop: 2,
  },
  idEmpNumber: {
    color: '#94a3b8',
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  qrSimulation: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  qrNote: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
    marginTop: 6,
  },
});
