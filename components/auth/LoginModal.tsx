"use client";

import React from "react";
import { createPortal } from "react-dom";
import { Brain, X, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";

interface LoginModalInterface {
  open: boolean;
  onClose: () => void;
  onSwitchToSignup?: () => void;
}

const LoginModal = ({ open, onClose, onSwitchToSignup }: LoginModalInterface) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  return createPortal(
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 w-screen h-screen left-0 top-0"
      style={{ background: "rgba(5, 4, 9, 0.85)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      {/* ── Panel ── */}
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 25px 80px rgba(147,51,234,0.25), 0 0 0 1px rgba(255,255,255,0.04)",
          animation: "modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Ambient glows ── */}
        <div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(219,39,119,0.18) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(147,51,234,0.18) 0%, transparent 70%)" }}
        />

        {/* ── Grid bg overlay ── */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close login modal"
          className="absolute top-4 right-4 z-20 p-1.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/8 transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── Content (Scrollable Container) ── */}
        <div
          className="relative z-10 p-6 overflow-y-auto flex-1 select-none"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Header */}
          <div className="flex flex-col items-center gap-2 mb-5 mt-2">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-80"
                style={{ background: "rgba(219,39,119,0.6)" }}
              />
              <div
                className="relative flex items-center justify-center w-11 h-11 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, rgba(219,39,119,0.25) 0%, rgba(147,51,234,0.25) 100%)",
                  border: "1px solid rgba(219,39,119,0.3)",
                }}
              >
                <Brain className="w-6 h-6 text-pink-400 stroke-[2.5]" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Sign in to your MindRush account to continue
              </p>
            </div>
          </div>

          {/* ── Google OAuth Button ── */}
          <button
            type="button"
            id="login-google-btn"
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mb-4 cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Google "G" SVG */}
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            <span className="text-[10px] text-zinc-500 font-bold tracking-wider">OR</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* ── Form Fields ── */}
          <form className="flex flex-col gap-3.5" onSubmit={(e) => e.preventDefault()}>
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="login-email"
                className="text-[10px] font-semibold text-zinc-400 tracking-wider uppercase"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = "1px solid rgba(236,72,153,0.5)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(236,72,153,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="login-password"
                  className="text-[10px] font-semibold text-zinc-400 tracking-wider uppercase"
                >
                  Password
                </label>
                <span className="text-[10px] text-pink-400 hover:text-pink-300 font-medium cursor-pointer transition-colors">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = "1px solid rgba(236,72,153,0.5)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(236,72,153,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-3 cursor-pointer group mt-0.5">
              <div className="relative flex-shrink-0">
                <input
                  id="login-remember"
                  type="checkbox"
                  className="peer sr-only"
                />
                <div
                  className="w-4 h-4 rounded-[5px] transition-all duration-200 peer-checked:opacity-0"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}
                />
                <div
                  className="absolute inset-0 rounded-[5px] flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-all duration-200"
                  style={{ background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)" }}
                >
                  <svg viewBox="0 0 10 8" className="w-2.5 h-2" fill="none" aria-hidden="true">
                    <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <span className="text-[11px] text-zinc-500 select-none group-hover:text-zinc-400 transition-colors">
                Remember me on this device
              </span>
            </label>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              className="btn-gradient w-full flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xl mt-1.5 cursor-pointer"
              style={{ boxShadow: "0 8px 32px rgba(236,72,153,0.3)" }}
            >
              <Sparkles className="w-4 h-4" />
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-zinc-500 mt-4">
            Don't have an account?{" "}
            <span
              onClick={onSwitchToSignup}
              className="text-pink-400 hover:text-pink-300 cursor-pointer font-semibold transition-colors"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>

      {/* ── Modal entrance animation ── */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.93) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default LoginModal;