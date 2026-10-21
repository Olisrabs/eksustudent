import { 
  StudentProfile, 
  PaymentTransaction, 
  PaymentCase, 
  IncidentCluster, 
  ComplaintTicket, 
  StudentCourseResult,
  Role
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_CASES, 
  INITIAL_INCIDENT_CLUSTERS, 
  INITIAL_COMPLAINTS, 
  INITIAL_TRANSCRIPT_RESULTS 
} from '../data/mockData';

const STORAGE_KEYS = {
  CURRENT_USER_ROLE: 'eksu_current_role',
  ACTIVE_STUDENT_ID: 'eksu_active_student_id',
  STUDENTS: 'eksu_students_data',
  TRANSACTIONS: 'eksu_transactions_data',
  CASES: 'eksu_cases_data',
  CLUSTERS: 'eksu_clusters_data',
  COMPLAINTS: 'eksu_complaints_data',
  TRANSCRIPTS: 'eksu_transcripts_data',
};

export class AppStorage {
  public static getCurrentRole(): Role {
    const role = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ROLE);
    return (role as Role) || 'STUDENT';
  }

  public static setCurrentRole(role: Role) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ROLE, role);
  }

  public static getActiveStudentId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT_ID) || 'std_01';
  }

  public static setActiveStudentId(id: string) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT_ID, id);
  }

  public static getStudents(): StudentProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return raw ? JSON.parse(raw) : INITIAL_STUDENTS;
  }

  public static getActiveStudent(): StudentProfile {
    const students = this.getStudents();
    const activeId = this.getActiveStudentId();
    return students.find(s => s.id === activeId) || students[0];
  }

  public static getTransactions(): PaymentTransaction[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return raw ? JSON.parse(raw) : INITIAL_TRANSACTIONS;
  }

  public static getCases(): PaymentCase[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CASES);
    return raw ? JSON.parse(raw) : INITIAL_CASES;
  }

  public static getClusters(): IncidentCluster[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CLUSTERS);
    return raw ? JSON.parse(raw) : INITIAL_INCIDENT_CLUSTERS;
  }

  public static getComplaints(): ComplaintTicket[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    return raw ? JSON.parse(raw) : INITIAL_COMPLAINTS;
  }

  public static getTranscripts(): Record<string, StudentCourseResult[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSCRIPTS);
    return raw ? JSON.parse(raw) : INITIAL_TRANSCRIPT_RESULTS;
  }

  /**
   * The Flagship Action: Reconcile Payment and Live-Sync EKSU Portal Status!
   */
  public static reconcilePayment(reference: string, staffName: string = 'Engr. J. Ogundele (Bursary Systems)'): {
    success: boolean;
    transaction: PaymentTransaction;
  } {
    const transactions = this.getTransactions();
    const cases = this.getCases();
    const students = this.getStudents();

    const txIndex = transactions.findIndex(t => t.reference.toUpperCase() === reference.toUpperCase());
    if (txIndex === -1) {
      throw new Error(`Transaction with reference ${reference} not found.`);
    }

    const tx = transactions[txIndex];
    tx.portalStatus = 'PAID';
    tx.discrepancyType = 'MATCHED_SYNCED';

    // Update Case
    const caseIndex = cases.findIndex(c => c.transaction.reference.toUpperCase() === reference.toUpperCase());
    if (caseIndex !== -1) {
      cases[caseIndex].status = 'RESOLVED_PORTAL_UPDATED';
      cases[caseIndex].resolvedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      cases[caseIndex].resolvedBy = staffName;
      cases[caseIndex].auditTrail.push({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        action: `Payment reference ${reference} reconciled. EKSU Student Portal ledger marked as PAID. Official receipt issued.`,
        actor: staffName
      });
    }

    // Unlock student hostel or fee services
    const studentIndex = students.findIndex(s => s.id === tx.studentId);
    if (studentIndex !== -1 && (tx.category === 'HOSTEL_ACCOMMODATION' as any || tx.category === 'HOSTEL_ALLOCATION_FEE')) {
      students[studentIndex].hostelApplication.status = 'CONFIRMED_CLEARED_FOR_MOVEIN';
      students[studentIndex].hostelApplication.moveInPassCode = `EKSU-HOSTEL-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    // Save to storage
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));

    return {
      success: true,
      transaction: tx
    };
  }

  /**
   * UNILAG Model: Accept Allocated Bedspace & Trigger Payment Clearance
   */
  public static acceptAndPayHostel(studentId: string, reference: string = 'RRR-2409-1834-9021'): {
    success: boolean;
    student: StudentProfile;
  } {
    return this.reconcilePayment(reference, 'Student Direct Gateway Clearance (UNILAG Model)') as any;
  }

  /**
   * UNILAG Model: Reject / Decline Allocated Space -> Immediately release to waitlist!
   */
  public static rejectHostelSpace(studentId: string, reason: string = 'Opted for private off-campus accommodation'): {
    success: boolean;
    student: StudentProfile;
  } {
    const students = this.getStudents();
    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) throw new Error('Student not found');

    const std = students[studentIndex];
    std.hostelApplication.status = 'REJECTED_BY_STUDENT';
    std.hostelApplication.rejectionReason = reason;

    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    return { success: true, student: std };
  }


  /**
   * Batch Reconcile an Incident Cluster
   */
  public static batchReconcileCluster(clusterId: string, staffName: string = 'Dr. K. Aremu (Director ICT)'): {
    affectedCount: number;
  } {
    const clusters = this.getClusters();
    const transactions = this.getTransactions();
    const students = this.getStudents();
    const cases = this.getCases();

    const clusterIndex = clusters.findIndex(c => c.id === clusterId);
    if (clusterIndex === -1) return { affectedCount: 0 };

    const cluster = clusters[clusterIndex];
    cluster.status = 'RESOLVED_IN_BATCH';

    // Auto-resolve any matching open transactions
    transactions.forEach(tx => {
      if (tx.category === 'HOSTEL_ACCOMMODATION' && tx.portalStatus === 'UNPAID') {
        tx.portalStatus = 'PAID';
        tx.discrepancyType = 'MATCHED_SYNCED';
      }
    });

    cases.forEach(c => {
      if (c.category === 'HOSTEL_ACCOMMODATION' && c.status !== 'RESOLVED_PORTAL_UPDATED') {
        c.status = 'RESOLVED_PORTAL_UPDATED';
        c.resolvedAt = new Date().toISOString();
        c.resolvedBy = staffName;
        c.auditTrail.push({
          timestamp: new Date().toISOString(),
          action: `Batch reconciliation triggered via Cluster ${cluster.clusterCode}. All ${cluster.affectedCount} impacted records updated on EKSU ledger.`,
          actor: staffName
        });
      }
    });

    students.forEach(s => {
      if (s.hostelApplication && s.hostelApplication.status === 'ALLOCATED_OFFER_ACTIVE') {
        s.hostelApplication.status = 'CONFIRMED_CLEARED_FOR_MOVEIN';
        s.hostelApplication.moveInPassCode = `EKSU-HOSTEL-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      }
    });

    localStorage.setItem(STORAGE_KEYS.CLUSTERS, JSON.stringify(clusters));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));

    return { affectedCount: cluster.affectedCount };
  }

  /**
   * Submit a new payment discrepancy report
   */
  public static addPaymentDiscrepancy(
    student: StudentProfile,
    data: {
      reference: string;
      category: PaymentTransaction['category'];
      amount: number;
      channel: PaymentTransaction['channel'];
      bankNarration?: string;
    }
  ): { transaction: PaymentTransaction; paymentCase: PaymentCase } {
    const transactions = this.getTransactions();
    const cases = this.getCases();

    const newTx: PaymentTransaction = {
      id: `tx_${Date.now()}`,
      reference: data.reference.toUpperCase(),
      studentId: student.id,
      matricNumber: student.matricNumber,
      studentName: student.fullName,
      category: data.category,
      amount: data.amount,
      channel: data.channel,
      initiatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      providerStatus: 'SUCCESS',
      providerPaidAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      portalStatus: 'UNPAID',
      discrepancyType: 'PORTAL_DESYNC_VERIFIED',
      bankNarration: data.bankNarration || `DEBIT/NIP/${data.channel}/${data.reference}`
    };

    const newCase: PaymentCase = {
      id: `case_${Date.now()}`,
      caseNumber: `PAY-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      transactionId: newTx.id,
      transaction: newTx,
      studentId: student.id,
      matricNumber: student.matricNumber,
      category: data.category,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'AI_VERIFIED',
      assignedTeam: data.category === 'HOSTEL_ACCOMMODATION' ? 'HOSTEL_ADMIN' : 'ICT_INTEGRATION',
      priority: 'URGENT',
      aiExplanation: `Student reported debit of ₦${data.amount.toLocaleString()} on reference ${data.reference}. AI gateway query matched settlement. Portal webhook desynchronization verified.`,
      auditTrail: [
        {
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          action: 'Discrepancy submitted and verified by AI engine',
          actor: student.fullName
        }
      ]
    };

    transactions.unshift(newTx);
    cases.unshift(newCase);

    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));

    return { transaction: newTx, paymentCase: newCase };
  }

  /**
   * Add a new complaint
   */
  public static addComplaint(student: StudentProfile, title: string, description: string): ComplaintTicket {
    const complaints = this.getComplaints();
    const newComplaint: ComplaintTicket = {
      id: `comp_${Date.now()}`,
      ticketNumber: `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: student.id,
      studentName: student.fullName,
      matricNumber: student.matricNumber,
      category: description.toLowerCase().includes('hostel') ? 'HOSTEL_ALLOCATION' : 'PAYMENT_DISCREPANCY',
      title,
      description,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      urgency: 'HIGH',
      status: 'OPEN'
    };

    complaints.unshift(newComplaint);
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    return newComplaint;
  }

  /**
   * Reset all data back to the clean initial demo state
   */
  public static resetToDefaults() {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.CASES);
    localStorage.removeItem(STORAGE_KEYS.CLUSTERS);
    localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(STORAGE_KEYS.TRANSCRIPTS);
  }
}
