"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Brain,
  LayoutDashboard,
  History,
  BarChart3,
  Settings,
  Plus,
  BookOpen,
  LogOut,
  Sparkles,
  X,
  AlertCircle,
  Menu,
} from "lucide-react";

interface DashboardLayoutClientProps {
  initialSession: any;
  children: React.ReactNode;
}

const MOCK_USER = {
  name: "Amandeep Singh",
  email: "amandeep@example.com",
  image: null,
  tier: "Premium Creator",
  creditsUsed: 12,
  creditsTotal: 30,
};

export default function DashboardLayoutClient({
  initialSession,
  children,
}: DashboardLayoutClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide sidebar/nav while actively playing a quiz — but NOT on the results page
  const isQuizRoute = /^\/dashboard\/quiz\/[^/]+$/.test(pathname);

  // Check if ?create=true query parameter is present to open the global generator modal
  const isCreateModalOpen = searchParams.get("create") === "true";

  // Form states for creating a quiz
  const [quizTopic, setQuizTopic] = useState("");
  const [quizDifficulty, setQuizDifficulty] = useState("medium");
  const [quizNumQuestions, setQuizNumQuestions] = useState(10);
  const [quizTimeLimit, setQuizTimeLimit] = useState(10);

  const user = initialSession?.user || MOCK_USER;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const closeCreateModal = () => {
    // Navigate to the current path without the search parameters
    router.push(pathname);
  };

  const menuItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Quizzes", href: "/dashboard/quizzes", icon: BookOpen },
    { name: "Quiz History", href: "/dashboard/history", icon: History },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen w-full relative flex font-sans selection:bg-pink-500/30 selection:text-pink-200 bg-[#050409]">
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 grid-bg opacity-[0.15] pointer-events-none z-0"></div>

      {/* ----------------- DESKTOP SIDEBAR ----------------- */}
      {!isQuizRoute && (
        <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 z-20 sticky top-0 h-screen glass-card select-none">
          {/* Brand Logo */}
          <div className="p-6 border-b border-white/5 flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute inset-0 bg-pink-500 rounded-full blur-md opacity-75"></div>
              <Brain className="relative w-7 h-7 text-pink-500 stroke-[2.5]" />
            </div>
            <span
              onClick={() => router.push("/")}
              className="cursor-pointer text-xl font-bold bg-gradient-to-r from-white via-zinc-100 to-pink-500 bg-clip-text text-transparent tracking-tight hover:opacity-80 transition-opacity"
            >
              MindRush
            </span>
          </div>

          {/* Navigation Link Menu */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative ${
                    isActive
                      ? "bg-white/[0.04] text-white border-l-2 border-pink-500 pl-3.5 shadow-[inset_4px_0_15px_-4px_rgba(236,72,153,0.15)]"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors duration-300 ${
                      isActive ? "text-pink-500" : "text-zinc-500 group-hover:text-zinc-400"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Card & Credits Tracker */}
          <div className="p-4 border-t border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-3 mb-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-9 h-9 rounded-full ring-1 ring-pink-500/20 object-cover"
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
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-200 cursor-pointer border border-transparent hover:border-red-500/10"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>
      )}

      {/* ----------------- MOBILE NAVIGATION BAR ----------------- */}
      {!isQuizRoute && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050409]/95 backdrop-blur-md border-t border-white/5 px-2 py-2 flex justify-around">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
                  isActive ? "text-pink-500" : "text-zinc-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-semibold">{item.name.replace("Quiz ", "")}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* ----------------- MAIN VIEWPORT ----------------- */}
      <main className="flex-1 min-w-0 z-10 flex flex-col pb-24 lg:pb-8">
        {/* Mobile Header */}
        {!isQuizRoute && (
          <header className="lg:hidden p-4 flex items-center justify-between border-b border-white/5 bg-[#050409]/60 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-pink-500" />
              <span className="text-lg font-bold bg-gradient-to-r from-white via-zinc-100 to-pink-500 bg-clip-text text-transparent">
                MindRush
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`${pathname}?create=true`}
                className="btn-gradient p-2 rounded-xl text-white shadow-md shadow-pink-500/20"
              >
                <Plus className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/settings"
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-tr from-pink-500 to-purple-600"
              >
                {initials}
              </Link>
            </div>
          </header>
        )}

        {/* Child Pages Port */}
        <div className="max-w-7xl w-full mx-auto p-4 md:p-8">{children}</div>
      </main>

      {/* ----------------- GLOBAL CREATE QUIZ MOCK MODAL ----------------- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
            onClick={closeCreateModal}
          ></div>

          <div className="relative glass-card w-full max-w-lg rounded-3xl p-6 border border-white/8 shadow-2xl shadow-pink-500/10 animate-modalIn z-10">
            <button
              onClick={closeCreateModal}
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
                  `Mock generator submitted! Topic: ${quizTopic || "Custom Topic"}, Questions: ${quizNumQuestions}, Difficulty: ${quizDifficulty}, Time limit: ${quizTimeLimit}`
                );
                closeCreateModal();
              }}
              className="space-y-4"
            >
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
                  onClick={closeCreateModal}
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
