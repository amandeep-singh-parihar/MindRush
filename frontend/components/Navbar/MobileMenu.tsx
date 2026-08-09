"use client";

import { useState } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import SignupModal from "../auth/SignupModal";
import LoginModal from "../auth/LoginModal";

interface NavLink {
  name: string;
  href: string;
}

interface MobileMenuProps {
  navLinks: NavLink[];
  session: {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  } | null;
}

export default function MobileMenu({ navLinks, session }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [openSignUpModal, setOpenSignUpModal] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden p-2 rounded-lg transition-colors cursor-pointer"
        style={{
          color: "var(--text-muted)",
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
        }}
        aria-label="Toggle Menu"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Drawer */}
      {open && (
        <div
          className="md:hidden absolute left-0 right-0 top-full mt-2 p-4 rounded-xl flex flex-col gap-3 animate-fade-in z-50"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Navigation Links */}
          <div className="flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium py-2.5 px-3 rounded-lg transition-colors hover:text-white hover:bg-white/5"
                style={{ color: "var(--text-muted)" }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div style={{ height: "1px", background: "var(--border)" }} />

          {/* User Profile / Auth Actions */}
          <div className="flex flex-col gap-2">
            {session?.user ? (
              <div className="flex flex-col gap-2">
                <div
                  className="flex items-center gap-3 p-2.5 rounded-lg"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                >
                  {session.user.image && !imgError ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name ?? "User"}
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
                      {session.user.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white truncate">
                      {session.user.name ?? "User"}
                    </span>
                    <span className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>
                      {session.user.email ?? "Authenticated User"}
                    </span>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold text-white transition-colors"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <User className="w-4 h-4" style={{ color: "var(--accent)" }} />
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold text-red-400 transition-colors cursor-pointer"
                  style={{
                    background: "rgba(239,68,68,0.05)",
                    border: "1px solid rgba(239,68,68,0.15)",
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => {
                    setOpen(false);
                    setOpenLoginModal(true);
                  }}
                  className="w-full py-2.5 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer text-center"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                  }}
                >
                  Log In
                </button>

                <button
                  onClick={() => {
                    setOpen(false);
                    setOpenSignUpModal(true);
                  }}
                  className="w-full accent-btn py-2.5 rounded-lg text-xs font-bold cursor-pointer text-center"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Modals */}
      <LoginModal
        open={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
        onSwitchToSignup={() => {
          setOpenLoginModal(false);
          setOpenSignUpModal(true);
        }}
      />
      <SignupModal
        open={openSignUpModal}
        onClose={() => setOpenSignUpModal(false)}
        onSwitchToLogin={() => {
          setOpenSignUpModal(false);
          setOpenLoginModal(true);
        }}
      />
    </>
  );
}
