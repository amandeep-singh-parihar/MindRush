"use client";

import { useState, useRef, useEffect } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when user clicks anywhere outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

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
    <div ref={containerRef} className="relative hidden md:block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
        style={{ color: "var(--text-muted)" }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background = "var(--surface-2)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
        }
      >
        {/* Avatar */}
        {session.user.image && !imgError ? (
          <img
            src={session.user.image}
            alt={session.user.name ?? "User"}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-7 h-7 rounded-full object-cover"
            style={{ border: "1px solid var(--border)" }}
          />
        ) : (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
          >
            {initials}
          </div>
        )}

        <span className="text-sm font-medium text-white max-w-[100px] truncate">{firstName}</span>

        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          style={{ color: "var(--text-subtle)" }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 rounded-xl z-50 py-1.5 overflow-hidden animate-fade-in"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {/* User info header */}
          <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <p className="text-sm font-semibold text-white truncate">{session.user.name}</p>
            <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
              {session.user.email}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/dashboard/settings");
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer hover:bg-white/5"
              style={{ color: "var(--text-muted)" }}
            >
              <User className="w-4 h-4" />
              My Profile
            </button>

            <button
              onClick={() => {
                setOpen(false);
                router.push("/dashboard");
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer hover:bg-white/5"
              style={{ color: "var(--text-muted)" }}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
