export type AttendanceStatus = 'Hadir' | 'Terlambat' | 'Cuti' | 'Izin' | 'Alpha';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  avatar: string;
  joinDate: string;
  employeeId: string;
  status: 'Tetap' | 'Kontrak';
  officeLocation: string;
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  ptkp: string;
  bpjsKetenagakerjaan: string;
  bpjsKesehatan: string;
  leaveBalance: {
    annual: number;
    annualTotal: number;
    sick: number;
    special: number;
    wfa: number;
  };
  managerName: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  dayName?: string;
  clockIn: string | null;
  clockOut: string | null;
  status: AttendanceStatus;
  locationName?: string;
  distanceMeter?: number;
  selfieUrl?: string;
  notes?: string;
  workHours?: string;
}

export type LeaveType = 'Cuti Tahunan' | 'Cuti Sakit' | 'Cuti Menikah' | 'Izin Keperluan Khusus' | 'WFA (Work From Anywhere)';
export type ApprovalStatus = 'Pending' | 'Disetujui' | 'Ditolak';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: ApprovalStatus;
  appliedAt: string;
  approvedBy?: string;
  rejectionReason?: string;
  attachmentName?: string;
}

export interface Payslip {
  id: string;
  periodMonth: string;
  periodYear: number;
  payDate: string;
  status: 'Lunas' | 'Diproses';
  earnings: {
    basicSalary: number;
    positionAllowance: number;
    transportMealAllowance: number;
    communicationAllowance: number;
    performanceBonus: number;
  };
  deductions: {
    bpjsKetenagakerjaan: number;
    bpjsKesehatan: number;
    pph21: number;
    cooperativeLoan: number;
  };
  totalEarnings: number;
  totalDeductions: number;
  takeHomePay: number;
}

export interface ExpenseClaim {
  id: string;
  title: string;
  category: 'Transport' | 'Kesehatan' | 'Makan Bisnis' | 'Internet & Pulsa' | 'Pelatihan';
  amount: number;
  date: string;
  status: ApprovalStatus;
  notes: string;
  receiptName?: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: string;
  date: string;
  content: string;
  isImportant?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  type: 'attendance' | 'leave' | 'payroll' | 'announcement';
}

// Simple types for basic interface
export interface AttendanceItem {
  id: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  status: 'Hadir' | 'Terlambat' | 'Izin';
}

export interface LeaveItem {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Disetujui' | 'Menunggu';
}

export interface PayslipItem {
  month: string;
  basicSalary: number;
  allowance: number;
  deduction: number;
  total: number;
}
