"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  Trash2,
  RotateCcw,
  Clock,
  ShieldAlert,
  X,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Flame,
  Skull,
} from "lucide-react";
import {
  verifyPasswordAndScheduleDeletionAction,
  cancelAccountDeletionAction,
} from "@/actions/quiz";

interface DangerZoneProps {
  initialDeletionScheduledAt?: string | null;
  hasPassword?: boolean;
  userEmail?: string;
}

export default function DangerZone({
  initialDeletionScheduledAt = null,
  hasPassword = true,
  userEmail = "",
}: DangerZoneProps) {
  const [deletionScheduledAt, setDeletionScheduledAt] = useState<string | null>(
    initialDeletionScheduledAt
  );
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  // Form input states
  const [confirmText, setConfirmText] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const isScheduled = !!deletionScheduledAt;
  const CONFIRMATION_REQUIRED_STRING = "DELETE MY ACCOUNT";
  const isStringMatched = confirmText.trim() === CONFIRMATION_REQUIRED_STRING;

  const getDaysRemaining = () => {
    if (!deletionScheduledAt) return 7;
    const diffMs = new Date(deletionScheduledAt).getTime() - Date.now();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(1, days);
  };

  const openModal = () => {
    setStep(1);
    setConfirmText("");
    setPasswordInput("");
    setShowPassword(false);
    setModalError(null);
    setConfirmModalOpen(true);
  };

  const closeModal = () => {
    if (loading) return;
    setConfirmModalOpen(false);
    setStep(1);
    setConfirmText("");
    setPasswordInput("");
    setModalError(null);
  };

  // Step 1 -> Step 2 transition
  const handleProceedToPassword = () => {
    if (!isStringMatched) return;
    setModalError(null);
    setStep(2);
  };

  // Step 2: Verify Password / Email
  const handleVerifyPassword = async () => {
    setLoading(true);
    setModalError(null);
    try {
      const res = await verifyPasswordAndScheduleDeletionAction(passwordInput);
      if (res.success && res.deletionScheduledAt) {
        setDeletionScheduledAt(res.deletionScheduledAt);
        setMsg({
          type: "success",
          text: "Verification successful! Account deletion scheduled for 7 days from today.",
        });
        closeModal();
      } else {
        setModalError(res.message || "Verification failed. Please try again.");
      }
    } catch {
      setModalError("An error occurred during verification.");
    } finally {
      setLoading(false);
    }
  };

  // Cancel deletion request
  const handleCancelDeletion = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await cancelAccountDeletionAction();
      if (res.success) {
        setDeletionScheduledAt(null);
        setMsg({ type: "success", text: "Account deletion request has been canceled." });
      } else {
        setMsg({ type: "error", text: res.message || "Failed to cancel account deletion." });
      }
    } catch {
      setMsg({ type: "error", text: "An error occurred while canceling deletion." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="danger-zone" className="space-y-4 pt-4">
      <div className="surface-card rounded-xl p-6 border border-red-500/20 bg-red-950/5 space-y-5">
        <div className="flex items-start justify-between gap-4 border-b border-red-500/10 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Danger Area
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Actions in this section carry permanent consequences for your account.
            </p>
          </div>
        </div>

        {msg && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
              msg.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{msg.text}</span>
          </div>
        )}

        {/* Scheduled Status Banner */}
        {isScheduled ? (
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Deletion Scheduled in {getDaysRemaining()} Days</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Your account and all associated data (quizzes, attempt history, statistics) are
              scheduled for permanent deletion on{" "}
              <strong className="text-white">
                {new Date(deletionScheduledAt!).toLocaleDateString([], {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </strong>
              . You can cancel this request anytime during the 7-day period.
            </p>
            <div className="pt-1">
              <button
                type="button"
                disabled={loading}
                onClick={handleCancelDeletion}
                className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {loading ? "Canceling..." : "Cancel Deletion Request"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/5">
            <div>
              <h4 className="text-sm font-bold text-white">Delete Account</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Permanently purge your account, quizzes, and attempt records after a 7-day grace
                window. Requires confirmation text & authorization verification.
              </p>
            </div>
            <button
              type="button"
              onClick={openModal}
              className="px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2 hover:scale-[1.02] active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              Request Account Deletion
            </button>
          </div>
        )}
      </div>

      {/* Multi-step Password / Email Verification Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="absolute inset-0 cursor-pointer" onClick={closeModal} />

          <div className="relative surface-card w-full max-w-md rounded-xl p-6 sm:p-7 border border-red-500/20 shadow-2xl animate-scale-up z-10 space-y-5">
            <button
              onClick={closeModal}
              disabled={loading}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/15 text-red-400 rounded-2xl border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                  Step {step} of 2 • Security Verification
                </span>
                <h3 className="text-lg font-extrabold text-white leading-snug">
                  {step === 1
                    ? "Confirm Account Deletion"
                    : hasPassword
                      ? "Enter Password to Verify"
                      : "Confirm Email to Verify"}
                </h3>
              </div>
            </div>

            {modalError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {/* STEP 1: Text String Confirmation */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-300 leading-relaxed">
                  To prevent accidental deletion, please type{" "}
                  <strong className="text-red-400 select-all font-mono">
                    "{CONFIRMATION_REQUIRED_STRING}"
                  </strong>{" "}
                  in the box below.
                </p>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Type Confirmation Text
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={CONFIRMATION_REQUIRED_STRING}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-zinc-600 focus:border-red-500/50 outline-none transition-all"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={!isStringMatched || loading}
                    onClick={handleProceedToPassword}
                    className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:hover:bg-red-500 text-xs font-bold text-white shadow-lg shadow-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Password or Email Verification */}
            {step === 2 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerifyPassword();
                }}
                className="space-y-4"
              >
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {hasPassword
                    ? "Please enter your account password to authorize scheduling this account for 7-day deletion."
                    : `OAuth / Google account detected. Please enter your account email (${userEmail}) to confirm scheduling 7-day deletion.`}
                </p>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    {hasPassword ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-red-400" />
                        Account Password
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5 text-red-400" />
                        Confirm Registered Email
                      </>
                    )}
                  </label>

                  <div className="relative">
                    <input
                      type={hasPassword ? (showPassword ? "text" : "password") : "text"}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder={
                        hasPassword
                          ? "Enter your current password"
                          : userEmail || "Enter your registered email address"
                      }
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-red-500/50 outline-none transition-all pr-10"
                    />

                    {hasPassword && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setStep(1)}
                    className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 transition-all cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:hover:bg-red-500 text-xs font-bold text-white shadow-lg shadow-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {loading ? "Verifying..." : "Verify & Schedule (7 Days)"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
