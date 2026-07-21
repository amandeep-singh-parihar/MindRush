"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, User, ChevronDown, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserMenuProps {
  session: {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  } | null;
}

export default function UserMenu({ session }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const router = useRouter();

  if (!session?.user) return null;

  const initials =
    session.user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";

  const firstName = session.user.name?.split(" ")[0] ?? "User";

  return (
    <div className="relative hidden md:block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/5"
      >
        {/* Avatar */}
        {session.user.image && !imgError ? (
          <img
            src={session.user.image}
            alt={session.user.name ?? "User"}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-8 h-8 rounded-full ring-2 ring-pink-500/30 object-cover"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-pink-500/30"
            style={{
              background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
            }}
          >
            {initials}
          </div>
        )}

        <span className="text-sm font-medium text-zinc-300 max-w-[120px] truncate">
          {firstName}
        </span>

        <ChevronDown
          className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Invisible overlay to close on outside click */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div
            className="absolute right-0 top-full mt-2 w-56 rounded-xl z-50 py-2 overflow-hidden"
            style={{
              background: "rgba(15, 15, 20, 0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
              animation: "modalIn 0.15s ease-out both",
            }}
          >
            {/* User info header */}
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-sm font-semibold text-white truncate">{session.user.name}</p>
              <p className="text-xs text-zinc-500 truncate mt-0.5">{session.user.email}</p>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/dashboard/settings");
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-zinc-500" />
                My Profile
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>

              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
