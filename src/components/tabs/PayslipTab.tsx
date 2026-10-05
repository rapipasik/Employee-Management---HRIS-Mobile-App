import React, { useState } from 'react';
import { 
  FileText, Eye, EyeOff, Download, ArrowUpRight, ShieldCheck, 
  CreditCard, ChevronRight, CheckCircle2, Building 
} from 'lucide-react';
import { Payslip, Employee } from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface PayslipTabProps {
  payslips: Payslip[];
  employee: Employee;
  onOpenPayslipDetail: (slip: Payslip) => void;
}

export const PayslipTab: React.FC<PayslipTabProps> = ({
  payslips,
  employee,
  onOpenPayslipDetail,
}) => {
  const [selectedPayslipIndex, setSelectedPayslipIndex] = useState(0);
  const [isAmountVisible, setIsAmountVisible] = useState(false);

  const currentPayslip = payslips[selectedPayslipIndex] || payslips[0];

  const maskAmount = (amount: number) => {
    if (isAmountVisible) return formatRupiah(amount);
    return 'Rp ••••••••';
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-base font-bold text-slate-900">Slip Gaji & Kompensasi</h2>
          <p className="text-xs text-slate-500">Rincian pendapatan & potongan resmi PT Nexa Tech</p>
        </div>
        <button
          onClick={() => setIsAmountVisible(!isAmountVisible)}
          className="w-9 h-9 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
          title={isAmountVisible ? 'Sembunyikan Nominal' : 'Tampilkan Nominal'}
        >
          {isAmountVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Month Selector Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {payslips.map((slip, idx) => (
          <button
            key={slip.id}
            onClick={() => setSelectedPayslipIndex(idx)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedPayslipIndex === idx
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {slip.periodMonth}
          </button>
        ))}
      </div>

      {/* Take Home Pay Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-5 shadow-xl">
        <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
          <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
            Gaji Bersih (Take Home Pay)
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
            ● Ditransfer BCA
          </span>
        </div>

        <div className="my-4">
          <div className="text-3xl font-bold font-mono-numbers tracking-tight text-white mb-1">
            {maskAmount(currentPayslip.takeHomePay)}
          </div>
          <div className="text-xs text-slate-400">
            Periode Penggajian: <strong className="text-slate-200">{currentPayslip.periodMonth}</strong>
          </div>
        </div>

        {/* Quick Earnings vs Deduction Summary */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Total Pendapatan</span>
            <span className="font-bold font-mono-numbers text-emerald-400">
              +{maskAmount(currentPayslip.totalEarnings)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Total Potongan (BPJS/Pajak)</span>
            <span className="font-bold font-mono-numbers text-rose-400">
              -{maskAmount(currentPayslip.totalDeductions)}
            </span>
          </div>
        </div>

        {/* View Document Button */}
        <button
          onClick={() => onOpenPayslipDetail(currentPayslip)}
          className="w-full mt-4 h-11 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors"
        >
          <FileText className="w-4 h-4 text-blue-600" />
          Lihat & Unduh Slip Gaji Resmi (PDF)
        </button>
      </div>

      {/* Detailed Breakdown Accordion List */}
      <div className="space-y-3">
        {/* 1. Pendapatan Section */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="bg-emerald-50/70 px-4 py-2.5 flex items-center justify-between border-b border-emerald-100">
            <span className="text-xs font-bold text-emerald-900">Rincian Pendapatan</span>
            <span className="text-xs font-bold font-mono-numbers text-emerald-700">
              +{maskAmount(currentPayslip.totalEarnings)}
            </span>
          </div>
          <div className="divide-y divide-slate-100 text-xs px-4">
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-600">Gaji Pokok</span>
              <span className="font-mono-numbers font-semibold text-slate-800">
                {maskAmount(currentPayslip.earnings.basicSalary)}
              </span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-600">Tunjangan Jabatan</span>
              <span className="font-mono-numbers font-semibold text-slate-800">
                {maskAmount(currentPayslip.earnings.positionAllowance)}
              </span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-600">Tunjangan Transport & Makan</span>
              <span className="font-mono-numbers font-semibold text-slate-800">
                {maskAmount(currentPayslip.earnings.transportMealAllowance)}
              </span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-600">Tunjangan Komunikasi</span>
              <span className="font-mono-numbers font-semibold text-slate-800">
                {maskAmount(currentPayslip.earnings.communicationAllowance)}
              </span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-600">Bonus Kinerja</span>
              <span className="font-mono-numbers font-semibold text-slate-800">
                {maskAmount(currentPayslip.earnings.performanceBonus)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Potongan Section */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="bg-rose-50/70 px-4 py-2.5 flex items-center justify-between border-b border-rose-100">
            <span className="text-xs font-bold text-rose-900">Rincian Potongan Wajib</span>
            <span className="text-xs font-bold font-mono-numbers text-rose-700">
              -{maskAmount(currentPayslip.totalDeductions)}
            </span>
          </div>
          <div className="divide-y divide-slate-100 text-xs px-4">
            <div className="py-2.5 flex justify-between">
              <div>
                <span className="text-slate-600 block">BPJS Ketenagakerjaan</span>
                <span className="text-[10px] text-slate-400">JHT & Jaminan Pensiun (JP)</span>
              </div>
              <span className="font-mono-numbers font-semibold text-rose-600">
                -{maskAmount(currentPayslip.deductions.bpjsKetenagakerjaan)}
              </span>
            </div>
            <div className="py-2.5 flex justify-between">
              <div>
                <span className="text-slate-600 block">BPJS Kesehatan</span>
                <span className="text-[10px] text-slate-400">1% Iuran Wajib Pekerja</span>
              </div>
              <span className="font-mono-numbers font-semibold text-rose-600">
                -{maskAmount(currentPayslip.deductions.bpjsKesehatan)}
              </span>
            </div>
            <div className="py-2.5 flex justify-between">
              <div>
                <span className="text-slate-600 block">Pajak PPh 21</span>
                <span className="text-[10px] text-slate-400">Tarif Efektif Rata-rata (TER)</span>
              </div>
              <span className="font-mono-numbers font-semibold text-rose-600">
                -{maskAmount(currentPayslip.deductions.pph21)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Account Verification Notice */}
      <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3 text-xs">
        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <CreditCard className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-slate-900 block">
            {employee.bankAccount.bankName} • {employee.bankAccount.accountNumber}
          </span>
          <span className="text-[11px] text-slate-500">
            Atas Nama: {employee.bankAccount.accountHolder}
          </span>
        </div>
      </div>
    </div>
  );
};
