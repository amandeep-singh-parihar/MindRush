"use client";

import { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import Link from "next/link";
import NavbarActions from "./NavbarActions";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import { Session } from "next-auth";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Why MindRush", href: "#why-choose-us" },
  { name: "FAQ", href: "#faq" },
];

export default function NavbarClient({ session }: { session: Session | null }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-3 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 rounded-2xl px-6 transition-all duration-300 ${
        scrolled
          ? "bg-zinc-950/95 border border-white/15 backdrop-blur-2xl shadow-2xl shadow-pink-500/10 py-3.5"
          : "bg-zinc-950/40 border border-white/5 backdrop-blur-md py-3"
      }`}
    >
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

        {/* Desktop Auth Actions */}
        <NavbarActions session={session} />

        {/* User Menu — shown when logged in */}
        <UserMenu session={session} />

        {/* Mobile Menu Toggle + Drawer */}
        <MobileMenu navLinks={navLinks} session={session} />
      </div>
    </nav>
  );
}
