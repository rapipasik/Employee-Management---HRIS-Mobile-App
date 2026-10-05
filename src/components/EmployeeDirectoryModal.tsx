import React, { useState } from 'react';
import { X, Search, Phone, Mail, MessageSquare, Building2, User, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Employee } from '../types';

interface EmployeeDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
}

export const EmployeeDirectoryModal: React.FC<EmployeeDirectoryModalProps> = ({
  isOpen,
  onClose,
  employees,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  if (!isOpen) return null;

  const departments = ['All', 'Engineering & Technology', 'Product Design', 'Human Resources'];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">Direktori Karyawan</h3>
            <p className="text-xs text-slate-500">PT NEXA TECH Nusantara ({employees.length} Karyawan)</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Dept Filters */}
        <div className="p-4 border-b border-slate-100 space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nama, jabatan, atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedDept === dept
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept === 'All' ? 'Semua Divisi' : dept}
              </button>
            ))}
          </div>
        </div>

        {/* Directory List */}
        <div className="p-4 overflow-y-auto no-scrollbar divide-y divide-slate-100 flex-1">
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Tidak ada karyawan ditemukan dengan kata kunci tersebut.
            </div>
          ) : (
            filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer"
                onClick={() => setSelectedEmployee(emp)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{emp.name}</h4>
                    <p className="text-[11px] text-blue-600 font-medium">{emp.role}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{emp.department}</span>
                      <span>•</span>
                      <span className="font-mono">{emp.employeeId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://wa.me/${emp.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                    title="Kirim Pesan WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                  <a
                    href={`mailto:${emp.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                    title="Kirim Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Employee Detail Card Drawer (if clicked) */}
        {selectedEmployee && (
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Detail Kontak Rekan</span>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-xs text-blue-600 font-medium"
              >
                Tutup
              </button>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Nomor Telepon:</span>
                <span className="font-semibold text-slate-900">{selectedEmployee.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email Kantor:</span>
                <span className="font-semibold text-slate-900">{selectedEmployee.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Atasan Langsung:</span>
                <span className="font-semibold text-slate-900">{selectedEmployee.managerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Lokasi Kerja:</span>
                <span className="font-semibold text-slate-900">{selectedEmployee.officeLocation}</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
