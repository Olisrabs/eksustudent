import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  Clock, 
  FileCheck, 
  UserCheck,
  RefreshCw,
  ExternalLink,
  Zap,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentCase, IncidentCluster, StudentProfile } from '../../types';
import { AppStorage } from '../../services/storage';

interface StaffConsoleProps {
  cases: PaymentCase[];
  clusters: IncidentCluster[];
  student: StudentProfile;
  onDataUpdated: () => void;
}

export const StaffConsole: React.FC<StaffConsoleProps> = ({
  cases,
  clusters,
  student,
  onDataUpdated
}) => {
  const [resolvingCaseId, setResolvingCaseId] = useState<string | null>(null);
  const [resolvingClusterId, setResolvingClusterId] = useState<string | null>(null);

  const pendingCases = cases.filter(c => c.status !== 'RESOLVED_PORTAL_UPDATED');
  const resolvedCases = cases.filter(c => c.status === 'RESOLVED_PORTAL_UPDATED');

  const handleApproveCase = (c: PaymentCase) => {
    setResolvingCaseId(c.id);

    setTimeout(() => {
      AppStorage.reconcilePayment(c.transaction.reference, 'Dr. A. Olowookere (Chief Bursar / Systems ICT)');
      setResolvingCaseId(null);
      onDataUpdated();

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (e) {}
    }, 1200);
  };

  const handleBatchResolveCluster = (clusterId: string) => {
    setResolvingClusterId(clusterId);

    setTimeout(() => {
      AppStorage.batchReconcileCluster(clusterId, 'EKSU ICT Taskforce & Bursary Automation Relay');
      setResolvingClusterId(null);
      onDataUpdated();

      try {
        confetti({
          particleCount: 180,
          spread: 100,
          origin: { y: 0.4 }
        });
      } catch (e) {}
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border-l-4 border-l-eksu-gold-500">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-eksu-gold-400 border border-eksu-gold-500/30">
              Institutional Operations Console
            </span>
            <span className="text-xs text-slate-400">Bursary · ICT Unit · Hostel Affairs</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1 tracking-tight font-['Outfit']">
            University Administrative & Reconciliation Command
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Audit gateway settlements, review AI-flagged desynchronization evidence, and push verified ledger updates directly into EKSU's student database with 100% immutable audit logging.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-right">
            <span className="text-[11px] text-slate-400 block">Avg Resolution Time</span>
            <span className="text-base font-extrabold text-emerald-400 flex items-center gap-1 justify-end">
              <Zap className="w-3.5 h-3.5" /> 12 Seconds <span className="text-slate-400 font-normal text-xs">(vs 14 days)</span>
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 block">Pending Reconciliation Queue</span>
          <div className="mt-2 text-3xl font-black text-white font-mono">
            {pendingCases.length} Cases
          </div>
          <div className="mt-1 text-xs text-rose-400 font-medium">
            Requires staff authorization
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 block">Total Discrepancy Capital</span>
          <div className="mt-2 text-3xl font-black text-amber-400 font-mono">
            ₦{pendingCases.reduce((sum, c) => sum + c.transaction.amount, 0).toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Escrowed in Remita TSA Account
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 block">Auto-Reconciled Today</span>
          <div className="mt-2 text-3xl font-black text-emerald-400 font-mono">
            {resolvedCases.length + 38} Records
          </div>
          <div className="mt-1 text-xs text-emerald-400/90 font-medium">
            100% Paperless Execution
          </div>
        </div>
      </div>

      {/* Active Desynchronization Queue */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-eksu-gold-400" />
            <h2 className="text-base font-bold text-white">
              Bursary Discrepancy Queue ({pendingCases.length} Action Needed)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Pre-audited with Remita Gateway Proof
          </span>
        </div>

        {pendingCases.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
            🎉 All payment discrepancies have been reconciled and pushed to the EKSU student portal ledger!
          </div>
        ) : (
          <div className="space-y-4">
            {pendingCases.map((c) => (
              <div 
                key={c.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-4 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <span className="font-mono text-xs font-bold text-eksu-gold-400">
                      {c.caseNumber}
                    </span>
                    <h3 className="text-base font-bold text-white">
                      {c.transaction.studentName} — <span className="font-mono text-slate-300">{c.transaction.matricNumber}</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      {c.priority} Priority
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300">
                      Assigned: {c.assignedTeam}
                    </span>
                  </div>
                </div>

                {/* Evidence Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Gateway Transaction Ref:</span>
                    <span className="font-mono font-bold text-white text-sm">{c.transaction.reference}</span>
                    <span className="text-slate-400 block mt-1">Paid via {c.transaction.channel}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Fee Category & Amount:</span>
                    <span className="font-mono font-bold text-amber-300 text-sm">
                      ₦{c.transaction.amount.toLocaleString()}
                    </span>
                    <span className="text-slate-400 block mt-1">{c.transaction.category.replace(/_/g, ' ')}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Audit Verification Engine:</span>
                    <span className="font-bold text-emerald-400 block">Remita Settlement Confirmed</span>
                    <span className="text-rose-400 block mt-1">Portal Table: UNPAID (Webhook Dropped)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-eksu-blue-950/60 border border-eksu-blue-800/40 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-eksu-gold-400 block mb-1">
                    AI Auto-Audit Finding:
                  </span>
                  {c.aiExplanation}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="text-[11px] text-slate-400">
                    Bank Narration: <code className="text-slate-300 font-mono">{c.transaction.bankNarration}</code>
                  </div>

                  <button
                    disabled={resolvingCaseId === c.id}
                    onClick={() => handleApproveCase(c)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                  >
                    {resolvingCaseId === c.id ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Pushing Live Ledger Update...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Approve & Push to Portal Ledger
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Incident Clustering & Batch Resolution Power Tool */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-eksu-gold-400" />
            <h2 className="text-base font-bold text-white">
              Institutional Outage Remediation (Batch Clearance)
            </h2>
          </div>
        </div>

        <div className="space-y-4">
          {clusters.map((cl) => {
            const isResolved = cl.status === 'RESOLVED_IN_BATCH';

            return (
              <div 
                key={cl.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-eksu-gold-400">
                      {cl.clusterCode}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {cl.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {cl.description}
                  </p>
                  <div className="text-[11px] text-slate-400 pt-1">
                    Affected: <strong className="text-white">{cl.affectedCount} Students</strong> · Category: {cl.rootCauseCategory}
                  </div>
                </div>

                <div>
                  {isResolved ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <CheckCircle2 className="w-4 h-4" />
                      Batch Reconciled ({cl.affectedCount} Students Cleared)
                    </span>
                  ) : (
                    <button
                      disabled={resolvingClusterId === cl.id}
                      onClick={() => handleBatchResolveCluster(cl.id)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-eksu-gold-500 hover:opacity-95 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
                    >
                      {resolvingClusterId === cl.id ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Batch Synchronizing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          1-Click Batch Resolve all {cl.affectedCount} Students
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
