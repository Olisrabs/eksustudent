export type Role = 'STUDENT' | 'STAFF_BURSARY' | 'STAFF_ICT' | 'STAFF_HOSTEL';

export type HostelLifecycleStage = 
  | 'NOT_ELIGIBLE'                 // Tuition not paid or disciplinary hold
  | 'ELIGIBLE_NOT_APPLIED'         // Can apply for balloting
  | 'APPLICATION_SUBMITTED'        // Applied within window, waiting for ballot
  | 'BALLOT_UNSUCCESSFUL_WAITLIST' // Ballot ran, not selected, on waitlist (₦0 spent!)
  | 'ALLOCATED_OFFER_ACTIVE'       // Space allocated! 48-hr countdown to Accept & Pay or Reject
  | 'PAYMENT_PROCESSING_PROTECTED' // PayResolve shield active during gateway settlement
  | 'CONFIRMED_CLEARED_FOR_MOVEIN' // Paid, Move-in pass & Hall Warden slip generated!
  | 'REJECTED_BY_STUDENT'          // Student declined space, released to waitlist
  | 'OFFER_EXPIRED';               // 48 hours passed without payment, forfeited

export interface HostelBedspace {
  hallId: string;
  hallName: string;
  block: string;
  roomNumber: string;
  bedNumber: string;
  feeAmount: number;
  gender: 'MALE' | 'FEMALE';
}

export interface HostelApplication {
  id: string;
  studentId: string;
  matricNumber: string;
  studentName: string;
  level: string;
  gender: 'MALE' | 'FEMALE';
  appliedAt: string;
  preferredHalls: string[];
  status: HostelLifecycleStage;
  allocatedSpace?: HostelBedspace;
  offerExpiresAt?: string; // 48-hour deadline
  rejectionReason?: string;
  paymentReference?: string;
  moveInPassCode?: string;
}

export interface StudentProfile {
  id: string;
  matricNumber: string;
  fullName: string;
  department: string;
  faculty: string;
  level: '100L' | '200L' | '300L' | '400L' | '500L';
  isFresher: boolean; // 100L or Direct Entry
  currentSession: string;
  currentSemester: 'First' | 'Second';
  currentCgpa: number;
  totalCreditsEarned: number;
  requiredGraduationCredits: number;
  avatarUrl?: string;
  tuitionPaid: boolean;
  tuitionReceiptRef?: string;
  hostelApplication: HostelApplication;
}

export type CourseStatus = 'PASSED' | 'FAILED' | 'OUTSTANDING' | 'REGISTERED' | 'NOT_TAKEN';

export interface Course {
  code: string;
  title: string;
  creditUnits: number;
  level: '100L' | '200L' | '300L' | '400L';
  semester: 'First' | 'Second';
  isCompulsory: boolean;
  prerequisites?: string[];
}

export interface StudentCourseResult {
  courseCode: string;
  title: string;
  creditUnits: number;
  score?: number;
  grade?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  semester: 'First' | 'Second';
  session: string;
  status: CourseStatus;
}

export interface AcademicAuditReport {
  studentId: string;
  totalCreditsEarned: number;
  totalCreditsRequired: number;
  currentCgpa: number;
  passedCompulsoryCount: number;
  totalCompulsoryCount: number;
  missingCompulsoryCourses: Course[];
  carryovers: StudentCourseResult[];
  prerequisiteConflicts: {
    targetCourse: Course;
    blockedBy: string;
  }[];
  isEligibleForFinalYearProject: boolean;
  isAtRiskOfDelay: boolean;
  riskSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  aiAnalysisSummary: string;
  recommendedPathway: {
    semester: string;
    recommendedCourses: Course[];
    totalUnits: number;
    advisoryNote: string;
  }[];
}

export type PaymentCategory = 
  | 'HOSTEL_ALLOCATION_FEE' 
  | 'HOSTEL_ACCOMMODATION' 
  | 'TUITION' 
  | 'ACCEPTANCE_FEE' 
  | 'FACULTY_DUES' 
  | 'LATE_REGISTRATION';
export type ProviderGateway = 'REMITA' | 'INTERSWITCH' | 'PAYSTACK' | 'DIRECT_BANK_NIBSS';

export type DiscrepancyClassification = 
  | 'MATCHED_SYNCED'
  | 'PORTAL_DESYNC_VERIFIED'
  | 'GATEWAY_PENDING'
  | 'AMOUNT_MISMATCH'
  | 'INVALID_REFERENCE'
  | 'ALREADY_CLAIMED';

export type CaseStatus = 
  | 'SUBMITTED' 
  | 'AI_VERIFIED' 
  | 'QUEUED_FOR_STAFF' 
  | 'RESOLVED_PORTAL_UPDATED' 
  | 'REJECTED';

export interface PaymentTransaction {
  id: string;
  reference: string;
  studentId: string;
  matricNumber: string;
  studentName: string;
  category: PaymentCategory;
  amount: number;
  channel: ProviderGateway;
  initiatedAt: string;
  providerStatus: 'SUCCESS' | 'PENDING' | 'FAILED';
  providerPaidAt?: string;
  portalStatus: 'PAID' | 'UNPAID';
  discrepancyType: DiscrepancyClassification;
  proofDocumentUrl?: string;
  bankNarration?: string;
  bedspaceDetails?: string;
}

export interface PaymentCase {
  id: string;
  caseNumber: string;
  transactionId: string;
  transaction: PaymentTransaction;
  studentId: string;
  matricNumber: string;
  category: PaymentCategory;
  submittedAt: string;
  status: CaseStatus;
  assignedTeam: 'BURSARY_FINANCE' | 'ICT_INTEGRATION' | 'HOSTEL_ADMIN';
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  aiExplanation: string;
  staffNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  auditTrail: {
    timestamp: string;
    action: string;
    actor: string;
  }[];
}

export type ComplaintCategory = 'PAYMENT_DISCREPANCY' | 'HOSTEL_ALLOCATION' | 'COURSE_REGISTRATION' | 'RESULT_MISSING' | 'PORTAL_TIMEOUT' | 'OTHER';

export interface ComplaintTicket {
  id: string;
  ticketNumber: string;
  studentId: string;
  studentName: string;
  matricNumber: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  submittedAt: string;
  urgency: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'INVESTIGATING' | 'CLUSTERED' | 'RESOLVED';
  clusterId?: string;
  extractedEntities?: {
    serviceAffected?: string;
    amountMentioned?: string;
    referenceNumber?: string;
  };
}

export interface IncidentCluster {
  id: string;
  clusterCode: string;
  title: string;
  rootCauseCategory: string;
  description: string;
  affectedCount: number;
  firstSeenAt: string;
  lastReportedAt: string;
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE_INVESTIGATION' | 'GATEWAY_FIX_IN_PROGRESS' | 'RESOLVED_IN_BATCH';
  affectedStudentIds: string[];
  suggestedAction: string;
}
