import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileCheck, 
  Sparkles, 
  ChevronRight, 
  BookOpen, 
  Award,
  ArrowUpRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { StudentProfile, StudentCourseResult, AcademicAuditReport } from '../../types';
import { AcademicAuditorService } from '../../services/academicAuditor';
import { AIService, AIAdvisoryResponse } from '../../services/aiService';
import { COMPUTER_SCIENCE_CURRICULUM } from '../../data/mockData';

interface AuditOverviewProps {
  student: StudentProfile;
  results: StudentCourseResult[];
}

export const AuditOverview: React.FC<AuditOverviewProps> = ({
  student,
  results
}) => {
  const [auditReport, setAuditReport] = useState<AcademicAuditReport | null>(null);
  const [aiAdvisory, setAiAdvisory] = useState<AIAdvisoryResponse | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('ALL');
  const [appliedToSlip, setAppliedToSlip] = useState(false);

  useEffect(() => {
    const report = AcademicAuditorService.runAudit(student, results, COMPUTER_SCIENCE_CURRICULUM);
    setAuditReport(report);

    // Generate SmartPath AI advice
    setIsGeneratingAi(true);
    AIService.generateSmartPathAdvisory(report, student).then(adv => {
      setAiAdvisory(adv);
      setIsGeneratingAi(false);
    });
  }, [student, results]);

  if (!auditReport) return null;

  const filteredCurriculum = COMPUTER_SCIENCE_CURRICULUM.filter(c => {
    if (selectedLevelFilter === 'ALL') return true;
    return c.level === selectedLevelFilter;
  });

  const getCourseStatus = (code: string) => {
    const r = results.find(res => res.courseCode.toUpperCase() === code.toUpperCase());
    if (r) return r.status;
    const isMissingCompulsory = auditReport.missingCompulsoryCourses.some(m => m.code.toUpperCase() === code.toUpperCase());
    if (isMissingCompulsory) return 'OUTSTANDING';
    return 'NOT_TAKEN';
  };

  const handleApplyToSlip = () => {
    setAppliedToSlip(true);
    setTimeout(() => setAppliedToSlip(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border-l-4 border-l-blue-500">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-900/60 text-blue-300 border border-blue-500/30">
              Module 2: Academic Risk Auditor
            </span>
            <span className="text-xs text-slate-400">Department of Computer Science</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1 tracking-tight font-['Outfit']">
            SmartPath — Degree Audit & Graduation Roadmaps
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Detects missing compulsory General Studies (GST) courses, carryovers, and prerequisite bottlenecks before convocation clearance.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Graduation Risk Index:</span>
            <span className="text-sm font-extrabold text-rose-400 uppercase tracking-wider">
              {auditReport.riskSeverity} Risk (Action Required)
            </span>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CGPA */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Cumulative GPA</span>
            <Award className="w-4 h-4 text-eksu-gold-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {auditReport.currentCgpa}
            </span>
            <span className="text-xs font-semibold text-eksu-gold-400">
              / 5.00
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Class: <strong className="text-white">Second Class (Upper)</strong>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-eksu-gold-400 h-full rounded-full"
              style={{ width: `${(auditReport.currentCgpa / 5.0) * 100}%` }}
            />
          </div>
        </div>

        {/* Earned Credit Units */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Earned Credits</span>
            <FileCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {auditReport.totalCreditsEarned}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              / {auditReport.totalCreditsRequired} Units
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Remaining: <strong className="text-white">{auditReport.totalCreditsRequired - auditReport.totalCreditsEarned} Units</strong>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full"
              style={{ width: `${(auditReport.totalCreditsEarned / auditReport.totalCreditsRequired) * 100}%` }}
            />
          </div>
        </div>

        {/* Compulsory Courses */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Core Curriculum</span>
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {auditReport.passedCompulsoryCount}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              / {auditReport.totalCompulsoryCount} Courses
            </span>
          </div>
          <div className="mt-1 text-xs text-rose-400 font-medium">
            ⚠️ 1 Missing Past Compulsory Course!
          </div>
        </div>

        {/* Final Year Status */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Final Year Capstone</span>
            <GraduationCap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-black text-emerald-400">
              Eligible
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            CSC 499 Project Approved for Second Sem
          </div>
        </div>
      </div>

      {/* Critical Flag Alert Callout */}
      <div className="p-6 rounded-2xl bg-rose-950/40 border-2 border-rose-500/40 shadow-xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Convocation Clearance Risk Detected
              <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase bg-rose-500 text-slate-950">
                Action Required
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Senate regulations require every graduating student to pass all 100L–300L compulsory courses. You currently have <strong className="text-white">1 missing General Studies course</strong> and <strong className="text-white">1 outstanding carryover</strong> that will prevent your final clearance if not added to this semester's course slip.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {/* Missing Compulsory */}
          {auditReport.missingCompulsoryCourses.map((c) => (
            <div key={c.code} className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300">
                  Missing University Requirement
                </span>
                <span className="font-mono text-xs text-slate-400">{c.creditUnits} Units</span>
              </div>
              <div className="mt-2 font-bold text-white text-sm">
                {c.code} — {c.title}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Not registered during 200L Second Semester. Must be added to your current course registration immediately.
              </p>
            </div>
          ))}

          {/* Outstanding Carryover */}
          {auditReport.carryovers.map((carry) => (
            <div key={carry.courseCode} className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300">
                  Outstanding Carryover
                </span>
                <span className="font-mono text-xs text-rose-400 font-bold">Grade: {carry.grade}</span>
              </div>
              <div className="mt-2 font-bold text-white text-sm">
                {carry.courseCode} — {carry.title}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Failed in 300L First Semester (Score: {carry.score}). Blocks advanced core course <strong className="text-white">CSC 411 (Compiler Construction)</strong>.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI SmartPath Graduation Pathway */}
      {aiAdvisory && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-blue-500/30 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Sparkles className="w-5 h-5 text-eksu-gold-400 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">
                  SmartPath AI — Personalized Graduation Pathway
                </h3>
                <p className="text-xs text-slate-400">
                  Grounded in EKSU Academic Handbook §4.2 and Department of Computer Science guidelines
                </p>
              </div>
            </div>

            <button
              onClick={handleApplyToSlip}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-blue transition-all"
            >
              <FileCheck className="w-4 h-4" />
              {appliedToSlip ? '✅ Added to Course Slip!' : '1-Click Add Pathway to Course Slip'}
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
              <span className="font-bold text-eksu-gold-400 block mb-1">
                AI Academic Evaluation:
              </span>
              {aiAdvisory.summary}
            </div>

            {/* Recommended Semester Roadmaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {auditReport.recommendedPathway.map((sem, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs sm:text-sm">
                      {sem.semester}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-500/20 text-blue-300">
                      Total: {sem.totalUnits} Units
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {sem.recommendedCourses.map((c) => (
                      <div key={c.code} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-eksu-gold-400">{c.code}</span>
                          <span className="text-slate-300 truncate max-w-[170px] sm:max-w-[220px]">{c.title}</span>
                        </div>
                        <span className="font-mono text-slate-400">{c.creditUnits}U</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
                    💡 {sem.advisoryNote}
                  </p>
                </div>
              ))}
            </div>

            {/* Official Rule Grounding citation */}
            {aiAdvisory.groundedPolicyCitation && (
              <div className="p-3.5 rounded-xl bg-eksu-blue-950/40 border border-eksu-blue-800/40 text-[11px] text-slate-400">
                <span className="font-semibold text-eksu-gold-400 block mb-0.5">
                  Institutional Policy Grounding:
                </span>
                {aiAdvisory.groundedPolicyCitation}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Curriculum & Transcript Inspector */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">
              Official Computer Science Curriculum & Grade Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Interactive course checklist from 100L through 400L
            </p>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {['ALL', '100L', '200L', '300L', '400L'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevelFilter(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedLevelFilter === lvl
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase font-semibold">
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Units</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status & Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredCurriculum.map((c) => {
                const status = getCourseStatus(c.code);
                const result = results.find(r => r.courseCode.toUpperCase() === c.code.toUpperCase());

                return (
                  <tr key={c.code} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white text-xs">
                      {c.code}
                    </td>
                    <td className="py-3 px-4 text-slate-200 text-xs">
                      {c.title}
                      {c.prerequisites && (
                        <span className="block text-[10px] text-slate-400">
                          Prereq: {c.prerequisites.join(', ')}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400">
                      {c.level} ({c.semester})
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-300">
                      {c.creditUnits}U
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.isCompulsory ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {c.isCompulsory ? 'Compulsory' : 'Elective'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {status === 'PASSED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" />
                          Passed ({result?.grade})
                        </span>
                      )}
                      {status === 'FAILED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 animate-pulse">
                          <XCircle className="w-3 h-3" />
                          Failed (Carryover)
                        </span>
                      )}
                      {status === 'OUTSTANDING' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          Missing Compulsory
                        </span>
                      )}
                      {status === 'NOT_TAKEN' && (
                        <span className="text-xs text-slate-400">
                          Pending Registration
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
