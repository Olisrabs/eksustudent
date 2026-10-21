import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  CreditCard, 
  GraduationCap, 
  MessageSquareWarning, 
  Bot, 
  Building2, 
  ChevronRight,
  Sparkles,
  X,
  ShieldCheck
} from 'lucide-react';
import { Role } from '../types';

export type TabType = 'overview' | 'payresolve' | 'smartpath' | 'voiceout' | 'staff' | 'copilot';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  currentRole: Role;
  hasUnresolvedPayment: boolean;
  hasCriticalAcademicRisk: boolean;
  activeTicketCount: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  hasUnresolvedPayment,
  hasCriticalAcademicRisk,
  activeTicketCount,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const studentNavItems = [
    {
      id: 'overview' as TabType,
      label: 'Hub Overview',
      icon: LayoutDashboard,
      desc: 'Unified Dashboard'
    },
    {
      id: 'payresolve' as TabType,
      label: 'PayResolve',
      icon: CreditCard,
      desc: 'Hostel & Fee Shield',
      badge: hasUnresolvedPayment ? 'Offer Active' : undefined,
      badgeColor: 'bg-orange-500/10 text-orange-500'
    },
    {
      id: 'smartpath' as TabType,
      label: 'SmartPath',
      icon: GraduationCap,
      desc: 'Degree & Risk Auditor',
      badge: hasCriticalAcademicRisk ? 'Alert' : undefined,
      badgeColor: 'bg-red-500/10 text-red-500'
    },
    {
      id: 'voiceout' as TabType,
      label: 'VoiceOut',
      icon: MessageSquareWarning,
      desc: 'Complaints & Clusters',
      badge: activeTicketCount > 0 ? `${activeTicketCount}` : undefined,
      badgeColor: 'bg-blue-500/10 text-blue-500'
    },
    {
      id: 'copilot' as TabType,
      label: 'EKSU Copilot',
      icon: Bot,
      desc: 'Onboarding & AI Guide',
      badge: 'Grounded',
      badgeColor: 'bg-accent/10 text-accent'
    }
  ];

  const staffNavItems = [
    {
      id: 'staff' as TabType,
      label: 'Staff Ops Console',
      icon: Building2,
      desc: 'Bursary & ICT Queue',
      badge: hasUnresolvedPayment ? 'Action' : 'Clear',
      badgeColor: hasUnresolvedPayment ? 'bg-orange-500/10 text-orange-500 animate-pulse' : 'bg-accent/10 text-accent'
    },
    {
      id: 'overview' as TabType,
      label: 'Student Perspective',
      icon: LayoutDashboard,
      desc: 'Switch view'
    },
    {
      id: 'payresolve' as TabType,
      label: 'Gateway Transactions',
      icon: CreditCard,
      desc: 'Ledger Audit'
    },
    {
      id: 'voiceout' as TabType,
      label: 'Incident Heatmap',
      icon: MessageSquareWarning,
      desc: 'Macro Clusters'
    }
  ];

  const items = currentRole === 'STUDENT' ? studentNavItems : staffNavItems;

  const renderNavContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand Logo Header (Section 11.2 & 13.5 Logo Hover Spin) */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 180 }} 
            transition={{ duration: 0.3 }}
            className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black text-sm shadow-sm cursor-pointer"
          >
            EK
          </motion.div>
          <div>
            <span className="font-bold text-lg tracking-tight text-gradient block leading-none">
              EKSU Portal
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
              Assurance Hub
            </span>
          </div>
        </div>

        {onCloseMobile && (
          <button 
            onClick={onCloseMobile} 
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative group text-left ${
                isActive
                  ? 'text-primary-foreground shadow-lg shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              {/* Framer Motion Sliding Pill (Section 11.2) */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary rounded-xl"
                  transition={{ type: "spring", bounce: 0.2 }}
                />
              )}

              <Icon size={18} className="relative z-10 shrink-0" />
              <div className="relative z-10 min-w-0 flex-1">
                <span className="block truncate font-semibold">{item.label}</span>
                <span className="block text-[10px] opacity-70 truncate hidden sm:block">
                  {item.desc}
                </span>
              </div>

              {item.badge && (
                <span className={`relative z-10 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}

              {isActive && (
                <ChevronRight size={14} className="relative z-10 ml-auto opacity-70" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="glass-card rounded-2xl p-3 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <ShieldCheck size={14} className="text-accent" />
            <span>UNILAG Balloting Model</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Zero upfront payment. Allocation before settlement.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar (Section 11.2) */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-border bg-card/50 backdrop-blur-xl z-40">
        {renderNavContent()}
      </aside>

      {/* Mobile Drawer (Section 11.4) */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border z-50 flex flex-col shadow-2xl"
            >
              {renderNavContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
