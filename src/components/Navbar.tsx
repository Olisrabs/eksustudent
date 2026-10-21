import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Bell, 
  ShieldCheck, 
  AlertTriangle, 
  Building2, 
  GraduationCap, 
  Key, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { StudentProfile, Role, PaymentTransaction } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { AIService } from '../services/aiService';

interface NavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  activeStudent: StudentProfile;
  transactions: PaymentTransaction[];
  onResetData: () => void;
  onToggleMobileMenu?: () => void;
  activeTabTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeStudent,
  transactions,
  onResetData,
  onToggleMobileMenu,
  activeTabTitle
}) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(localStorage.getItem('eksu_gemini_api_key') || '');
  const [isSaved, setIsSaved] = useState(false);

  const isStaff = currentRole !== 'STUDENT';
  const activeDiscrepancy = transactions.find(t => t.discrepancyType === 'PORTAL_DESYNC_VERIFIED');
  const alertCount = activeDiscrepancy ? 1 : 0;

  const handleSaveKey = () => {
    AIService.setApiKey(apiKeyInput);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setShowKeyModal(false);
    }, 1200);
  };

  return (
    <>
      <header className="lg:pl-64 fixed top-0 left-0 right-0 z-30 border-b border-border bg-background/95 backdrop-blur-2xl">
        <div className="flex items-center justify-between px-4 sm:px-6 h-16">
          
          {/* Left: Mobile Hamburger & Page Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              aria-label="Toggle mobile navigation menu"
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                {activeTabTitle}
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                  Assurance Layer
                </span>
              </h1>
            </div>
          </div>

          {/* Right: Actions, Badges, Role Switcher, Theme Toggle, Avatar */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Live Role Badge (Section 17) */}
            <button
              onClick={() => onRoleChange(isStaff ? 'STUDENT' : 'STAFF_BURSARY')}
              title="Click to toggle perspective between Student and Staff"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                isStaff
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-primary/20 text-primary border border-primary/30'
              }`}
            >
              {isStaff ? (
                <>
                  <Building2 size={14} />
                  <span className="hidden sm:inline">Bursary & ICT Admin</span>
                  <span className="sm:hidden">Staff</span>
                </>
              ) : (
                <>
                  <GraduationCap size={14} />
                  <span className="hidden sm:inline">Student View</span>
                  <span className="sm:hidden">Student</span>
                </>
              )}
            </button>

            {/* Notification Bell with Badge Pop Animation (Section 11.3) */}
            <div className="relative">
              <button
                onClick={() => onRoleChange('STAFF_BURSARY')}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <AnimatePresence>
                  {alertCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
                    >
                      {alertCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* AI Key Configuration */}
            <button
              onClick={() => setShowKeyModal(true)}
              title="Configure Gemini API"
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              <Key size={18} />
            </button>

            {/* Quick Demo Reset */}
            <button
              onClick={onResetData}
              title="Reset Demo Data"
              className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <RefreshCw size={18} />
            </button>

            {/* Theme Toggle Button (Section 16) */}
            <ThemeToggle />

            {/* Avatar Initial (Section 10.13) */}
            <div 
              title={`${activeStudent.fullName} (${activeStudent.matricNumber})`}
              className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm cursor-pointer shadow-sm hover:scale-105 transition-transform"
            >
              {activeStudent.fullName ? activeStudent.fullName[0].toUpperCase() : 'O'}
            </div>

          </div>
        </div>
      </header>

      {/* Gemini AI Key Modal matching Section 10.6 Modal pattern */}
      <AnimatePresence>
        {showKeyModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowKeyModal(false)}
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
                    <Sparkles className="text-primary" size={20} />
                    Configure AI Intelligence
                  </h3>
                  <button
                    onClick={() => setShowKeyModal(false)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  EKSU Assurance Hub includes a built-in semantic engine that operates client-side with zero latency. Enter a Google Gemini API key to query external live endpoints:
                </p>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1 font-medium">
                    Google Gemini API Key
                  </label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="input"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowKeyModal(false)}
                    className="px-4 py-2.5 rounded-xl font-bold glass hover:bg-white/5 transition-all text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveKey}
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                  >
                    {isSaved ? 'Saved!' : 'Save Key'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
