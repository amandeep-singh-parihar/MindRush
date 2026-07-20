import { Brain } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import NavbarActions from "./NavbarActions";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export default async function Navbar() {
  const session = await auth();

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

        {/* Desktop Auth Actions (Client) */}
        <NavbarActions session={session} />

        {/* User Menu — shown when logged in (Client) */}
        <UserMenu session={session} />

        {/* Mobile Menu Toggle + Drawer (Client) */}
        <MobileMenu navLinks={navLinks} session={session} />
      </div>
    </nav>
  );
}
