"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Brain,
  LayoutDashboard,
  History,
  BarChart3,
  Settings,
  Plus,
  Flame,
  Trophy,
  Clock,
  Target,
  ChevronRight,
  Play,
  Share2,
  Search,
  Sparkles,
  BookOpen,
  User,
  CreditCard,
  Lock,
  Trash2,
  LogOut,
  Calendar,
  X,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Menu,
} from "lucide-react";

interface DashboardClientProps {
  initialSession: any;
}

// Mock user, quizzes, attempts, and statistics for high-fidelity UX preview
const MOCK_USER = {
  name: "Amandeep Singh",
  email: "amandeep@example.com",
  image: null,
  tier: "Premium Creator",
  creditsUsed: 12,
  creditsTotal: 30,
};

const MOCK_STATS = {
  totalQuizzesTaken: 34,
  totalQuestionsAnswered: 340,
  correctlyAnswered: 272,
  accuracy: 80,
  currentStreak: 5,
  maxStreak: 12,
  totalStudyTime: 245, // in minutes
};

const MOCK_RECENT_ATTEMPTS = [
  {
    id: 1,
    quizTitle: "Next.js 15 App Router Deep Dive",
    topic: "Web Development",
    difficulty: "Hard",
    score: 8,
    totalQuestions: 10,
    percentage: 80,
    timeTaken: 380, // seconds
    completedAt: "2026-07-14T18:24:00Z",
  },
  {
    id: 2,
    quizTitle: "Quantum Mechanics Fundamentals",
    topic: "Physics",
    difficulty: "Medium",
    score: 9,
    totalQuestions: 10,
    percentage: 90,
    timeTaken: 290,
    completedAt: "2026-07-13T10:15:00Z",
  },
  {
    id: 3,
    quizTitle: "Modern World History 1900s",
    topic: "History",
    difficulty: "Easy",
    score: 7,
    totalQuestions: 10,
    percentage: 70,
    timeTaken: 195,
    completedAt: "2026-07-11T14:40:00Z",
  },
  {
    id: 4,
    quizTitle: "Data Structures & Algorithms in JS",
    topic: "Computer Science",
    difficulty: "Hard",
    score: 6,
    totalQuestions: 8,
    percentage: 75,
    timeTaken: 450,
    completedAt: "2026-07-09T21:05:00Z",
  },
];

const MOCK_CREATED_QUIZZES = [
  {
    id: 101,
    title: "React 19 Features & Server Actions",
    topic: "ReactJS",
    difficulty: "Hard",
    questionsCount: 10,
    timeLimit: 15, // mins
    visibility: "public",
    playsCount: 42,
    createdAt: "2026-07-10T12:00:00Z",
  },
  {
    id: 102,
    title: "Docker & Containerization Basics",
    topic: "DevOps",
    difficulty: "Medium",
    questionsCount: 8,
    timeLimit: 12,
    visibility: "private",
    playsCount: 3,
    createdAt: "2026-07-08T09:30:00Z",
  },
  {
    id: 103,
    title: "English Grammar & Vocabulary Builder",
    topic: "Language",
    difficulty: "Easy",
    questionsCount: 15,
    timeLimit: 20,
    visibility: "public",
    playsCount: 128,
    createdAt: "2026-06-25T16:45:00Z",
  },
];

const MOCK_RECOMMENDED_TOPICS = [
  {
    topic: "CSS Grid & Flexbox",
    category: "Design",
    questions: 10,
    color: "from-amber-500 to-orange-600",
  },
  {
    topic: "TypeScript Advanced Types",
    category: "Coding",
    questions: 12,
    color: "from-blue-500 to-indigo-600",
  },
  {
    topic: "Ancient Roman Empire",
    category: "History",
    questions: 8,
    color: "from-emerald-500 to-teal-600",
  },
  {
    topic: "Machine Learning Basics",
    category: "AI/ML",
    questions: 10,
    color: "from-purple-500 to-pink-600",
  },
];

export default function DashboardClient({ initialSession }: DashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "quizzes" | "history" | "analytics" | "settings"
  >("overview");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [historyFilter, setHistoryFilter] = useState("all");

  // Form states for creating a quiz
  const [quizTopic, setQuizTopic] = useState("");
  const [quizDifficulty, setQuizDifficulty] = useState("medium");
  const [quizNumQuestions, setQuizNumQuestions] = useState(10);
  const [quizTimeLimit, setQuizTimeLimit] = useState(10);

  // User session resolution
  const user = initialSession?.user || MOCK_USER;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  // Filter created quizzes
  const filteredQuizzes = MOCK_CREATED_QUIZZES.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter history attempts
  const filteredHistory = MOCK_RECENT_ATTEMPTS.filter((attempt) => {
    const matchesSearch =
      attempt.quizTitle.toLowerCase().includes(historySearch.toLowerCase()) ||
      attempt.topic.toLowerCase().includes(historySearch.toLowerCase());
    const matchesDifficulty =
      historyFilter === "all" || attempt.difficulty.toLowerCase() === historyFilter.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  // Share Quiz simulation handler
  const handleShareQuiz = (quizId: number) => {
    alert(`Mock link copied! Share quiz: ${window.location.origin}/quiz/${quizId}`);
  };

  // Generate heatmap items (last 12 weeks - 84 cells)
  const renderHeatmap = () => {
    const cells = [];
    const seed = [
      0, 0, 1, 0, 2, 0, 0, 3, 0, 1, 0, 0, 2, 0, 4, 1, 0, 0, 0, 2, 1, 0, 0, 0, 3, 0, 0, 1, 2, 0, 0,
      0, 0, 1, 0, 3, 0, 2, 0, 0, 1, 0, 0, 0, 0, 1, 2, 0, 0, 3, 0, 0, 1, 0, 0, 2, 0, 0, 0, 1, 0, 4,
      0, 0, 2, 0, 0, 1, 0, 0, 0, 3, 0, 1, 0, 0, 2, 0, 0, 1, 0, 2, 0, 1,
    ];
    for (let i = 0; i < 84; i++) {
      const level = seed[i % seed.length];
      let bgClass = "bg-white/5";
      if (level === 1) bgClass = "bg-pink-500/20";
      else if (level === 2) bgClass = "bg-pink-500/40";
      else if (level === 3) bgClass = "bg-purple-500/60";
      else if (level === 4) bgClass = "bg-purple-500/90";

      cells.push(
        <div
          key={i}
          className={`w-3.5 h-3.5 rounded-sm transition-all duration-200 hover:scale-125 hover:ring-1 hover:ring-white ${bgClass}`}
          title={`Day ${i + 1}: ${level} attempts`}
        />
      );
    }
    return cells;
  };

  return (
    <div className="min-h-screen w-full relative flex font-sans selection:bg-pink-500/30 selection:text-pink-200 bg-[#050409]">
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 grid-bg opacity-[0.15] pointer-events-none z-0"></div>

      {/* ----------------- DESKTOP SIDEBAR ----------------- */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 z-20 sticky top-0 h-screen glass-card select-none">
        {/* Brand Logo */}
        <div className="p-6 border-b border-white/5 flex items-center gap-2.5">
          <div className="relative">
            <div className="absolute inset-0 bg-pink-500 rounded-full blur-md opacity-75"></div>
            <Brain className="relative w-7 h-7 text-pink-500 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-zinc-100 to-pink-500 bg-clip-text text-transparent tracking-tight">
            MindRush
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === "overview"
                ? "bg-white/5 text-white border-l-2 border-pink-500 pl-3.5"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            <LayoutDashboard
              className={`w-4 h-4 ${activeTab === "overview" ? "text-pink-500" : "text-zinc-500"}`}
            />
            Overview
          </button>

          <button
            onClick={() => setActiveTab("quizzes")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === "quizzes"
                ? "bg-white/5 text-white border-l-2 border-pink-500 pl-3.5"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            <BookOpen
              className={`w-4 h-4 ${activeTab === "quizzes" ? "text-pink-500" : "text-zinc-500"}`}
            />
            My Quizzes
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === "history"
                ? "bg-white/5 text-white border-l-2 border-pink-500 pl-3.5"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            <History
              className={`w-4 h-4 ${activeTab === "history" ? "text-pink-500" : "text-zinc-500"}`}
            />
            Quiz History
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === "analytics"
                ? "bg-white/5 text-white border-l-2 border-pink-500 pl-3.5"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            <BarChart3
              className={`w-4 h-4 ${activeTab === "analytics" ? "text-pink-500" : "text-zinc-500"}`}
            />
            Analytics
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === "settings"
                ? "bg-white/5 text-white border-l-2 border-pink-500 pl-3.5"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            <Settings
              className={`w-4 h-4 ${activeTab === "settings" ? "text-pink-500" : "text-zinc-500"}`}
            />
            Settings
          </button>
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-3 mb-3">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-9 h-9 rounded-full ring-1 ring-pink-500/20"
              />
            ) : (
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-tr from-pink-500 to-purple-600">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20 font-medium">
                {MOCK_USER.tier}
              </span>
            </div>
          </div>

          {/* AI Usage Tracker */}
          <div className="space-y-1 mb-4">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-400">Monthly AI Credits</span>
              <span className="text-zinc-200 font-semibold">
                {MOCK_USER.creditsUsed}/{MOCK_USER.creditsTotal}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                style={{ width: `${(MOCK_USER.creditsUsed / MOCK_USER.creditsTotal) * 100}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-200 cursor-pointer border border-transparent hover:border-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ----------------- MOBILE NAVIGATION BAR ----------------- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050409]/95 backdrop-blur-md border-t border-white/5 px-2 py-2 flex justify-around">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
            activeTab === "overview" ? "text-pink-500" : "text-zinc-400"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium">Overview</span>
        </button>
        <button
          onClick={() => setActiveTab("quizzes")}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
            activeTab === "quizzes" ? "text-pink-500" : "text-zinc-400"
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium">My Quizzes</span>
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
            activeTab === "history" ? "text-pink-500" : "text-zinc-400"
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px] font-medium">History</span>
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
            activeTab === "analytics" ? "text-pink-500" : "text-zinc-400"
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-medium">Analytics</span>
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
            activeTab === "settings" ? "text-pink-500" : "text-zinc-400"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </nav>

      {/* ----------------- MAIN VIEWPORT ----------------- */}
      <main className="flex-1 min-w-0 z-10 flex flex-col pb-24 lg:pb-8">
        {/* Mobile Header Banner */}
        <header className="lg:hidden p-4 flex items-center justify-between border-b border-white/5 bg-[#050409]/60 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-pink-500" />
            <span className="text-lg font-bold bg-gradient-to-r from-white via-zinc-100 to-pink-500 bg-clip-text text-transparent">
              MindRush
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-gradient p-2 rounded-xl text-white shadow-md shadow-pink-500/20"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div
              onClick={() => setActiveTab("settings")}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-tr from-pink-500 to-purple-600"
            >
              {initials}
            </div>
          </div>
        </header>

        <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
          {/* ----------------- VIEW 1: OVERVIEW ----------------- */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fadeIn">
              {/* Header Banner Section */}
              <div className="relative glass-card rounded-3xl p-6 md:p-8 overflow-hidden border border-white/5">
                {/* Glow lights behind */}
                <div className="absolute right-0 top-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                      Welcome back,{" "}
                      <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                        {user.name.split(" ")[0]}
                      </span>
                      !
                    </h2>
                    <p className="text-sm md:text-base text-zinc-400 mt-2 max-w-xl">
                      Ready to boost your knowledge today? Choose a recommended topic below or
                      construct a custom quiz using the power of AI.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn-gradient shrink-0 px-6 py-3.5 rounded-2xl text-sm font-semibold text-white shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 fill-white/10" />
                    Create Custom Quiz
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stat Item 1: Streak */}
                <div className="glass-card rounded-2xl p-4 md:p-5 flex items-center gap-4 relative overflow-hidden">
                  <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                    <Flame className="w-5 h-5 fill-amber-500/10 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 font-medium">Daily Streak</p>
                    <h4 className="text-lg md:text-xl font-bold text-white mt-1">
                      {MOCK_STATS.currentStreak}{" "}
                      <span className="text-xs font-normal text-zinc-500">days</span>
                    </h4>
                    <p className="text-[10px] text-amber-500/80 font-medium mt-0.5">
                      Best: {MOCK_STATS.maxStreak} days
                    </p>
                  </div>
                </div>

                {/* Stat Item 2: Accuracy */}
                <div className="glass-card rounded-2xl p-4 md:p-5 flex items-center gap-4 relative overflow-hidden">
                  <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl">
                    <Target className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-400 font-medium">Avg Accuracy</p>
                    <h4 className="text-lg md:text-xl font-bold text-white mt-1">
                      {MOCK_STATS.accuracy}%
                    </h4>
                    <div className="w-full bg-white/5 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-pink-500 rounded-full"
                        style={{ width: `${MOCK_STATS.accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Stat Item 3: Total Quizzes */}
                <div className="glass-card rounded-2xl p-4 md:p-5 flex items-center gap-4 relative overflow-hidden">
                  <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 font-medium">Quizzes Completed</p>
                    <h4 className="text-lg md:text-xl font-bold text-white mt-1">
                      {MOCK_STATS.totalQuizzesTaken}
                    </h4>
                    <p className="text-[10px] text-purple-400/80 font-medium mt-0.5">
                      Top 8% this week
                    </p>
                  </div>
                </div>

                {/* Stat Item 4: Study Time */}
                <div className="glass-card rounded-2xl p-4 md:p-5 flex items-center gap-4 relative overflow-hidden">
                  <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 font-medium">Study Time</p>
                    <h4 className="text-lg md:text-xl font-bold text-white mt-1">
                      {Math.round(MOCK_STATS.totalStudyTime / 60)}h {MOCK_STATS.totalStudyTime % 60}
                      m
                    </h4>
                    <p className="text-[10px] text-indigo-400/80 font-medium mt-0.5">
                      +15% vs last week
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Topics */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  Quick AI Templates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {MOCK_RECOMMENDED_TOPICS.map((topic, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setQuizTopic(topic.topic);
                        setIsCreateModalOpen(true);
                      }}
                      className="glass-card rounded-2xl p-5 hover:border-pink-500/30 transition-all duration-300 cursor-pointer relative group overflow-hidden"
                    >
                      <div
                        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${topic.color} opacity-[0.05] group-hover:opacity-10 rounded-full blur-xl transition-all duration-300`}
                      ></div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/5 font-semibold">
                        {topic.category}
                      </span>
                      <h4 className="text-base font-bold text-white mt-3 group-hover:text-pink-400 transition-colors">
                        {topic.topic}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1">
                        {topic.questions} AI questions • 10m
                      </p>
                      <div className="flex items-center gap-1 text-xs text-pink-500 font-semibold mt-4 group-hover:gap-2 transition-all">
                        Generate Now
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content Grid: Attempts & Heatmap */}
              <div className="grid grid-cols-12 gap-8">
                {/* Left Side: Recent Attempts Table (8 cols on desktop) */}
                <div className="col-span-12 lg:col-span-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                      <History className="w-4 h-4 text-zinc-400" />
                      Recent Quiz Attempts
                    </h3>
                    <button
                      onClick={() => setActiveTab("history")}
                      className="text-xs text-pink-500 hover:text-pink-400 font-semibold transition-colors flex items-center gap-0.5 cursor-pointer"
                    >
                      View All History
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 bg-white/[0.01]">
                            <th className="p-4 text-xs font-semibold text-zinc-400">Quiz Topic</th>
                            <th className="p-4 text-xs font-semibold text-zinc-400">Difficulty</th>
                            <th className="p-4 text-xs font-semibold text-zinc-400">Score</th>
                            <th className="p-4 text-xs font-semibold text-zinc-400">Accuracy</th>
                            <th className="p-4 text-xs font-semibold text-zinc-400">Date</th>
                            <th className="p-4 text-xs font-semibold text-zinc-400 text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {MOCK_RECENT_ATTEMPTS.map((attempt) => (
                            <tr
                              key={attempt.id}
                              className="hover:bg-white/[0.01] transition-colors"
                            >
                              <td className="p-4">
                                <div className="font-semibold text-white text-sm">
                                  {attempt.quizTitle}
                                </div>
                                <div className="text-[11px] text-zinc-500">{attempt.topic}</div>
                              </td>
                              <td className="p-4">
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                                    attempt.difficulty === "Easy"
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                      : attempt.difficulty === "Medium"
                                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                                  }`}
                                >
                                  {attempt.difficulty}
                                </span>
                              </td>
                              <td className="p-4 text-sm font-semibold text-white">
                                {attempt.score} / {attempt.totalQuestions}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-zinc-300">
                                    {attempt.percentage}%
                                  </span>
                                  <div className="w-12 bg-white/5 h-1 rounded-full overflow-hidden hidden sm:block">
                                    <div
                                      className={`h-full rounded-full ${
                                        attempt.percentage >= 80
                                          ? "bg-emerald-500"
                                          : attempt.percentage >= 60
                                            ? "bg-amber-500"
                                            : "bg-red-500"
                                      }`}
                                      style={{ width: `${attempt.percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-xs text-zinc-400">
                                {new Date(attempt.completedAt).toLocaleDateString()}
                              </td>
                              <td className="p-4 text-right">
                                <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all cursor-pointer">
                                  Review
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right Side: Weekly Activity Heatmap (4 cols on desktop) */}
                <div className="col-span-12 lg:col-span-4 space-y-4">
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    Learning Intensity
                  </h3>

                  <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
                    <div>
                      <p className="text-xs text-zinc-400 font-medium">
                        Activity Log (Past 12 Weeks)
                      </p>
                      <h4 className="text-xl font-extrabold text-white mt-1">14 Active Days</h4>
                    </div>

                    {/* Heatmap Grid wrapper */}
                    <div className="flex flex-col gap-1.5 self-center">
                      <div className="grid grid-flow-col grid-rows-7 gap-1">{renderHeatmap()}</div>
                      <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-1 px-1">
                        <span>Less</span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-sm bg-white/5"></div>
                          <div className="w-2 h-2 rounded-sm bg-pink-500/20"></div>
                          <div className="w-2 h-2 rounded-sm bg-pink-500/40"></div>
                          <div className="w-2 h-2 rounded-sm bg-purple-500/60"></div>
                          <div className="w-2 h-2 rounded-sm bg-purple-500/90"></div>
                        </div>
                        <span>More</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-zinc-400 flex items-start gap-2.5 mt-2">
                      <Flame className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white">Daily Streak Active!</span> Keep
                        answering quizzes everyday to unlock premium achievements.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------- VIEW 2: MY QUIZZES ----------------- */}
          {activeTab === "quizzes" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header with Search and Create button */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">
                    My Created Quizzes
                  </h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    Manage, share, and play the customized quizzes you generated.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setQuizTopic("");
                    setIsCreateModalOpen(true);
                  }}
                  className="btn-gradient px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Generate New Quiz
                </button>
              </div>

              {/* Filter bar */}
              <div className="flex items-center gap-3 glass-card rounded-2xl p-3 border border-white/5 max-w-md w-full">
                <Search className="w-4 h-4 text-zinc-500 shrink-0 ml-1" />
                <input
                  type="text"
                  placeholder="Search quizzes by title or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-white placeholder-zinc-500 w-full"
                />
              </div>

              {/* Grid of Quizzes */}
              {filteredQuizzes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 font-semibold border border-white/5">
                            {quiz.topic}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                              quiz.visibility === "public"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                                : "bg-zinc-500/10 text-zinc-400 border border-white/5"
                            }`}
                          >
                            {quiz.visibility.toUpperCase()}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white tracking-tight mb-2 line-clamp-1">
                          {quiz.title}
                        </h4>
                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-4">
                          Custom quiz on {quiz.topic} created on{" "}
                          {new Date(quiz.createdAt).toLocaleDateString()}. Contains comprehensive
                          questions to challenge your expertise.
                        </p>

                        <div className="flex items-center gap-4 text-xs text-zinc-400 mb-6 bg-white/[0.01] p-2.5 rounded-xl border border-white/5">
                          <div>
                            <span className="font-semibold text-white block">
                              {quiz.questionsCount}
                            </span>
                            Questions
                          </div>
                          <div className="w-px h-6 bg-white/5"></div>
                          <div>
                            <span className="font-semibold text-white block">
                              {quiz.timeLimit}m
                            </span>
                            Time Limit
                          </div>
                          <div className="w-px h-6 bg-white/5"></div>
                          <div>
                            <span className="font-semibold text-white block">
                              {quiz.playsCount}
                            </span>
                            Plays
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <button className="flex-1 btn-gradient py-2 px-3 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 transition-all duration-200">
                          <Play className="w-3.5 h-3.5 fill-white/10" />
                          Play Quiz
                        </button>
                        <button
                          onClick={() => handleShareQuiz(quiz.id)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                          title="Share Quiz Link"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-400 hover:text-red-300 transition-colors cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-12 text-center border border-white/5 max-w-xl mx-auto mt-8">
                  <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-white">No quizzes found</h4>
                  <p className="text-sm text-zinc-400 mt-2 max-w-sm mx-auto">
                    You haven't generated any quizzes with this name yet. Click 'Generate New Quiz'
                    above to generate one instantly.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ----------------- VIEW 3: HISTORY ----------------- */}
          {activeTab === "history" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  Full Attempt History
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Review all your previous scores, correct answers, and learning progress.
                </p>
              </div>

              {/* Filters / Search Bar */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-3 glass-card rounded-2xl px-4 py-2 border border-white/5 w-full md:w-80">
                    <Search className="w-4 h-4 text-zinc-500 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search history by topic..."
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      className="bg-transparent border-none outline-none text-sm text-white placeholder-zinc-500 w-full"
                    />
                  </div>

                  <div className="flex items-center gap-2 glass-card rounded-2xl px-3 py-2 border border-white/5 text-sm text-zinc-300">
                    <span>Difficulty:</span>
                    <select
                      value={historyFilter}
                      onChange={(e) => setHistoryFilter(e.target.value)}
                      className="bg-transparent border-none outline-none text-white font-semibold cursor-pointer text-xs"
                    >
                      <option value="all">All</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs text-zinc-400 bg-white/5 border border-white/5 px-3 py-2 rounded-xl">
                  Showing <span className="font-semibold text-white">{filteredHistory.length}</span>{" "}
                  attempts
                </div>
              </div>

              {/* List */}
              {filteredHistory.length > 0 ? (
                <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                          <th className="p-4 text-xs font-semibold text-zinc-400">Quiz Title</th>
                          <th className="p-4 text-xs font-semibold text-zinc-400">
                            Date Completed
                          </th>
                          <th className="p-4 text-xs font-semibold text-zinc-400">Difficulty</th>
                          <th className="p-4 text-xs font-semibold text-zinc-400">
                            Score Achieved
                          </th>
                          <th className="p-4 text-xs font-semibold text-zinc-400">Accuracy</th>
                          <th className="p-4 text-xs font-semibold text-zinc-400">Time Spent</th>
                          <th className="p-4 text-xs font-semibold text-zinc-400 text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredHistory.map((attempt) => (
                          <tr key={attempt.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="p-4">
                              <div className="font-bold text-white text-sm">
                                {attempt.quizTitle}
                              </div>
                              <span className="text-[10px] text-zinc-500 bg-white/5 border border-white/5 px-1.5 py-0.5 rounded font-semibold mt-1 inline-block">
                                {attempt.topic}
                              </span>
                            </td>
                            <td className="p-4 text-xs text-zinc-300">
                              {new Date(attempt.completedAt).toLocaleDateString()} at{" "}
                              {new Date(attempt.completedAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="p-4">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                  attempt.difficulty === "Easy"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : attempt.difficulty === "Medium"
                                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}
                              >
                                {attempt.difficulty}
                              </span>
                            </td>
                            <td className="p-4 text-sm font-semibold text-white">
                              {attempt.score} / {attempt.totalQuestions}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs font-semibold ${attempt.percentage >= 80 ? "text-emerald-400" : attempt.percentage >= 60 ? "text-amber-400" : "text-red-400"}`}
                                >
                                  {attempt.percentage}%
                                </span>
                                <div className="w-16 bg-white/5 h-1 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      attempt.percentage >= 80
                                        ? "bg-emerald-500"
                                        : attempt.percentage >= 60
                                          ? "bg-amber-500"
                                          : "bg-red-500"
                                    }`}
                                    style={{ width: `${attempt.percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-xs text-zinc-300">
                              {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
                            </td>
                            <td className="p-4 text-right">
                              <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all cursor-pointer">
                                Detailed Review
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-12 text-center border border-white/5 max-w-xl mx-auto mt-8">
                  <History className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-white">
                    No history records matching filters
                  </h4>
                  <p className="text-sm text-zinc-400 mt-2">
                    Try modifying your search or select "All" from the difficulty filters.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ----------------- VIEW 4: ANALYTICS ----------------- */}
          {activeTab === "analytics" && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  Performance Analytics
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Get an inside look at your learning patterns, strength distribution, and accuracy
                  growth.
                </p>
              </div>

              {/* Grid Section: Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card rounded-2xl p-5 border border-white/5">
                  <p className="text-xs text-zinc-400">Questions Correctly Answered</p>
                  <h4 className="text-2xl font-extrabold text-white mt-1.5">
                    {MOCK_STATS.correctlyAnswered}{" "}
                    <span className="text-xs text-zinc-500 font-normal">
                      / {MOCK_STATS.totalQuestionsAnswered}
                    </span>
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-400/10" />
                    Overall accuracy at {MOCK_STATS.accuracy}%
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-5 border border-white/5">
                  <p className="text-xs text-zinc-400">Total Quiz-taking Sessions</p>
                  <h4 className="text-2xl font-extrabold text-white mt-1.5">
                    {MOCK_STATS.totalQuizzesTaken}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-pink-400 mt-2 font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    Avg difficulty level: Medium-Hard
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-5 border border-white/5">
                  <p className="text-xs text-zinc-400">Est. Average Completion Time</p>
                  <h4 className="text-2xl font-extrabold text-white mt-1.5">285 seconds</h4>
                  <div className="flex items-center gap-1 text-[11px] text-indigo-400 mt-2 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    Faster than 72% of users on same topics
                  </div>
                </div>
              </div>

              {/* Graphic Charts: Line chart and category breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Score Trend Card (SVG Chart) */}
                <div className="lg:col-span-8 glass-card rounded-2xl p-6 border border-white/5 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Score Progression Trend</h3>
                    <p className="text-xs text-zinc-500">
                      Weekly accuracy growth across previous attempts
                    </p>
                  </div>

                  {/* SVG Chart Area */}
                  <div className="relative w-full h-64 bg-white/[0.01] rounded-xl border border-white/5 flex items-center justify-center p-4">
                    <svg
                      viewBox="0 0 500 200"
                      className="w-full h-full text-pink-500 overflow-visible"
                    >
                      {/* Grid Lines */}
                      <line
                        x1="0"
                        y1="50"
                        x2="500"
                        y2="50"
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth="1"
                      />
                      <line
                        x1="0"
                        y1="100"
                        x2="500"
                        y2="100"
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth="1"
                      />
                      <line
                        x1="0"
                        y1="150"
                        x2="500"
                        y2="150"
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth="1"
                      />

                      {/* Fill Gradient under the path */}
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Area polygon */}
                      <polygon
                        points="20,180 100,80 200,120 300,60 400,90 480,40 480,180"
                        fill="url(#chartGlow)"
                      />

                      {/* Path line */}
                      <path
                        d="M 20,180 L 100,80 L 200,120 L 300,60 L 400,90 L 480,40"
                        fill="none"
                        stroke="url(#gradientLine)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Gradient Definitions */}
                      <defs>
                        <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ec4899" />
                          <stop offset="50%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                      </defs>

                      {/* Data point indicators */}
                      <circle
                        cx="20"
                        cy="180"
                        r="5"
                        className="fill-[#050409] stroke-pink-500 stroke-[3.5] hover:scale-125 transition-transform"
                      />
                      <circle
                        cx="100"
                        cy="80"
                        r="5"
                        className="fill-[#050409] stroke-pink-500 stroke-[3.5] hover:scale-125 transition-transform"
                      />
                      <circle
                        cx="200"
                        cy="120"
                        r="5"
                        className="fill-[#050409] stroke-purple-500 stroke-[3.5] hover:scale-125 transition-transform"
                      />
                      <circle
                        cx="300"
                        cy="60"
                        r="5"
                        className="fill-[#050409] stroke-purple-500 stroke-[3.5] hover:scale-125 transition-transform"
                      />
                      <circle
                        cx="400"
                        cy="90"
                        r="5"
                        className="fill-[#050409] stroke-indigo-500 stroke-[3.5] hover:scale-125 transition-transform"
                      />
                      <circle
                        cx="480"
                        cy="40"
                        r="5"
                        className="fill-[#050409] stroke-indigo-500 stroke-[3.5] hover:scale-125 transition-transform"
                      />

                      {/* Custom Tooltip text mockup */}
                      <text x="445" y="25" fill="#f4f4f5" fontSize="10" fontWeight="bold">
                        90% Max
                      </text>
                    </svg>

                    {/* Chart overlay legends */}
                    <div className="absolute bottom-2 left-6 right-6 flex justify-between text-[9px] text-zinc-500 font-semibold uppercase">
                      <span>May 2026</span>
                      <span>June 2026</span>
                      <span>July 2026</span>
                    </div>
                  </div>
                </div>

                {/* Category Strength Breakdown (4 cols on desktop) */}
                <div className="lg:col-span-4 glass-card rounded-2xl p-6 border border-white/5 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Strength Breakdown</h3>
                    <p className="text-xs text-zinc-500">Average accuracy sorted by category</p>
                  </div>

                  <div className="space-y-4">
                    {/* Category item 1 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-white">Coding & Tech</span>
                        <span className="text-pink-400 font-semibold">88%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                          style={{ width: "88%" }}
                        ></div>
                      </div>
                    </div>

                    {/* Category item 2 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-white">Science & Logic</span>
                        <span className="text-purple-400 font-semibold">75%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>

                    {/* Category item 3 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-white">Language & Gram.</span>
                        <span className="text-indigo-400 font-semibold">70%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                          style={{ width: "70%" }}
                        ></div>
                      </div>
                    </div>

                    {/* Category item 4 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-white">World History</span>
                        <span className="text-zinc-400 font-semibold">55%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-zinc-600 rounded-full"
                          style={{ width: "55%" }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-pink-500/5 border border-pink-500/10 rounded-xl mt-4 flex gap-2">
                    <Sparkles className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      <span className="text-white font-bold">AI Tip:</span> You show excellent
                      prowess in <span className="text-pink-400">Coding</span>! Try generating a{" "}
                      <span className="text-white">World History</span> quiz today to strengthen
                      your weaknesses.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------- VIEW 5: SETTINGS ----------------- */}
          {activeTab === "settings" && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  Account Settings
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Configure profile settings, subscriptions, and interface parameters.
                </p>
              </div>

              {/* Split Settings Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Profile Edit Cards (8 cols on desktop) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Basic Info */}
                  <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-pink-500" />
                      Personal Profile Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400">Full Name</label>
                        <input
                          type="text"
                          defaultValue={user.name}
                          className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-pink-500/50 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400">Email Address</label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-pink-500/50 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <button className="btn-gradient px-4 py-2.5 rounded-xl text-xs font-semibold text-white cursor-pointer shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 transition-all self-start">
                      Save Profiles
                    </button>
                  </div>

                  {/* Password Modification */}
                  <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-500" />
                      Update Password Security
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400">
                          Current Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-pink-500/50 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400">New Password</label>
                        <input
                          type="password"
                          placeholder="New password"
                          className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-pink-500/50 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400">
                          Verify Password
                        </label>
                        <input
                          type="password"
                          placeholder="Re-type password"
                          className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-pink-500/50 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <button className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold text-white transition-all cursor-pointer">
                      Change Security Password
                    </button>
                  </div>
                </div>

                {/* Subscriptions Card (4 cols on desktop) */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-5 relative overflow-hidden">
                    {/* Glowing effect inside subscription card */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-pink-500/10 text-pink-500 rounded-xl">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Membership Details</h3>
                        <p className="text-[10px] text-zinc-500">
                          Subscription plan & pricing tier
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Current Plan:</span>
                        <span className="text-pink-400 font-bold tracking-wider uppercase text-[10px] px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20">
                          {MOCK_USER.tier}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Monthly renewal:</span>
                        <span className="text-zinc-200 font-semibold">August 10, 2026</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Cost:</span>
                        <span className="text-zinc-200 font-semibold">$9.99/mo</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button className="w-full btn-gradient py-2.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-pink-500/10">
                        Manage Billing Subscription
                        <ExternalLink className="w-3 h-3" />
                      </button>
                      <button className="w-full py-2.5 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-xs font-semibold text-red-400 hover:text-red-300 transition-all cursor-pointer">
                        Cancel Subscription Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ----------------- CREATE QUIZ MOCK OVERLAY MODAL ----------------- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop shadow overlay */}
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
            onClick={() => setIsCreateModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative glass-card w-full max-w-lg rounded-3xl p-6 border border-white/8 shadow-2xl shadow-pink-500/10 animate-modalIn z-10">
            {/* Close Button */}
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-pink-500/15 text-pink-500 rounded-2xl relative">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">AI Quiz Generator</h3>
                <p className="text-xs text-zinc-400">
                  Describe any topic, and let the AI generate customized quiz questions.
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(
                  `Mock generator submitted! Topic: ${quizTopic}, Questions: ${quizNumQuestions}, Difficulty: ${quizDifficulty}, Time limit: ${quizTimeLimit}`
                );
                setIsCreateModalOpen(false);
              }}
              className="space-y-4"
            >
              {/* Field 1: Topic */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Quiz Topic or Field</label>
                <input
                  type="text"
                  placeholder="e.g. JavaScript Arrays, General Astronomy, Ancient Greece"
                  required
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-pink-500/50 outline-none transition-all"
                />
              </div>

              {/* Field 2: Difficulty */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Complexity Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {["easy", "medium", "hard"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setQuizDifficulty(level)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        quizDifficulty === level
                          ? "bg-pink-500/10 text-pink-400 border-pink-500/30"
                          : "bg-white/[0.01] text-zinc-400 border-white/5 hover:text-zinc-200"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Fields: Questions Count and Time Limit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">Total Questions</label>
                  <div className="flex items-center bg-white/[0.02] border border-white/5 rounded-xl px-3 py-1.5">
                    <input
                      type="number"
                      min="5"
                      max="30"
                      value={quizNumQuestions}
                      onChange={(e) => setQuizNumQuestions(parseInt(e.target.value) || 10)}
                      className="bg-transparent border-none outline-none text-sm text-white w-full text-center"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">
                    Time Limit (Minutes)
                  </label>
                  <div className="flex items-center bg-white/[0.02] border border-white/5 rounded-xl px-3 py-1.5">
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={quizTimeLimit}
                      onChange={(e) => setQuizTimeLimit(parseInt(e.target.value) || 10)}
                      className="bg-transparent border-none outline-none text-sm text-white w-full text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Warning/Credits indicator */}
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-2.5 text-xs text-zinc-400">
                <AlertCircle className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <div>
                  This action consumes <span className="font-semibold text-white">1 AI credit</span>
                  . You have {MOCK_USER.creditsTotal - MOCK_USER.creditsUsed} credits remaining.
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient px-5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer shadow-lg shadow-pink-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Quiz ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
