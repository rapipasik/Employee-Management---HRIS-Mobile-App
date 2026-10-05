import React, { useState } from 'react';
import { X, QrCode, Shield, RotateCw, Wifi, Check, Sparkles, Building2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Employee } from '../types';

interface DigitalIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
}

export const DigitalIdModal: React.FC<DigitalIdModalProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyId = () => {
    navigator.clipboard?.writeText(employee.employeeId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-sm flex flex-col items-center"
      >
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between text-white mb-3 px-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold tracking-wide uppercase">ID Badge Digital Karyawan</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lanyard Strap Attachment visual */}
        <div className="w-16 h-4 bg-slate-800 rounded-t-lg border-t border-x border-slate-700 flex items-center justify-center">
          <div className="w-8 h-1.5 bg-slate-500 rounded-full" />
        </div>
        <div className="w-6 h-3 bg-gradient-to-b from-amber-400 to-amber-600 rounded-sm mb-1 shadow-sm" />

        {/* The Badge Card with 3D Flip */}
        <div
          className="relative w-full aspect-[1/1.55] cursor-pointer group"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <motion.div
            className="w-full h-full relative [transform-style:preserve-3d] transition-all duration-500"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
          >
            {/* FRONT OF BADGE */}
            <div className="absolute inset-0 [backface-visibility:hidden] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 p-5 flex flex-col justify-between text-white">
              {/* Card Hologram shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

              {/* Company Header */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md font-black text-sm text-white tracking-wider">
                    NX
                  </div>
                  <div>
                    <h4 className="font-bold text-xs tracking-wider text-white">PT NEXA TECH</h4>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">Nusantara Sejahtera</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Wifi className="w-4 h-4 rotate-90 text-blue-400" />
                  <span className="text-[10px] font-mono font-medium">NFC</span>
                </div>
              </div>

              {/* Photo & Identity Section */}
              <div className="flex flex-col items-center text-center my-auto z-10">
                <div className="relative mb-3">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl p-0.5 bg-white/10">
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                <h3 className="font-bold text-base text-white leading-tight">
                  {employee.name}
                </h3>
                <p className="text-xs text-blue-300 font-medium mt-0.5">
                  {employee.role}
                </p>
                <div className="text-[11px] text-slate-400 mt-1">
                  {employee.department}
                </div>

                {/* Badge Number */}
                <div className="mt-3 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono font-semibold tracking-wider text-slate-300 flex items-center gap-2">
                  <span>{employee.employeeId}</span>
                  <span className="text-[10px] text-emerald-400 uppercase font-sans font-bold">● AKTIF</span>
                </div>
              </div>

              {/* Card Footer Barcode & Tap Flip hint */}
              <div className="border-t border-slate-700/60 pt-3 flex items-center justify-between z-10 text-[10px] text-slate-400">
                <div>
                  <div className="text-slate-400 text-[9px] uppercase">Status Karyawan</div>
                  <div className="font-semibold text-slate-200">Karyawan {employee.status}</div>
                </div>
                <div className="flex items-center gap-1 text-blue-400 font-medium">
                  <RotateCw className="w-3 h-3" />
                  <span>Ketuk untuk QR & Barcode</span>
                </div>
              </div>
            </div>

            {/* BACK OF BADGE */}
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-200 p-5 flex flex-col justify-between text-slate-800">
              {/* Back Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Akses Masuk Gedung</span>
                <span className="text-[10px] text-slate-500 font-mono">SCBD Tower A Gate</span>
              </div>

              {/* QR Code turnstile scan */}
              <div className="flex flex-col items-center justify-center my-auto py-2">
                <div className="relative p-3 bg-slate-50 rounded-2xl border-2 border-dashed border-blue-400/80 shadow-inner flex flex-col items-center">
                  <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-sm flex items-center justify-center">
                    {/* Simulated Clean SVG QR Code */}
                    <div className="w-full h-full flex flex-col justify-between p-1 bg-slate-900 rounded-lg">
                      <div className="flex justify-between">
                        <div className="w-8 h-8 bg-white rounded-sm p-1"><div className="w-full h-full bg-slate-900 rounded-xs" /></div>
                        <div className="w-4 h-4 bg-white" />
                        <div className="w-8 h-8 bg-white rounded-sm p-1"><div className="w-full h-full bg-slate-900 rounded-xs" /></div>
                      </div>
                      <div className="grid grid-cols-5 gap-1 px-1">
                        <div className="h-2 bg-white rounded-xs" />
                        <div className="h-2 bg-transparent" />
                        <div className="h-2 bg-white rounded-xs" />
                        <div className="h-2 bg-white rounded-xs" />
                        <div className="h-2 bg-transparent" />
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="w-8 h-8 bg-white rounded-sm p-1"><div className="w-full h-full bg-slate-900 rounded-xs" /></div>
                        <div className="w-4 h-4 bg-white" />
                        <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center text-white text-[8px] font-bold">NX</div>
                      </div>
                    </div>
                  </div>
                  {/* Scanner line anim */}
                  <div className="text-[10px] text-blue-600 font-semibold mt-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Pindai di Turnstile Gerbang Kantor
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-2 w-full mt-3 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Bergabung Sejak:</span>
                    <span className="font-semibold text-slate-800">{employee.joinDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Lokasi Kerja:</span>
                    <span className="font-semibold text-slate-800">SCBD Jakarta</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">BPJS TK:</span>
                    <span className="font-mono text-slate-700">{employee.bpjsKetenagakerjaan}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Golongan Darah:</span>
                    <span className="font-semibold text-slate-800">O+ (Rhesus Positif)</span>
                  </div>
                </div>
              </div>

              {/* Barcode line */}
              <div className="text-center pt-2 border-t border-slate-100">
                <div className="h-6 w-full flex justify-center items-center gap-0.5 px-4 mb-1">
                  {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 1].map((w, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800 h-full"
                      style={{ width: `${w * 2}px` }}
                    />
                  ))}
                </div>
                <p className="text-[9px] font-mono text-slate-500 tracking-widest">{employee.employeeId}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20"
          >
            <RotateCw className="w-3.5 h-3.5" />
            {isFlipped ? 'Lihat Tampak Depan' : 'Lihat QR & Akses Pintu'}
          </button>
          <button
            onClick={handleCopyId}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : null}
            {copied ? 'ID Tersalin!' : 'Salin No. ID'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
