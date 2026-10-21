import React, { useState } from 'react';
import { 
  MessageSquareWarning, 
  Sparkles, 
  Send, 
  AlertCircle, 
  Layers, 
  Users, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { ComplaintTicket, IncidentCluster, StudentProfile } from '../../types';
import { AIService } from '../../services/aiService';
import { AppStorage } from '../../services/storage';

interface ComplaintFeedProps {
  student: StudentProfile;
  complaints: ComplaintTicket[];
  clusters: IncidentCluster[];
  onDataUpdated: () => void;
}

export const ComplaintFeed: React.FC<ComplaintFeedProps> = ({
  student,
  complaints,
  clusters,
  onDataUpdated
}) => {
  const [complaintText, setComplaintText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiPreview, setAiPreview] = useState<any | null>(null);

  const handleTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setComplaintText(val);

    if (val.length > 25) {
      const parsed = await AIService.analyzeComplaintText(val);
      setAiPreview(parsed);
    } else {
      setAiPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const title = aiPreview?.category === 'HOSTEL_ALLOCATION' 
        ? 'Debited for hostel fee but portal pending' 
        : 'Student portal discrepancy inquiry';

      AppStorage.addComplaint(student, title, complaintText);
      setComplaintText('');
      setAiPreview(null);
      setIsSubmitting(false);
      onDataUpdated();
    }, 700);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border-l-4 border-l-amber-500">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-900/60 text-amber-300 border border-amber-500/30">
              Module 3: Complaint Intelligence & Clustering
            </span>
            <span className="text-xs text-slate-400">Institutional Issue Grouping</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1 tracking-tight font-['Outfit']">
            VoiceOut — AI Student Support & Incident Clusters
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Transforms individual complaints into traceable incident clusters so university administrators solve systemic bottlenecks instead of treating 200 dropped payments as isolated user errors.
          </p>
        </div>
      </div>

      {/* Institutional Macro Incident Heatmap Callout */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-eksu-gold-400" />
            <h2 className="text-base font-bold text-white">
              Active Institutional Incident Clusters (System-Wide)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Detected across all 24,000 EKSU students
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clusters.map((cluster) => {
            const isResolved = cluster.status === 'RESOLVED_IN_BATCH';

            return (
              <div 
                key={cluster.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isResolved 
                    ? 'bg-emerald-950/20 border-emerald-500/30' 
                    : cluster.severity === 'CRITICAL'
                    ? 'bg-amber-950/30 border-amber-500/40 shadow-lg shadow-amber-950/20'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-eksu-gold-400">
                    {cluster.clusterCode}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    isResolved 
                      ? 'bg-emerald-500/20 text-emerald-300' 
                      : 'bg-rose-500/20 text-rose-300 animate-pulse'
                  }`}>
                    {isResolved ? 'Resolved in Batch' : `${cluster.affectedCount} Students Affected`}
                  </span>
                </div>

                <h3 className="mt-2 text-sm font-bold text-white leading-snug">
                  {cluster.title}
                </h3>

                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  {cluster.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    Root Cause: <strong className="text-slate-300">{cluster.rootCauseCategory.replace(/_/g, ' ')}</strong>
                  </span>
                  <span className="font-semibold text-eksu-gold-300">
                    {cluster.suggestedAction}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Complaint Submission Form with AI Real-Time Extraction */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400">
            <MessageSquareWarning className="w-5 h-5 text-eksu-gold-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Report an Issue or File an Inquiry
            </h2>
            <p className="text-xs text-slate-400">
              Type naturally — our AI extractor identifies payment references, urgency, and routes directly to Bursary or ICT
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              rows={3}
              required
              placeholder="e.g., I paid 35,000 naira for Peter Adeniyi Hall 2 this morning via Remita with my GTBank app. Money was deducted and I got alert, but my portal still says Unpaid and Room B-14 is pending..."
              value={complaintText}
              onChange={handleTextChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-eksu-gold-500 font-sans leading-relaxed"
            />
          </div>

          {/* AI Live Extraction Pill Box */}
          {aiPreview && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-500/40 animate-fadeIn space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-eksu-gold-400">
                <Sparkles className="w-4 h-4" />
                AI Real-Time Entity Extraction:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-950/80">
                  <span className="text-slate-400 block text-[10px]">Detected Category:</span>
                  <span className="font-semibold text-white">{aiPreview.category}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/80">
                  <span className="text-slate-400 block text-[10px]">Urgency Rating:</span>
                  <span className="font-bold text-rose-400">{aiPreview.urgency}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/80">
                  <span className="text-slate-400 block text-[10px]">Target Service:</span>
                  <span className="font-semibold text-white">{aiPreview.extractedEntities.serviceAffected}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/80">
                  <span className="text-slate-400 block text-[10px]">Routed Department:</span>
                  <span className="font-semibold text-eksu-gold-300">{aiPreview.suggestedTeam}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Logged as: <strong className="text-white">{student.fullName} ({student.matricNumber})</strong>
            </span>
            <button
              type="submit"
              disabled={isSubmitting || !complaintText.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-blue transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Submitting & Clustering...' : 'Submit AI Ticket'}
            </button>
          </div>
        </form>
      </div>

      {/* Ticket History */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4">
          Your Submitted Support Tickets
        </h3>

        <div className="space-y-3">
          {complaints.map((tkt) => (
            <div key={tkt.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-400">{tkt.ticketNumber}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300">
                  {tkt.status}
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">
                {tkt.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {tkt.description}
              </p>
              <div className="text-[10px] text-slate-400 pt-1">
                Submitted on {tkt.submittedAt} · Category: {tkt.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
