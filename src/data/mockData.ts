import { 
  StudentProfile, 
  Course, 
  StudentCourseResult, 
  PaymentTransaction, 
  PaymentCase, 
  IncidentCluster, 
  ComplaintTicket 
} from '../types';

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'std_01',
    matricNumber: 'EKSU/2021/CSC/1042',
    fullName: 'Oluwaseun Adeleke',
    department: 'Computer Science',
    faculty: 'Science',
    level: '400L',
    isFresher: false,
    currentSession: '2024/2025',
    currentSemester: 'First',
    currentCgpa: 3.48,
    totalCreditsEarned: 119,
    requiredGraduationCredits: 144,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    tuitionPaid: true,
    tuitionReceiptRef: 'RRR-1102-8841-3392',
    hostelApplication: {
      id: 'app_01',
      studentId: 'std_01',
      matricNumber: 'EKSU/2021/CSC/1042',
      studentName: 'Oluwaseun Adeleke',
      level: '400L',
      gender: 'MALE',
      appliedAt: '2026-10-18 10:14:00',
      preferredHalls: ['Prof. Peter Adeniyi Hall (Hall 2)', 'Hall 1'],
      status: 'ALLOCATED_OFFER_ACTIVE', // UNILAG MODEL: Space is allocated FIRST!
      allocatedSpace: {
        hallId: 'hall_02',
        hallName: 'Prof. Peter Adeniyi Hall (Hall 2)',
        block: 'Block B',
        roomNumber: 'Room B-14',
        bedNumber: 'Bedspace 2 (Upper Bunk)',
        feeAmount: 35000,
        gender: 'MALE'
      },
      offerExpiresAt: new Date(Date.now() + 38 * 60 * 60 * 1000).toISOString(), // 38 hours remaining
      paymentReference: 'RRR-2409-1834-9021'
    }
  },
  {
    id: 'std_02',
    matricNumber: 'EKSU/2022/ACC/0512',
    fullName: 'Blessing Chioma Eze',
    department: 'Accounting',
    faculty: 'Management Sciences',
    level: '300L',
    isFresher: false,
    currentSession: '2024/2025',
    currentSemester: 'First',
    currentCgpa: 4.12,
    totalCreditsEarned: 88,
    requiredGraduationCredits: 140,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    tuitionPaid: true,
    tuitionReceiptRef: 'RRR-9921-1200-4491',
    hostelApplication: {
      id: 'app_02',
      studentId: 'std_02',
      matricNumber: 'EKSU/2022/ACC/0512',
      studentName: 'Blessing Chioma Eze',
      level: '300L',
      gender: 'FEMALE',
      appliedAt: '2026-10-15 09:30:00',
      preferredHalls: ['Queen Moremi Hall'],
      status: 'CONFIRMED_CLEARED_FOR_MOVEIN',
      allocatedSpace: {
        hallId: 'hall_moremi',
        hallName: 'Queen Moremi Hall',
        block: 'Block A',
        roomNumber: 'Room A-08',
        bedNumber: 'Bedspace 1 (Lower Bunk)',
        feeAmount: 30000,
        gender: 'FEMALE'
      },
      paymentReference: 'RRR-8831-2910-3310',
      moveInPassCode: 'EKSU-HOSTEL-2024-419021'
    }
  }
];

export const COMPUTER_SCIENCE_CURRICULUM: Course[] = [
  // 100 Level
  { code: 'CSC 101', title: 'Introduction to Computer Science', creditUnits: 3, level: '100L', semester: 'First', isCompulsory: true },
  { code: 'MTH 101', title: 'Elementary Mathematics I (Algebra & Trig)', creditUnits: 3, level: '100L', semester: 'First', isCompulsory: true },
  { code: 'PHY 101', title: 'General Physics I (Mechanics & Heat)', creditUnits: 3, level: '100L', semester: 'First', isCompulsory: true },
  { code: 'GST 101', title: 'Use of English & Communication', creditUnits: 2, level: '100L', semester: 'First', isCompulsory: true },
  { code: 'CSC 102', title: 'Introduction to Problem Solving & Python', creditUnits: 3, level: '100L', semester: 'Second', isCompulsory: true, prerequisites: ['CSC 101'] },
  { code: 'MTH 102', title: 'Elementary Mathematics II (Calculus)', creditUnits: 3, level: '100L', semester: 'Second', isCompulsory: true, prerequisites: ['MTH 101'] },
  { code: 'GST 102', title: 'Nigerian Peoples and Culture', creditUnits: 2, level: '100L', semester: 'Second', isCompulsory: true },

  // 200 Level
  { code: 'CSC 201', title: 'Computer Programming I (Java/OOP)', creditUnits: 3, level: '200L', semester: 'First', isCompulsory: true, prerequisites: ['CSC 102'] },
  { code: 'CSC 203', title: 'Foundations of Sequential Programming', creditUnits: 3, level: '200L', semester: 'First', isCompulsory: true },
  { code: 'MTH 201', title: 'Mathematical Methods I', creditUnits: 3, level: '200L', semester: 'First', isCompulsory: true, prerequisites: ['MTH 102'] },
  { code: 'GST 201', title: 'General Studies: Peace & Conflict Studies', creditUnits: 2, level: '200L', semester: 'First', isCompulsory: true },
  { code: 'CSC 202', title: 'Data Structures and Algorithms', creditUnits: 3, level: '200L', semester: 'Second', isCompulsory: true, prerequisites: ['CSC 201'] },
  { code: 'CSC 204', title: 'Computer Architecture and Organization', creditUnits: 3, level: '200L', semester: 'Second', isCompulsory: true },
  { code: 'GST 202', title: 'Philosophy, Logic & Human Existence', creditUnits: 2, level: '200L', semester: 'Second', isCompulsory: true }, // Placed as missing in student record!

  // 300 Level
  { code: 'CSC 301', title: 'Structured Systems Analysis & Design', creditUnits: 3, level: '300L', semester: 'First', isCompulsory: true },
  { code: 'CSC 305', title: 'Theory of Automata & Computation', creditUnits: 3, level: '300L', semester: 'First', isCompulsory: true, prerequisites: ['CSC 202'] }, // Student carryover!
  { code: 'CSC 307', title: 'Database Design and Management', creditUnits: 3, level: '300L', semester: 'First', isCompulsory: true },
  { code: 'CSC 399', title: 'Students Industrial Work Experience (SIWES)', creditUnits: 6, level: '300L', semester: 'Second', isCompulsory: true },

  // 400 Level
  { code: 'CSC 401', title: 'Software Engineering Methodologies', creditUnits: 3, level: '400L', semester: 'First', isCompulsory: true, prerequisites: ['CSC 301'] },
  { code: 'CSC 403', title: 'Operating Systems Principles & Concurrency', creditUnits: 3, level: '400L', semester: 'First', isCompulsory: true },
  { code: 'CSC 411', title: 'Compiler Construction Principles', creditUnits: 3, level: '400L', semester: 'First', isCompulsory: true, prerequisites: ['CSC 305'] }, // Blocked by CSC 305!
  { code: 'CSC 415', title: 'Artificial Intelligence & Machine Learning', creditUnits: 3, level: '400L', semester: 'First', isCompulsory: false },
  { code: 'CSC 499', title: 'Final Year Capstone Research Project', creditUnits: 6, level: '400L', semester: 'Second', isCompulsory: true },
  { code: 'CSC 402', title: 'Computer Network Security & Cryptography', creditUnits: 3, level: '400L', semester: 'Second', isCompulsory: true },
];

export const INITIAL_TRANSCRIPT_RESULTS: Record<string, StudentCourseResult[]> = {
  std_01: [
    // 100L First Semester
    { courseCode: 'CSC 101', title: 'Introduction to Computer Science', creditUnits: 3, score: 74, grade: 'A', semester: 'First', session: '2021/2022', status: 'PASSED' },
    { courseCode: 'MTH 101', title: 'Elementary Mathematics I', creditUnits: 3, score: 62, grade: 'B', semester: 'First', session: '2021/2022', status: 'PASSED' },
    { courseCode: 'PHY 101', title: 'General Physics I', creditUnits: 3, score: 55, grade: 'C', semester: 'First', session: '2021/2022', status: 'PASSED' },
    { courseCode: 'GST 101', title: 'Use of English & Communication', creditUnits: 2, score: 68, grade: 'B', semester: 'First', session: '2021/2022', status: 'PASSED' },

    // 100L Second Semester
    { courseCode: 'CSC 102', title: 'Introduction to Problem Solving', creditUnits: 3, score: 81, grade: 'A', semester: 'Second', session: '2021/2022', status: 'PASSED' },
    { courseCode: 'MTH 102', title: 'Elementary Mathematics II', creditUnits: 3, score: 58, grade: 'C', semester: 'Second', session: '2021/2022', status: 'PASSED' },
    { courseCode: 'GST 102', title: 'Nigerian Peoples and Culture', creditUnits: 2, score: 64, grade: 'B', semester: 'Second', session: '2021/2022', status: 'PASSED' },

    // 200L First Semester
    { courseCode: 'CSC 201', title: 'Computer Programming I (Java)', creditUnits: 3, score: 71, grade: 'A', semester: 'First', session: '2022/2023', status: 'PASSED' },
    { courseCode: 'CSC 203', title: 'Foundations of Sequential Prog.', creditUnits: 3, score: 63, grade: 'B', semester: 'First', session: '2022/2023', status: 'PASSED' },
    { courseCode: 'MTH 201', title: 'Mathematical Methods I', creditUnits: 3, score: 50, grade: 'C', semester: 'First', session: '2022/2023', status: 'PASSED' },
    { courseCode: 'GST 201', title: 'Peace & Conflict Studies', creditUnits: 2, score: 66, grade: 'B', semester: 'First', session: '2022/2023', status: 'PASSED' },

    // 200L Second Semester
    { courseCode: 'CSC 202', title: 'Data Structures and Algorithms', creditUnits: 3, score: 77, grade: 'A', semester: 'Second', session: '2022/2023', status: 'PASSED' },
    { courseCode: 'CSC 204', title: 'Computer Architecture', creditUnits: 3, score: 61, grade: 'B', semester: 'Second', session: '2022/2023', status: 'PASSED' },
    // NOTICE: GST 202 was omitted or not written! Critical flag!

    // 300L First Semester
    { courseCode: 'CSC 301', title: 'Structured Systems Analysis', creditUnits: 3, score: 65, grade: 'B', semester: 'First', session: '2023/2024', status: 'PASSED' },
    { courseCode: 'CSC 305', title: 'Theory of Automata & Computation', creditUnits: 3, score: 38, grade: 'F', semester: 'First', session: '2023/2024', status: 'FAILED' }, // CARRYOVER!
    { courseCode: 'CSC 307', title: 'Database Design and Management', creditUnits: 3, score: 73, grade: 'A', semester: 'First', session: '2023/2024', status: 'PASSED' },

    // 300L Second Semester
    { courseCode: 'CSC 399', title: 'SIWES Industrial Training', creditUnits: 6, score: 82, grade: 'A', semester: 'Second', session: '2023/2024', status: 'PASSED' },
  ]
};

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx_hostel_01',
    reference: 'RRR-2409-1834-9021',
    studentId: 'std_01',
    matricNumber: 'EKSU/2021/CSC/1042',
    studentName: 'Oluwaseun Adeleke',
    category: 'HOSTEL_ACCOMMODATION',
    amount: 35000,
    channel: 'REMITA',
    initiatedAt: '2026-10-21 09:14:22',
    providerStatus: 'SUCCESS',
    providerPaidAt: '2026-10-21 09:16:04',
    portalStatus: 'UNPAID', // THE FLAGSHIP PROBLEM! Bank debited, portal unpaid
    discrepancyType: 'PORTAL_DESYNC_VERIFIED',
    bankNarration: 'DEBIT/NIP/REMITA-EKSU-HOSTEL/240918349021/GTB'
  },
  {
    id: 'tx_tuition_01',
    reference: 'RRR-1102-8841-3392',
    studentId: 'std_01',
    matricNumber: 'EKSU/2021/CSC/1042',
    studentName: 'Oluwaseun Adeleke',
    category: 'TUITION',
    amount: 75500,
    channel: 'REMITA',
    initiatedAt: '2026-09-12 14:20:10',
    providerStatus: 'SUCCESS',
    providerPaidAt: '2026-09-12 14:21:45',
    portalStatus: 'PAID',
    discrepancyType: 'MATCHED_SYNCED',
    bankNarration: 'DEBIT/NIP/EKSU-24-25-TUITION/110288413392'
  },
  {
    id: 'tx_faculty_01',
    reference: 'ISW-8842-1920-5512',
    studentId: 'std_01',
    matricNumber: 'EKSU/2021/CSC/1042',
    studentName: 'Oluwaseun Adeleke',
    category: 'FACULTY_DUES',
    amount: 5000,
    channel: 'INTERSWITCH',
    initiatedAt: '2026-10-02 11:05:00',
    providerStatus: 'SUCCESS',
    providerPaidAt: '2026-10-02 11:06:12',
    portalStatus: 'PAID',
    discrepancyType: 'MATCHED_SYNCED'
  }
];

export const INITIAL_CASES: PaymentCase[] = [
  {
    id: 'case_001',
    caseNumber: 'PAY-2026-00418',
    transactionId: 'tx_hostel_01',
    transaction: INITIAL_TRANSACTIONS[0],
    studentId: 'std_01',
    matricNumber: 'EKSU/2021/CSC/1042',
    category: 'HOSTEL_ACCOMMODATION',
    submittedAt: '2026-10-21 09:30:15',
    status: 'AI_VERIFIED',
    assignedTeam: 'ICT_INTEGRATION',
    priority: 'URGENT',
    aiExplanation: 'Automated gateway verification confirmed transaction RRR-2409-1834-9021 was settled for ₦35,000 via Remita at 09:16:04. EKSU portal webhook listener timed out due to concurrent server load. Student is blocked from confirming Hall 2 Room B-14. Action recommended: Push manual ledger sync and release bedspace allocation.',
    auditTrail: [
      { timestamp: '2026-10-21 09:30:15', action: 'Discrepancy reported by student', actor: 'Oluwaseun Adeleke' },
      { timestamp: '2026-10-21 09:30:18', action: 'AI Gateway Re-query executed: Remita status = SUCCESS (₦35,000)', actor: 'EKSU PayResolve AI Engine' },
      { timestamp: '2026-10-21 09:30:19', action: 'Portal Desync verified. Assigned to ICT/Bursary queue as URGENT', actor: 'System Routing' }
    ]
  }
];

export const INITIAL_INCIDENT_CLUSTERS: IncidentCluster[] = [
  {
    id: 'cluster_01',
    clusterCode: 'INC-2026-H2',
    title: 'Remita Hostel Hall 2 Webhook Timeout Spike',
    rootCauseCategory: 'GATEWAY_WEBHOOK_TIMEOUT',
    description: 'Between 09:00 AM and 11:30 AM today, Remita callback notifications for Hall 2 bedspace reservations timed out due to high concurrency. 38 students experienced bank debits while their portal status remained "UNPAID".',
    affectedCount: 38,
    firstSeenAt: '2026-10-21 09:05:00',
    lastReportedAt: '2026-10-21 11:22:40',
    severity: 'CRITICAL',
    status: 'ACTIVE_INVESTIGATION',
    affectedStudentIds: ['std_01', 'std_08', 'std_14', 'std_22'],
    suggestedAction: 'Execute batch gateway re-synchronization on all RRR references matching pattern "2409-1834-xxxx" to clear 38 ledger rows at once.'
  },
  {
    id: 'cluster_02',
    clusterCode: 'INC-2026-CSC411',
    title: 'CSC 411 Prerequisite Registration Lockout',
    rootCauseCategory: 'ACADEMIC_REGISTRATION_POLICY',
    description: '14 final-year Computer Science students unable to register CSC 411 due to automated system prerequisite enforcement on CSC 305 carryovers without advisor override.',
    affectedCount: 14,
    firstSeenAt: '2026-10-18 10:15:00',
    lastReportedAt: '2026-10-20 16:40:00',
    severity: 'MEDIUM',
    status: 'ACTIVE_INVESTIGATION',
    affectedStudentIds: ['std_01', 'std_04', 'std_09'],
    suggestedAction: 'Notify Departmental Board for concurrent waiver approval during registration window.'
  }
];

export const INITIAL_COMPLAINTS: ComplaintTicket[] = [
  {
    id: 'comp_01',
    ticketNumber: 'TKT-2026-9041',
    studentId: 'std_01',
    studentName: 'Oluwaseun Adeleke',
    matricNumber: 'EKSU/2021/CSC/1042',
    category: 'HOSTEL_ALLOCATION',
    title: 'Debited ₦35k for Hall 2 but application still showing unpaid',
    description: 'I made payment through Remita this morning around 9:15am with my GTBank app. ₦35,000 was debited and I got the alert, but when I refreshed the portal it is still saying Unpaid. Now I am scared someone else will pick Room B-14 before ICT opens.',
    submittedAt: '2026-10-21 09:30:15',
    urgency: 'CRITICAL',
    status: 'CLUSTERED',
    clusterId: 'cluster_01',
    extractedEntities: {
      serviceAffected: 'Hostel Hall 2 Room B-14',
      amountMentioned: '₦35,000',
      referenceNumber: 'RRR-2409-1834-9021'
    }
  },
  {
    id: 'comp_02',
    ticketNumber: 'TKT-2026-8910',
    studentId: 'std_02',
    studentName: 'Blessing Chioma Eze',
    matricNumber: 'EKSU/2022/ACC/0512',
    category: 'COURSE_REGISTRATION',
    title: 'Unable to add ACC 302 to approved slip',
    description: 'The add and drop portal is rejecting my attempt to register ACC 302 saying maximum credit load exceeded, but my advisor approved 24 units.',
    submittedAt: '2026-10-20 14:10:00',
    urgency: 'NORMAL',
    status: 'OPEN'
  }
];
