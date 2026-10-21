import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { OverviewDashboard } from './components/Dashboard/OverviewDashboard';
import { PaymentDashboard } from './components/PaymentResolver/PaymentDashboard';
import { AuditOverview } from './components/AcademicAuditor/AuditOverview';
import { ComplaintFeed } from './components/ComplaintHub/ComplaintFeed';
import { StaffConsole } from './components/StaffOperations/StaffConsole';
import { ChatDrawer } from './components/AICopilot/ChatDrawer';
import { ReceiptViewerModal } from './components/PaymentResolver/ReceiptViewerModal';
import { ReportDiscrepancyModal } from './components/PaymentResolver/ReportDiscrepancyModal';
import { AppStorage } from './services/storage';
import { Role, PaymentTransaction } from './types';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<Role>(AppStorage.getCurrentRole());
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Data State
  const [student, setStudent] = useState(AppStorage.getActiveStudent());
  const [transactions, setTransactions] = useState(AppStorage.getTransactions());
  const [cases, setCases] = useState(AppStorage.getCases());
  const [clusters, setClusters] = useState(AppStorage.getClusters());
  const [complaints, setComplaints] = useState(AppStorage.getComplaints());
  const [transcripts, setTranscripts] = useState(AppStorage.getTranscripts());

  // Modals
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<PaymentTransaction | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Initialize dark mode default as per layout.md
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const refreshData = () => {
    setStudent(AppStorage.getActiveStudent());
    setTransactions(AppStorage.getTransactions());
    setCases(AppStorage.getCases());
    setClusters(AppStorage.getClusters());
    setComplaints(AppStorage.getComplaints());
    setTranscripts(AppStorage.getTranscripts());
  };

  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    AppStorage.setCurrentRole(role);
    if (role === 'STAFF_BURSARY') {
      setActiveTab('staff');
    } else {
      setActiveTab('overview');
    }
  };

  const handleResetData = () => {
    AppStorage.resetToDefaults();
    refreshData();
    setActiveTab('overview');
  };

  const activeDiscrepancy = transactions.find(t => t.discrepancyType === 'PORTAL_DESYNC_VERIFIED');
  const activeStudentResults = transcripts[student.id] || transcripts['std_01'];

  const tabTitles: Record<TabType, string> = {
    overview: 'Hub Overview',
    payresolve: 'PayResolve & Hostel Shield',
    smartpath: 'SmartPath Degree Audit',
    voiceout: 'VoiceOut Incident Intelligence',
    staff: 'Bursary & ICT Operations Console',
    copilot: 'EKSU SmartPath Copilot'
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground font-sans">
      
      {/* Desktop Fixed Sidebar & Mobile Drawer (Section 11.2 & 11.4) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentRole={currentRole}
        hasUnresolvedPayment={Boolean(activeDiscrepancy)}
        hasCriticalAcademicRisk={true}
        activeTicketCount={complaints.filter(c => c.status === 'OPEN').length}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Topbar with lg:pl-64 fixed offset (Section 11.3) */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeStudent={student}
        transactions={transactions}
        onResetData={handleResetData}
        onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        activeTabTitle={tabTitles[activeTab]}
      />

      {/* Main Content Area matching Section 12 Layout Structure: <main lg:pl-64 pt-16> */}
      <main className="lg:pl-64 pt-16 min-h-screen flex flex-col justify-between">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
          {activeTab === 'overview' && (
            <OverviewDashboard
              student={student}
              transactions={transactions}
              results={activeStudentResults}
              cases={cases}
              onNavigateTab={setActiveTab}
              onOpenReportModal={() => setShowReportModal(true)}
            />
          )}

          {activeTab === 'payresolve' && (
            <PaymentDashboard
              student={student}
              transactions={transactions}
              cases={cases}
              onDataUpdated={refreshData}
              onOpenReportModal={() => setShowReportModal(true)}
              onViewReceipt={(tx) => setSelectedReceiptTx(tx)}
            />
          )}

          {activeTab === 'smartpath' && (
            <AuditOverview
              student={student}
              results={activeStudentResults}
            />
          )}

          {activeTab === 'voiceout' && (
            <ComplaintFeed
              student={student}
              complaints={complaints}
              clusters={clusters}
              onDataUpdated={refreshData}
            />
          )}

          {activeTab === 'staff' && (
            <StaffConsole
              cases={cases}
              clusters={clusters}
              student={student}
              onDataUpdated={refreshData}
            />
          )}

          {activeTab === 'copilot' && (
            <ChatDrawer
              student={student}
              activeDiscrepancy={activeDiscrepancy}
            />
          )}
        </div>

        {/* Footer (Section 15) */}
        <footer className="bg-card/50 border-t border-border mt-12 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div>
              © {new Date().getFullYear()} Ekiti State University (EKSU), Ado-Ekiti · Student Assurance Hub.
            </div>
            <div className="flex items-center gap-4">
              <span>UNILAG Balloting Model</span>
              <span>·</span>
              <span>Senate Regulation §4.2</span>
              <span>·</span>
              <span className="text-primary font-medium">PayResolve Shield</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Modals */}
      {selectedReceiptTx && (
        <ReceiptViewerModal
          transaction={selectedReceiptTx}
          student={student}
          onClose={() => setSelectedReceiptTx(null)}
        />
      )}

      {showReportModal && (
        <ReportDiscrepancyModal
          student={student}
          onClose={() => setShowReportModal(false)}
          onSuccess={() => {
            setShowReportModal(false);
            refreshData();
          }}
        />
      )}
    </div>
  );
};

export default App;
