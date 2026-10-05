import React, { useState } from 'react';
import { 
  Clock, Calendar, MapPin, CheckCircle2, AlertTriangle, 
  ChevronRight, Filter, Download, ArrowUpRight, Camera 
} from 'lucide-react';
import { AttendanceRecord, Employee } from '../../types';
import { getStatusBadgeColor } from '../../utils/formatters';

interface AttendanceTabProps {
  attendanceLogs: AttendanceRecord[];
  isClockedIn: boolean;
  onOpenClockInModal: () => void;
  employee: Employee;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({
  attendanceLogs,
  isClockedIn,
  onOpenClockInModal,
  employee,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AttendanceRecord | null>(null);

  // Correction form states
  const [correctionDate, setCorrectionDate] = useState('2026-10-01');
  const [correctionClockIn, setCorrectionClockIn] = useState('08:30');
  const [correctionClockOut, setCorrectionClockOut] = useState('17:30');
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctionSuccess, setCorrectionSuccess] = useState(false);

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCorrectionSuccess(true);
    setTimeout(() => {
      setCorrectionSuccess(false);
      setShowCorrectionModal(false);
    }, 1800);
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-base font-bold text-slate-900">Rekap Presensi & Jam Kerja</h2>
          <p className="text-xs text-slate-500">Log kehadiran terverifikasi biometric GPS</p>
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="2026-10">Oktober 2026</option>
          <option value="2026-09">September 2026</option>
          <option value="2026-08">Agustus 2026</option>
        </select>
      </div>

      {/* Attendance Metric Highlights */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-4 shadow-lg">
        <div className="flex items-center justify-between text-xs text-blue-200 pb-3 border-b border-white/10">
          <span>Tingkat Kehadiran Bulan Ini</span>
          <span className="font-bold text-white font-mono">98.2% (Sangat Baik)</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-3">
          <div>
            <span className="text-[10px] text-blue-300 block">Total Hadir</span>
            <span className="text-lg font-bold text-white font-mono-numbers">21 Hari</span>
          </div>
          <div>
            <span className="text-[10px] text-blue-300 block">Terlambat</span>
            <span className="text-lg font-bold text-amber-300 font-mono-numbers">1 Hari</span>
          </div>
          <div>
            <span className="text-[10px] text-blue-300 block">Rata-rata Durasi</span>
            <span className="text-lg font-bold text-emerald-300 font-mono-numbers">9j 12m</span>
          </div>
        </div>
      </div>

      {/* Live Check-In Action Banner */}
      <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isClockedIn ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              {isClockedIn ? 'Sedang Bekerja (Aktif)' : 'Belum Melakukan Clock-In'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {isClockedIn ? 'Shift Pagi • 08:30 - 17:30' : 'Segera lakukan absensi di kantor'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenClockInModal}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-all ${
            isClockedIn
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isClockedIn ? 'Clock Out' : 'Clock In'}
        </button>
      </div>

      {/* Regularization Action Bar */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className="font-bold text-slate-800 uppercase tracking-wider">
          Log Riwayat Harian
        </span>
        <button
          onClick={() => setShowCorrectionModal(true)}
          className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
        >
          Ajukan Koreksi Presensi
        </button>
      </div>

      {/* Daily Attendance History List */}
      <div className="space-y-2.5">
        {attendanceLogs.map((record) => {
          const badge = getStatusBadgeColor(record.status);
          return (
            <div
              key={record.id}
              onClick={() => setSelectedLog(record)}
              className="p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-slate-300 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{record.dayName}</span>
                  <span className="text-[11px] text-slate-400 font-mono">{record.date}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}
                >
                  {record.status}
                </span>
              </div>

              {/* In / Out Timestamps */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">Masuk</span>
                  <span className="text-xs font-bold text-slate-800 font-mono-numbers">
                    {record.clockIn ? `${record.clockIn} WIB` : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Pulang</span>
                  <span className="text-xs font-bold text-slate-800 font-mono-numbers">
                    {record.clockOut ? `${record.clockOut} WIB` : record.clockIn ? 'Aktif' : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Durasi</span>
                  <span className="text-xs font-bold text-blue-600 font-mono-numbers">
                    {record.workHours || '-'}
                  </span>
                </div>
              </div>

              {/* Location info */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span className="flex items-center gap-1 truncate max-w-[240px]">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  {record.locationName}
                </span>
                <span className="text-blue-600 font-medium shrink-0">Lihat Detail</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">
                Detail Presensi {selectedLog.dayName}, {selectedLog.date}
              </h4>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                Tutup
              </button>
            </div>

            {/* Selfie snapshot if present */}
            {selectedLog.selfieUrl && (
              <div className="text-center">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Foto Biometrik Saat Clock-In:
                </span>
                <div className="w-32 h-32 rounded-2xl overflow-hidden mx-auto border-2 border-emerald-500 shadow-md">
                  <img
                    src={selectedLog.selfieUrl}
                    alt="Biometric Selfie"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Jam Masuk:</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedLog.clockIn ? `${selectedLog.clockIn} WIB` : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jam Pulang:</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedLog.clockOut ? `${selectedLog.clockOut} WIB` : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status Kehadiran:</span>
                <span className="font-bold text-slate-900">{selectedLog.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Titik Geofence:</span>
                <span className="font-medium text-slate-900">{selectedLog.locationName}</span>
              </div>
              {selectedLog.notes && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block mb-0.5">Catatan Presensi:</span>
                  <span className="italic text-slate-700">{selectedLog.notes}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="w-full h-10 bg-slate-900 text-white rounded-xl font-bold text-xs"
            >
              Kembali
            </button>
          </div>
        </div>
      )}

      {/* Koreksi Presensi Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Ajukan Koreksi Presensi</h4>
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                Tutup
              </button>
            </div>

            {correctionSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h5 className="text-sm font-bold text-slate-900">Pengajuan Koreksi Terkirim!</h5>
                <p className="text-xs text-slate-500">
                  Menunggu persetujuan atasan langsung ({employee.managerName}).
                </p>
              </div>
            ) : (
              <form onSubmit={handleCorrectionSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Yang Dikoreksi
                  </label>
                  <input
                    type="date"
                    required
                    value={correctionDate}
                    onChange={(e) => setCorrectionDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Jam Masuk Sebenarnya
                    </label>
                    <input
                      type="time"
                      required
                      value={correctionClockIn}
                      onChange={(e) => setCorrectionClockIn(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Jam Pulang Sebenarnya
                    </label>
                    <input
                      type="time"
                      required
                      value={correctionClockOut}
                      onChange={(e) => setCorrectionClockOut(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Alasan Koreksi (Lupa tap, kendala sinyal, dsb.)
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Contoh: Lupa melakukan clock-out karena meeting mendadak dengan klien di luar..."
                    value={correctionReason}
                    onChange={(e) => setCorrectionReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  Kirim Pengajuan Koreksi
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
