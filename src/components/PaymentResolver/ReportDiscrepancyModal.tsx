import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Sparkles } from 'lucide-react';
import { StudentProfile, PaymentCategory, ProviderGateway } from '../../types';
import { AppStorage } from '../../services/storage';

interface ReportDiscrepancyModalProps {
  student: StudentProfile;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReportDiscrepancyModal: React.FC<ReportDiscrepancyModalProps> = ({
  student,
  onClose,
  onSuccess
}) => {
  const [reference, setReference] = useState('');
  const [category, setCategory] = useState<PaymentCategory>('HOSTEL_ALLOCATION_FEE');
  const [amount, setAmount] = useState<number>(35000);
  const [channel, setChannel] = useState<ProviderGateway>('REMITA');
  const [bankNarration, setBankNarration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAutofillSample = () => {
    setReference(`RRR-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`);
    setCategory('HOSTEL_ALLOCATION_FEE');
    setAmount(35000);
    setChannel('REMITA');
    setBankNarration(`DEBIT: ₦35,000.00 | ACCT: 014****892 | DESC: REMITA EKSU HOSTEL FEE | DATE: ${new Date().toLocaleDateString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      AppStorage.addPaymentDiscrepancy(student, {
        reference: reference.trim().toUpperCase(),
        category,
        amount: Number(amount),
        channel,
        bankNarration
      });
      setIsSubmitting(false);
      onSuccess();
    }, 800);
  };

  return (
    <>
      {/* Backdrop (Section 10.6) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />

      {/* Panel (Section 10.6) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-card border border-border rounded-3xl p-7 w-full max-w-lg shadow-2xl pointer-events-auto space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Report Fee Inquiry / Discrepancy
                </h3>
                <p className="text-xs text-muted-foreground">
                  Query payment gateway for unconfirmed transactions
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Demo Autofill */}
          <div className="bg-secondary/30 rounded-2xl p-4 border border-border flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              <span className="font-bold text-foreground block">Quick Testing for Judges:</span>
              Auto-generate a bank transaction record
            </div>
            <button
              type="button"
              onClick={handleAutofillSample}
              className="px-3 py-1.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <Sparkles size={14} />
              Auto-Fill
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Transaction Reference (RRR / Paystack Ref)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. RRR-2409-1834-9021"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="input font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Fee Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PaymentCategory)}
                  className="input"
                >
                  <option value="HOSTEL_ALLOCATION_FEE">Hostel Allocation Dues</option>
                  <option value="TUITION">School Fees (Tuition)</option>
                  <option value="ACCEPTANCE_FEE">Acceptance Dues</option>
                  <option value="FACULTY_DUES">Faculty / Dept Dues</option>
                  <option value="LATE_REGISTRATION">Late Registration Fee</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="input font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Bank Narration / SMS Debit Alert Text
              </label>
              <textarea
                rows={2}
                placeholder="Paste bank debit message..."
                value={bankNarration}
                onChange={(e) => setBankNarration(e.target.value)}
                className="input text-xs font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-bold glass hover:bg-white/5 text-xs text-muted-foreground hover:text-foreground transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !reference.trim()}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-70"
              >
                {isSubmitting ? 'Verifying Gateway...' : 'Submit & Reconcile'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};
