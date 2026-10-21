import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  User, 
  Compass, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { StudentProfile, PaymentTransaction } from '../../types';
import { AIService } from '../../services/aiService';

interface ChatDrawerProps {
  student: StudentProfile;
  activeDiscrepancy?: PaymentTransaction | null;
}

interface Message {
  id: string;
  sender: 'USER' | 'COPILOT';
  text: string;
  timestamp: string;
  citation?: string;
  quickActions?: string[];
  isWelcomeDoc?: boolean;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  student,
  activeDiscrepancy
}) => {
  const [selectedGuideTab, setSelectedGuideTab] = useState<'FRESHER' | 'STAYLITE'>(
    student.isFresher || student.level === '100L' ? 'FRESHER' : 'STAYLITE'
  );
  const [showDocBanner, setShowDocBanner] = useState(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm_welcome_doc',
      sender: 'COPILOT',
      text: `Hello ${student.fullName.split(' ')[0]}! Welcome to the EKSU SmartPath AI Copilot.\n\nI have prepared the official EKSU Portal System Documentation & Campus Navigation Roadmap for you below. Whether you are a 100-Level Fresher just entering EKSU or a returning Staylite (200L–500L), follow the exact steps to navigate your portal and academic journey seamlessly.\n\nAfter reviewing the guide, feel free to ask me any personalized question about your courses, fees, hostel balloting, or graduation requirements!`,
      timestamp: 'Just now',
      citation: 'EKSU Student Information Handbook & Senate Regulation §4.2',
      isWelcomeDoc: true,
      quickActions: [
        'How does the UNILAG-style hostel balloting work?',
        'Am I eligible to register courses right now?',
        'Why do I have a missing GST 202 course?',
        'How do I clear my carryover in CSC 305?'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'USER',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(async () => {
      const response = await AIService.askCopilot(textToSend, student, activeDiscrepancy);
      
      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        sender: 'COPILOT',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citation: response.relatedArticle,
        quickActions: response.quickActions
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col h-[750px] overflow-hidden">
      
      {/* Copilot Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-eksu-blue-700 to-slate-900 border border-eksu-gold-500/40 text-eksu-gold-400">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-['Outfit']">
                EKSU SmartPath Copilot
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-eksu-blue-950 text-eksu-gold-400 border border-eksu-gold-500/30">
                Official Portal Guide & AI
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Personalized for {student.fullName} ({student.matricNumber} · {student.level})
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowDocBanner(!showDocBanner)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
        >
          <Compass className="w-3.5 h-3.5 text-eksu-gold-400" />
          <span>{showDocBanner ? 'Hide Portal Guide' : 'Show Portal Guide'}</span>
          {showDocBanner ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        
        {/* Comprehensive System Documentation & Campus Navigation Roadmap */}
        {showDocBanner && (
          <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-eksu-gold-500/40 bg-gradient-to-br from-eksu-blue-950/80 via-slate-900 to-slate-950 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-eksu-gold-400" />
                <h3 className="text-sm sm:text-base font-bold text-white font-['Outfit']">
                  EKSU Portal System Documentation & Onboarding Roadmap
                </h3>
              </div>

              {/* Guide Switcher Tabs */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setSelectedGuideTab('FRESHER')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedGuideTab === 'FRESHER'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  👶 100L Freshers Guide
                </button>
                <button
                  onClick={() => setSelectedGuideTab('STAYLITE')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedGuideTab === 'STAYLITE'
                      ? 'bg-gradient-to-r from-eksu-gold-500 to-amber-500 text-slate-950 shadow font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🎓 Staylites (200L–500L) Guide
                </button>
              </div>
            </div>

            {/* Content for 100L Freshers */}
            {selectedGuideTab === 'FRESHER' && (
              <div className="space-y-3 animate-fadeIn text-xs text-slate-300">
                <p className="text-slate-300 leading-relaxed">
                  Congratulations on your provisional admission into Ekiti State University! Follow these sequential milestones on the <strong className="text-white">eksuportal.eksu.edu.ng</strong> portal to formalize your student status:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="font-bold text-eksu-gold-400 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-eksu-gold-500/20 text-eksu-gold-300 flex items-center justify-center text-[10px]">1</span>
                      Acceptance Fee & Clearance
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Generate your Remita RRR on the portal and pay the non-refundable Acceptance Fee. Upload O'Level (WAEC/NECO), JAMB Result Slip, and Birth Certificate for online faculty screening.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px]">2</span>
                      Matriculation Number Generation
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Upon Faculty Officer clearance, your official EKSU Matriculation Number (e.g., EKSU/2024/CSC/xxxx) is assigned. Use this for all future portal logins.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">3</span>
                      School Fees & Course Registration
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Pay approved tuition (full or 1st installment). Complete bio-data, register compulsory 100L GSTs (<strong className="text-white">GST 101, GST 102</strong>), and print 4 copies for Level Adviser endorsement.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="font-bold text-purple-400 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px]">4</span>
                      UNILAG-Style Hostel Balloting
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      100L students receive highest accommodation quota priority. Apply for free during balloting window. Once allocated, you have 48 hours to Accept & Pay (₦35,000) or Decline!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Content for Staylites (200L–500L) */}
            {selectedGuideTab === 'STAYLITE' && (
              <div className="space-y-3 animate-fadeIn text-xs text-slate-300">
                <p className="text-slate-300 leading-relaxed">
                  Welcome back to the new academic session! Here is your step-by-step checklist to stay academically safe and on track for convocation:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="font-bold text-eksu-gold-400 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-eksu-gold-500/20 text-eksu-gold-300 flex items-center justify-center text-[10px]">1</span>
                      Previous Result & CGPA Audit
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Check your semester grade sheet. Use the <strong className="text-white">SmartPath</strong> tab to verify that no compulsory General Studies course (like <span className="text-rose-400 font-semibold">GST 202</span>) was omitted.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="font-bold text-rose-400 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center text-[10px]">2</span>
                      Carryover & Prerequisite Resolution
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Under Senate Regulation 2022/18, failed courses (e.g. <span className="text-amber-300 font-semibold">CSC 305</span>) MUST be registered before new electives. Advanced courses like CSC 411 will be blocked without it!
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px]">3</span>
                      Course Registration & Add/Drop Slip
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Maximum credit unit ceiling is 24 units per semester. Register before the deadline to avoid the ₦15,000 late registration fee penalty.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">4</span>
                      Final Year Clearance (400L/500L)
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Verify complete 144 credit units, assign capstone supervisor for CSC 499, and obtain Bursary ledger clearance stamp before NYSC mobilization.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-2xl ${
              msg.sender === 'USER' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                msg.sender === 'USER'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gradient-to-br from-eksu-blue-800 to-slate-900 text-eksu-gold-400 border border-eksu-gold-500/40'
              }`}
            >
              {msg.sender === 'USER' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className="space-y-2">
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'USER'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.citation && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-eksu-gold-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Grounded in: <strong>{msg.citation}</strong></span>
                  </div>
                )}
              </div>

              {/* Quick Actions Chips */}
              {msg.quickActions && msg.quickActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.quickActions.map((qa, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(qa)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-eksu-gold-500/40 text-[11px] text-slate-300 font-medium transition-colors text-left"
                    >
                      {qa}
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[10px] text-slate-400 block px-1">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-md">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-eksu-gold-400 text-xs">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-eksu-gold-400 animate-pulse" />
              Checking EKSU academic handbooks & fee circulars...
            </div>
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything: 'How do I resolve my carryover?', 'Am I cleared for hostel?'..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-eksu-gold-500 font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50 transition-opacity"
          >
            <Send className="w-3.5 h-3.5" />
            Ask
          </button>
        </form>
      </div>

    </div>
  );
};
