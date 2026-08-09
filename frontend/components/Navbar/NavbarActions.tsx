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
    <div className="hidden md:flex items-center gap-3">
      <button
        onClick={() => setOpenLoginModal(true)}
        className="cursor-pointer text-sm font-medium transition-colors duration-200 hover:text-white"
        style={{ color: "var(--text-muted)" }}
      >
        Log in
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
        className="accent-btn cursor-pointer text-sm font-semibold px-4 py-2 rounded-lg"
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
