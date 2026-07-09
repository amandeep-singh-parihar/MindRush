"use client";

import { useState } from "react";
import { Brain, Menu, X } from "lucide-react";
import Link from "next/link";
import SignupModal from "./auth/SignupModal";
import LoginModal from "./auth/LoginModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openSignUpModal, setOpenSignUpModal] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 glass-navbar rounded-2xl px-6 py-3 transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-pink-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <Brain className="relative w-7 h-7 text-pink-500 dark:text-pink-400 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-pink-500 bg-clip-text text-transparent font-sans tracking-tight">
            MindRush
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setOpenLoginModal(true)}
            className="cursor-pointer text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-200"
          >
            Login
          </button>

          <LoginModal
            open={openLoginModal}
            onClose={() => setOpenLoginModal(false)}
            onSwitchToSignup={() => {
              setOpenLoginModal(false);
              setOpenSignUpModal(true);
            }}
          />

          <button
            onClick={() => setOpenSignUpModal(true)}
            className="cursor-pointer btn-gradient text-sm font-semibold text-white px-5 py-2 rounded-xl transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-pink-500/20"
          >
            Get Started
          </button>

          <SignupModal
            open={openSignUpModal}
            onClose={() => setOpenSignUpModal(false)}
            onSwitchToLogin={() => {
              setOpenSignUpModal(false);
              setOpenLoginModal(true);
            }}
          />
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          aria-label="Toggle Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/5 flex flex-col gap-4 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-base font-medium text-zinc-400 hover:text-white transition-colors py-1.5 px-2 rounded-lg hover:bg-white/5"
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-white/5 my-2"></div>
          <div className="flex flex-col gap-3 pb-2">
            <Link
              href="#login"
              onClick={() => setOpen(false)}
              className="text-center text-base font-medium text-zinc-300 hover:text-white py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              Login
            </Link>
            <Link
              href="#generate"
              onClick={() => setOpen(false)}
              className="btn-gradient text-center text-base font-semibold text-white py-2.5 rounded-xl shadow-lg shadow-pink-500/20 transition-transform duration-200 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
