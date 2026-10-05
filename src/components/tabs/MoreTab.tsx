import React, { useState } from 'react';
import { 
  User, CreditCard, Users, Receipt, Calendar, Shield, 
  HelpCircle, ChevronRight, LogOut, CheckCircle, 
  Building, Phone, Mail, Award, Lock, ExternalLink 
} from 'lucide-react';
import { Employee } from '../../types';

interface MoreTabProps {
  employee: Employee;
  onOpenIdBadge: () => void;
  onOpenDirectory: () => void;
  onOpenReimbursement: () => void;
  isManagerMode: boolean;
  onToggleManagerMode: () => void;
}

export const MoreTab: React.FC<MoreTabProps> = ({
  employee,
  onOpenIdBadge,
  onOpenDirectory,
  onOpenReimbursement,
  isManagerMode,
  onToggleManagerMode,
}) => {
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  return (
    <div className="space-y-4 pb-6">
      {/* Employee Profile Card */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={employee.avatar}
            alt={employee.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate">{employee.name}</h3>
            <p className="text-xs text-blue-600 font-semibold">{employee.role}</p>
            <p className="text-[11px] text-slate-500 truncate">{employee.department}</p>
          </div>
        </div>

        {/* Contract & Employment stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs bg-slate-50 p-2.5 rounded-2xl">
          <div>
            <span className="text-slate-400 text-[10px] block">No. Karyawan:</span>
            <span className="font-mono font-bold text-slate-800">{employee.employeeId}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Status Kerja:</span>
            <span className="font-bold text-emerald-600">Karyawan {employee.status}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Tgl Bergabung:</span>
            <span className="font-medium text-slate-800">{employee.joinDate}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Status Pajak:</span>
            <span className="font-medium text-slate-800">{employee.ptkp}</span>
          </div>
        </div>
      </div>

      {/* Feature Menu Group 1: HR Self Service */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
          Layanan Karyawan Mandiri
        </span>

        <div className="bg-white border border-slate-200/80 rounded-2xl divide-y divide-slate-100 shadow-xs overflow-hidden">
          {/* ID Badge */}
          <button
            onClick={onOpenIdBadge}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">ID Badge Digital Karyawan</span>
                <span className="text-[10px] text-slate-500">QR Code akses pintu turnstile & NFC</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Directory */}
          <button
            onClick={onOpenDirectory}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Direktori Kontak Karyawan</span>
                <span className="text-[10px] text-slate-500">Daftar rekan kerja, email & WhatsApp</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Reimbursement */}
          <button
            onClick={onOpenReimbursement}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Klaim Biaya & Reimbursement</span>
                <span className="text-[10px] text-slate-500">Penggantian biaya transport, medis & internet</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Shift Schedule */}
          <button
            onClick={() => setShowRosterModal(true)}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Jadwal Shift & Kalender Kerja</span>
                <span className="text-[10px] text-slate-500">Shift reguler Senin - Jumat (08:30 - 17:30)</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Feature Menu Group 2: Role Switcher & Security */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
          Akses & Pengaturan Sistem
        </span>

        <div className="bg-white border border-slate-200/80 rounded-2xl divide-y divide-slate-100 shadow-xs overflow-hidden">
          {/* Manager Mode Switch */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Mode Reviewer / Manajer HR</span>
                <span className="text-[10px] text-slate-500">Simulasikan persetujuan cuti tim</span>
              </div>
            </div>
            <button
              onClick={onToggleManagerMode}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                isManagerMode ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  isManagerMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Help & HR Center */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Pusat Bantuan & HR Hotline</span>
                <span className="text-[10px] text-slate-500">FAQ, kebijakan kantor & kontak HR</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Version badge */}
      <div className="text-center pt-2 text-slate-400 text-[11px]">
        PT Nexa Tech Nusantara • HRIS Mobile v2.4.0
      </div>

      {/* Roster Modal */}
      {showRosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Jadwal Shift Kerja Karyawan</h4>
              <button
                onClick={() => setShowRosterModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                Tutup
              </button>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl">
                <span className="font-bold block">Pola Kerja: 5 Hari Kerja (WFO & WFA Hybrid)</span>
                <span className="text-[11px]">Senin s/d Jumat • 08:30 - 17:30 WIB</span>
              </div>
              <div className="divide-y divide-slate-100 bg-slate-50 rounded-xl p-3">
                <div className="py-1.5 flex justify-between">
                  <span className="font-semibold text-slate-700">Senin - Kamis</span>
                  <span className="text-slate-900">08:30 - 17:30 (Istirahat 12:00 - 13:00)</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="font-semibold text-slate-700">Jumat</span>
                  <span className="text-slate-900">08:30 - 17:30 (Istirahat 11:30 - 13:00)</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="font-semibold text-slate-700">Sabtu - Minggu</span>
                  <span className="text-rose-600 font-semibold">Libur Akhir Pekan</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowRosterModal(false)}
              className="w-full h-10 bg-slate-900 text-white rounded-xl font-bold"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Pusat Layanan HR Helpdesk</h4>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                Tutup
              </button>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Jika mengalami kendala presensi GPS, payroll, atau permohonan asuransi, silakan hubungi tim People & Culture:
            </p>
            <div className="p-3 bg-slate-50 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-slate-800">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>people@nexatech.co.id</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>+62 21 520 8899 (Ext. 182)</span>
              </div>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full h-10 bg-slate-900 text-white rounded-xl font-bold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
