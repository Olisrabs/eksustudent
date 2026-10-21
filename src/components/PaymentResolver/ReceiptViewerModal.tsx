import React from 'react';
import { X, Printer, ShieldCheck, CheckCircle2, Download } from 'lucide-react';
import { PaymentTransaction, StudentProfile } from '../../types';

interface ReceiptViewerModalProps {
  transaction: PaymentTransaction;
  student: StudentProfile;
  onClose: () => void;
}

export const ReceiptViewerModal: React.FC<ReceiptViewerModalProps> = ({
  transaction,
  student,
  onClose
}) => {
  const receiptNo = `EKSU-REC-${new Date().getFullYear()}-${transaction.reference.replace(/\D/g, '').slice(-6) || '819203'}`;
  const dateFormatted = transaction.providerPaidAt || new Date().toISOString().replace('T', ' ').substring(0, 19);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl relative border-4 border-slate-200 print:border-none print:shadow-none print:p-0">
        
        {/* Action bar (hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Verified Bursary e-Receipt
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Receipt Header */}
        <div className="text-center pb-6 border-b-2 border-slate-900/80 space-y-1">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-900 border-2 border-amber-500 flex items-center justify-center text-amber-400 font-extrabold text-xl font-mono shadow-sm">
            EKSU
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-blue-950 uppercase mt-2">
            Ekiti State University, Ado-Ekiti
          </h2>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
            Bursary Department · Treasury & Student Accounts
          </p>
          <div className="inline-block mt-2 px-3 py-1 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs">
            OFFICIAL ELECTRONIC PAYMENT RECEIPT
          </div>
        </div>

        {/* Receipt Meta */}
        <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block">Receipt Number:</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{receiptNo}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block">Transaction Date:</span>
            <span className="font-semibold text-slate-900">{dateFormatted}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Academic Session:</span>
            <span className="font-semibold text-slate-900">{student.currentSession}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block">Gateway & Channel:</span>
            <span className="font-mono font-semibold text-slate-900">{transaction.channel}</span>
          </div>
        </div>

        {/* Student Information Table */}
        <div className="py-4 border-b border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Student Full Name:</span>
            <span className="font-bold text-slate-900">{student.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Matriculation Number:</span>
            <span className="font-mono font-bold text-slate-900">{student.matricNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Department / Faculty:</span>
            <span className="font-medium text-slate-900">{student.department} ({student.faculty})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Level:</span>
            <span className="font-medium text-slate-900">{student.level}</span>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="py-4 border-b-2 border-slate-900 space-y-3">
          <div className="flex justify-between text-xs font-bold text-slate-700 uppercase">
            <span>Description</span>
            <span>Amount</span>
          </div>
          <div className="flex justify-between items-center text-sm font-semibold text-slate-900">
            <div>
              <span>{transaction.category.replace(/_/g, ' ')}</span>
              <span className="text-[11px] text-slate-500 block font-mono">
                Remita RRR: {transaction.reference}
              </span>
            </div>
            <span className="font-mono font-bold text-base">
              ₦{transaction.amount.toLocaleString()}.00
            </span>
          </div>
        </div>

        {/* Total & Verification Seal */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center p-1 bg-slate-50">
              <div className="w-full h-full bg-slate-900 rounded flex flex-col items-center justify-center text-[7px] text-white font-mono leading-none text-center">
                <span>EKSU</span>
                <span>QR-SECURE</span>
                <span>AUTHENTIC</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 leading-tight">
              <span className="font-bold text-slate-800 block">Digitally Certified Receipt</span>
              Auto-reconciled & approved by Bursary Electronic Ledger.
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1 text-emerald-700 font-extrabold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              CONFIRMED PAID
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              SEAL: EKSU-BUR-AUTOPAY-2024
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
