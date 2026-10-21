import React from 'react';
import { 
  CreditCard, 
  GraduationCap, 
  MessageSquareWarning, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Building, 
  BookOpen,
  Award,
  Zap,
  Key,
  Layers
} from 'lucide-react';
import { StudentProfile, PaymentTransaction, StudentCourseResult, PaymentCase } from '../../types';
import { TabType } from '../Sidebar';

interface OverviewDashboardProps {
  student: StudentProfile;
  transactions: PaymentTransaction[];
  results: StudentCourseResult[];
  cases: PaymentCase[];
  onNavigateTab: (tab: TabType) => void;
  onOpenReportModal: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  student,
  transactions,
  results,
  cases,
  onNavigateTab,
  onOpenReportModal
}) => {
  const app = student.hostelApplication;
  const isHostelOfferActive = app && app.status === 'ALLOCATED_OFFER_ACTIVE';
  const isHostelConfirmed = app && app.status === 'CONFIRMED_CLEARED_FOR_MOVEIN';
  const desyncTx = transactions.find(t => t.discrepancyType === 'PORTAL_DESYNC_VERIFIED');

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Hero Banner (Section 10.2 Gradient Hero with Decorative Blobs) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-purple-600 p-6 sm:p-8 text-white shadow-xl">
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-bold text-2xl text-white shadow-md">
              {student.fullName ? student.fullName[0].toUpperCase() : 'O'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm border border-white/20">
                  {student.level} Undergraduate
                </span>
                <span className="text-xs text-white/80 font-mono">
                  {student.matricNumber}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight font-sans">
                Welcome, {student.fullName}
              </h1>
              <p className="text-xs sm:text-sm text-white/80 mt-1">
                B.Sc {student.department} · Faculty of {student.faculty} · Session {student.currentSession}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('copilot')}
              className="px-5 py-2.5 rounded-xl font-bold glass hover:bg-white/10 text-white text-xs transition-all flex items-center gap-2"
            >
              <Sparkles size={14} className="text-amber-300" />
              Ask Copilot
            </button>
            <button
              onClick={() => onNavigateTab('payresolve')}
              className="bg-white text-primary px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/20 flex items-center gap-2"
            >
              <Building size={14} />
              Hostel Allocation
            </button>
          </div>
        </div>
      </div>

      {/* Critical Flagship Alert: UNILAG Conditional Offer or Success Alert (Section 10.11) */}
      {isHostelOfferActive ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 shadow-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Building size={20} className="text-orange-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  Hostel Allocation Offer Active (UNILAG Model)
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold">
                  48-Hour Countdown
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mt-0.5">
                Bedspace Allocated: {app?.allocatedSpace?.hallName} ({app?.allocatedSpace?.roomNumber})
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                You have been randomly allocated a space in balloting. You have 48 hours to either <strong className="text-foreground">Accept & Pay (₦35,000)</strong> or <strong className="text-foreground">Decline Space</strong> so it passes to the waitlist. Zero fee charged before allocation!
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('payresolve')}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-xs hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Zap size={14} />
            Accept & Pay / Review Space
            <ArrowRight size={14} />
          </button>
        </div>
      ) : isHostelConfirmed ? (
        <div className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-accent shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} className="text-accent" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent block">
                Hostel Move-In Pass Issued
              </span>
              <span className="text-sm text-foreground">
                {app?.allocatedSpace?.hallName} ({app?.allocatedSpace?.roomNumber}) is 100% cleared for move-in with Warden Key Authorization.
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('payresolve')}
            className="text-xs font-bold text-accent hover:underline flex items-center gap-1 shrink-0"
          >
            View Move-In Pass <ArrowRight size={14} />
          </button>
        </div>
      ) : null}

      {/* 4 Stat Cards Row (Section 10.1 Stat Card Pattern & Section 20 Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Cumulative GPA */}
        <div className="glass-card rounded-2xl p-5 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Award size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground font-mono">{student.currentCgpa} <span className="text-xs font-sans text-muted-foreground">/ 5.00</span></p>
            <p className="text-xs text-muted-foreground mt-0.5">Cumulative GPA (Second Class Upper)</p>
          </div>
        </div>

        {/* Earned Credits */}
        <div className="glass-card rounded-2xl p-5 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <BookOpen size={20} className="text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground font-mono">{student.totalCreditsEarned} <span className="text-xs font-sans text-muted-foreground">/ {student.requiredGraduationCredits} Units</span></p>
            <p className="text-xs text-muted-foreground mt-0.5">Degree Progress (82.6%)</p>
          </div>
        </div>

        {/* Hostel Allocation */}
        <div className="glass-card rounded-2xl p-5 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Building size={20} className="text-purple-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground truncate">
              {app?.allocatedSpace?.hallName ? 'Peter Adeniyi Hall' : 'Balloting Open'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isHostelConfirmed ? (
                <span className="text-accent font-medium">Cleared for Move-In</span>
              ) : isHostelOfferActive ? (
                <span className="text-orange-500 font-medium">48h Offer Active</span>
              ) : (
                'Free Balloting Available'
              )}
            </p>
          </div>
        </div>

        {/* Financial Standing */}
        <div className="glass-card rounded-2xl p-5 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <CreditCard size={20} className="text-blue-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">
              {student.tuitionPaid ? 'Tuition Paid' : 'Pending Fees'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Session 2024/2025 Ledger</p>
          </div>
        </div>

      </div>

      {/* 3 Pillar Quick Actions (Section 18 Quick Actions Card Pattern & Section 20 Grid) */}
      <div className="grid sm:grid-cols-3 gap-4">
        
        {/* Pillar 1: PayResolve */}
        <div 
          onClick={() => onNavigateTab('payresolve')}
          className="glass-card rounded-2xl p-5 flex items-start gap-4 hover:border-primary/40 transition-all group cursor-pointer"
        >
          <div className="bg-primary/10 text-primary p-2.5 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all shrink-0">
            <CreditCard size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">PayResolve & Hostel</p>
              <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              UNILAG-style accommodation balloting, 48-hr conditional offer & PayResolve shield.
            </p>
            <span className="inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full font-medium bg-accent/10 text-accent">
              {isHostelConfirmed ? 'Move-In Ready' : 'Active Offer'}
            </span>
          </div>
        </div>

        {/* Pillar 2: SmartPath */}
        <div 
          onClick={() => onNavigateTab('smartpath')}
          className="glass-card rounded-2xl p-5 flex items-start gap-4 hover:border-primary/40 transition-all group cursor-pointer"
        >
          <div className="bg-primary/10 text-primary p-2.5 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all shrink-0">
            <GraduationCap size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">SmartPath Auditor</p>
              <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Degree audit engine detecting missing GST 202 & prerequisite bottlenecks before graduation.
            </p>
            <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium bg-red-500/10 text-red-500">
              GST 202 Missing
            </span>
          </div>
        </div>

        {/* Pillar 3: VoiceOut */}
        <div 
          onClick={() => onNavigateTab('voiceout')}
          className="glass-card rounded-2xl p-5 flex items-start gap-4 hover:border-primary/40 transition-all group cursor-pointer"
        >
          <div className="bg-primary/10 text-primary p-2.5 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all shrink-0">
            <MessageSquareWarning size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">VoiceOut & Clusters</p>
              <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              AI natural language entity extraction & institutional macro incident clustering.
            </p>
            <span className="inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-500">
              INC-2026-H2 Active
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
