import React from 'react';
import { Home, Clock, Calendar, FileText, Menu } from 'lucide-react';

interface BottomTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCount?: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  unreadCount = 0,
}) => {
  const tabs = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'attendance', label: 'Presensi', icon: Clock },
    { id: 'leave', label: 'Cuti', icon: Calendar },
    { id: 'payslip', label: 'Slip Gaji', icon: FileText },
    { id: 'more', label: 'Lainnya', icon: Menu },
  ];

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1 shadow-lg shrink-0">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="min-h-[50px] flex flex-col items-center justify-center py-1 transition-all relative select-none"
            >
              <div
                className={`relative flex items-center justify-center transition-transform ${
                  isActive ? 'scale-110 text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.id === 'more' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-1 transition-colors ${
                  isActive ? 'font-bold text-blue-600' : 'font-medium text-slate-500'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
