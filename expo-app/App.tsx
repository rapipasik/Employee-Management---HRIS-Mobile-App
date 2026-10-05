import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TabType = 'home' | 'attendance' | 'leave' | 'payroll' | 'team';

interface AttendanceItem {
  id: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  status: string;
}

interface LeaveItem {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isClockedIn, setIsClockedIn] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('08:00:00 WIB');
  const [leaveBalance, setLeaveBalance] = useState<number>(9);
  const [leaveReason, setLeaveReason] = useState<string>('');
  const [leaveType, setLeaveType] = useState<string>('Cuti Tahunan');

  const [attendanceList, setAttendanceList] = useState<AttendanceItem[]>([
    { id: '1', date: '05 Okt 2026', clockIn: '08:15 WIB', clockOut: null, status: 'Hadir' },
    { id: '2', date: '02 Okt 2026', clockIn: '08:20 WIB', clockOut: '17:05 WIB', status: 'Hadir' },
    { id: '3', date: '01 Okt 2026', clockIn: '08:10 WIB', clockOut: '17:00 WIB', status: 'Hadir' },
    { id: '4', date: '30 Sep 2026', clockIn: '08:45 WIB', clockOut: '17:15 WIB', status: 'Terlambat' },
  ]);

  const [leaveList, setLeaveList] = useState<LeaveItem[]>([
    { id: '1', type: 'Cuti Tahunan', startDate: '12 Okt 2026', endDate: '14 Okt 2026', reason: 'Keperluan keluarga', status: 'Menunggu' },
    { id: '2', type: 'Cuti Sakit', startDate: '18 Sep 2026', endDate: '19 Sep 2026', reason: 'Demam dan flu', status: 'Disetujui' },
  ]);

  // Jam Real-time
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

  // Absen Masuk / Pulang Sederhana
  const handleClockInOut = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

    if (!isClockedIn) {
      const baru: AttendanceItem = {
        id: Date.now().toString(),
        date: dateStr,
        clockIn: timeStr,
        clockOut: null,
        status: 'Hadir',
      };
      setAttendanceList([baru, ...attendanceList]);
      setIsClockedIn(true);
      Alert.alert('Sukses', 'Berhasil Absen Masuk pukul ' + timeStr);
    } else {
      setAttendanceList(
        attendanceList.map((item, idx) => (idx === 0 ? { ...item, clockOut: timeStr } : item))
      );
      setIsClockedIn(false);
      Alert.alert('Sukses', 'Berhasil Absen Pulang pukul ' + timeStr);
    }
  };

  // Ajukan Cuti Sederhana
  const handleKirimCuti = () => {
    if (!leaveReason.trim()) {
      Alert.alert('Perhatian', 'Mohon isi alasan pengajuan cuti.');
      return;
    }

    const cutiBaru: LeaveItem = {
      id: Date.now().toString(),
      type: leaveType,
      startDate: '15 Okt 2026',
      endDate: '16 Okt 2026',
      reason: leaveReason,
      status: 'Menunggu',
    };

    setLeaveList([cutiBaru, ...leaveList]);
    if (leaveType === 'Cuti Tahunan') {
      setLeaveBalance((prev) => Math.max(0, prev - 1));
    }
    setLeaveReason('');
    Alert.alert('Sukses', 'Pengajuan cuti berhasil dikirim.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

      {/* Header Sederhana */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AP</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>Alex Pratama</Text>
          <Text style={styles.headerRole}>Staf IT / Programmer</Text>
        </View>
      </View>

      {/* Konten Utama */}
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* TAB 1: BERANDA */}
        {activeTab === 'home' && (
          <View>
            {/* Box Absen Cepat */}
            <View style={styles.clockCard}>
              <Text style={styles.clockTitle}>Jam Kerja Hari Ini</Text>
              <Text style={styles.clockTime}>{currentTime}</Text>
              <Text style={styles.clockStatus}>
                Status: {isClockedIn ? 'Sudah Absen Masuk' : 'Belum Absen Masuk'}
              </Text>

              <TouchableOpacity
                style={[styles.clockBtn, isClockedIn ? styles.clockOutColor : styles.clockInColor]}
                onPress={handleClockInOut}
              >
                <Text style={styles.clockBtnText}>
                  {isClockedIn ? 'Absen Pulang (Clock Out)' : 'Absen Masuk (Clock In)'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Ringkasan Angka */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Hadir</Text>
                <Text style={styles.statNumber}>21 Hari</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Sisa Cuti</Text>
                <Text style={[styles.statNumber, { color: '#059669' }]}>{leaveBalance} Hari</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Gaji Bersih</Text>
                <Text style={[styles.statNumber, { color: '#2563eb' }]}>Rp 7,65 Jt</Text>
              </View>
            </View>

            {/* Menu Cepat */}
            <Text style={styles.sectionHeader}>Menu Cepat</Text>
            <View style={styles.menuGrid}>
              <TouchableOpacity style={styles.menuItem} onPress={() => setActiveTab('attendance')}>
                <Ionicons name="time-outline" size={24} color="#2563eb" />
                <Text style={styles.menuText}>Absensi</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => setActiveTab('leave')}>
                <Ionicons name="calendar-outline" size={24} color="#059669" />
                <Text style={styles.menuText}>Cuti</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => setActiveTab('payroll')}>
                <Ionicons name="document-text-outline" size={24} color="#7c3aed" />
                <Text style={styles.menuText}>Slip Gaji</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => setActiveTab('team')}>
                <Ionicons name="people-outline" size={24} color="#d97706" />
                <Text style={styles.menuText}>Rekan Tim</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 2: ABSENSI */}
        {activeTab === 'attendance' && (
          <View>
            <Text style={styles.pageTitle}>Riwayat Kehadiran</Text>
            {attendanceList.map((item) => (
              <View key={item.id} style={styles.listItem}>
                <View>
                  <Text style={styles.itemTitle}>{item.date}</Text>
                  <Text style={styles.itemSubtitle}>
                    Masuk: {item.clockIn} • Pulang: {item.clockOut || '-'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.itemBadge,
                    { backgroundColor: item.status === 'Hadir' ? '#ecfdf5' : '#fffbeb', color: item.status === 'Hadir' ? '#059669' : '#d97706' },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* TAB 3: CUTI */}
        {activeTab === 'leave' && (
          <View>
            <View style={styles.leaveHeaderBox}>
              <Text style={styles.leaveBoxLabel}>Sisa Jatah Cuti Anda:</Text>
              <Text style={styles.leaveBoxValue}>{leaveBalance} Hari</Text>
            </View>

            <View style={styles.formBox}>
              <Text style={styles.formTitle}>Pengajuan Cuti Sederhana</Text>
              <TextInput
                style={styles.input}
                placeholder="Tulis alasan cuti..."
                value={leaveReason}
                onChangeText={setLeaveReason}
              />
              <TouchableOpacity style={styles.submitBtn} onPress={handleKirimCuti}>
                <Text style={styles.submitBtnText}>Kirim Pengajuan</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionHeader}>Riwayat Cuti</Text>
            {leaveList.map((item) => (
              <View key={item.id} style={styles.listItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.type}</Text>
                  <Text style={styles.itemSubtitle}>{item.startDate} s/d {item.endDate}</Text>
                  <Text style={[styles.itemSubtitle, { fontStyle: 'italic' }]}>"{item.reason}"</Text>
                </View>
                <Text
                  style={[
                    styles.itemBadge,
                    { backgroundColor: item.status === 'Disetujui' ? '#ecfdf5' : '#fffbeb', color: item.status === 'Disetujui' ? '#059669' : '#d97706' },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* TAB 4: SLIP GAJI */}
        {activeTab === 'payroll' && (
          <View>
            <Text style={styles.pageTitle}>Slip Gaji (September 2026)</Text>
            <View style={styles.salaryCard}>
              <Text style={styles.salaryLabel}>Gaji Bersih Diterima</Text>
              <Text style={styles.salaryAmount}>Rp 7.650.000</Text>
              <Text style={styles.salaryNote}>Ditransfer via Rekening BCA</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardHeader}>Rincian Gaji</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Gaji Pokok</Text>
                <Text style={styles.value}>Rp 6.500.000</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Tunjangan</Text>
                <Text style={styles.value}>+Rp 1.500.000</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, { color: '#e11d48' }]}>Potongan (BPJS/Pajak)</Text>
                <Text style={[styles.value, { color: '#e11d48' }]}>-Rp 350.000</Text>
              </View>
              <View style={[styles.row, { borderTopWidth: 1, borderColor: '#e2e8f0', paddingTop: 8, marginTop: 4 }]}>
                <Text style={[styles.label, { fontWeight: 'bold' }]}>Total Bersih</Text>
                <Text style={[styles.value, { fontWeight: 'bold', color: '#059669' }]}>Rp 7.650.000</Text>
              </View>
            </View>
          </View>
        )}

        {/* TAB 5: TIM */}
        {activeTab === 'team' && (
          <View>
            <Text style={styles.pageTitle}>Daftar Rekan Kerja</Text>
            {[
              { id: '1', name: 'Alex Pratama', role: 'IT Programmer', phone: '0812-3456-7890' },
              { id: '2', name: 'Maya Indrawati', role: 'Manajer HRD', phone: '0811-9876-5432' },
              { id: '3', name: 'Budi Santoso', role: 'Desain Grafis', phone: '0813-1122-3344' },
              { id: '4', name: 'Siti Rahma', role: 'Staf Administrasi', phone: '0857-4433-2211' },
            ].map((person) => (
              <View key={person.id} style={styles.listItem}>
                <View>
                  <Text style={styles.itemTitle}>{person.name}</Text>
                  <Text style={styles.itemSubtitle}>{person.role} • {person.phone}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Navigasi Bawah */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navBtn} onPress={() => setActiveTab('home')}>
          <Ionicons name={activeTab === 'home' ? 'home' : 'home-outline'} size={20} color={activeTab === 'home' ? '#2563eb' : '#64748b'} />
          <Text style={[styles.navText, activeTab === 'home' && styles.navActive]}>Beranda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navBtn} onPress={() => setActiveTab('attendance')}>
          <Ionicons name={activeTab === 'attendance' ? 'time' : 'time-outline'} size={20} color={activeTab === 'attendance' ? '#2563eb' : '#64748b'} />
          <Text style={[styles.navText, activeTab === 'attendance' && styles.navActive]}>Absensi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navBtn} onPress={() => setActiveTab('leave')}>
          <Ionicons name={activeTab === 'leave' ? 'calendar' : 'calendar-outline'} size={20} color={activeTab === 'leave' ? '#2563eb' : '#64748b'} />
          <Text style={[styles.navText, activeTab === 'leave' && styles.navActive]}>Cuti</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navBtn} onPress={() => setActiveTab('payroll')}>
          <Ionicons name={activeTab === 'payroll' ? 'document-text' : 'document-text-outline'} size={20} color={activeTab === 'payroll' ? '#2563eb' : '#64748b'} />
          <Text style={[styles.navText, activeTab === 'payroll' && styles.navActive]}>Gaji</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navBtn} onPress={() => setActiveTab('team')}>
          <Ionicons name={activeTab === 'team' ? 'people' : 'people-outline'} size={20} color={activeTab === 'team' ? '#2563eb' : '#64748b'} />
          <Text style={[styles.navText, activeTab === 'team' && styles.navActive]}>Tim</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#2563eb' },
  header: {
    backgroundColor: '#2563eb',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1d4ed8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  headerInfo: { flex: 1 },
  headerName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  headerRole: { color: '#bfdbfe', fontSize: 12 },
  container: { flex: 1, backgroundColor: '#f8fafc' },
  contentContainer: { padding: 16, paddingBottom: 30 },
  clockCard: {
    backgroundColor: '#0f172a',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  clockTitle: { color: '#94a3b8', fontSize: 12 },
  clockTime: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginVertical: 6 },
  clockStatus: { color: '#cbd5e1', fontSize: 12, marginBottom: 14 },
  clockBtn: { width: '100%', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  clockInColor: { backgroundColor: '#2563eb' },
  clockOutColor: { backgroundColor: '#d97706' },
  clockBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  statLabel: { fontSize: 11, color: '#64748b' },
  statNumber: { fontSize: 16, fontWeight: 'bold', marginTop: 2, color: '#0f172a' },
  sectionHeader: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  menuItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    gap: 4,
  },
  menuText: { fontSize: 12, fontWeight: '600', color: '#0f172a' },
  pageTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  listItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: { fontSize: 13, fontWeight: 'bold', color: '#0f172a' },
  itemSubtitle: { fontSize: 11, color: '#64748b', marginTop: 2 },
  itemBadge: { fontSize: 10, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  leaveHeaderBox: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },
  leaveBoxLabel: { color: '#a7f3d0', fontSize: 12 },
  leaveBoxValue: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 4 },
  formBox: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  formTitle: { fontSize: 12, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 8,
    fontSize: 12,
    backgroundColor: '#f8fafc',
    marginBottom: 10,
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  salaryCard: {
    backgroundColor: '#0f172a',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  salaryLabel: { color: '#94a3b8', fontSize: 11 },
  salaryAmount: { color: '#10b981', fontSize: 24, fontWeight: 'bold', marginVertical: 4 },
  salaryNote: { color: '#64748b', fontSize: 11 },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: { fontSize: 12, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  label: { fontSize: 12, color: '#475569' },
  value: { fontSize: 12, fontWeight: '600', color: '#0f172a' },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 6,
  },
  navBtn: { flex: 1, alignItems: 'center' },
  navText: { fontSize: 9, color: '#64748b', marginTop: 2 },
  navActive: { color: '#2563eb', fontWeight: 'bold' },
});
