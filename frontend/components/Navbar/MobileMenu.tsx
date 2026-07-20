"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

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

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        aria-label="Toggle Menu"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Drawer */}
      {open && (
        <div
          className="md:hidden absolute left-0 right-0 top-full mt-1 mx-0 px-6 pb-4 pt-4 border-t border-white/5 flex flex-col gap-4 animate-fadeIn rounded-b-2xl"
          style={{
            background: "inherit",
            backdropFilter: "inherit",
          }}
        >
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
            {session?.user ? (
              /* Show user info + sign out in mobile */
              <div className="flex items-center gap-3 px-2 py-2">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    className="w-8 h-8 rounded-full ring-2 ring-pink-500/30 object-cover"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-pink-500/30"
                    style={{
                      background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
                    }}
                  >
                    {session.user.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
                <span className="text-sm font-medium text-white truncate">
                  {session.user.name?.split(" ")[0] ?? "User"}
                </span>
              </div>
            ) : (
              /* Show login / get started when not authenticated */
              <>
                <button
                  onClick={() => setOpen(false)}
                  className="text-center text-base font-medium text-zinc-300 hover:text-white py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="btn-gradient text-center text-base font-semibold text-white py-2.5 rounded-xl shadow-lg shadow-pink-500/20 transition-transform duration-200 active:scale-95 cursor-pointer"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
