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
    <div
      className="min-h-screen w-full relative flex font-sans"
      style={{ background: "var(--bg)" }}
    >
      {/* ----------------- DESKTOP SIDEBAR ----------------- */}
      {!isQuizRoute && (
        <aside
          className="hidden lg:flex flex-col w-60 z-20 sticky top-0 h-screen select-none"
          style={{
            background: "var(--surface)",
            borderRight: "1px solid var(--border)",
          }}
        >
          {/* Brand Logo */}
          <div
            className="p-5 flex items-center gap-2"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <Brain className="w-5 h-5" style={{ color: "var(--accent)" }} strokeWidth={2.5} />
            <span
              onClick={() => router.push("/")}
              className="cursor-pointer text-base font-bold text-white tracking-tight hover:opacity-80 transition-opacity"
            >
              Mind<span style={{ color: "var(--accent)" }}>Rush</span>
            </span>
          </div>

          {/* Navigation Link Menu */}
          <nav className="flex-1 px-3 py-5 space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150"
                  style={{
                    color: isActive ? "#fff" : "var(--text-muted)",
                    background: isActive ? "var(--surface-2)" : "transparent",
                    borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                  }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: isActive ? "var(--accent)" : "var(--text-muted)" }}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Card */}
          <div className="p-4" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex items-center gap-3 mb-3">
              {user.image && !imgError ? (
                <img
                  src={user.image}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-8 h-8 rounded-full object-cover"
                  style={{ border: "1px solid var(--border)" }}
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                >
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-[11px] truncate" style={{ color: "var(--text-subtle)" }}>
                  {user.email || "Free Tier"}
                </p>
              </div>
            </div>

            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer"
              style={{
                color: "var(--text-muted)",
                background: "transparent",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
              }}
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </aside>
      )}

      {/* ----------------- MOBILE NAVIGATION BAR ----------------- */}
      {!isQuizRoute && (
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-2 py-2 flex justify-around"
          style={{
            background: "rgba(13,13,13,0.95)",
            borderTop: "1px solid var(--border)",
            backdropFilter: "blur(10px)",
          }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center gap-1 py-1.5 px-3 rounded-lg transition-colors"
                style={{ color: isActive ? "var(--accent)" : "var(--text-muted)" }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.name.replace("Quiz ", "")}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* ----------------- MAIN VIEWPORT ----------------- */}
      <main className="flex-1 min-w-0 z-10 flex flex-col pb-24 lg:pb-8">
        {/* Mobile Header */}
        {!isQuizRoute && (
          <header
            className="lg:hidden p-4 flex items-center justify-between sticky top-0 z-30"
            style={{
              background: "rgba(13,13,13,0.92)",
              borderBottom: "1px solid var(--border)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <Brain className="w-5 h-5" style={{ color: "var(--accent)" }} strokeWidth={2.5} />
              <span className="text-base font-bold text-white">
                Mind<span style={{ color: "var(--accent)" }}>Rush</span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="accent-btn p-2 rounded-lg cursor-pointer"
                title="Create Quiz"
              >
                <Plus className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/settings"
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
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
