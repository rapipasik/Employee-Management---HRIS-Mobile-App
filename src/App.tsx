import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Clock, 
  Calendar, 
  FileText, 
  Users, 
  CheckCircle, 
  Plus, 
  Smartphone, 
  ChevronRight,
  User
} from 'lucide-react';
import { Employee, AttendanceItem, LeaveItem, PayslipItem } from './types';
import userAvatar from './assets/images/hris_user_avatar_1791208090688.jpg';

// Data Karyawan Awal (Simpel & Jelas)
const INITIAL_EMPLOYEE: Employee = {
  id: 'EMP-001',
  name: 'Alex Pratama',
  role: 'Staf IT / Programmer',
  department: 'Teknologi Informasi',
  phone: '0812-3456-7890',
  email: 'alex@perusahaan.com',
  avatar: userAvatar,
  joinDate: '15 Maret 2022',
  employeeId: 'EMP-2022-042',
  status: 'Tetap',
  officeLocation: 'Kantor Pusat Lt. 3',
  bankAccount: {
    bankName: 'BCA',
    accountNumber: '8820 4491 20',
    accountHolder: 'ALEX PRATAMA',
  },
  ptkp: 'TK/0',
  bpjsKetenagakerjaan: '22094418290',
  bpjsKesehatan: '00029481928',
  leaveBalance: {
    annual: 9,
    annualTotal: 12,
    sick: 14,
    special: 3,
    wfa: 4,
  },
  managerName: 'Maya Indrawati',
};

const INITIAL_ATTENDANCE: AttendanceItem[] = [
  { id: '1', date: '05 Okt 2026', clockIn: '08:15 WIB', clockOut: null, status: 'Hadir' },
  { id: '2', date: '02 Okt 2026', clockIn: '08:20 WIB', clockOut: '17:05 WIB', status: 'Hadir' },
  { id: '3', date: '01 Okt 2026', clockIn: '08:10 WIB', clockOut: '17:00 WIB', status: 'Hadir' },
  { id: '4', date: '30 Sep 2026', clockIn: '08:45 WIB', clockOut: '17:15 WIB', status: 'Terlambat' },
  { id: '5', date: '29 Sep 2026', clockIn: '08:12 WIB', clockOut: '17:02 WIB', status: 'Hadir' },
];

const INITIAL_LEAVE: LeaveItem[] = [
  { id: '1', type: 'Cuti Tahunan', startDate: '12 Okt 2026', endDate: '14 Okt 2026', reason: 'Keperluan keluarga', status: 'Menunggu' },
  { id: '2', type: 'Cuti Sakit', startDate: '18 Sep 2026', endDate: '19 Sep 2026', reason: 'Demam dan flu', status: 'Disetujui' },
];

const INITIAL_PAYSLIP: PayslipItem = {
  month: 'September 2026',
  basicSalary: 6500000,
  allowance: 1500000,
  deduction: 350000,
  total: 7650000,
};

const TEAM_LIST = [
  { id: '1', name: 'Alex Pratama', role: 'IT Programmer', phone: '0812-3456-7890' },
  { id: '2', name: 'Maya Indrawati', role: 'Manajer HRD', phone: '0811-9876-5432' },
  { id: '3', name: 'Budi Santoso', role: 'Desain Grafis', phone: '0813-1122-3344' },
  { id: '4', name: 'Siti Rahma', role: 'Staf Administrasi', phone: '0857-4433-2211' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'attendance' | 'leave' | 'payroll' | 'team'>('home');
  const [employee, setEmployee] = useState<Employee>(INITIAL_EMPLOYEE);
  const [attendanceList, setAttendanceList] = useState<AttendanceItem[]>(INITIAL_ATTENDANCE);
  const [isClockedIn, setIsClockedIn] = useState<boolean>(true);
  const [leaveList, setLeaveList] = useState<LeaveItem[]>(INITIAL_LEAVE);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Form Cuti Sederhana
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveType, setLeaveType] = useState('Cuti Tahunan');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  // Notifikasi pesan
  const [pesanSukses, setPesanSukses] = useState<string | null>(null);

  const tampilkanPesan = (pesan: string) => {
    setPesanSukses(pesan);
    setTimeout(() => setPesanSukses(null), 3000);
  };

  // Jam real-time
  useEffect(() => {
    const updateJam = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB');
    };
    updateJam();
    const interval = setInterval(updateJam, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format Rupiah sederhana
  const formatRp = (angka: number) => {
    return 'Rp ' + angka.toLocaleString('id-ID');
  };

  // Fungsi Absen Masuk & Pulang
  const handleClockInOut = () => {
    const now = new Date();
    const jamSekarang = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const tanggalSekarang = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

    if (!isClockedIn) {
      // Clock In
      const baru: AttendanceItem = {
        id: Date.now().toString(),
        date: tanggalSekarang,
        clockIn: jamSekarang,
        clockOut: null,
        status: 'Hadir',
      };
      setAttendanceList([baru, ...attendanceList]);
      setIsClockedIn(true);
      tampilkanPesan('✓ Berhasil Absen Masuk pukul ' + jamSekarang);
    } else {
      // Clock Out
      setAttendanceList(
        attendanceList.map((item, idx) =>
          idx === 0 ? { ...item, clockOut: jamSekarang } : item
        )
      );
      setIsClockedIn(false);
      tampilkanPesan('✓ Berhasil Absen Pulang pukul ' + jamSekarang);
    }
  };

  // Kirim Pengajuan Cuti
  const handleKirimCuti = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveStartDate || !leaveReason) {
      alert('Mohon isi tanggal dan alasan cuti.');
      return;
    }

    const cutiBaru: LeaveItem = {
      id: Date.now().toString(),
      type: leaveType,
      startDate: leaveStartDate,
      endDate: leaveEndDate || leaveStartDate,
      reason: leaveReason,
      status: 'Menunggu',
    };

    setLeaveList([cutiBaru, ...leaveList]);
    if (leaveType === 'Cuti Tahunan') {
      setEmployee({
        ...employee,
        leaveBalance: {
          ...employee.leaveBalance,
          annual: Math.max(0, employee.leaveBalance.annual - 1),
        },
      });
    }
    setShowLeaveForm(false);
    setLeaveReason('');
    tampilkanPesan('✓ Pengajuan cuti berhasil dikirim ke atasan');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start sm:p-4">
      {/* Container Tampilan HP */}
      <div className="w-full sm:max-w-md bg-white min-h-screen sm:min-h-[820px] sm:rounded-3xl shadow-lg border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header Sederhana */}
        <div className="bg-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow"
              />
              <div>
                <h1 className="text-sm font-bold leading-tight">{employee.name}</h1>
                <p className="text-xs text-blue-100">{employee.role}</p>
              </div>
            </div>
            <span className="text-[10px] bg-blue-700/80 px-2 py-1 rounded-md text-blue-100">
              {employee.department}
            </span>
          </div>
        </div>

        {/* Notifikasi Pesan Sukses */}
        {pesanSukses && (
          <div className="bg-emerald-500 text-white text-xs text-center py-2 px-4 font-medium transition-all">
            {pesanSukses}
          </div>
        )}

        {/* Area Isi Halaman */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB 1: BERANDA */}
          {activeTab === 'home' && (
            <div className="space-y-4">
              {/* Kotak Absensi Cepat */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl text-center space-y-3 shadow">
                <div className="text-xs text-slate-300">Jam Kerja Hari Ini (08:00 - 17:00)</div>
                <div className="text-3xl font-bold font-mono tracking-wider text-white">
                  {currentTime || '08:00:00 WIB'}
                </div>
                <div className="text-xs text-slate-300">
                  Status: <span className="font-semibold text-emerald-400">{isClockedIn ? 'Sudah Masuk Kerja' : 'Belum Absen Masuk'}</span>
                </div>

                {/* Tombol Absen Sederhana */}
                <button
                  onClick={handleClockInOut}
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow transition-all active:scale-95 ${
                    isClockedIn
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isClockedIn ? 'Absen Pulang (Clock Out)' : 'Absen Masuk (Clock In)'}
                </button>
              </div>

              {/* Ringkasan Angka Sederhana */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Total Hadir</span>
                  <span className="text-lg font-bold text-blue-600">21 Hari</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Sisa Cuti</span>
                  <span className="text-lg font-bold text-emerald-600">{employee.leaveBalance.annual} Hari</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Terlambat</span>
                  <span className="text-lg font-bold text-amber-600">1 Hari</span>
                </div>
              </div>

              {/* Menu Cepat */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                  Menu Utama
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3 text-left hover:bg-slate-50 shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Riwayat Absensi</div>
                      <div className="text-[10px] text-slate-400">Jam masuk & pulang</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('leave')}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3 text-left hover:bg-slate-50 shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Pengajuan Cuti</div>
                      <div className="text-[10px] text-slate-400">Ajukan libur & izin</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('payroll')}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3 text-left hover:bg-slate-50 shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Slip Gaji</div>
                      <div className="text-[10px] text-slate-400">Rincian gaji bulanan</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('team')}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3 text-left hover:bg-slate-50 shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Daftar Rekan</div>
                      <div className="text-[10px] text-slate-400">Kontak tim kantor</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Pengumuman Singkat */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-blue-900 block">Pengumuman Kantor</span>
                <p className="text-blue-800 text-[11px] leading-relaxed">
                  Rapat koordinasi bulanan akan diadakan pada hari Jumat pukul 09:00 WIB di ruang meeting lantai 2.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: RIWAYAT ABSENSI */}
          {activeTab === 'attendance' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-800">Riwayat Absensi Karyawan</h2>
                <button
                  onClick={handleClockInOut}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                >
                  {isClockedIn ? 'Absen Pulang' : 'Absen Masuk'}
                </button>
              </div>

              <div className="space-y-2">
                {attendanceList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{item.date}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Masuk: <span className="font-semibold text-slate-700">{item.clockIn}</span> • Pulang: <span className="font-semibold text-slate-700">{item.clockOut || '-'}</span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Hadir'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MANAJEMEN CUTI */}
          {activeTab === 'leave' && (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-600 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-100 block">Sisa Jatah Cuti Anda:</span>
                  <span className="text-2xl font-bold">{employee.leaveBalance.annual} Hari</span>
                </div>
                <button
                  onClick={() => setShowLeaveForm(!showLeaveForm)}
                  className="px-3 py-1.5 bg-white text-emerald-800 font-bold text-xs rounded-xl shadow-xs"
                >
                  {showLeaveForm ? 'Tutup Form' : '+ Ajukan Cuti'}
                </button>
              </div>

              {/* Form Tambah Cuti */}
              {showLeaveForm && (
                <form onSubmit={handleKirimCuti} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 text-xs shadow-sm">
                  <h3 className="font-bold text-slate-800">Form Pengajuan Cuti Baru</h3>
                  
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Jenis Cuti</label>
                    <select
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                    >
                      <option value="Cuti Tahunan">Cuti Tahunan</option>
                      <option value="Cuti Sakit">Cuti Sakit</option>
                      <option value="Izin Pribadi">Izin Pribadi</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">Mulai Tanggal</label>
                      <input
                        type="date"
                        required
                        value={leaveStartDate}
                        onChange={(e) => setLeaveStartDate(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">Sampai Tanggal</label>
                      <input
                        type="date"
                        value={leaveEndDate}
                        onChange={(e) => setLeaveEndDate(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Alasan / Keterangan</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Tuliskan alasan pengajuan cuti..."
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-xs"
                  >
                    Kirim Pengajuan
                  </button>
                </form>
              )}

              {/* Daftar Riwayat Cuti */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Riwayat Pengajuan</span>
                {leaveList.map((item) => (
                  <div key={item.id} className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">{item.type}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Disetujui'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Tanggal: {item.startDate} s/d {item.endDate}
                    </div>
                    <div className="text-slate-600 italic text-[11px]">"{item.reason}"</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SLIP GAJI */}
          {activeTab === 'payroll' && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-800">Slip Gaji ({INITIAL_PAYSLIP.month})</h2>

              {/* Kartu Total Gaji Bersih */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl text-center space-y-1">
                <span className="text-xs text-slate-400">Total Diterima (Gaji Bersih)</span>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {formatRp(INITIAL_PAYSLIP.total)}
                </div>
                <span className="text-[11px] text-slate-400">Ditransfer ke Rekening BCA</span>
              </div>

              {/* Rincian Sederhana */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs space-y-2.5">
                <div className="font-bold text-slate-800 pb-1 border-b border-slate-100">
                  Rincian Komponen Gaji
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Gaji Pokok</span>
                  <span className="font-semibold text-slate-800">{formatRp(INITIAL_PAYSLIP.basicSalary)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Tunjangan Transport & Makan</span>
                  <span className="font-semibold text-slate-800">+{formatRp(INITIAL_PAYSLIP.allowance)}</span>
                </div>

                <div className="flex justify-between text-rose-600">
                  <span>Potongan (BPJS & Pajak)</span>
                  <span className="font-semibold">-{formatRp(INITIAL_PAYSLIP.deduction)}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Gaji Bersih</span>
                  <span className="text-emerald-600">{formatRp(INITIAL_PAYSLIP.total)}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DAFTAR REKAN KERJA */}
          {activeTab === 'team' && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-800">Daftar Rekan Kerja Tim</h2>
              <div className="space-y-2">
                {TEAM_LIST.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{member.name}</div>
                      <div className="text-slate-500 text-[11px]">{member.role}</div>
                    </div>
                    <a
                      href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100"
                    >
                      WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Bilah Navigasi Bawah Sederhana (Bottom Navigation) */}
        <div className="bg-white border-t border-slate-200 px-2 py-1.5 grid grid-cols-5 text-center text-xs">
          <button
            onClick={() => setActiveTab('home')}
            className={`py-1 flex flex-col items-center gap-1 ${
              activeTab === 'home' ? 'text-blue-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Beranda</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-1 flex flex-col items-center gap-1 ${
              activeTab === 'attendance' ? 'text-blue-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px]">Absensi</span>
          </button>

          <button
            onClick={() => setActiveTab('leave')}
            className={`py-1 flex flex-col items-center gap-1 ${
              activeTab === 'leave' ? 'text-blue-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px]">Cuti</span>
          </button>

          <button
            onClick={() => setActiveTab('payroll')}
            className={`py-1 flex flex-col items-center gap-1 ${
              activeTab === 'payroll' ? 'text-blue-600 font-bold' : 'text-slate-500'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px]">Gaji</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`py-1 flex flex-col items-center gap-1 ${
              activeTab === 'team' ? 'text-blue-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px]">Tim</span>
          </button>
        </div>

      </div>
    </div>
  );
}
