import React, { useState } from 'react';
import { 
  CURRENT_EMPLOYEE, 
  TEAM_MEMBERS, 
  INITIAL_ATTENDANCE_LOG, 
  INITIAL_LEAVE_REQUESTS, 
  INITIAL_PAYSLIPS, 
  INITIAL_EXPENSE_CLAIMS, 
  ANNOUNCEMENTS, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { 
  Employee, 
  AttendanceRecord, 
  LeaveRequest, 
  Payslip, 
  ExpenseClaim, 
  Announcement, 
  AppNotification 
} from './types';

// Components
import { MobileFrame } from './components/MobileFrame';
import { BottomTabBar } from './components/BottomTabBar';
import { ClockInModal } from './components/ClockInModal';
import { DigitalIdModal } from './components/DigitalIdModal';
import { LeaveRequestModal } from './components/LeaveRequestModal';
import { PayslipDetailModal } from './components/PayslipDetailModal';
import { ReimbursementModal } from './components/ReimbursementModal';
import { EmployeeDirectoryModal } from './components/EmployeeDirectoryModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ExpoRunnerModal } from './components/ExpoRunnerModal';

// Tabs
import { HomeTab } from './components/tabs/HomeTab';
import { AttendanceTab } from './components/tabs/AttendanceTab';
import { LeaveTab } from './components/tabs/LeaveTab';
import { PayslipTab } from './components/tabs/PayslipTab';
import { MoreTab } from './components/tabs/MoreTab';

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isManagerMode, setIsManagerMode] = useState<boolean>(false);

  // App Data States
  const [employee, setEmployee] = useState<Employee>(CURRENT_EMPLOYEE);
  const [teamMembers] = useState<Employee[]>(TEAM_MEMBERS);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE_LOG);
  const [isClockedIn, setIsClockedIn] = useState<boolean>(true); // Default morning clocked-in
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [payslips] = useState<Payslip[]>(INITIAL_PAYSLIPS);
  const [expenseClaims, setExpenseClaims] = useState<ExpenseClaim[]>(INITIAL_EXPENSE_CLAIMS);
  const [announcements] = useState<Announcement[]>(ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Modals Visibility
  const [isClockInModalOpen, setIsClockInModalOpen] = useState(false);
  const [isIdBadgeModalOpen, setIsIdBadgeModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isReimbursementModalOpen, setIsReimbursementModalOpen] = useState(false);
  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isExpoModalOpen, setIsExpoModalOpen] = useState(false);
  const [selectedPayslipForModal, setSelectedPayslipForModal] = useState<Payslip | null>(null);

  // Success Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Clock In / Out Handler
  const handleClockInOutSuccess = (newRecord: AttendanceRecord, clockedInState: boolean) => {
    setIsClockedIn(clockedInState);
    setAttendanceLogs((prev) => [newRecord, ...prev.filter((r) => r.date !== newRecord.date)]);

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: clockedInState ? 'Presensi Masuk Berhasil' : 'Presensi Pulang Berhasil',
      message: `Presensi jam ${newRecord.clockIn || newRecord.clockOut} WIB terverifikasi di ${newRecord.locationName}`,
      timeAgo: 'Baru saja',
      read: false,
      type: 'attendance',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(
      clockedInState
        ? '✓ Presensi Masuk Berhasil! Selamat bekerja.'
        : '✓ Presensi Pulang Berhasil! Hati-hati di jalan.'
    );
  };

  // Leave Request Submission Handler
  const handleLeaveSubmit = (newReq: LeaveRequest) => {
    setLeaveRequests((prev) => [newReq, ...prev]);

    // Deduct leave balance if annual leave
    if (newReq.leaveType === 'Cuti Tahunan') {
      setEmployee((prev) => ({
        ...prev,
        leaveBalance: {
          ...prev.leaveBalance,
          annual: Math.max(0, prev.leaveBalance.annual - newReq.totalDays),
        },
      }));
    }

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Pengajuan Cuti Terkirim',
      message: `Permohonan ${newReq.leaveType} (${newReq.totalDays} hari) berhasil diajukan ke ${employee.managerName}.`,
      timeAgo: 'Baru saja',
      read: false,
      type: 'leave',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('✓ Pengajuan cuti berhasil dikirim ke Manajer!');
  };

  // Manager Approve Leave
  const handleApproveLeave = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'Disetujui' } : req))
    );
    showToast('✓ Pengajuan cuti telah disetujui');
  };

  // Manager Reject Leave
  const handleRejectLeave = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'Ditolak' } : req))
    );
    showToast('✕ Pengajuan cuti telah ditolak');
  };

  // New Reimbursement Claim Handler
  const handleClaimSubmit = (newClaim: ExpenseClaim) => {
    setExpenseClaims((prev) => [newClaim, ...prev]);
    showToast('✓ Pengajuan klaim biaya berhasil dikirim ke Finance!');
  };

  // Mark all notifications as read
  const handleMarkAllNotifsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('✓ Semua notifikasi ditandai telah dibaca');
  };

  const latestAttendance = attendanceLogs[0];
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <MobileFrame
      activeStatusText={
        isClockedIn ? `Presensi: ${latestAttendance?.clockIn || '08:24'}` : 'Belum Presensi'
      }
      onOpenExpoModal={() => setIsExpoModalOpen(true)}
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-full shadow-xl border border-slate-700 transition-all animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Main Tab Content View */}
      <div className="flex-1">
        {activeTab === 'home' && (
          <HomeTab
            employee={employee}
            latestAttendance={latestAttendance}
            isClockedIn={isClockedIn}
            onOpenClockInModal={() => setIsClockInModalOpen(true)}
            onNavigateTab={setActiveTab}
            onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
            onOpenIdBadge={() => setIsIdBadgeModalOpen(true)}
            onOpenReimbursement={() => setIsReimbursementModalOpen(true)}
            onOpenDirectory={() => setIsDirectoryModalOpen(true)}
            onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
            announcements={announcements}
            notifications={notifications}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceTab
            attendanceLogs={attendanceLogs}
            isClockedIn={isClockedIn}
            onOpenClockInModal={() => setIsClockInModalOpen(true)}
            employee={employee}
          />
        )}

        {activeTab === 'leave' && (
          <LeaveTab
            leaveRequests={leaveRequests}
            employee={employee}
            onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
            isManagerMode={isManagerMode}
            onApproveLeave={handleApproveLeave}
            onRejectLeave={handleRejectLeave}
          />
        )}

        {activeTab === 'payslip' && (
          <PayslipTab
            payslips={payslips}
            employee={employee}
            onOpenPayslipDetail={(slip) => setSelectedPayslipForModal(slip)}
          />
        )}

        {activeTab === 'more' && (
          <MoreTab
            employee={employee}
            onOpenIdBadge={() => setIsIdBadgeModalOpen(true)}
            onOpenDirectory={() => setIsDirectoryModalOpen(true)}
            onOpenReimbursement={() => setIsReimbursementModalOpen(true)}
            isManagerMode={isManagerMode}
            onToggleManagerMode={() => {
              setIsManagerMode(!isManagerMode);
              showToast(
                !isManagerMode
                  ? '🛡️ Mode Manajer HR Diaktifkan'
                  : '👤 Mode Karyawan Diaktifkan'
              );
            }}
            onOpenExpoModal={() => setIsExpoModalOpen(true)}
          />
        )}
      </div>

      {/* Bottom Fixed Tab Navigation */}
      <div className="-mx-4 sticky bottom-0 z-30">
        <BottomTabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unreadCount={unreadNotifCount}
        />
      </div>

      {/* MODALS */}
      {/* 1. Biometric GPS Clock In/Out Modal */}
      <ClockInModal
        isOpen={isClockInModalOpen}
        onClose={() => setIsClockInModalOpen(false)}
        isClockedIn={isClockedIn}
        onSuccess={handleClockInOutSuccess}
        userAvatar={employee.avatar}
      />

      {/* 2. Interactive Digital ID Badge Modal */}
      <DigitalIdModal
        isOpen={isIdBadgeModalOpen}
        onClose={() => setIsIdBadgeModalOpen(false)}
        employee={employee}
      />

      {/* 3. Leave Request Modal */}
      <LeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        employee={employee}
        onSubmit={handleLeaveSubmit}
      />

      {/* 4. Official Payslip Detail Document Modal */}
      {selectedPayslipForModal && (
        <PayslipDetailModal
          isOpen={!!selectedPayslipForModal}
          onClose={() => setSelectedPayslipForModal(null)}
          payslip={selectedPayslipForModal}
          employee={employee}
        />
      )}

      {/* 5. Reimbursement / Expense Claim Modal */}
      <ReimbursementModal
        isOpen={isReimbursementModalOpen}
        onClose={() => setIsReimbursementModalOpen(false)}
        claims={expenseClaims}
        onSubmitNewClaim={handleClaimSubmit}
      />

      {/* 6. Employee Directory Modal */}
      <EmployeeDirectoryModal
        isOpen={isDirectoryModalOpen}
        onClose={() => setIsDirectoryModalOpen(false)}
        employees={teamMembers}
      />

      {/* 7. Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotifsAsRead}
      />

      {/* 8. Expo Go Runner Modal */}
      <ExpoRunnerModal
        isOpen={isExpoModalOpen}
        onClose={() => setIsExpoModalOpen(false)}
      />
    </MobileFrame>
  );
}
