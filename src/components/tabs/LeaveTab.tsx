import React, { useState } from 'react';
import { 
  Calendar, Plus, Clock, CheckCircle2, XCircle, AlertCircle, 
  ChevronRight, Users, Shield, FileText 
} from 'lucide-react';
import { LeaveRequest, Employee } from '../../types';
import { getStatusBadgeColor } from '../../utils/formatters';

interface LeaveTabProps {
  leaveRequests: LeaveRequest[];
  employee: Employee;
  onOpenLeaveModal: () => void;
  isManagerMode: boolean;
  onApproveLeave: (id: string) => void;
  onRejectLeave: (id: string) => void;
}

export const LeaveTab: React.FC<LeaveTabProps> = ({
  leaveRequests,
  employee,
  onOpenLeaveModal,
  isManagerMode,
  onApproveLeave,
  onRejectLeave,
}) => {
  const [activeFilter, setActiveFilter] = useState<'Semua' | 'Pending' | 'Disetujui' | 'Ditolak'>('Semua');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const filteredRequests = leaveRequests.filter((req) => {
    if (activeFilter === 'Semua') return true;
    return req.status === activeFilter;
  });

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-base font-bold text-slate-900">Manajemen Cuti & Izin</h2>
          <p className="text-xs text-slate-500">Saldo jatah cuti & persetujuan izin kerja</p>
        </div>
        <button
          onClick={onOpenLeaveModal}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Ajukan Cuti
        </button>
      </div>

      {/* Leave Balance Overview Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-blue-100 mb-1">
            <span>Cuti Tahunan</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
              Total {employee.leaveBalance.annualTotal}
            </span>
          </div>
          <div className="text-2xl font-bold font-mono-numbers">
            {employee.leaveBalance.annual} <span className="text-xs font-normal text-blue-200">Hari Tersisa</span>
          </div>
          <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-white h-full rounded-full"
              style={{
                width: `${(employee.leaveBalance.annual / employee.leaveBalance.annualTotal) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="p-3.5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-emerald-100 mb-1">
            <span>Cuti Sakit</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
              Plafon Medis
            </span>
          </div>
          <div className="text-2xl font-bold font-mono-numbers">
            {employee.leaveBalance.sick} <span className="text-xs font-normal text-emerald-200">Hari Kuota</span>
          </div>
          <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-white h-full rounded-full" style={{ width: '85%' }} />
          </div>
        </div>
      </div>

      {/* Additional allowances: WFA & Izin Khusus */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
          <span className="text-slate-600">Jatah WFA (Remote):</span>
          <span className="font-bold text-slate-900 font-mono">{employee.leaveBalance.wfa} Hari / Bulan</span>
        </div>
        <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
          <span className="text-slate-600">Izin Khusus / Nikah:</span>
          <span className="font-bold text-slate-900 font-mono">{employee.leaveBalance.special} Hari</span>
        </div>
      </div>

      {/* Manager Mode Alert Banner */}
      {isManagerMode && (
        <div className="p-3 bg-amber-500/10 border border-amber-300 rounded-2xl flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold block">Mode Manajer / Reviewer Aktif</span>
              <span className="text-[11px] text-amber-800">
                Anda dapat langsung menyetujui atau menolak pengajuan cuti tim.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
        {(['Semua', 'Pending', 'Disetujui', 'Ditolak'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeFilter === tab
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Leave Requests Feed */}
      <div className="space-y-2.5">
        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
            Tidak ada pengajuan cuti dalam kategori {activeFilter}.
          </div>
        ) : (
          filteredRequests.map((req) => {
            const badge = getStatusBadgeColor(req.status);
            return (
              <div
                key={req.id}
                className="p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2.5 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={req.employeeAvatar}
                      alt={req.employeeName}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {req.employeeName}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="text-blue-600 font-semibold">{req.leaveType}</span>
                        <span>•</span>
                        <span>{req.totalDays} Hari Kerja</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}
                  >
                    {req.status}
                  </span>
                </div>

                {/* Date range row */}
                <div className="bg-slate-50 p-2.5 rounded-xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {req.startDate} — {req.endDate}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{req.appliedAt}</span>
                </div>

                {/* Reason */}
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{req.reason}"
                </p>

                {/* Attachment label if exists */}
                {req.attachmentName && (
                  <div className="text-[11px] text-blue-600 flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Lampiran: {req.attachmentName}</span>
                  </div>
                )}

                {/* Manager Actions (if in manager mode & pending) */}
                {isManagerMode && req.status === 'Pending' && (
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => onApproveLeave(req.id)}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Setujui
                    </button>
                    <button
                      onClick={() => onRejectLeave(req.id)}
                      className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center justify-center gap-1 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Tolak
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
