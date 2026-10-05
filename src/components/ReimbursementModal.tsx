import React, { useState } from 'react';
import { X, Plus, Receipt, CheckCircle, Clock, UploadCloud, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { ExpenseClaim } from '../types';
import { formatRupiah, getStatusBadgeColor } from '../utils/formatters';

interface ReimbursementModalProps {
  isOpen: boolean;
  onClose: () => void;
  claims: ExpenseClaim[];
  onSubmitNewClaim: (claim: ExpenseClaim) => void;
}

export const ReimbursementModal: React.FC<ReimbursementModalProps> = ({
  isOpen,
  onClose,
  claims,
  onSubmitNewClaim,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseClaim['category']>('Transport');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptFile, setReceiptFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    const parsedAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newClaim: ExpenseClaim = {
      id: `CLM-${Date.now().toString().slice(-4)}`,
      title,
      category,
      amount: parsedAmount,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Pending',
      notes,
      receiptName: receiptFile || 'bukti_nota_transaksi.jpg',
    };

    onSubmitNewClaim(newClaim);
    // Reset form
    setTitle('');
    setAmount('');
    setNotes('');
    setReceiptFile(null);
    setShowForm(false);
  };

  const totalClaimApproved = claims
    .filter((c) => c.status === 'Disetujui')
    .reduce((sum, c) => sum + c.amount, 0);

  const totalClaimPending = claims
    .filter((c) => c.status === 'Pending')
    .reduce((sum, c) => sum + c.amount, 0);

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
            <h3 className="text-base font-bold text-slate-900">Klaim Biaya & Reimbursement</h3>
            <p className="text-xs text-slate-500">Penggantian biaya operasional & benefit</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Summary Cards */}
        <div className="p-4 grid grid-cols-2 gap-2.5 bg-slate-50 border-b border-slate-100">
          <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] text-slate-500 block mb-1">Total Disetujui (YTD)</span>
            <span className="text-sm font-bold text-emerald-600 font-mono-numbers">
              {formatRupiah(totalClaimApproved)}
            </span>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] text-slate-500 block mb-1">Sedang Diproses HR</span>
            <span className="text-sm font-bold text-amber-600 font-mono-numbers">
              {formatRupiah(totalClaimPending)}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto no-scrollbar flex-1 space-y-4">
          {!showForm ? (
            <>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800">Riwayat Pengajuan Klaim</h4>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Ajukan Klaim
                </button>
              </div>

              <div className="space-y-2.5">
                {claims.map((claim) => {
                  const badge = getStatusBadgeColor(claim.status);
                  return (
                    <div
                      key={claim.id}
                      className="p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                              {claim.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{claim.date}</span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-900 mt-1">{claim.title}</h5>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}
                        >
                          {claim.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="text-slate-500 text-[11px] truncate max-w-[200px]">
                          {claim.notes || 'Tanpa catatan tambahan'}
                        </span>
                        <span className="font-bold text-slate-900 font-mono-numbers">
                          {formatRupiah(claim.amount)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* New Claim Form */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900">Form Pengajuan Reimbursement</h4>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul / Deskripsi Pengeluaran
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Biaya GrabCar meeting klien"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Klaim
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Transport">Transport</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Internet & Pulsa">Internet & Pulsa</option>
                    <option value="Makan Bisnis">Makan Bisnis</option>
                    <option value="Pelatihan">Pelatihan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nominal (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="150000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Keterangan
                </label>
                <textarea
                  rows={2}
                  placeholder="Jelaskan kebutuhan pengeluaran ini untuk keperluan perusahaan..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              {/* Upload Receipt simulation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lampiran Bukti Struk / Kuitansi
                </label>
                <div
                  onClick={() => setReceiptFile('struk_pembayaran_terlampir.pdf')}
                  className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-4 text-center cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition-colors"
                >
                  <UploadCloud className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-slate-700">
                    {receiptFile ? `File Dipilih: ${receiptFile}` : 'Unggah Foto Struk / PDF'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Maksimal 5MB (JPG, PNG, PDF)</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                Kirim Pengajuan Klaim
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
