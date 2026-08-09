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
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-3 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 rounded-xl px-6 transition-all duration-200 ${
        scrolled ? "glass-navbar py-3.5 shadow-lg" : "bg-transparent border border-transparent py-3"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Brain className="w-6 h-6" style={{ color: "var(--accent)" }} strokeWidth={2.5} />
          <span className="text-lg font-bold text-white tracking-tight font-sans">
            Mind<span style={{ color: "var(--accent)" }}>Rush</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium transition-colors duration-200 hover:text-white"
              style={{ color: "var(--text-muted)" }}
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
