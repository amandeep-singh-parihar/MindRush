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
        className="md:hidden p-2 text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors cursor-pointer"
        aria-label="Toggle Menu"
      >
        {open ? <X className="w-5 h-5 text-pink-400" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Opaque Glass Drawer */}
      {open && (
        <div className="md:hidden absolute left-0 right-0 top-full mt-2 p-5 bg-zinc-950/95 border border-white/15 backdrop-blur-2xl shadow-2xl shadow-pink-500/10 rounded-2xl flex flex-col gap-3 animate-fadeIn z-50">
          {/* Navigation Links */}
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors py-2.5 px-3 rounded-xl hover:bg-white/5"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="h-px bg-white/10 my-1"></div>

          {/* User Profile / Auth Actions */}
          <div className="flex flex-col gap-2.5">
            {session?.user ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  {session.user.image && !imgError ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name ?? "User"}
                      referrerPolicy="no-referrer"
                      onError={() => setImgError(true)}
                      className="w-9 h-9 rounded-full ring-2 ring-pink-500/30 object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-tr from-pink-500 to-purple-600">
                      {session.user.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-white truncate">
                      {session.user.name ?? "User"}
                    </span>
                    <span className="text-[11px] text-zinc-400 truncate">
                      {session.user.email ?? "Authenticated User"}
                    </span>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all"
                >
                  <User className="w-4 h-4 text-pink-400" />
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-semibold text-red-400 transition-all cursor-pointer"
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
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 hover:text-white transition-colors cursor-pointer text-center"
                >
                  Log In
                </button>

                <button
                  onClick={() => {
                    setOpen(false);
                    setOpenSignUpModal(true);
                  }}
                  className="w-full btn-gradient py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-pink-500/20 transition-transform active:scale-95 cursor-pointer text-center"
                >
                  Get Started ✨
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
