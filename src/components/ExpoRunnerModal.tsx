import React, { useState } from 'react';
import { X, Smartphone, QrCode, Copy, Check, Terminal, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ExpoRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpoRunnerModal: React.FC<ExpoRunnerModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                Jalankan di Expo Go (Native App)
              </h3>
              <p className="text-[11px] text-slate-400">React Native • iOS & Android</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-4 text-xs">
          {/* Intro Banner */}
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Proyek Expo React Native Siap Pakai!</p>
              <p className="text-[11px] text-blue-700 mt-0.5">
                Source code native lengkap telah disediakan di folder <code>/expo-app</code> dengan konfigurasi <code>app.json</code>, <code>babel.config.js</code>, dan <code>App.tsx</code>.
              </p>
            </div>
          </div>

          {/* Simulated QR Code for Expo */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-center space-y-2">
            <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
              Pindai dengan Expo Go
            </span>
            <div className="w-36 h-36 bg-white p-3 rounded-2xl mx-auto shadow-sm border border-slate-200 flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="w-7 h-7 bg-slate-900 rounded-md p-1">
                  <div className="w-full h-full bg-white rounded-xs" />
                </div>
                <div className="w-4 h-4 bg-slate-900 rounded-xs" />
                <div className="w-7 h-7 bg-slate-900 rounded-md p-1">
                  <div className="w-full h-full bg-white rounded-xs" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1 px-1">
                <div className="h-1.5 bg-slate-900 rounded-xs" />
                <div className="h-1.5 bg-transparent" />
                <div className="h-1.5 bg-slate-900 rounded-xs" />
                <div className="h-1.5 bg-slate-900 rounded-xs" />
              </div>
              <div className="flex justify-between items-end">
                <div className="w-7 h-7 bg-slate-900 rounded-md p-1">
                  <div className="w-full h-full bg-white rounded-xs" />
                </div>
                <div className="w-3 h-3 bg-slate-900" />
                <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-[8px]">
                  EXPO
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Jalankan perintah di bawah pada terminal untuk mengaktifkan Metro Bundler:
            </p>
          </div>

          {/* Quick Terminal Commands */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Langkah Menjalankan di Terminal:
            </span>

            {/* Step 1 */}
            <div className="bg-slate-900 text-slate-200 rounded-xl p-3 font-mono text-[11px] flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>cd expo-app && npm install</span>
              </div>
              <button
                onClick={() => copyToClipboard('cd expo-app && npm install', 'step1')}
                className="text-slate-400 hover:text-white p-1"
                title="Salin Perintah"
              >
                {copied === 'step1' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 text-slate-200 rounded-xl p-3 font-mono text-[11px] flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>npx expo start</span>
              </div>
              <button
                onClick={() => copyToClipboard('npx expo start', 'step2')}
                className="text-slate-400 hover:text-white p-1"
                title="Salin Perintah"
              >
                {copied === 'step2' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Instructions List */}
          <div className="space-y-1.5 pt-1 text-slate-600 text-[11px]">
            <p className="font-semibold text-slate-800">Cara Buka di Smartphone Fisik:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Unduh aplikasi <strong>Expo Go</strong> dari Play Store (Android) atau App Store (iOS).</li>
              <li>Pastikan smartphone dan komputer Anda terhubung ke jaringan Wi-Fi yang sama.</li>
              <li>Pindai QR Code di terminal dengan Expo Go (Android) atau Kamera bawaan (iOS).</li>
              <li>Aplikasi HRIS Mobile akan langsung terbuka dan berjalan secara native di HP Anda!</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">Folder: /expo-app</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
          >
            Mengerti & Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
};
