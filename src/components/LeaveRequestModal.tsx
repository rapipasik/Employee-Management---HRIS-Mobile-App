import React, { useState } from 'react';
import { X, Calendar, FileText, UploadCloud, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { LeaveRequest, LeaveType, Employee } from '../types';

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onSubmit: (newRequest: LeaveRequest) => void;
}

export const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({
  isOpen,
  onClose,
  employee,
  onSubmit,
}) => {
  const [leaveType, setLeaveType] = useState<LeaveType>('Cuti Tahunan');
  const [startDate, setStartDate] = useState('2026-10-12');
  const [endDate, setEndDate] = useState('2026-10-14');
  const [reason, setReason] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate days between
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const diffDays = isNaN(diffTime) ? 1 : Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Mohon isi alasan pengajuan cuti.');
      return;
    }

    const formatIndoDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const newReq: LeaveRequest = {
      id: `LV-${Date.now().toString().slice(-4)}`,
      employeeId: employee.id,
      employeeName: employee.name,
      employeeAvatar: employee.avatar,
      department: employee.department,
      leaveType,
      startDate: formatIndoDate(startDate),
      endDate: formatIndoDate(endDate),
      totalDays: diffDays,
      reason,
      status: 'Pending',
      appliedAt: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB',
      approvedBy: `Menunggu review ${employee.managerName}`,
      attachmentName: attachment || (leaveType === 'Cuti Sakit' ? 'Surat_Dokter_Klinik.pdf' : undefined),
    };

    onSubmit(newReq);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">Form Pengajuan Cuti / Izin</h3>
            <p className="text-xs text-slate-500">Sisa Kuota Cuti Tahunan: {employee.leaveBalance.annual} Hari</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto no-scrollbar space-y-4 flex-1">
          {/* Leave Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jenis Cuti / Permohonan Izin
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  'Cuti Tahunan',
                  'Cuti Sakit',
                  'Cuti Menikah',
                  'WFA (Work From Anywhere)',
                ] as LeaveType[]
              ).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLeaveType(type)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                    leaveType === type
                      ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-semibold ring-1 ring-blue-500'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{type}</span>
                    {leaveType === type && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker Grid */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tanggal Mulai
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tanggal Selesai
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Total Durasi Pengajuan:</span>
              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-mono">
                {diffDays} Hari Kerja
              </span>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alasan Pengajuan Cuti
            </label>
            <textarea
              required
              rows={3}
              placeholder="Berikan alasan yang jelas untuk review manajer divisi..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Attachment (Especially for Sick Leave) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lampiran Pendukung {leaveType === 'Cuti Sakit' && <span className="text-rose-500">*Wajib Surat Dokter</span>}
            </label>
            <div
              onClick={() => setAttachment('Surat_Keterangan_Dokter_Klinik.pdf')}
              className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-3.5 text-center cursor-pointer bg-slate-50 transition-colors"
            >
              <UploadCloud className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-slate-700">
                {attachment ? `File: ${attachment}` : 'Unggah Surat Dokter / Bukti Undangan'}
              </p>
              <p className="text-[10px] text-slate-400">PDF, JPG, PNG (Maks 10MB)</p>
            </div>
          </div>

          {/* Approval Routing notice */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-2 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Jalur Persetujuan:</p>
              <p className="text-[11px] text-amber-800">
                Pengajuan akan langsung diteruskan ke <strong>{employee.managerName}</strong> dan tembusan ke Divisi HR.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
          >
            Kirim Pengajuan Cuti
          </button>
        </form>
      </motion.div>
    </div>
  );
};
