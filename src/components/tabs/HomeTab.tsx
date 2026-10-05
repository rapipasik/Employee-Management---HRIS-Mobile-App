import React, { useState, useEffect } from 'react';
import { 
  Clock, MapPin, Calendar, FileText, CreditCard, Users, 
  Sparkles, ChevronRight, AlertCircle, CheckCircle2, 
  Bell, Building, Award, Coffee, ShieldCheck 
} from 'lucide-react';
import { Employee, AttendanceRecord, Announcement, AppNotification } from '../../types';

interface HomeTabProps {
  employee: Employee;
  latestAttendance: AttendanceRecord | undefined;
  isClockedIn: boolean;
  onOpenClockInModal: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenLeaveModal: () => void;
  onOpenIdBadge: () => void;
  onOpenReimbursement: () => void;
  onOpenDirectory: () => void;
  onOpenNotifications: () => void;
  announcements: Announcement[];
  notifications: AppNotification[];
}

export const HomeTab: React.FC<HomeTabProps> = ({
  employee,
  latestAttendance,
  isClockedIn,
  onOpenClockInModal,
  onNavigateTab,
  onOpenLeaveModal,
  onOpenIdBadge,
  onOpenReimbursement,
  onOpenDirectory,
  onOpenNotifications,
  announcements,
  notifications,
}) => {
  const [liveTime, setLiveTime] = useState('');
  const [liveDate, setLiveDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setLiveTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setLiveDate(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4 pb-4">
      {/* Top Profile Bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer" onClick={onOpenIdBadge}>
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm ring-1 ring-slate-200"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] text-white">
              ✓
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">
              Selamat Datang Kembali 👋
            </span>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">
              {employee.name.split(',')[0]}
            </h2>
            <p className="text-[11px] text-blue-600 font-medium">
              {employee.role}
            </p>
          </div>
        </div>

        {/* Notifications and ID Badge Quick Triggers */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenIdBadge}
            className="w-9 h-9 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
            title="Buka ID Badge Digital"
          >
            <CreditCard className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
            title="Notifikasi"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center border-2 border-white">
                {unreadNotifs}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Attendance Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-5 shadow-xl">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Shift row */}
        <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10 z-10 relative">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium">Shift Reguler (08:30 - 17:30)</span>
          </div>
          <span className="text-slate-400 text-[11px] font-mono">{liveDate}</span>
        </div>

        {/* Live Digital Clock & Status */}
        <div className="my-4 text-center z-10 relative">
          <div className="text-4xl font-bold font-mono-numbers tracking-tight text-white mb-1">
            {liveTime || '08:30:00'} <span className="text-xs text-blue-300 font-sans font-normal">WIB</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isClockedIn ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-slate-200">
              {isClockedIn
                ? `Clock-In: ${latestAttendance?.clockIn || '08:24'} WIB (Tepat Waktu)`
                : 'Belum Presensi Masuk Hari Ini'}
            </span>
          </div>
        </div>

        {/* GPS Radius Check Notice */}
        <div className="flex items-center justify-between text-[11px] bg-white/5 rounded-xl px-3 py-2 mb-4 border border-white/10 z-10 relative">
          <div className="flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Nexa Tower SCBD Lt. 18</span>
          </div>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Radius 14m (Valid)
          </span>
        </div>

        {/* Primary Clock-In / Clock-Out Button */}
        <button
          onClick={onOpenClockInModal}
          className={`w-full h-12 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
            isClockedIn
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-500/25 hover:from-amber-600 hover:to-orange-700'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          {isClockedIn ? 'Presensi Pulang (Clock Out)' : 'Presensi Masuk (Clock In)'}
        </button>
      </div>

      {/* Quick Action Grid (6 Interactive Tiles) */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Menu Utama HR
          </h3>
          <span className="text-[11px] text-slate-400">Layanan Karyawan</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* 1. Presensi */}
          <button
            onClick={() => onNavigateTab('attendance')}
            className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5 transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Presensi</span>
            <span className="text-[10px] text-slate-400">Riwayat GPS</span>
          </button>

          {/* 2. Ajukan Cuti */}
          <button
            onClick={onOpenLeaveModal}
            className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 group-hover:bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1.5 transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Ajukan Cuti</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Sisa {employee.leaveBalance.annual} Hari</span>
          </button>

          {/* 3. Slip Gaji */}
          <button
            onClick={() => onNavigateTab('payslip')}
            className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-300 hover:shadow-sm transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-50 group-hover:bg-purple-100 text-purple-600 flex items-center justify-center mb-1.5 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Slip Gaji</span>
            <span className="text-[10px] text-slate-400">Sep 2026</span>
          </button>

          {/* 4. Klaim Biaya */}
          <button
            onClick={onOpenReimbursement}
            className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-sm transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 group-hover:bg-amber-100 text-amber-600 flex items-center justify-center mb-1.5 transition-colors">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Klaim Biaya</span>
            <span className="text-[10px] text-slate-400">Reimburse</span>
          </button>

          {/* 5. ID Badge */}
          <button
            onClick={onOpenIdBadge}
            className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 text-indigo-600 flex items-center justify-center mb-1.5 transition-colors">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">ID Badge</span>
            <span className="text-[10px] text-slate-400">QR Gate</span>
          </button>

          {/* 6. Rekan Tim */}
          <button
            onClick={onOpenDirectory}
            className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-sm transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-2xl bg-sky-50 group-hover:bg-sky-100 text-sky-600 flex items-center justify-center mb-1.5 transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Direktori</span>
            <span className="text-[10px] text-slate-400">Kontak Tim</span>
          </button>
        </div>
      </div>

      {/* Monthly Attendance Mini Stat Ribbon */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="font-bold text-slate-800">Ringkasan Bulan Ini (Oktober)</span>
          <button
            onClick={() => onNavigateTab('attendance')}
            className="text-blue-600 hover:text-blue-700 font-semibold text-[11px] flex items-center gap-0.5"
          >
            Detail <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-500 block">Hadir</span>
            <span className="text-base font-bold text-emerald-600 font-mono-numbers">21</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-500 block">Terlambat</span>
            <span className="text-base font-bold text-amber-600 font-mono-numbers">1</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-500 block">Izin/Cuti</span>
            <span className="text-base font-bold text-blue-600 font-mono-numbers">1</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-500 block">Sisa Cuti</span>
            <span className="text-base font-bold text-purple-600 font-mono-numbers">
              {employee.leaveBalance.annual}
            </span>
          </div>
        </div>
      </div>

      {/* Announcements / Berita Perusahaan */}
      <div>
        <div className="flex items-center justify-between mb-2 px-0.5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Pengumuman Perusahaan
          </h3>
          <span className="text-[11px] text-slate-400">Update Terkini</span>
        </div>

        <div className="space-y-2">
          {announcements.slice(0, 2).map((ann) => (
            <div
              key={ann.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                ann.isImportant
                  ? 'bg-amber-50/70 border-amber-200'
                  : 'bg-white border-slate-200/80 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                <span className="font-semibold text-blue-600 uppercase tracking-wider">
                  {ann.category}
                </span>
                <span>{ann.date}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-snug">{ann.title}</h4>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {ann.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Member Out Today Widget */}
      <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Coffee className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900">Rekan Tim Cuti Hari Ini</h5>
            <p className="text-[11px] text-slate-500">2 orang sedang beristirahat</p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('leave')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          Lihat Kalender
        </button>
      </div>
    </div>
  );
};
