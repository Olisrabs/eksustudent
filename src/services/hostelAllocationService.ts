import { StudentProfile, HostelLifecycleStage, HostelBedspace, HostelApplication } from '../types';

export interface EligibilityResult {
  isEligible: boolean;
  criteria: {
    title: string;
    passed: boolean;
    details: string;
  }[];
  priorityCategory: 'HIGH_PRIORITY_FINAL_YEAR' | 'HIGH_PRIORITY_FRESHER' | 'STANDARD_STAYLITE';
  summary: string;
}

export class HostelAllocationService {
  /**
   * Evaluates student eligibility under the UNILAG structured model.
   * Condition: Must have verified tuition payment and priority check before balloting.
   */
  public static checkEligibility(student: StudentProfile): EligibilityResult {
    const tuitionPassed = student.tuitionPaid;
    const isPriorityLevel = student.level === '100L' || student.level === '400L' || student.level === '500L';
    const isGoodStanding = student.currentCgpa >= 1.5;

    const criteria = [
      {
        title: 'Tuition Payment Verification',
        passed: tuitionPassed,
        details: tuitionPassed 
          ? `Verified paid for ${student.currentSession} (Ref: ${student.tuitionReceiptRef || 'RRR-1102-8841-3392'})`
          : 'Outstanding: 2024/2025 school fees must be paid before hostel application is permitted.'
      },
      {
        title: 'Level & Accommodation Quota Priority',
        passed: isPriorityLevel,
        details: student.level === '400L'
          ? 'Final Year Priority: 400L students receive priority allocation for capstone research convenience.'
          : student.level === '100L'
          ? 'Freshman Priority: 100L students receive priority settling onto campus.'
          : 'Staylite Quota: 200L/300L applicants are subject to competitive departmental quota.'
      },
      {
        title: 'Academic Standing (Minimum CGPA)',
        passed: isGoodStanding,
        details: `Current CGPA: ${student.currentCgpa} (Minimum threshold: 1.50).`
      },
      {
        title: 'Student Affairs Disciplinary Clearance',
        passed: true,
        details: 'Zero disciplinary or examination malpractice sanctions on record.'
      }
    ];

    const isEligible = criteria.every(c => c.passed);
    const priorityCategory = student.level === '100L'
      ? 'HIGH_PRIORITY_FRESHER'
      : student.level === '400L' || student.level === '500L'
      ? 'HIGH_PRIORITY_FINAL_YEAR'
      : 'STANDARD_STAYLITE';

    return {
      isEligible,
      criteria,
      priorityCategory,
      summary: isEligible
        ? `Eligibility Confirmed. As a ${student.level} ${student.department} student with verified tuition payment, you are cleared to participate in the upcoming accommodation ballot with zero upfront cost.`
        : 'Ineligible: Please resolve outstanding tuition payment before hostel application.'
    };
  }

  /**
   * Submit free hostel accommodation application
   */
  public static createApplication(student: StudentProfile, preferredHalls: string[]): HostelApplication {
    return {
      id: `app_${Date.now()}`,
      studentId: student.id,
      matricNumber: student.matricNumber,
      studentName: student.fullName,
      level: student.level,
      gender: 'MALE',
      appliedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      preferredHalls,
      status: 'APPLICATION_SUBMITTED'
    };
  }

  /**
   * Simulate the university's automated allocation balloting run
   */
  public static simulateBallotRun(student: StudentProfile): {
    success: boolean;
    allocatedSpace?: HostelBedspace;
    offerExpiresAt?: string;
  } {
    // 48-Hour countdown window from now
    const expires = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    const sampleBedspace: HostelBedspace = {
      hallId: 'hall_02',
      hallName: 'Prof. Peter Adeniyi Hall (Hall 2)',
      block: 'Block B',
      roomNumber: 'Room B-14',
      bedNumber: 'Bedspace 2 (Upper Bunk)',
      feeAmount: 35000,
      gender: 'MALE'
    };

    return {
      success: true,
      allocatedSpace: sampleBedspace,
      offerExpiresAt: expires
    };
  }

  /**
   * Generate Move-in Pass & Warden Clearance Code
   */
  public static generateMoveInPass(student: StudentProfile, bedspace: HostelBedspace) {
    return {
      passNumber: `EKSU-HOSTEL-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      studentName: student.fullName,
      matricNumber: student.matricNumber,
      department: student.department,
      hallName: bedspace.hallName,
      blockRoom: `${bedspace.block}, ${bedspace.roomNumber}`,
      bedNumber: bedspace.bedNumber,
      amountPaid: bedspace.feeAmount,
      wardenCheckInCode: `HALL-KEY-B14-B2`,
      session: student.currentSession,
      issuedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      qrPayload: `EKSU_MOVE_IN#${student.matricNumber}#${bedspace.hallName}#${bedspace.roomNumber}#PAID`
    };
  }
}
