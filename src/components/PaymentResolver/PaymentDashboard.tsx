import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  XCircle, 
  ArrowRight, 
  Printer, 
  FileText, 
  RefreshCw, 
  Search, 
  CreditCard, 
  Key,
  Layers,
  X,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentTransaction, StudentProfile, PaymentCase, HostelLifecycleStage } from '../../types';
import { HostelAllocationService, EligibilityResult } from '../../services/hostelAllocationService';
import { PaymentReconciliationService, VerificationResult } from '../../services/paymentReconciliation';
import { AppStorage } from '../../services/storage';

interface PaymentDashboardProps {
  student: StudentProfile;
  transactions: PaymentTransaction[];
  cases: PaymentCase[];
  onDataUpdated: () => void;
  onOpenReportModal: () => void;
  onViewReceipt: (tx: PaymentTransaction) => void;
}

export const PaymentDashboard: React.FC<PaymentDashboardProps> = ({
  student,
  transactions,
  cases,
  onDataUpdated,
  onOpenReportModal,
  onViewReceipt
}) => {
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifyingRef, setIsVerifyingRef] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('Found off-campus private apartment');

  const app = student.hostelApplication;
  const stage: HostelLifecycleStage = app ? app.status : 'ELIGIBLE_NOT_APPLIED';

  useEffect(() => {
    const el = HostelAllocationService.checkEligibility(student);
    setEligibility(el);
  }, [student]);

  const handleAcceptAndPay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      AppStorage.acceptAndPayHostel(student.id, app?.paymentReference || 'RRR-2409-1834-9021');
      setIsProcessing(false);
      onDataUpdated();

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }, 1200);
  };

  const handleRejectSpace = () => {
    AppStorage.rejectHostelSpace(student.id, rejectReason);
    setShowRejectModal(false);
    onDataUpdated();
  };

  const handleVerifyReference = (refToTest: string) => {
    setIsVerifyingRef(true);
    setVerificationResult(null);

    setTimeout(() => {
      const targetTx = transactions.find(t => t.reference.toUpperCase() === refToTest.toUpperCase());
      const expectedAmount = targetTx ? targetTx.amount : 35000;
      const portalStatus = targetTx ? targetTx.portalStatus : 'PAID';

      const result = PaymentReconciliationService.verifyTransaction(refToTest, expectedAmount, portalStatus);
      setVerificationResult(result);
      setIsVerifyingRef(false);
    }, 800);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Top Page Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">
              UNILAG-Style Accommodation Architecture
            </span>
            <span className="text-xs text-muted-foreground">Allocation Before Payment</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mt-2 tracking-tight">
            Hostel Space Allocation & PayResolve Shield
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            Eliminates payment friction at the structural root. Bedspaces are allocated randomly to eligible students with zero upfront cost. Only allocated students receive a 48-hour conditional offer to Accept & Pay or Decline.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="px-6 py-3 rounded-xl font-bold glass hover:bg-white/5 text-xs transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <CreditCard size={16} className="text-primary" />
          General Fee Query
        </button>
      </div>

      {/* Structured Hostel Lifecycle Stepper (Section 10.1 Stat Grid) */}
      <div className="glass-card rounded-3xl p-6 border border-border space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Layers size={16} className="text-primary" />
          UNILAG Model 4-Step Allocation Pipeline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Step 1 */}
          <div className="bg-secondary/30 rounded-2xl p-4 border border-border space-y-1">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-accent/10 text-accent flex items-center gap-1 w-fit">
              <CheckCircle2 size={12} /> Step 1: Cleared
            </span>
            <h4 className="font-bold text-foreground pt-1">Tuition & Eligibility</h4>
            <p className="text-xs text-muted-foreground">Tuition verified paid. 400L final year quota confirmed.</p>
          </div>

          {/* Step 2 */}
          <div className="bg-secondary/30 rounded-2xl p-4 border border-border space-y-1">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-accent/10 text-accent flex items-center gap-1 w-fit">
              <CheckCircle2 size={12} /> Step 2: Completed
            </span>
            <h4 className="font-bold text-foreground pt-1">Free Balloting Window</h4>
            <p className="text-xs text-muted-foreground">Application submitted with ₦0 upfront cost.</p>
          </div>

          {/* Step 3 */}
          <div className={`rounded-2xl p-4 border space-y-1 ${
            stage === 'CONFIRMED_CLEARED_FOR_MOVEIN'
              ? 'bg-secondary/30 border-border'
              : stage === 'REJECTED_BY_STUDENT'
              ? 'bg-secondary/30 border-border'
              : 'bg-primary/10 border-primary/30 shadow-md'
          }`}>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit ${
              stage === 'CONFIRMED_CLEARED_FOR_MOVEIN'
                ? 'bg-accent/10 text-accent'
                : stage === 'REJECTED_BY_STUDENT'
                ? 'bg-secondary text-muted-foreground'
                : 'bg-orange-500/10 text-orange-500 animate-pulse'
            }`}>
              {stage === 'CONFIRMED_CLEARED_FOR_MOVEIN' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
              Step 3: {stage === 'CONFIRMED_CLEARED_FOR_MOVEIN' ? 'Offer Accepted' : stage === 'REJECTED_BY_STUDENT' ? 'Declined' : 'Active Offer'}
            </span>
            <h4 className="font-bold text-foreground pt-1">Randomized Allocation</h4>
            <p className="text-xs text-muted-foreground">Room B-14 in Hall 2 reserved for 48 hours.</p>
          </div>

          {/* Step 4 */}
          <div className={`rounded-2xl p-4 border space-y-1 ${
            stage === 'CONFIRMED_CLEARED_FOR_MOVEIN'
              ? 'bg-accent/10 border-accent/30 shadow-md'
              : 'bg-secondary/20 border-border opacity-70'
          }`}>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit ${
              stage === 'CONFIRMED_CLEARED_FOR_MOVEIN' ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'
            }`}>
              <Key size={12} /> Step 4: Final Step
            </span>
            <h4 className="font-bold text-foreground pt-1">Move-In Clearance Pass</h4>
            <p className="text-xs text-muted-foreground">Key authorization code & Warden QR stamp.</p>
          </div>
        </div>
      </div>

      {/* STAGE A: ACTIVE CONDITIONAL OFFER (Section 10.2 & 10.8) */}
      {stage === 'ALLOCATED_OFFER_ACTIVE' && app?.allocatedSpace && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-primary/40 relative overflow-hidden shadow-2xl">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                {/* Live pulse dot (Section 13.10) */}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  CONDITIONAL ALLOCATION OFFER ACTIVE
                </span>
              </div>

              {/* 48-Hour Countdown Pill (Section 10.4) */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-mono font-semibold">
                <Clock size={14} className="animate-spin" style={{ animationDuration: '8s' }} />
                <span>37h : 42m : 18s Remaining to Accept or Decline</span>
              </div>
            </div>

            {/* Allocation Room Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                  You Have Been Randomly Allocated a Bedspace
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Congratulations! Under EKSU's UNILAG-model accommodation balloting, you have been selected for on-campus housing. You have 48 hours to either <strong className="text-foreground">Accept & Pay</strong> the allocation fee or <strong className="text-foreground">Decline Space</strong> so it automatically passes to the waitlist.
                </p>

                {/* Sub-cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-secondary/30 rounded-2xl p-4 border border-border">
                    <span className="text-xs text-muted-foreground block uppercase">Allocated Hall</span>
                    <span className="font-bold text-foreground text-sm">{app.allocatedSpace.hallName}</span>
                  </div>
                  <div className="bg-secondary/30 rounded-2xl p-4 border border-border">
                    <span className="text-xs text-muted-foreground block uppercase">Block & Room</span>
                    <span className="font-bold text-foreground text-sm">{app.allocatedSpace.block}, {app.allocatedSpace.roomNumber}</span>
                  </div>
                  <div className="bg-secondary/30 rounded-2xl p-4 border border-border">
                    <span className="text-xs text-muted-foreground block uppercase">Bedspace</span>
                    <span className="font-bold text-primary text-sm">{app.allocatedSpace.bedNumber}</span>
                  </div>
                </div>
              </div>

              {/* Decision Box */}
              <div className="glass rounded-3xl p-6 border border-border space-y-4 shadow-lg">
                <div className="text-center pb-3 border-b border-border">
                  <span className="text-xs text-muted-foreground block">Allocation Fee:</span>
                  <div className="text-3xl font-extrabold text-foreground font-mono mt-1">
                    ₦{app.allocatedSpace.feeAmount.toLocaleString()}
                  </div>
                  <span className="text-xs text-accent font-medium">Session 2024/2025 · No Extra Fees</span>
                </div>

                <div className="space-y-2.5">
                  {/* Primary Button matching Section 10.8 */}
                  <button
                    disabled={isProcessing}
                    onClick={handleAcceptAndPay}
                    className="w-full bg-primary text-primary-foreground px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Shielding & Confirming...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Accept & Pay (₦35,000)
                      </>
                    )}
                  </button>

                  {/* Secondary Button matching Section 10.9 */}
                  <button
                    disabled={isProcessing}
                    onClick={() => setShowRejectModal(true)}
                    className="w-full px-6 py-2.5 rounded-xl font-bold glass hover:bg-white/5 text-xs text-muted-foreground hover:text-red-500 transition-all flex items-center justify-center gap-1.5"
                  >
                    <XCircle size={14} />
                    Decline Space (Pass to Waitlist)
                  </button>
                </div>

                <p className="text-[11px] text-muted-foreground text-center leading-tight">
                  🛡️ <strong>PayResolve Shield Active:</strong> Your reservation is protected during gateway settlement. No dropped payments.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE B: CONFIRMED & CLEARED FOR MOVE-IN */}
      {stage === 'CONFIRMED_CLEARED_FOR_MOVEIN' && app?.allocatedSpace && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-accent/40 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <Key size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-accent/10 text-accent">
                    Move-In Clearance Issued
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {app.moveInPassCode || 'EKSU-HOSTEL-2024-819203'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-0.5">
                  Hostel Move-In Pass & Room Key Authorization
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl glass hover:bg-white/5 text-xs font-semibold text-foreground transition-all flex items-center gap-1.5"
              >
                <Printer size={14} />
                Print Slip
              </button>
              <button
                onClick={() => onViewReceipt(transactions[0])}
                className="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-md"
              >
                <FileText size={14} />
                View e-Receipt
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-secondary/30 rounded-2xl p-5 border border-border space-y-2">
              <span className="text-muted-foreground block text-xs uppercase">Allocated Bedspace</span>
              <div className="font-bold text-foreground text-base">
                {app.allocatedSpace.hallName}
              </div>
              <div className="text-muted-foreground">
                {app.allocatedSpace.block}, {app.allocatedSpace.roomNumber}
              </div>
              <div className="text-accent font-semibold">
                {app.allocatedSpace.bedNumber}
              </div>
            </div>

            <div className="bg-secondary/30 rounded-2xl p-5 border border-border space-y-2">
              <span className="text-muted-foreground block text-xs uppercase">Hall Warden Authorization</span>
              <div className="font-mono font-bold text-accent text-base">
                HALL-KEY-B14-B2
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Present this clearance code and your student ID card to the Hall Porter/Warden at Hall 2 for physical room key collection.
              </p>
            </div>

            <div className="bg-secondary/30 rounded-2xl p-5 border border-border flex items-center gap-4">
              <div className="w-16 h-16 bg-card border border-border rounded-xl flex flex-col items-center justify-center text-[7px] text-foreground font-mono text-center p-1 shadow-sm shrink-0">
                <span>EKSU</span>
                <span>WARDEN</span>
                <span>QR-SEAL</span>
                <span>CLEARED</span>
              </div>
              <div className="space-y-1">
                <span className="text-accent font-bold block text-sm">100% Cleared for Move-In</span>
                <span className="text-muted-foreground block text-xs">Valid for 2024/2025 Session</span>
                <span className="text-muted-foreground text-[11px] block">Bursary Verified & Synchronized</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE C: REJECTED SPACE BANNER */}
      {stage === 'REJECTED_BY_STUDENT' && (
        <div className="bg-secondary/30 rounded-2xl p-6 border border-border space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground font-bold text-sm">
            <XCircle size={18} className="text-red-500" />
            Allocated Bedspace Declined by Student
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            You declined your allocated bedspace in <strong className="text-foreground">Prof. Peter Adeniyi Hall 2</strong>. In accordance with the UNILAG accommodation framework, this bedspace has been immediately transferred to the next eligible applicant on the waitlist. You have not been charged any fee.
          </p>
          <p className="text-xs text-muted-foreground italic">
            Recorded Reason: {app?.rejectionReason || 'Opted for off-campus accommodation'}
          </p>
        </div>
      )}

      {/* Eligibility Verification Check (Section 10.1 Stat Grid) */}
      {eligibility && (
        <div className="glass-card rounded-3xl p-6 border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              Hostel Accommodation Eligibility Verification
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-accent/10 text-accent">
              Cleared for Balloting
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {eligibility.criteria.map((c, i) => (
              <div key={i} className="bg-secondary/30 rounded-2xl p-4 border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{c.title}</span>
                  <CheckCircle2 size={16} className="text-accent" />
                </div>
                <p className="text-xs text-muted-foreground leading-snug">{c.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General University Payment Reconciler Tool */}
      <div className="glass-card rounded-3xl p-6 border border-border space-y-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Search size={18} className="text-primary" />
            General Payment Reference Reconciler (Tuition & Dues)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Query Remita, Interswitch, or NIBSS references for school fees, acceptance, or faculty dues
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter RRR or Payment Reference (e.g. RRR-1102-8841-3392)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input font-mono"
          />
          <button
            disabled={!searchQuery.trim() || isVerifyingRef}
            onClick={() => handleVerifyReference(searchQuery)}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-70 shrink-0"
          >
            {isVerifyingRef ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Verify
          </button>
        </div>

        {verificationResult && (
          <div className="bg-secondary/30 rounded-2xl p-4 border border-border text-xs text-foreground space-y-1">
            <div className="flex justify-between font-bold">
              <span>Status: {verificationResult.classification.replace(/_/g, ' ')}</span>
              <span className="font-mono text-primary font-bold">₦{verificationResult.amount.toLocaleString()}</span>
            </div>
            <p className="text-muted-foreground">{verificationResult.explanation}</p>
          </div>
        )}
      </div>

      {/* Reject Confirmation Modal matching Section 10.6 Modal pattern */}
      <AnimatePresence>
        {showRejectModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRejectModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-card border border-border rounded-3xl p-7 w-full max-w-md shadow-2xl pointer-events-auto space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <XCircle size={20} className="text-red-500" />
                    Decline Bedspace Allocation?
                  </h3>
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Are you sure you want to decline <strong className="text-foreground">Peter Adeniyi Hall 2, Room B-14</strong>? Under the UNILAG model, this space will immediately be released to the next applicant on the university waitlist. You will not be charged any fee.
                </p>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Reason for Declining
                  </label>
                  <select
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="input"
                  >
                    <option value="Found off-campus private apartment">Found off-campus private apartment</option>
                    <option value="Living with family / relatives in Ado-Ekiti">Living with family / relatives in Ado-Ekiti</option>
                    <option value="Prefer a different hostel hall">Prefer a different hostel hall</option>
                    <option value="Financial constraints">Financial constraints</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="px-4 py-2.5 rounded-xl font-bold glass hover:bg-white/5 text-xs text-muted-foreground hover:text-foreground transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRejectSpace}
                    className="bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-red-600 transition-all shadow-md"
                  >
                    Confirm Decline
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
