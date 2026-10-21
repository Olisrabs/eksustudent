export interface KnowledgeArticle {
  id: string;
  category: 'FEES_AND_PAYMENTS' | 'ACADEMIC_REGULATIONS' | 'HOSTEL_ACCOMMODATION' | 'GRADUATION_CLEARANCE';
  title: string;
  summary: string;
  officialRuleExcerpt: string;
  keywords: string[];
}

export const EKSU_KNOWLEDGE_BASE: KnowledgeArticle[] = [
  {
    id: 'kb_01',
    category: 'FEES_AND_PAYMENTS',
    title: 'Bank Debit without Portal Credit (Desynchronization Policy)',
    summary: 'What to do when Remita/Interswitch debits your bank account but the portal continues to show Unpaid status.',
    officialRuleExcerpt: 'Under EKSU Financial Circular 2024/09, all students who suffer bank debits during portal gateway timeouts must allow up to 2 hours for automated settlement webhook reconciliation. If portal status remains Unpaid after 2 hours, students are protected against late registration penalties provided their Remita RRR or Bank Transaction Reference was generated prior to the published deadline. Duplicate payments made out of panic are subject to a 6-week administrative audit before refund approval.',
    keywords: ['debit', 'unpaid', 'remita', 'rrr', 'hostel fee', 'tuition', 'interswitch', 'refund', 'bank alert']
  },
  {
    id: 'kb_02',
    category: 'ACADEMIC_REGULATIONS',
    title: 'Compulsory General Studies (GST) & Graduation Requirements',
    summary: 'Every undergraduate student must pass all university-mandated GST courses prior to convocation clearance.',
    officialRuleExcerpt: 'As stipulated in the EKSU Academic Handbook Section 4.2, GST 101, 102, 201, and 202 are university-wide compulsory requirements. A student who attains the requisite departmental credit threshold (144 units for 4-year programmes) but possesses an outstanding or uncredited GST course shall NOT be mobilized for the National Youth Service Corps (NYSC) nor awarded a degree until the deficiency is remedied in the subsequent academic session.',
    keywords: ['gst', 'compulsory', 'graduation', 'clearance', 'nysc', 'carryover', 'delay', 'philosophy']
  },
  {
    id: 'kb_03',
    category: 'ACADEMIC_REGULATIONS',
    title: 'Prerequisite Course Policy & Carryover Priority',
    summary: 'Guidelines on registering advanced 300L/400L courses when 100L/200L prerequisites remain failed.',
    officialRuleExcerpt: 'Senate Regulation 2022/18 mandates that students with carryover courses must prioritize registering failed courses over higher-level electives or new courses. Furthermore, no student may register for an advanced course (such as CSC 411) without having obtained at least an E grade in the prerequisite course (CSC 305), unless a formal waiver is approved in writing by the Departmental Board of Examiners.',
    keywords: ['prerequisite', 'carryover', 'csc 305', 'csc 411', 'maximum credit', 'waiver', 'head of department']
  },
  {
    id: 'kb_04',
    category: 'HOSTEL_ACCOMMODATION',
    title: 'Bedspace Allocation Lockout & Payment Confirmation',
    summary: 'Procedure for securing allocated bedspaces in Hall 1, Hall 2, and Moremi Hall.',
    officialRuleExcerpt: 'Bedspace reservations generated on the portal are held in temporary escrow for a maximum of 48 hours. If payment verification via the approved gateway is not confirmed into the university designated account within this window, the reserved space will automatically be released back to the general balloting pool. Where payment succeeded but portal verification stalled, submission of the verified RRR halts automatic release.',
    keywords: ['hostel', 'hall 2', 'peter adeniyi', 'moremi', 'bedspace', 'balloting', 'room allocation', 'escrow']
  },
  {
    id: 'kb_05',
    category: 'GRADUATION_CLEARANCE',
    title: 'Final Year Pre-Clearance and Transcript Reconciliation',
    summary: 'Verification of course unit totals, senate approval, and bursary financial clearance.',
    officialRuleExcerpt: 'Final year clearance requires endorsement from three distinct arms: (1) Departmental Examination Officer (verifying complete 100L-400L course forms and zero outstanding carryovers), (2) Faculty Officer, and (3) Bursary Student Accounts (confirming no un-reconciled fee receipts from 100L to final year).',
    keywords: ['final year', 'clearance', 'bursary clearance', 'transcript', 'senate', 'convocation']
  }
];
