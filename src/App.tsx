/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Calculator, 
  Wallet, 
  MessageCircle, 
  TrendingUp, 
  BookOpen, 
  ChevronRight, 
  CheckCircle2, 
  Bell, 
  User,
  LogOut,
  Send,
  Loader2,
  Sparkles,
  ArrowRight,
  Target,
  Globe,
  DollarSign,
  Users,
  Activity,
  FileText,
  ShieldCheck,
  Briefcase,
  History,
  MoreVertical,
  BellRing,
  Lock,
  Mail,
  Phone,
  MapPin,
  Building2,
  CalendarDays,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import confetti from 'canvas-confetti';

import { useRegisterSW } from 'virtual:pwa-register/react';

import { getUniversityRecommendations, getMentorResponse } from './lib/gemini';
import type { UserProfile, UniversityRecommendation, LoanOffer, KnowledgeBite, AppNotification, Document } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---

const INITIAL_KNOWLEDGE: KnowledgeBite[] = [
  {
    id: '1',
    title: 'New Visa Rules for UK (2025)',
    content: 'The UK government has updated the post-study work visa requirements. Students must now...',
    category: 'Visa',
    date: '2 hours ago'
  },
  {
    id: '2',
    title: 'Lower Interest Rates on Loans',
    content: 'Top Indian private banks are offering a 0.25% discount for female students heading to Stem courses.',
    category: 'Loan',
    date: '5 hours ago'
  },
  {
    id: '3',
    title: 'Masters in Data Science ROI',
    content: 'Why US remains the top choice for tech graduates despite rising tuition fees.',
    category: 'University',
    date: '1 day ago'
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Visa Probablity Updated',
    message: 'Your profile has a 88% chance for USA STEM Visa.',
    time: '2m ago',
    type: 'ai',
    read: false
  },
  {
    id: 'n2',
    title: 'University Visit',
    message: 'NYU Representative is visiting Delhi next week.',
    time: '1h ago',
    type: 'info',
    read: true
  }
];

const INITIAL_DOCS: Document[] = [
  { id: 'd1', name: 'Passport_Scan.pdf', type: 'PDF', status: 'Verified', uploadDate: '2025-04-10', category: 'Identity' },
  { id: 'd2', name: 'GRE_Scorecard.pdf', type: 'PDF', status: 'Pending', uploadDate: '2025-04-12', category: 'Academic' }
];

const MOCK_LOANS: LoanOffer[] = [
  {
    bankName: 'HDFC Credila',
    interestRate: '9.25%',
    maxAmount: '₹75 Lakhs',
    tenure: '15 Years',
    processingFee: '1%'
  },
  {
    bankName: 'ICICI Bank',
    interestRate: '9.50%',
    maxAmount: '₹60 Lakhs',
    tenure: '10 Years',
    processingFee: '0.5%'
  },
  {
    bankName: 'Prodigy Finance',
    interestRate: '12.4%',
    maxAmount: '$150,000',
    tenure: '20 Years',
    processingFee: '2%'
  }
];

// --- Components ---

const Sidebar = ({ activeTab, setTab, profile }: { activeTab: string, setTab: (t: string) => void, profile: any }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'navigator', icon: Search, label: 'Career Navigator' },
    { id: 'vault', icon: FileText, label: 'Document Vault' },
    { id: 'roi', icon: Calculator, label: 'ROI Predictor' },
    { id: 'community', icon: Users, label: 'Global Community' },
    { id: 'loans', icon: Wallet, label: 'Loan Center' },
    { id: 'mentor', icon: MessageCircle, label: 'AI Mentor' },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col fixed left-0 top-0 z-50 hidden md:flex">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-xl text-white">
          E
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight uppercase font-mono text-primary tracking-tighter">EduFin AI</h1>
          <p className="text-[10px] text-muted font-mono uppercase tracking-widest font-bold">Copilot Engine</p>
        </div>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-bold",
              activeTab === item.id 
                ? "bg-primary text-white vibrant-shadow" 
                : "text-muted hover:bg-bg hover:text-primary border border-transparent hover:border-border"
            )}
          >
            <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-white" : "text-muted group-hover:text-primary")} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-bg rounded-xl p-4 flex items-center gap-3 border border-border">
          <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-white overflow-hidden shadow-sm">
            <img src={`https://picsum.photos/seed/${profile.name}/40/40`} alt="User" referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate text-text">{profile.name}</p>
            <p className="text-[10px] text-muted truncate font-bold uppercase tracking-tight">{profile.currentEducation}</p>
          </div>
          <LogOut 
            onClick={() => {
              if (confirm('Are you sure you want to log out and clear your profile?')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="w-4 h-4 text-muted hover:text-secondary cursor-pointer transition-colors" 
          />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('edufin_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<UniversityRecommendation[]>(() => {
    const saved = localStorage.getItem('edufin_recommendations');
    return saved ? JSON.parse(saved) : [];
  });
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>(() => {
    const saved = localStorage.getItem('edufin_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [isMentorLoading, setIsMentorLoading] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCS);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);

  const [hasStartedLoan, setHasStartedLoan] = useState<boolean>(() => {
    return localStorage.getItem('edufin_loan_started') === 'true';
  });
  const [selectedUniv, setSelectedUniv] = useState<UniversityRecommendation | null>(() => {
    const saved = localStorage.getItem('edufin_selected_univ');
    return saved ? JSON.parse(saved) : null;
  });
  const [showToast, setShowToast] = useState(false);
  const [showFinalSummary, setShowFinalSummary] = useState(false);
  const [selectedUnivForDetails, setSelectedUnivForDetails] = useState<UniversityRecommendation | null>(null);

  // Growth Engine Simulation: Streaks & Notifications
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('edufin_streak');
    return saved ? parseInt(saved) : 5;
  });
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('edufin_points');
    return saved ? parseInt(saved) : 1250;
  });

  useEffect(() => {
    localStorage.setItem('edufin_streak', streak.toString());
    localStorage.setItem('edufin_points', points.toString());
  }, [streak, points]);

  useEffect(() => {
    if (profile) localStorage.setItem('edufin_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('edufin_recommendations', JSON.stringify(recommendations));
  }, [recommendations]);

  useEffect(() => {
    localStorage.setItem('edufin_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('edufin_loan_started', hasStartedLoan.toString());
  }, [hasStartedLoan]);

  useEffect(() => {
    if (selectedUniv) localStorage.setItem('edufin_selected_univ', JSON.stringify(selectedUniv));
  }, [selectedUniv]);

  const handleLoanApply = () => {
    setHasStartedLoan(true);
    setPoints(prev => prev + 500); // Award points for milestone
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4F46E5', '#F97316', '#10B981']
    });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setShowFinalSummary(true);
    }, 2000);
  };

  const handleOnboarding = (data: UserProfile) => {
    setProfile(data);
  };

  if (!profile) {
    return <Onboarding onComplete={handleOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">
      <Sidebar activeTab={activeTab} setTab={setActiveTab} profile={profile} />
      
      <main className="flex-1 md:ml-64 p-6 md:p-10 pb-32 md:pb-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-extrabold text-text tracking-tight">
              {activeTab === 'dashboard' && `Jai Hind, ${profile.name.split(' ')[0]}!`}
              {activeTab === 'navigator' && 'University Finder'}
              {activeTab === 'roi' && 'ROI Predictions'}
              {activeTab === 'loans' && 'Loan Center'}
              {activeTab === 'mentor' && 'AI Personal Mentor'}
            </h2>
            <p className="text-muted mt-1 font-medium">
              {activeTab === 'dashboard' && 'Your study abroad journey is 65% complete. Keep going!'}
              {activeTab === 'navigator' && 'Find your high-ROI university matches.'}
              {activeTab === 'roi' && 'Predicting your career future using advanced pathways.'}
              {activeTab === 'loans' && 'Smart financing starts with transparency.'}
              {activeTab === 'mentor' && '24/7 intelligence for your academic success.'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowRewardsModal(true)}
              className="bg-white px-5 py-2.5 rounded-2xl vibrant-shadow border border-border flex items-center gap-5 cursor-pointer"
            >
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-muted font-black uppercase tracking-widest">Points</span>
                <span className="font-mono font-black text-primary text-lg leading-none">{points}</span>
              </div>
              <div className="w-[1.5px] h-8 bg-border" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-muted font-black uppercase tracking-widest">Streak</span>
                <span className="font-mono font-black text-secondary text-lg leading-none">{streak}🔥</span>
              </div>
            </motion.button>
            <button 
              onClick={() => {
                setShowNotificationPanel(true);
                // Mark all as read when opening panel
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
              }}
              className="p-3 bg-white rounded-2xl vibrant-shadow border border-border relative text-muted hover:text-primary transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-white animate-pulse" />
              )}
            </button>
          </div>
        </header>

        <AnimatePresence>
          {showNotificationPanel && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowNotificationPanel(false)}
                className="fixed inset-0 bg-text/20 backdrop-blur-sm z-[110]"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-[120] border-l border-border flex flex-col"
              >
                <div className="p-8 border-b border-border flex justify-between items-center">
                   <h3 className="font-black text-xl text-text uppercase tracking-tight flex items-center gap-3">
                     <Activity className="w-5 h-5 text-primary" /> Activity Center
                   </h3>
                   <button onClick={() => setShowNotificationPanel(false)} className="text-muted hover:text-text">
                     <LogOut className="w-5 h-5" />
                   </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        setNotifications(prev => prev.map(notif => 
                          notif.id === n.id ? { ...notif, read: true } : notif
                        ));
                      }}
                      className={cn(
                        "p-5 rounded-2xl border transition-all cursor-pointer relative",
                        n.read ? "bg-bg/10 border-transparent" : "bg-white border-primary/20 shadow-lg shadow-primary/5"
                      )}
                    >
                      {!n.read && <div className="absolute top-5 right-5 w-2 h-2 bg-secondary rounded-full animate-pulse" />}
                      <div className="flex justify-between items-start mb-1">
                        <span className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                          n.type === 'ai' ? "bg-accent text-white" : "bg-primary text-white"
                        )}>{n.type}</span>
                        <span className="text-[10px] text-muted font-bold">{n.time}</span>
                      </div>
                      <h4 className="font-bold text-text mb-1">{n.title}</h4>
                      <p className="text-xs text-muted leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Main Progress Tracker */}
              <div className="lg:col-span-2 bg-card rounded-[32px] p-10 vibrant-shadow border border-border flex flex-col gap-8">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-2xl flex items-center gap-3 text-text">
                    <TrendingUp className="w-6 h-6 text-primary" /> Journey Progress
                  </h3>
                  <span className="text-[11px] bg-primary/10 text-primary px-4 py-1.5 rounded-full font-black uppercase tracking-widest">In Progress</span>
                </div>
                
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-border flex items-center gap-5 bg-bg/20">
                    <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-text">Profile Discovery</div>
                        <div className="text-[10px] font-black uppercase text-accent bg-accent/5 px-2 py-0.5 rounded inline-block">Step 1 • Verified</div>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                  </div>

                  <motion.div 
                    initial={false}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('navigator')}
                    className={cn(
                      "p-5 rounded-2xl border flex items-center gap-5 relative overflow-hidden text-left transition-all cursor-pointer group",
                      recommendations.length > 0 ? "border-accent bg-accent/5" : "border-primary bg-primary/5 vibrant-shadow"
                    )}
                  >
                    <div className={cn("absolute top-0 left-0 w-1.5 h-full", recommendations.length > 0 ? "bg-accent" : "bg-primary")} />
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-colors",
                      recommendations.length > 0 ? "bg-accent text-white shadow-accent/20" : "bg-primary text-white shadow-primary/20"
                    )}>
                      <Search className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-text">University Shortlist</div>
                        <div className={cn(
                          "text-[10px] font-black uppercase px-2 py-0.5 rounded inline-block",
                          recommendations.length > 0 ? "text-accent bg-accent/10" : 
                          isLoading ? "text-primary bg-primary/10" : "text-muted bg-muted/10"
                        )}>
                          {recommendations.length > 0 ? "Step 2 • Completed" : 
                           isLoading ? "Step 2 • Matching..." : "Step 2 • Not Started"}
                        </div>
                    </div>
                    {recommendations.length > 0 ? (
                      <CheckCircle2 className="w-10 h-10 text-accent animate-in fade-in zoom-in duration-500" />
                    ) : isLoading ? (
                      <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-[spin_1s_linear_infinite]" />
                    ) : (
                      <ArrowRight className="w-8 h-8 text-muted group-hover:text-primary transition-all" />
                    )}
                  </motion.div>

                  <motion.div 
                    initial={false}
                    whileHover={{ scale: recommendations.length > 0 ? 1.01 : 1 }}
                    whileTap={{ scale: recommendations.length > 0 ? 0.98 : 1 }}
                    onClick={() => recommendations.length > 0 && setActiveTab('loans')}
                    className={cn(
                      "p-5 rounded-2xl border flex items-center gap-5 transition-all text-left w-full group overflow-hidden relative",
                      hasStartedLoan ? "border-accent bg-accent/5 cursor-pointer shadow-lg shadow-accent/5" :
                      recommendations.length > 0 ? "border-border bg-white cursor-pointer vibrant-shadow" : "border-border bg-bg/20 opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                      hasStartedLoan ? "bg-accent text-white" :
                      recommendations.length > 0 ? "bg-secondary text-white shadow-lg shadow-secondary/20" : "bg-muted/10 text-muted"
                    )}>
                      <Calculator className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-text">Finance & Loans</div>
                        <div className={cn(
                          "text-[10px] font-black uppercase px-2 py-0.5 rounded inline-block",
                          hasStartedLoan ? "text-accent bg-accent/10" :
                          recommendations.length > 0 ? "text-secondary bg-secondary/10" : "text-muted bg-muted/5"
                        )}>
                          {hasStartedLoan ? "Step 3 • Completed" : recommendations.length > 0 ? "Step 3 • Unlocked" : "Step 3 • Locked"}
                        </div>
                    </div>
                    {hasStartedLoan ? (
                      <CheckCircle2 className="w-10 h-10 text-accent animate-in fade-in zoom-in duration-500" />
                    ) : (
                      recommendations.length > 0 ? (
                        <ArrowRight className="w-6 h-6 text-secondary group-hover:translate-x-1 transition-transform" />
                      ) : (
                        <Lock className="w-5 h-5 text-muted/30" />
                      )
                    )}
                  </motion.div>

                  <motion.div 
                    initial={false}
                    whileHover={{ scale: hasStartedLoan ? 1.01 : 1 }}
                    whileTap={{ scale: hasStartedLoan ? 0.98 : 1 }}
                    onClick={() => hasStartedLoan && setActiveTab('vault')}
                    className={cn(
                      "p-5 rounded-2xl border flex items-center gap-5 transition-all text-left w-full group overflow-hidden relative",
                      hasStartedLoan ? "border-border bg-white cursor-pointer vibrant-shadow" : "border-border bg-bg/20 opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                      hasStartedLoan ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted/10 text-muted"
                    )}>
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-text">Visa & Documentation</div>
                        <div className={cn(
                          "text-[10px] font-black uppercase px-2 py-0.5 rounded inline-block",
                          hasStartedLoan ? "text-primary bg-primary/10" : "text-muted bg-muted/5"
                        )}>
                          {hasStartedLoan ? "Step 4 • In Progress" : "Step 4 • Locked"}
                        </div>
                    </div>
                    {hasStartedLoan ? (
                      <ArrowRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" />
                    ) : (
                      <Lock className="w-5 h-5 text-muted/30" />
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Smart Nudges & AI Feed */}
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-text p-10 rounded-[40px] text-white vibrant-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                     <Activity className="w-6 h-6 text-primary" />
                     <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Market Live • USD/INR</span>
                  </div>
                  <div className="flex items-end gap-3 mb-2 relative z-10">
                    <span className="text-4xl font-mono font-black text-white leading-none">₹83.45</span>
                    <span className="text-emerald-400 text-xs font-black pb-1">+0.12% 📈</span>
                  </div>
                  <p className="text-xs font-bold text-white/60 relative z-10 leading-relaxed mb-6">Rates optimized for education remittances. Transfer now to save ₹4,500 on commissions.</p>
                  <button 
                    onClick={() => setActiveTab('loans')}
                    className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest transition-colors relative z-10"
                  >
                    Open Forex Desk
                  </button>
                </div>
                <div 
                  onClick={() => setActiveTab('navigator')}
                  className="ai-gradient rounded-[32px] p-8 text-white vibrant-shadow transition-all hover:scale-[1.03] cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <Sparkles className="w-6 h-6 text-indigo-100" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-50">AI Career Insights</span>
                  </div>
                  <h4 className="font-extrabold text-2xl leading-tight mb-3">424 Active Pathways Simulated.</h4>
                  <p className="text-sm text-indigo-50 mb-8 font-medium leading-relaxed opacity-90 italic">"Based on your profile, you have 92% odds at Georgia Tech for Fall 2025."</p>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white/20 w-fit px-5 py-2.5 rounded-xl group-hover:bg-white/30 transition-colors">
                    View Matches <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform ml-2" />
                  </div>
                </div>

                <div className="bg-card rounded-[32px] p-8 vibrant-shadow border border-border">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-[12px] uppercase tracking-[0.2em] text-muted">Ready Documentation</h3>
                    <button onClick={() => setActiveTab('vault')} className="text-[10px] font-black uppercase text-primary hover:underline">Manage All</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {documents.map(doc => (
                      <button 
                        key={doc.id}
                        onClick={() => setActiveTab('vault')}
                        className="flex flex-col items-center justify-center p-4 bg-bg/50 rounded-2xl border border-border hover:border-primary hover:bg-white transition-all group"
                      >
                        <FileText className="w-6 h-6 text-muted group-hover:text-primary mb-2 transition-colors" />
                        <span className="text-[10px] font-black text-text uppercase tracking-tight text-center">{doc.name.replace('.pdf', '')}</span>
                        <span className={cn(
                          "text-[8px] font-black px-1.5 py-0.5 rounded mt-1 uppercase",
                          doc.status === 'Verified' ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"
                        )}>{doc.status}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-card rounded-[32px] p-8 vibrant-shadow border border-border">
                  <h3 className="font-black text-[12px] uppercase tracking-[0.2em] text-muted mb-6">EduFin Daily Feed</h3>
                  <div className="space-y-6">
                    {INITIAL_KNOWLEDGE.map(bite => (
                      <div 
                        key={bite.id} 
                        onClick={() => {
                          const toast = document.createElement('div');
                          toast.className = 'fixed inset-0 flex items-center justify-center z-[300] p-6';
                          toast.innerHTML = `
                            <div class="bg-white p-10 rounded-[40px] shadow-2xl border border-border max-w-sm w-full animate-in zoom-in-95">
                              <div class="text-[10px] font-black uppercase text-primary mb-2">${bite.category} • ${bite.date}</div>
                              <h3 class="text-2xl font-black text-text mb-4">${bite.title}</h3>
                              <p class="text-sm text-muted font-medium leading-relaxed">${bite.content}</p>
                              <button class="w-full mt-8 py-4 bg-text text-white rounded-2xl font-black uppercase text-xs transition-all hover:bg-primary">Close Article</button>
                            </div>
                          `;
                          document.body.appendChild(toast);
                          toast.querySelector('button')?.addEventListener('click', () => toast.remove());
                          toast.addEventListener('click', (e) => e.target === toast && toast.remove());
                        }}
                        className="group cursor-pointer p-4 -mx-4 rounded-2xl hover:bg-bg/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={cn(
                            "text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-tighter shadow-sm",
                            bite.category === 'Visa' ? "bg-secondary text-white" :
                            bite.category === 'Loan' ? "bg-accent text-white" :
                            "bg-primary text-white"
                          )}>
                            {bite.category}
                          </span>
                          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{bite.date}</span>
                        </div>
                        <h5 className="font-bold text-text group-hover:text-primary transition-colors text-sm leading-tight">{bite.title}</h5>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'navigator' && (
            <Navigator 
              profile={profile} 
              isLoading={isLoading} 
              onSearch={async () => {
                setIsLoading(true);
                try {
                  const results = await getUniversityRecommendations(profile);
                  setRecommendations(results.recommendations || []);
                } catch (e) {
                  console.error(e);
                } finally {
                  setIsLoading(false);
                }
              }}
              recommendations={recommendations}
              onSelect={(univ: UniversityRecommendation) => {
                setSelectedUniv(univ);
                setActiveTab('loans');
              }}
              onSelectDetails={(univ: UniversityRecommendation) => setSelectedUnivForDetails(univ)}
              selectedUniv={selectedUniv}
            />
          )}

          {activeTab === 'vault' && (
            <DocVault 
              documents={documents} 
              onUpload={(newDoc) => setDocuments([newDoc, ...documents])}
            />
          )}

          {activeTab === 'community' && (
            <CommunityHub />
          )}

          {activeTab === 'roi' && (
            <ROICalc profile={profile} recommendations={recommendations} />
          )}

          {activeTab === 'loans' && (
            <LoanCenter 
              profile={profile} 
              selectedUniv={selectedUniv}
              onApply={handleLoanApply}
            />
          )}

          {activeTab === 'mentor' && (
            <Mentor 
              messages={chatMessages} 
              setMessages={(m) => setChatMessages(m)} 
              isMentorLoading={isMentorLoading}
              setIsMentorLoading={setIsMentorLoading}
            />
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showRewardsModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRewardsModal(false)}
              className="fixed inset-0 bg-text/40 backdrop-blur-md z-[200]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[40px] p-10 z-[210] shadow-2xl border border-border"
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl mx-auto flex items-center justify-center text-primary">
                  <Sparkles className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-text">Your Rewards Dashboard</h2>
                  <p className="text-muted font-medium mt-1">Keep using EduFin AI to unlock more milestones!</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-bg rounded-3xl border border-border text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2">Lifetime Points</span>
                    <span className="text-3xl font-mono font-black text-primary">{points}</span>
                  </div>
                  <div className="p-6 bg-bg rounded-3xl border border-border text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2">Daily Streak</span>
                    <span className="text-3xl font-mono font-black text-secondary">{streak}🔥</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-primary/5 rounded-2xl text-left">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg">
                         <Search className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-xs font-bold text-text">Daily University Search</span>
                    </div>
                    <span className="text-xs font-black text-emerald-500">+50 pts</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-bg rounded-2xl text-left opacity-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg">
                         <Briefcase className="w-4 h-4 text-muted" />
                      </div>
                      <span className="text-xs font-bold text-text">Submit Visa Draft</span>
                    </div>
                    <span className="text-xs font-black text-muted">+200 pts</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowRewardsModal(false)}
                  className="w-full py-4 bg-text text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all hover:bg-primary"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}

        {selectedUnivForDetails && (
          <UniversityProfileModal 
            univ={selectedUnivForDetails} 
            onClose={() => setSelectedUnivForDetails(null)} 
          />
        )}

        {showFinalSummary && selectedUniv && (
          <EnrollmentSummary 
            selectedUniv={selectedUniv} 
            profile={profile} 
            onClose={() => setShowFinalSummary(false)} 
          />
        )}

        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 md:bottom-10 right-6 z-[100] bg-accent text-white px-6 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3 animate-bounce"
          >
            <CheckCircle2 className="w-6 h-6" />
            APPLICATION SUBMITTED SUCCESSFULLY!
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} setTab={setActiveTab} />
    </div>
  );
}

// --- Sub-components ---

const BottomNav = ({ activeTab, setTab }: { activeTab: string, setTab: (t: string) => void }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
    { id: 'navigator', icon: Search, label: 'Finder' },
    { id: 'vault', icon: FileText, label: 'Vault' },
    { id: 'loans', icon: Wallet, label: 'Loans' },
    { id: 'mentor', icon: MessageCircle, label: 'Mentor' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 px-6 pb-6 pt-3 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setTab(item.id)}
          className="flex flex-col items-center gap-1 relative"
        >
          <div className={cn(
            "p-2 rounded-xl transition-all duration-300",
            activeTab === item.id ? "bg-primary text-white scale-110 vibrant-shadow" : "text-muted"
          )}>
            <item.icon className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest transition-opacity duration-300",
            activeTab === item.id ? "opacity-100 text-primary" : "opacity-0"
          )}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

function StepItem({ icon: Icon, title, status, percentage }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
        status === 'complete' ? "bg-emerald-50 text-emerald-500" :
        status === 'active' ? "bg-indigo-50 text-indigo-500" :
        "bg-slate-50 text-slate-300"
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className={cn("font-bold", status === 'pending' ? "text-slate-400" : "text-slate-700")}>{title}</span>
          {status === 'complete' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          {status === 'active' && <span className="text-xs font-bold text-indigo-500">{percentage}%</span>}
        </div>
        <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-1000",
              status === 'complete' ? "w-full bg-emerald-500" :
              status === 'active' ? `bg-indigo-500` : "w-0"
            )} 
            style={{ width: status === 'active' ? `${percentage}%` : status === 'complete' ? '100%' : '0%' }}
          />
        </div>
      </div>
    </div>
  );
}

function Onboarding({ onComplete }: { onComplete: (p: UserProfile) => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<UserProfile>>({
    interestFields: [],
    targetDegree: 'Masters'
  });

  const steps = [
    {
      title: "Hey there! Let's build your AI Profile.",
      subtitle: "What's your name?",
      field: 'name',
      placeholder: 'e.g. Aditya Sharma'
    },
    { 
      title: "Great to meet you!", 
      subtitle: "What degree are you planning to pursue?", 
      field: 'targetDegree', 
      options: ['Bachelors', 'Masters', 'PhD'] 
    },
    { 
      title: "Where do you want to study?", 
      subtitle: "Select your preferred dream location.", 
      field: 'targetCountry',
      options: ['USA', 'UK', 'Canada', 'Europe', 'Australia', 'India']
    },
    {
      title: "Tell us about your background.",
      subtitle: "What's your current qualification?",
      field: 'currentEducation',
      placeholder: 'e.g. B.Tech Computer Science (Final Year)'
    },
    {
      title: "Final touch!",
      subtitle: "What's your estimated budget for the entire journey?",
      field: 'budgetRange',
      options: ['< ₹20 Lakhs', '₹20-40 Lakhs', '₹40-60 Lakhs', '₹60 Lakhs +']
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(data as UserProfile);
    }
  };

  const current = steps[step];

  return (
    <div className="min-h-screen bg-[#1E293B] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_#4F46E533,_transparent_40%),_radial-gradient(circle_at_bottom_left,_#F9731611,_transparent_40%)]">
      <motion.div 
        key={step}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-white rounded-[40px] p-12 shadow-2xl overflow-hidden relative border border-white/10"
      >
        <div className="absolute top-0 left-0 w-full h-2 flex">
          {steps.map((_, i) => (
            <div key={i} className={cn("flex-1 h-full transition-colors", i <= step ? "bg-primary" : "bg-bg")} />
          ))}
        </div>

        <h2 className="text-4xl font-extrabold text-text tracking-tighter mb-2">{current.title}</h2>
        <p className="text-muted text-lg mb-10 font-medium">{current.subtitle}</p>

        <div className="space-y-4">
          {current.options ? (
            <div className="grid grid-cols-2 gap-4">
              {current.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => setData({ ...data, [current.field]: opt })}
                  className={cn(
                    "p-6 rounded-2xl border-2 transition-all font-black text-left uppercase tracking-tight text-sm hover:border-primary group",
                    data[current.field as keyof UserProfile] === opt ? "border-primary bg-primary/5 text-primary" : "border-bg text-muted"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <input 
              type="text"
              autoFocus
              placeholder={current.placeholder}
              className="w-full p-6 bg-bg border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary font-black text-lg text-text"
              onChange={e => setData({ ...data, [current.field as keyof UserProfile]: e.target.value })}
            />
          )}

          <button 
            disabled={!data[current.field as keyof UserProfile]}
            onClick={handleNext}
            className="w-full py-6 mt-8 bg-text text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed vibrant-shadow group"
          >
            {step === steps.length - 1 ? "Launch EduFin AI" : "Continue"}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Navigator({ profile, isLoading, onSearch, recommendations, onSelect, selectedUniv, onSelectDetails }: any) {
  return (
    <div className="space-y-8">
      <div className="bg-card p-10 rounded-[32px] vibrant-shadow border border-border flex flex-col md:flex-row gap-10 items-center overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="w-24 h-24 bg-primary/10 rounded-[32%] flex items-center justify-center text-primary relative z-10">
          <Globe className="w-10 h-10" />
        </div>
        <div className="flex-1 relative z-10">
          <h3 className="text-2xl font-black text-text mb-2 uppercase tracking-tight">University Matching Engine</h3>
          <p className="text-muted font-medium leading-relaxed">Simulated matching for <b>{profile.targetCountry}</b> in <b>{profile.targetDegree}</b> studies. Our AI evaluates 50,000+ data points for precise fitment.</p>
        </div>
        <button 
          onClick={onSearch}
          disabled={isLoading}
          className="px-10 py-5 bg-primary text-white rounded-2xl font-black flex items-center gap-4 hover:bg-primary/90 transition-all disabled:opacity-50 vibrant-shadow hover:-translate-y-1 active:translate-y-0 group"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
          Generate Matches
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {recommendations.map((univ: UniversityRecommendation, idx: number) => (
          <motion.div 
            key={univ.name} 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onSelectDetails(univ)}
            className="bg-card p-8 rounded-[32px] vibrant-shadow border border-border group hover:border-primary/30 transition-all cursor-pointer overflow-hidden relative"
          >
            <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
              <span className={cn(
                "font-black text-[9px] px-2.5 py-1 rounded uppercase tracking-[0.1em]",
                univ.tier === 1 ? "bg-amber-100 text-amber-600 border border-amber-200" :
                univ.tier === 2 ? "bg-slate-100 text-slate-600 border border-slate-200" :
                "bg-blue-50 text-blue-500 border border-blue-100"
              )}>
                Tier {univ.tier}
              </span>
            </div>
            <div className="probability-badge absolute top-6 right-6 bg-accent/20 text-accent font-black text-[11px] px-4 py-1.5 rounded-full uppercase tracking-widest z-20">
              {idx % 3 === 0 ? '92% Prob.' : idx % 3 === 1 ? '78% Prob.' : '64% Prob.'}
            </div>
            
            <div className="relative z-10 flex flex-col h-full gap-5">
              <div className="flex items-center gap-5 mt-6">
                <div className="w-16 h-16 bg-bg rounded-2xl border border-border flex items-center justify-center font-black text-2xl text-primary shadow-sm group-hover:bg-primary/5 transition-colors overflow-hidden">
                  {univ.image ? (
                    <img src={univ.image} alt={univ.name} className="w-full h-full object-cover"  referrerPolicy="no-referrer" />
                  ) : (
                    univ.name.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="font-black text-xl text-text leading-tight group-hover:text-primary transition-colors">{univ.name}</h4>
                  <p className="text-xs text-muted font-bold uppercase tracking-widest mt-1">{univ.country} • Rank #{univ.ranking}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {univ.courses.map(course => (
                  <span key={course} className="text-[10px] font-black bg-bg text-text border border-border px-3 py-1.5 rounded-xl uppercase tracking-tighter">{course}</span>
                ))}
              </div>

              <div className="mt-4 p-5 bg-bg/50 rounded-2xl border border-border/50">
                  <div className="flex justify-between items-end mb-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted font-black uppercase tracking-widest">Growth ROI Index</span>
                      <span className="text-2xl font-mono font-black text-primary leading-none mt-1">{univ.roiScore}%</span>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] text-muted font-black uppercase tracking-widest">Est. Budget</span>
                        <div className="font-black text-text text-lg leading-none mt-1">{univ.estimatedCost}</div>
                    </div>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-accent transition-all duration-1000 ease-out" style={{ width: `${univ.roiScore}%` }} />
                  </div>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(univ);
                }}
                className={cn(
                  "w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all",
                  selectedUniv?.name === univ.name 
                    ? "bg-accent text-white" 
                    : "bg-primary text-white hover:bg-primary/90"
                )}
              >
                {selectedUniv?.name === univ.name ? "Selected for Enrollment" : "Select & Proceed to Financing"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ROICalc({ profile, recommendations }: any) {
  const data = recommendations.length > 0 ? recommendations : [
    { name: 'Ivy Sample', roiScore: 85, estimatedCost: '₹60 L', country: 'USA' },
    { name: 'Tech State', roiScore: 72, estimatedCost: '₹40 L', country: 'USA' },
    { name: 'Public Global', roiScore: 91, estimatedCost: '₹25 L', country: 'Germany' }
  ];

  const chartData = data.map((u: any) => ({
    name: u.name,
    ROI: u.roiScore,
    Cost: parseInt(u.estimatedCost.replace(/[^0-9]/g, '')) || 50
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 bg-card p-10 rounded-[32px] vibrant-shadow border border-border">
        <div className="flex justify-between items-center mb-10">
          <h3 className="font-black text-2xl flex items-center gap-4 text-text uppercase tracking-tight">
            <TrendingUp className="w-8 h-8 text-primary" /> Career ROI Analytics
          </h3>
          <div className="flex gap-6">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-primary rounded-lg shadow-sm" />
              <span className="text-[11px] text-muted font-black uppercase tracking-widest">ROI INDEX</span>
            </div>
          </div>
        </div>

        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748B', fontSize: 11, fontWeight: 900 }}
                height={60}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748B', fontSize: 11, fontWeight: 900 }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
              />
              <Bar dataKey="ROI" radius={[12, 12, 0, 0]} barSize={50}>
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4F46E5' : '#818CF8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="md:col-span-1 space-y-8">
        <div className="bg-card p-8 rounded-[32px] vibrant-shadow border border-border">
          <div className="flex items-center justify-between mb-8">
              <h4 className="font-black text-[12px] uppercase tracking-[0.2em] text-muted">A+ Profile Health</h4>
              <div className="w-3 h-3 bg-accent rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
          </div>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-3 items-end">
                <span className="text-xs font-black uppercase tracking-widest text-muted">Unsecured Limit</span>
                <span className="text-xl font-mono font-black text-text">₹65.0 L</span>
              </div>
              <div className="w-full h-3 bg-bg rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[75%] shadow-sm" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-3 items-end">
                <span className="text-xs font-black uppercase tracking-widest text-muted">Elite Index</span>
                <span className="text-xl font-mono font-black text-primary">TIER 1</span>
              </div>
              <div className="w-full h-3 bg-bg rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[92%] shadow-sm" />
              </div>
            </div>
            
            <div className="p-5 bg-bg/50 rounded-2xl border border-border italic text-[12px] text-muted font-medium leading-relaxed">
              "Based on your profile, you are eligible for <b>8.25%</b> interest with zero collateral."
            </div>
          </div>
        </div>

        <div className="bg-accent p-10 rounded-[40px] text-white vibrant-shadow overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="font-black text-[12px] uppercase tracking-[0.2em] opacity-80">Predicted Salary</span>
          </div>
          <h4 className="text-5xl font-mono font-black tracking-tighter">$92,500</h4>
          <p className="text-sm font-bold opacity-80 mt-2 hover:opacity-100 transition-opacity">Base Average Post-Graduation</p>
          <div className="mt-8 bg-black/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <p className="text-xs leading-relaxed font-bold">
              Potential to achieve <b>debt-free status</b> in 3.5 years via aggressive repayment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoanCenter({ profile, onApply, selectedUniv }: any) {
  return (
    <div className="space-y-10">
      <div className="bg-card p-10 rounded-[32px] border border-border vibrant-shadow flex items-center justify-between overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_rgba(249,115,22,0.05),_transparent_40%)]" />
        <div className="relative z-10 w-2/3">
          <div className="text-[11px] font-black uppercase text-secondary tracking-[0.2em] mb-3">AI Dynamic Offering</div>
          <h3 className="text-3xl font-black text-text mb-3 leading-none">
            {selectedUniv ? `Financing for ${selectedUniv.name}` : "Pre-Approved Limit Released."}
          </h3>
          <p className="text-muted font-medium mb-8 leading-relaxed">
            {selectedUniv 
              ? `We have analyzed the fee structure of ${selectedUniv.name} and matched it with our credit ecosystem.` 
              : `Based on your potential outcomes in ${profile.targetCountry}, our partners have issued 3 certified quotes.`}
          </p>
          <div className="flex gap-5">
            <button 
              disabled={!selectedUniv}
              onClick={onApply}
              className="px-10 py-5 bg-secondary text-white rounded-2xl font-black hover:bg-secondary/90 shadow-xl shadow-secondary/20 transition-all hover:-translate-y-1 disabled:opacity-50"
            >
              {selectedUniv ? "Apply for Enrollment Loan" : "Select University First"}
            </button>
            <button 
              onClick={() => {
                const toast = document.createElement('div');
                toast.className = 'fixed bottom-10 left-1/2 -translate-x-1/2 bg-text text-white px-8 py-4 rounded-2xl font-black uppercase text-xs z-[300] shadow-2xl animate-in slide-in-from-bottom-5';
                toast.innerText = 'Eligibility Re-analyzed • Tier 1 Consistent';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
              }}
              className="px-10 py-5 bg-white border-2 border-border rounded-2xl font-black text-muted hover:bg-bg transition-all"
            >
              Relook Eligibility
            </button>
          </div>
        </div>
        <div className="w-1/3 flex justify-end relative z-10">
           <div className="w-40 h-40 bg-white shadow-2xl shadow-secondary/10 rounded-full flex items-center justify-center relative p-2 border border-border">
              <div className="w-full h-full border-[10px] border-secondary border-t-transparent rounded-full animate-[spin_4s_linear_infinite]" />
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-[10px] font-black text-muted uppercase tracking-[0.1em]">Credit Score</span>
                <span className="text-3xl font-mono font-black text-secondary">780</span>
                <span className="text-[10px] font-black text-accent uppercase">Tier 1 Elite</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {MOCK_LOANS.map((loan, idx) => (
          <motion.div 
            key={loan.bankName}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card p-8 rounded-[32px] vibrant-shadow border border-border flex flex-col md:flex-row items-center gap-10 group hover:border-secondary transition-all cursor-pointer"
          >
            <div className="flex items-center gap-10 flex-1">
                <div className="w-20 h-20 bg-bg rounded-[32px] flex items-center justify-center font-black text-3xl text-secondary border border-border group-hover:bg-secondary/5 transition-colors">
                {loan.bankName.charAt(0)}
                </div>
                <div>
                <h4 className="font-black text-2xl text-text leading-none">{loan.bankName}</h4>
                <p className="text-xs text-muted font-bold uppercase tracking-widest mt-2">{loan.tenure} tenure • No Collateral Required</p>
                </div>
            </div>
            
            <div className="flex items-center gap-16 px-10 border-x border-border/50">
                <div className="text-center">
                    <p className="text-[10px] uppercase font-black text-muted tracking-[0.2em] mb-2">Interest</p>
                    <p className="text-2xl font-mono font-black text-secondary">{loan.interestRate}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] uppercase font-black text-muted tracking-[0.2em] mb-2">Max Amount</p>
                    <p className="text-2xl font-mono font-black text-text">{loan.maxAmount}</p>
                </div>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                onApply();
              }}
              className="px-8 py-4 bg-text text-white rounded-2xl font-black uppercase text-[12px] tracking-widest hover:bg-primary transition-all vibrant-shadow"
            >
              Apply Now
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DocVault({ documents, onUpload }: { documents: Document[], onUpload: (d: Document) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      const newDoc: Document = {
        id: `d${Date.now()}`,
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        status: 'Pending',
        uploadDate: new Date().toISOString().split('T')[0],
        category: 'Finance'
      };
      onUpload(newDoc);
      setIsUploading(false);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#4F46E5', '#10B981']
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 relative">
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />

      <AnimatePresence>
        {selectedDoc && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-text/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setSelectedDoc(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-lg rounded-[32px] p-10 shadow-2xl overflow-hidden relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <div className="bg-primary/5 text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Document Registry</div>
                <button onClick={() => setSelectedDoc(null)} className="p-2 hover:bg-bg rounded-xl transition-colors">
                  <LogOut className="w-5 h-5 opacity-50 rotate-180" />
                </button>
              </div>

              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary">
                  <FileText className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-text leading-tight">{selectedDoc.name}</h3>
                  <p className="text-muted font-bold uppercase text-xs tracking-widest mt-1">Status: <span className="text-accent">{selectedDoc.status}</span></p>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex justify-between p-4 bg-bg rounded-2xl border border-border">
                   <span className="text-xs font-black text-muted uppercase tracking-widest">Type</span>
                   <span className="text-xs font-bold text-text">{selectedDoc.type}</span>
                </div>
                <div className="flex justify-between p-4 bg-bg rounded-2xl border border-border">
                   <span className="text-xs font-black text-muted uppercase tracking-widest">Category</span>
                   <span className="text-xs font-bold text-text">{selectedDoc.category}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    const toast = document.createElement('div');
                    toast.className = 'fixed top-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs z-[300] shadow-2xl animate-in slide-in-from-top-5';
                    toast.innerText = `Downloading ${selectedDoc.name}...`;
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 3000);
                  }}
                  className="flex-1 py-4 bg-text text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-primary transition-all"
                >
                  Download Copy
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-4 bg-bg rounded-2xl font-black uppercase text-xs tracking-[0.2em] text-muted hover:bg-border transition-all"
                >
                  Replace
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
           <div className="bg-white p-8 rounded-[32px] border border-border vibrant-shadow">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="font-black text-xl text-text uppercase tracking-tight">Required Documents</h3>
                 <button 
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : '+ Upload New'}
                </button>
              </div>
              <div className="space-y-4">
                 {documents.map(doc => (
                   <div 
                    key={doc.id} 
                    onClick={() => setSelectedDoc(doc)}
                    className="p-5 bg-bg/30 rounded-2xl border border-border flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer"
                   >
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-border group-hover:bg-primary/5 transition-colors">
                            <FileText className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                         </div>
                         <div>
                            <h4 className="font-bold text-text group-hover:text-primary transition-colors">{doc.name}</h4>
                            <p className="text-[10px] text-muted font-bold uppercase tracking-widest">{doc.category} • Uploaded {doc.uploadDate}</p>
                         </div>
                      </div>
                      <div className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                        doc.status === 'Verified' ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"
                      )}>
                        {doc.status}
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-primary p-8 rounded-[32px] text-white vibrant-shadow relative overflow-hidden">
              <div className="relative z-10">
                <ShieldCheck className="w-10 h-10 mb-5 text-indigo-100" />
                <h4 className="text-xl font-black leading-tight mb-3">AI Verification Shield</h4>
                <p className="text-xs text-indigo-50 font-medium leading-relaxed mb-6 italic">"Your identity and academic documents are 100% compliant with UK visa standards."</p>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                   <div className="h-full bg-white w-full shadow-lg" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest mt-3">Compliance: 100%</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function CommunityHub() {
  const posts = [
    { user: 'Rohan M.', univ: 'Penn State', message: 'Just got my visa approved! The AI mentor helped so much with the SOP.', time: '12m ago' },
    { user: 'Sarah K.', univ: 'UCL London', message: 'Anyone heading to London this Fall? Looking for flatmates!', time: '1h ago' },
    { user: 'Kevin J.', univ: 'Stanford', message: 'AI Predicted ROI was 100% spot on for my internship offer.', time: '3h ago' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
       <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-border shadow-sm flex items-center gap-4">
             <div className="w-12 h-12 bg-bg rounded-2xl flex items-center justify-center text-muted">
                <User className="w-6 h-6" />
             </div>
             <input 
              type="text" 
              placeholder="Share your win with the global community..." 
              className="flex-1 bg-transparent focus:outline-none font-bold text-text" 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const toast = document.createElement('div');
                  toast.className = 'fixed bottom-10 right-10 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-xs z-[300] shadow-2xl animate-in fade-in slide-in-from-right-5';
                  toast.innerText = 'Post Published! 🚀';
                  document.body.appendChild(toast);
                  setTimeout(() => toast.remove(), 3000);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
             <button 
              onClick={() => {
                const toast = document.createElement('div');
                toast.className = 'fixed bottom-10 right-10 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-xs z-[300] shadow-2xl animate-in fade-in slide-in-from-right-5';
                toast.innerText = 'Post Published! 🚀';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
                const input = document.querySelector('input[placeholder="Share your win with the global community..."]') as HTMLInputElement;
                if (input) input.value = '';
              }}
              className="p-3 bg-primary text-white rounded-xl active:scale-90 transition-transform"
             >
                <Send className="w-5 h-5" />
             </button>
          </div>

          <div className="space-y-6">
            {posts.map((post, i) => (
              <div key={i} className="bg-white p-8 rounded-[32px] border border-border vibrant-shadow flex gap-6 group hover:translate-x-1 transition-all">
                 <div className="w-14 h-14 bg-bg rounded-2xl border border-border overflow-hidden flex-shrink-0">
                    <img src={`https://picsum.photos/seed/${post.user}/60/60`} alt="" referrerPolicy="no-referrer" />
                 </div>
                 <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                       <h4 className="font-black text-text">{post.user} <span className="text-muted font-bold text-xs">@ {post.univ}</span></h4>
                       <span className="text-[10px] text-muted font-bold uppercase">{post.time}</span>
                    </div>
                    <p className="text-sm font-medium text-muted leading-relaxed">{post.message}</p>
                    <div className="mt-4 flex gap-4">
                       <button 
                        onClick={(e) => {
                          const btn = e.currentTarget;
                          btn.innerText = 'Supported! ❤️';
                          btn.classList.add('text-accent');
                        }}
                        className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                       >
                        Support
                       </button>
                       <button 
                        onClick={(e) => {
                          const btn = e.currentTarget;
                          btn.innerText = 'Opening Thread...';
                          setTimeout(() => btn.innerText = 'Comment', 2000);
                        }}
                        className="text-[10px] font-black text-muted uppercase tracking-widest hover:underline"
                       >
                        Comment
                       </button>
                    </div>
                 </div>
              </div>
            ))}
          </div>
       </div>

       <div className="space-y-8">
          <div className="bg-card p-8 rounded-[32px] border border-border vibrant-shadow">
             <h3 className="font-black text-[12px] uppercase tracking-widest text-muted mb-6 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Global Trending
             </h3>
             <div className="space-y-4">
                {['#UKVisaRules', '#Masters2025', '#StanfordFinance', '#EduFinGlobal'].map(t => (
                  <div key={t} className="flex justify-between items-center group cursor-pointer">
                     <span className="text-sm font-bold text-text group-hover:text-primary transition-colors">{t}</span>
                     <span className="text-[10px] font-bold text-muted uppercase">{(Math.random() * 10).toFixed(1)}k posts</span>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
}

function Mentor({ messages, setMessages, isMentorLoading, setIsMentorLoading }: any) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isMentorLoading) return;
    
    const newMessages = [...messages, { role: 'user' as const, content: input }];
    setMessages(newMessages);
    setInput('');
    setIsMentorLoading(true);

    try {
      const response = await getMentorResponse(newMessages, input);
      setMessages([...newMessages, { role: 'assistant' as const, content: response || "I'm sorry, I couldn't reach the AI." }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant' as const, content: "Error connecting to AI. Please try again." }]);
    } finally {
      setIsMentorLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-[32px] vibrant-shadow border border-border h-[calc(100vh-250px)] flex flex-col overflow-hidden">
      <div className="p-8 border-b border-border flex items-center gap-5">
        <div className="relative">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full border-4 border-white" />
        </div>
        <div>
          <h3 className="font-black text-xl text-text leading-tight">AI Education Mentor</h3>
          <p className="text-[10px] text-accent font-black uppercase tracking-[0.2em]">Live • Advanced Advisory 2.0</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide bg-bg/10">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center text-primary/30">
               <MessageCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
                <p className="text-lg font-black text-text tracking-tight uppercase italic">"Ask me anything."</p>
                <p className="text-sm font-medium text-muted max-w-sm px-6">Direct access to our neural network for visa, financing, and admission strategies.</p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center max-w-md">
              {['Is USA better than Germany for CS?', 'Unsecured loan for ₹50L?', 'STEM visa rules 2025'].map(q => (
                <button 
                  key={q} 
                  onClick={() => setInput(q)}
                  className="px-4 py-2 bg-white border border-border rounded-xl text-xs font-black text-muted hover:border-primary hover:text-primary transition-all vibrant-shadow"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m: any, i: number) => (
          <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[75%] px-6 py-4 rounded-[24px] text-sm leading-relaxed",
              m.role === 'user' ? "bg-primary text-white rounded-tr-none vibrant-shadow font-medium" : "bg-white text-text rounded-tl-none border border-border vibrant-shadow prose-sm font-medium"
            )}>
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isMentorLoading && (
          <div className="flex justify-start">
            <div className="bg-white px-6 py-4 rounded-[24px] rounded-tl-none border border-border vibrant-shadow flex gap-2 items-center">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-border bg-white">
        <div className="flex gap-5 p-3 bg-bg border border-border rounded-2xl">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask your AI Mentor about visa or financing..."
            className="flex-1 px-4 py-2 bg-transparent focus:outline-none font-bold text-text placeholder:text-muted/50"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isMentorLoading}
            className="px-6 bg-primary text-white rounded-xl font-black uppercase text-[12px] tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            Send <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function EnrollmentSummary({ selectedUniv, profile, onClose }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[150] bg-text/95 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto"
    >
      <motion.div 
        initial={{ y: 50, scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        className="w-full max-w-2xl bg-white rounded-[40px] p-10 md:p-14 shadow-2xl relative overflow-hidden my-auto"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
        
        <div className="flex justify-between items-start mb-10 relative z-10">
          <div>
            <div className="bg-accent/10 text-accent text-[11px] font-black uppercase px-4 py-1.5 rounded-full inline-block mb-3">Enrollment Confirmed</div>
            <h2 className="text-4xl font-black text-text tracking-tighter leading-none">Congratulations, {profile.name}!</h2>
          </div>
          <button onClick={onClose} className="p-3 bg-bg rounded-2xl hover:bg-border transition-colors">
            <LogOut className="w-6 h-6 rotate-180" />
          </button>
        </div>

        <div className="space-y-10 relative z-10">
          <div className="bg-bg/50 border border-border rounded-[32px] p-8 flex items-center gap-8 shadow-sm">
             <div className="w-24 h-24 bg-white border border-border rounded-[32%] flex items-center justify-center font-black text-4xl text-primary shadow-xl">
                {selectedUniv.name.charAt(0)}
             </div>
             <div>
               <h4 className="text-2xl font-black text-text leading-tight">{selectedUniv.name}</h4>
               <p className="text-muted font-bold text-sm uppercase tracking-widest mt-1">{profile.targetDegree} • {selectedUniv.country}</p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
             <div className="p-8 bg-card rounded-[32px] border border-border vibrant-shadow">
                <span className="text-[10px] uppercase font-black text-muted tracking-widest block mb-1">Total Fee Structure</span>
                <span className="text-2xl font-mono font-black text-text">{selectedUniv.estimatedCost}</span>
             </div>
             <div className="p-8 bg-card rounded-[32px] border border-border vibrant-shadow">
                <span className="text-[10px] uppercase font-black text-muted tracking-widest block mb-1">Financing Status</span>
                <span className="text-2xl font-mono font-black text-accent uppercase">Approved</span>
             </div>
          </div>

          <div className="p-8 bg-primary text-white rounded-[32px] vibrant-shadow shadow-primary/20">
             <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-indigo-200" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">AI Next Steps</span>
             </div>
             <p className="font-bold text-lg leading-snug">Visa documentation for {selectedUniv.country} will be sent to your email. Expect your student ID generation within 48 hours.</p>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-6 bg-text text-white rounded-[24px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-primary transition-all active:scale-95"
          >
            Go to My Student Portal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function UniversityProfileModal({ univ, onClose }: { univ: UniversityRecommendation, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-text/60 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-5xl bg-bg rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col md:flex-row h-[90vh]"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 z-50 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all border border-white/20"
        >
          <LogOut className="w-6 h-6 rotate-180" />
        </button>

        {/* Left Span: Visual & Top Info */}
        <div className="w-full md:w-2/5 relative overflow-hidden">
          <img 
            src={univ.image || `https://picsum.photos/seed/${univ.name}/1000/1200`} 
            alt={univ.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-text/90 via-text/20 to-transparent flex flex-col justify-end p-12">
            <div className="flex items-center gap-3 mb-4">
              <span className={cn(
                "px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest",
                univ.tier === 1 ? "bg-amber-400 text-text" : "bg-white text-text"
              )}>
                Tier {univ.tier} Member
              </span>
              <span className="px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest bg-primary/20 text-white border border-white/20 backdrop-blur-sm">
                Rank #{univ.ranking}
              </span>
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter leading-none mb-4">{univ.name}</h2>
            <p className="text-white/80 font-bold text-lg mb-6 italic">"{univ.description}"</p>
            
            <div className="flex gap-4">
               <div className="flex flex-col">
                  <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Global ROI</span>
                  <span className="text-3xl font-mono font-black text-white">{univ.roiScore}%</span>
               </div>
               <div className="w-[1px] h-10 bg-white/20 mx-2" />
               <div className="flex flex-col">
                  <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Est. Yearly Cost</span>
                  <span className="text-3xl font-mono font-black text-white">{univ.estimatedCost}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Right Span: Records & Data */}
        <div className="flex-1 overflow-y-auto bg-white p-8 md:p-14 space-y-12 scrollbar-none">
          {/* Section 1: Contacts & Reception */}
          <section>
            <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-muted mb-8 flex items-center gap-3">
              <Building2 className="w-5 h-5 text-primary" /> Official Reception & Channels
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-bg rounded-2xl text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted tracking-tight">Admissions Email</p>
                    <p className="font-bold text-text">{univ.contact?.email || 'admissions@university.edu'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-bg rounded-2xl text-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted tracking-tight">Direct Line</p>
                    <p className="font-bold text-text">{univ.contact?.phone || '+1-000-0000'}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-bg/50 rounded-[32px] border border-border">
                <div className="p-3 bg-white rounded-2xl text-primary shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-muted tracking-tight mb-1">Campus Reception</p>
                  <p className="text-sm font-bold text-text leading-relaxed">{univ.contact?.reception || 'Campus Contact Desk, Main Hall'}</p>
                  <button className="mt-3 flex items-center gap-2 text-[10px] font-black text-primary uppercase hover:underline">
                    View on Map <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Placements & Economic Data */}
          <section>
            <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-muted mb-8 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-secondary" /> Placement & ROI Records
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 p-8 bg-text text-white rounded-[32px] shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">Average Graduate Salary</p>
                  <p className="text-3xl font-mono font-black">{univ.placements?.avgPackage || '$95,000'}</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              </div>
              <div className="md:col-span-2 p-8 bg-bg rounded-[32px] border border-border">
                 <p className="text-[10px] font-black uppercase text-muted mb-4 tracking-widest">Top Global Recruiters</p>
                 <div className="flex flex-wrap gap-3">
                   {(univ.placements?.topRecruiters || ['Google', 'Microsoft', 'Deloitte']).map(r => (
                     <span key={r} className="px-5 py-2.5 bg-white rounded-xl border border-border font-black text-xs text-text shadow-sm">{r}</span>
                   ))}
                 </div>
              </div>
            </div>
          </section>

          {/* Section 3: Alumni & History */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-muted mb-6 flex items-center gap-3">
                <Users className="w-5 h-5 text-accent" /> Notable Alumni
              </h3>
              <div className="space-y-4">
                {(univ.notableAlumni || ['Prominent Industry Leader', 'Acclaimed Researcher']).map((a, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-[35%] bg-accent/10 flex items-center justify-center font-black text-accent text-sm group-hover:bg-accent group-hover:text-white transition-all transform group-hover:rotate-12">
                      {i + 1}
                    </div>
                    <span className="font-bold text-text text-lg tracking-tight group-hover:translate-x-1 transition-transform">{a}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-muted mb-6 flex items-center gap-3">
                <History className="w-5 h-5 text-primary" /> Legacy & Records
              </h3>
              <div className="p-8 bg-bg rounded-[40px] border border-border relative">
                 <p className="text-sm font-medium text-muted leading-relaxed italic relative z-10">"{univ.history || 'A long-standing tradition of academic excellence and research innovation.'}"</p>
                 <div className="mt-6 flex items-center gap-3">
                   <div className="w-12 h-1 bg-primary/20 rounded-full" />
                   <span className="text-[10px] font-black uppercase text-primary/50">ESTABLISHED RESEARCH CENTER</span>
                 </div>
              </div>
            </div>
          </section>

          <div className="pt-8 flex flex-col gap-4">
            <button 
              onClick={() => {
                onClose();
              }}
              className="w-full py-6 bg-primary text-white rounded-[24px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              Start Enrollment Track <Sparkles className="w-5 h-5" />
            </button>
            <p className="text-center text-[10px] text-muted font-bold uppercase tracking-widest">Connect directly via official channels above for verified information.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
