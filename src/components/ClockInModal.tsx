import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Camera, MapPin, CheckCircle2, AlertTriangle, RefreshCw, 
  ShieldCheck, Clock, Building, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AttendanceRecord } from '../types';

interface ClockInModalProps {
  isOpen: boolean;
  onClose: () => void;
  isClockedIn: boolean;
  onSuccess: (newRecord: AttendanceRecord, isClockIn: boolean) => void;
  userAvatar: string;
}

export const ClockInModal: React.FC<ClockInModalProps> = ({
  isOpen,
  onClose,
  isClockedIn,
  onSuccess,
  userAvatar,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [locationMode, setLocationMode] = useState<'office' | 'wfh' | 'outside'>('office');
  const [notes, setNotes] = useState<string>('');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      );
      setCurrentDate(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle camera stream
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedPhoto(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setStreamError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraActive(true);
        }
      } else {
        setStreamError('Kamera tidak didukung pada browser ini');
      }
    } catch {
      // Permission denied or simulated environment
      setStreamError('Kamera fisik belum diberikan izin. Menggunakan simulator foto AI biometrik.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleCapture = () => {
    if (videoRef.current && cameraActive) {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 480;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedPhoto(dataUrl);
        stopCamera();
        return;
      }
    }
    // Fallback simulation
    setCapturedPhoto(userAvatar);
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const getDistanceAndStatus = () => {
    if (locationMode === 'office') {
      return {
        distance: 14,
        isValid: true,
        text: 'Nexa Tower SCBD Lt. 18 (Radius 14m)',
        detail: 'Dalam geofence kantor (Maks 50m)',
      };
    }
    if (locationMode === 'wfh') {
      return {
        distance: 0,
        isValid: true,
        text: 'Lokasi WFH Terverifikasi (Rumah)',
        detail: 'Berdasarkan persetujuan remote work HR',
      };
    }
    return {
      distance: 240,
      isValid: false,
      text: 'Di Luar Radius Kantor (240 meter)',
      detail: 'Jarak melebihi batas toleransi kantor (50m)',
    };
  };

  const locInfo = getDistanceAndStatus();

  const handleSubmit = () => {
    if (!locInfo.isValid) {
      alert('Anda berada di luar batas radius kantor! Silakan pindah ke area kantor atau pilih mode WFH bila disetujui.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toISOString().split('T')[0];

      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        date: dateStr,
        dayName: now.toLocaleDateString('id-ID', { weekday: 'long' }),
        clockIn: isClockedIn ? '08:24' : timeStr,
        clockOut: isClockedIn ? timeStr : null,
        status: 'Hadir',
        locationName: locInfo.text,
        distanceMeter: locInfo.distance,
        selfieUrl: capturedPhoto || userAvatar,
        notes: notes || (isClockedIn ? 'Presensi pulang reguler' : 'Presensi masuk via biometric AI verify'),
        workHours: isClockedIn ? '8j 42m' : 'Sedang Berjalan',
      };

      onSuccess(newRecord, !isClockedIn);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isClockedIn ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {isClockedIn ? 'Presensi Pulang (Clock Out)' : 'Presensi Masuk (Clock In)'}
              </h3>
              <p className="text-[11px] text-slate-500">Shift Pagi • 08:30 - 17:30 WIB</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-4">
          {/* Live Clock Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 text-center relative overflow-hidden shadow-md">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />
            <div className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
              {currentDate}
            </div>
            <div className="text-3xl font-bold font-mono-numbers tracking-tight text-white mb-1">
              {currentTime}
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sistem Presensi Aktif
            </div>
          </div>

          {/* Camera / Selfie Verification */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-blue-600" />
                Verifikasi Foto Wajah (Selfie Biometrik)
              </span>
              {capturedPhoto && (
                <button
                  onClick={handleRetake}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 text-[11px]"
                >
                  <RefreshCw className="w-3 h-3" /> Ambil Ulang
                </button>
              )}
            </div>

            <div className="relative w-full aspect-square max-h-56 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-slate-200">
              {capturedPhoto ? (
                <div className="relative w-full h-full">
                  <img
                    src={capturedPhoto}
                    alt="Captured Selfie"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-emerald-950/20 border-2 border-emerald-500 rounded-2xl pointer-events-none flex items-end p-3">
                    <span className="bg-emerald-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5" /> Wajah Terverifikasi 99.4%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                  />
                  {!cameraActive && (
                    <div className="text-center p-4 text-slate-300 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-2 text-slate-400 border border-slate-700">
                        <Camera className="w-8 h-8" />
                      </div>
                      <p className="text-xs font-medium text-slate-200">Biometric Face Scanner</p>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-[220px]">
                        Klik tombol di bawah untuk mengambil selfie presensi
                      </p>
                    </div>
                  )}

                  {/* Face Guide Frame */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-36 h-44 rounded-full border-2 border-dashed border-white/60 flex items-center justify-center">
                      <div className="w-32 h-40 rounded-full border border-white/30" />
                    </div>
                  </div>

                  {/* Capture Button */}
                  <div className="absolute bottom-3 inset-x-0 flex justify-center">
                    <button
                      onClick={handleCapture}
                      className="px-4 py-2 bg-white text-slate-900 rounded-full font-semibold text-xs shadow-lg hover:bg-slate-100 flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Camera className="w-4 h-4 text-blue-600" />
                      Ambil Foto Presensi
                    </button>
                  </div>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* GPS Location & Radius Checker */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" /> Lokasi Presensi GPS
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  locInfo.isValid
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {locInfo.isValid ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Valid
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 text-rose-600" /> Di Luar Radius
                  </>
                )}
              </span>
            </div>

            <div className="text-xs text-slate-800 font-medium">{locInfo.text}</div>
            <p className="text-[11px] text-slate-500">{locInfo.detail}</p>

            {/* Location Simulator Selector */}
            <div className="pt-2 border-t border-slate-200/60">
              <div className="text-[11px] text-slate-500 mb-1.5">Simulasi Lokasi Karyawan:</div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setLocationMode('office')}
                  className={`py-1.5 px-2 text-[11px] font-medium rounded-lg transition-all ${
                    locationMode === 'office'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🏢 Kantor (14m)
                </button>
                <button
                  type="button"
                  onClick={() => setLocationMode('wfh')}
                  className={`py-1.5 px-2 text-[11px] font-medium rounded-lg transition-all ${
                    locationMode === 'wfh'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🏠 WFH (Remote)
                </button>
                <button
                  type="button"
                  onClick={() => setLocationMode('outside')}
                  className={`py-1.5 px-2 text-[11px] font-medium rounded-lg transition-all ${
                    locationMode === 'outside'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  📍 Luar (240m)
                </button>
              </div>
            </div>
          </div>

          {/* Catatan / Keterangan Presensi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Pekerjaan / Shift (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Misal: Bertemu tim frontend, sprint planning..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <button
            onClick={handleSubmit}
            disabled={isProcessing || !locInfo.isValid}
            className={`w-full h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
              !locInfo.isValid
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : isClockedIn
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25'
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Memverifikasi Biometrik & GPS...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                {isClockedIn ? 'Konfirmasi Presensi Pulang' : 'Konfirmasi Presensi Masuk'}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
