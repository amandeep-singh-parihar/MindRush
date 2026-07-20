"use client";

import { useState } from "react";
import SignupModal from "../auth/SignupModal";
import LoginModal from "../auth/LoginModal";

interface NavbarActionsProps {
  session: {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  } | null;
}

export default function NavbarActions({ session }: NavbarActionsProps) {
  const [openSignUpModal, setOpenSignUpModal] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);

  // If user is logged in, don't show login/signup buttons
  if (session?.user) {
    return null; // UserMenu handles this
  }

  return (
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
  );
}
