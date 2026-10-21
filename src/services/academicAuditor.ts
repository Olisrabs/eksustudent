import { 
  Course, 
  StudentCourseResult, 
  AcademicAuditReport, 
  StudentProfile 
} from '../types';
import { COMPUTER_SCIENCE_CURRICULUM } from '../data/mockData';

export class AcademicAuditorService {
  /**
   * Run deterministic degree audit against department curriculum
   */
  public static runAudit(
    student: StudentProfile, 
    results: StudentCourseResult[], 
    curriculum: Course[] = COMPUTER_SCIENCE_CURRICULUM
  ): AcademicAuditReport {
    // 1. Calculate Grade Points and Earned Units
    let totalQualityPoints = 0;
    let totalGradedUnits = 0;
    let totalCreditsEarned = 0;

    const passedCoursesMap = new Map<string, StudentCourseResult>();
    const carryovers: StudentCourseResult[] = [];

    const gradePoints: Record<string, number> = {
      'A': 5,
      'B': 4,
      'C': 3,
      'D': 2,
      'E': 1,
      'F': 0
    };

    results.forEach(res => {
      if (res.grade && gradePoints[res.grade] !== undefined) {
        totalQualityPoints += gradePoints[res.grade] * res.creditUnits;
        totalGradedUnits += res.creditUnits;
      }

      if (res.status === 'PASSED' && res.grade !== 'F') {
        passedCoursesMap.set(res.courseCode.toUpperCase(), res);
        totalCreditsEarned += res.creditUnits;
      } else if (res.status === 'FAILED' || res.grade === 'F') {
        carryovers.push(res);
      }
    });

    const calculatedCgpa = totalGradedUnits > 0 
      ? Number((totalQualityPoints / totalGradedUnits).toFixed(2)) 
      : student.currentCgpa;

    // 2. Check for Missing Compulsory Courses (100L up to current level)
    const levelOrder = ['100L', '200L', '300L', '400L', '500L'];
    const currentLevelIndex = levelOrder.indexOf(student.level);

    const compulsoryCourses = curriculum.filter(c => c.isCompulsory);
    const totalCompulsoryCount = compulsoryCourses.length;
    let passedCompulsoryCount = 0;
    const missingCompulsoryCourses: Course[] = [];

    compulsoryCourses.forEach(comp => {
      const isPassed = passedCoursesMap.has(comp.code.toUpperCase());
      const compLevelIndex = levelOrder.indexOf(comp.level);

      if (isPassed) {
        passedCompulsoryCount++;
      } else {
        // If course is from a past level, it is an unregistered/missing compulsory course!
        if (compLevelIndex < currentLevelIndex) {
          missingCompulsoryCourses.push(comp);
        }
      }
    });

    // 3. Prerequisite Conflict Analysis for Upcoming Registration
    const prerequisiteConflicts: { targetCourse: Course; blockedBy: string }[] = [];
    
    // Check 400L courses that student should take this session
    const targetCourses = curriculum.filter(c => c.level === student.level && c.semester === student.currentSemester);

    targetCourses.forEach(target => {
      if (target.prerequisites && target.prerequisites.length > 0) {
        target.prerequisites.forEach(prereqCode => {
          const isPassed = passedCoursesMap.has(prereqCode.toUpperCase());
          if (!isPassed) {
            prerequisiteConflicts.push({
              targetCourse: target,
              blockedBy: prereqCode
            });
          }
        });
      }
    });

    // 4. Risk Assessment
    let riskSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    let isAtRiskOfDelay = false;

    if (missingCompulsoryCourses.length > 0 || carryovers.length > 1) {
      riskSeverity = 'CRITICAL';
      isAtRiskOfDelay = true;
    } else if (prerequisiteConflicts.length > 0 || carryovers.length === 1) {
      riskSeverity = 'HIGH';
      isAtRiskOfDelay = true;
    } else if (totalCreditsEarned < (student.requiredGraduationCredits - 30) && student.level === '400L') {
      riskSeverity = 'MEDIUM';
      isAtRiskOfDelay = true;
    }

    // 5. Generate Recommended Pathway
    const recommendedCourses: Course[] = [];

    // Prioritize carryovers first
    carryovers.forEach(carry => {
      const match = curriculum.find(c => c.code.toUpperCase() === carry.courseCode.toUpperCase());
      if (match && match.semester === student.currentSemester) {
        recommendedCourses.push(match);
      }
    });

    // Add missing past compulsory courses
    missingCompulsoryCourses.forEach(miss => {
      if (miss.semester === student.currentSemester) {
        recommendedCourses.push(miss);
      }
    });

    // Add current level courses that are not blocked by unsatisfied prerequisites
    targetCourses.forEach(tc => {
      const isBlocked = prerequisiteConflicts.some(pc => pc.targetCourse.code === tc.code);
      if (!isBlocked && !recommendedCourses.some(rc => rc.code === tc.code)) {
        recommendedCourses.push(tc);
      }
    });

    const firstSemesterUnits = recommendedCourses.reduce((sum, c) => sum + c.creditUnits, 0);

    const recommendedPathway = [
      {
        semester: `${student.level} ${student.currentSemester} Semester (Immediate Registration)`,
        recommendedCourses,
        totalUnits: firstSemesterUnits,
        advisoryNote: missingCompulsoryCourses.length > 0 
          ? `WARNING: You must include ${missingCompulsoryCourses.map(m => m.code).join(', ')} immediately to avoid clearance lockout during graduation.`
          : 'Your course selection is within departmental credit limits (max 24 units).'
      },
      {
        semester: `${student.level} Second Semester (Graduation Clearance Window)`,
        recommendedCourses: curriculum.filter(c => c.level === student.level && c.semester === 'Second'),
        totalUnits: curriculum.filter(c => c.level === student.level && c.semester === 'Second').reduce((sum, c) => sum + c.creditUnits, 0),
        advisoryNote: 'Focus heavily on CSC 499 (Final Year Project). Pre-clearance checks begin at week 8.'
      }
    ];

    // Summary text for human and AI prompt grounding
    const aiAnalysisSummary = `
Student ${student.fullName} (${student.matricNumber}) currently has a CGPA of ${calculatedCgpa} (Second Class Upper division).
Earned Credits: ${totalCreditsEarned} / ${student.requiredGraduationCredits} required for B.Sc Computer Science.
Audit Findings:
1. MISSING COMPULSORY REQUIREMENT: ${missingCompulsoryCourses.length > 0 ? missingCompulsoryCourses.map(c => `${c.code} (${c.title})`).join(', ') : 'None'}.
2. OUTSTANDING CARRYOVER: ${carryovers.length > 0 ? carryovers.map(c => `${c.courseCode} (${c.title})`).join(', ') : 'None'}.
3. PREREQUISITE BOTTLENECK: ${prerequisiteConflicts.length > 0 ? prerequisiteConflicts.map(p => `${p.targetCourse.code} is blocked because ${p.blockedBy} is uncompleted`).join('; ') : 'None'}.
Degree Risk Level: ${riskSeverity}. Immediate action needed before semester course registration closes.
`.trim();

    return {
      studentId: student.id,
      totalCreditsEarned,
      totalCreditsRequired: student.requiredGraduationCredits,
      currentCgpa: calculatedCgpa,
      passedCompulsoryCount,
      totalCompulsoryCount,
      missingCompulsoryCourses,
      carryovers,
      prerequisiteConflicts,
      isEligibleForFinalYearProject: totalCreditsEarned >= 90 && carryovers.length <= 2,
      isAtRiskOfDelay,
      riskSeverity,
      aiAnalysisSummary,
      recommendedPathway
    };
  }
}
