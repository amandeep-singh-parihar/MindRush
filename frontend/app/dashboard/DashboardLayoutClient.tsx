"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
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
} from "lucide-react";

interface DashboardLayoutClientProps {
  initialSession: any;
  children: React.ReactNode;
}

export default function DashboardLayoutClient({
  initialSession,
  children,
}: DashboardLayoutClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [imgError, setImgError] = useState(false);

  // Hide sidebar/nav while actively playing a quiz — but NOT on the results page
  const isQuizRoute = /^\/dashboard\/quiz\/[^/]+$/.test(pathname);

  const user = initialSession?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

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

          {/* User Card */}
          <div className="p-4 border-t border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-3 mb-4">
              {user.image && !imgError ? (
                <img
                  src={user.image}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-9 h-9 rounded-full ring-1 ring-pink-500/20 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-tr from-pink-500 to-purple-600">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-[11px] text-zinc-400 truncate">
                  {user.email || "Free Tier User"}
                </p>
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
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <Brain className="w-6 h-6 text-pink-500 group-hover:scale-110 transition-transform" />
              <span className="text-lg font-bold bg-gradient-to-r from-white via-zinc-100 to-pink-500 bg-clip-text text-transparent">
                MindRush
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="btn-gradient p-2 rounded-xl text-white shadow-md shadow-pink-500/20 cursor-pointer"
                title="Create Quiz"
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
    </div>
  );
}
