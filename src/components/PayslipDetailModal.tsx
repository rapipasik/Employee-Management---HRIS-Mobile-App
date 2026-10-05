import React, { useState } from 'react';
import { X, Download, Printer, ShieldCheck, CheckCircle2, Building, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { Payslip, Employee } from '../types';
import { formatRupiah } from '../utils/formatters';

interface PayslipDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payslip: Payslip;
  employee: Employee;
}

export const PayslipDetailModal: React.FC<PayslipDetailModalProps> = ({
  isOpen,
  onClose,
  payslip,
  employee,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
      >
        {/* Top Action Bar */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
              NX
            </div>
            <span className="text-xs font-bold text-slate-800">Dokumen Slip Gaji Digital Resmi</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable/Viewable Payslip Sheet */}
        <div className="p-5 overflow-y-auto no-scrollbar flex-1 space-y-4 text-slate-800 bg-white">
          {/* Header PT */}
          <div className="border-b border-slate-200 pb-3 text-center">
            <h3 className="font-bold text-base text-slate-900 tracking-tight">PT NEXA TECH NUSANTARA SEJAHTERA</h3>
            <p className="text-[10px] text-slate-500">
              Nexa Tower Lt. 18, Jl. Jend. Sudirman Kav. 52-53, SCBD Jakarta Selatan 12190
            </p>
            <p className="text-[10px] text-slate-500 font-mono">NPWP: 01.345.678.9-012.000</p>
            <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider">
              SLIP GAJI • {payslip.periodMonth}
            </div>
          </div>

          {/* Employee Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div>
              <span className="text-slate-400 text-[10px] block">Nama Karyawan:</span>
              <span className="font-bold text-slate-900">{employee.name}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">No. Induk Karyawan:</span>
              <span className="font-mono font-semibold text-slate-900">{employee.employeeId}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Jabatan / Posisi:</span>
              <span className="font-semibold text-slate-800">{employee.role}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Divisi:</span>
              <span className="font-semibold text-slate-800">{employee.department}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Status Pajak PTKP:</span>
              <span className="font-semibold text-slate-800">{employee.ptkp}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Rekening Pembayaran:</span>
              <span className="font-semibold text-slate-800">{employee.bankAccount.bankName}</span>
            </div>
          </div>

          {/* Table Breakdown: Pendapatan vs Potongan */}
          <div className="space-y-3">
            {/* 1. Pendapatan (Earnings) */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-100/80 px-3.5 py-1.5 text-xs font-bold text-slate-700 flex justify-between">
                <span>A. PENDAPATAN (EARNINGS)</span>
                <span>JUMLAH</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs px-3.5">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-600">Gaji Pokok (Basic Salary)</span>
                  <span className="font-mono-numbers font-medium text-slate-900">
                    {formatRupiah(payslip.earnings.basicSalary)}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-600">Tunjangan Jabatan</span>
                  <span className="font-mono-numbers font-medium text-slate-900">
                    {formatRupiah(payslip.earnings.positionAllowance)}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-600">Tunjangan Transport & Makan</span>
                  <span className="font-mono-numbers font-medium text-slate-900">
                    {formatRupiah(payslip.earnings.transportMealAllowance)}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-600">Tunjangan Komunikasi & Pulsa</span>
                  <span className="font-mono-numbers font-medium text-slate-900">
                    {formatRupiah(payslip.earnings.communicationAllowance)}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-600">Bonus Kinerja & Proyek</span>
                  <span className="font-mono-numbers font-medium text-slate-900">
                    {formatRupiah(payslip.earnings.performanceBonus)}
                  </span>
                </div>
              </div>
              <div className="bg-blue-50/60 px-3.5 py-2 text-xs font-bold text-blue-900 flex justify-between border-t border-slate-200">
                <span>Total Pendapatan Kotor</span>
                <span className="font-mono-numbers">{formatRupiah(payslip.totalEarnings)}</span>
              </div>
            </div>

            {/* 2. Potongan (Deductions) */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-100/80 px-3.5 py-1.5 text-xs font-bold text-slate-700 flex justify-between">
                <span>B. POTONGAN (DEDUCTIONS)</span>
                <span>JUMLAH</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs px-3.5">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-600">BPJS Ketenagakerjaan (JHT & JP)</span>
                  <span className="font-mono-numbers font-medium text-rose-600">
                    -{formatRupiah(payslip.deductions.bpjsKetenagakerjaan)}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-600">BPJS Kesehatan (1% Karyawan)</span>
                  <span className="font-mono-numbers font-medium text-rose-600">
                    -{formatRupiah(payslip.deductions.bpjsKesehatan)}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-600">Pajak PPh Pasal 21</span>
                  <span className="font-mono-numbers font-medium text-rose-600">
                    -{formatRupiah(payslip.deductions.pph21)}
                  </span>
                </div>
              </div>
              <div className="bg-rose-50/60 px-3.5 py-2 text-xs font-bold text-rose-900 flex justify-between border-t border-slate-200">
                <span>Total Potongan</span>
                <span className="font-mono-numbers">-{formatRupiah(payslip.totalDeductions)}</span>
              </div>
            </div>

            {/* 3. Take Home Pay (Gaji Bersih) */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-100 font-medium block">
                  Penerimaan Bersih (Take Home Pay)
                </span>
                <span className="text-[11px] text-emerald-200">Ditransfer tanggal {payslip.payDate}</span>
              </div>
              <span className="text-lg font-bold font-mono-numbers tracking-tight">
                {formatRupiah(payslip.takeHomePay)}
              </span>
            </div>
          </div>

          {/* Official Verification Seal */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Dokumen Digital Resmi Terverifikasi HRIS</span>
            </div>
            <span className="font-mono text-[10px]">AUTH-NX-{payslip.id}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-2.5">
          <button
            onClick={handleDownload}
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                Slip Gaji Tersimpan (PDF)!
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Unduh PDF Slip Gaji
              </>
            )}
          </button>
          <button
            onClick={() => window.print()}
            className="w-11 h-11 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors shadow-xs"
            title="Cetak Slip Gaji"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
