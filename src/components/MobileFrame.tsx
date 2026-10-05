import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeStatusText?: string;
  onOpenExpoModal?: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeStatusText = 'NEXA HRIS Online',
  onOpenExpoModal,
}) => {
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'full'>('mobile');

  // Live status bar time
  const [phoneTime, setPhoneTime] = React.useState('09:41');
  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setPhoneTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const getContainerWidth = () => {
    switch (deviceView) {
      case 'mobile':
        return 'max-w-[420px]';
      case 'tablet':
        return 'max-w-[540px]';
      case 'full':
        return 'max-w-2xl';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-900 flex flex-col items-center justify-start sm:py-6 sm:px-4 selection:bg-blue-600 selection:text-white">
      {/* Top Device Viewport Switcher Toolbar (Hidden on true mobile phones) */}
      <header className="hidden sm:flex items-center justify-between w-full max-w-xl mb-4 px-4 py-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 text-slate-300 shadow-lg text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-white tracking-wide">
            HRIS Mobile App
          </span>
          {onOpenExpoModal && (
            <button
              onClick={onOpenExpoModal}
              className="px-2 py-0.5 rounded-md bg-blue-600/30 text-blue-300 hover:bg-blue-600/50 hover:text-white border border-blue-500/40 text-[10px] font-bold flex items-center gap-1 transition-colors"
            >
              📲 Expo Go
            </button>
          )}
        </div>

        {/* Viewport switch buttons */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setDeviceView('mobile')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              deviceView === 'mobile'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan HP Mobile (390px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile (390px)</span>
          </button>
          <button
            onClick={() => setDeviceView('tablet')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              deviceView === 'tablet'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Layar Lebar"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            onClick={() => setDeviceView('full')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              deviceView === 'full'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Layar Penuh"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Full</span>
          </button>
        </div>
      </header>

      {/* Device Enclosure / Shell */}
      <div
        className={`w-full ${getContainerWidth()} bg-slate-50 sm:rounded-[44px] overflow-hidden sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] sm:border-[9px] sm:border-slate-800 flex flex-col h-screen sm:h-[840px] relative transition-all duration-300`}
      >
        {/* Phone Status Bar (Mocked iOS / Modern Android top bar) */}
        <div className="bg-slate-50 px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold text-slate-800 shrink-0 z-30 select-none">
          <span className="font-mono text-xs tracking-tight">{phoneTime}</span>

          {/* Dynamic Island Capsule */}
          <div className="h-6 px-3 bg-slate-900 text-white rounded-full flex items-center gap-2 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-medium tracking-tight text-slate-200">
              {activeStatusText}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-800">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-slate-800" />
          </div>
        </div>

        {/* Scrollable Viewport Inner Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-1 bg-slate-50 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};
