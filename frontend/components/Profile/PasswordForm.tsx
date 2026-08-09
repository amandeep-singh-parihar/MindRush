"use client";

import React, { useState, useEffect } from "react";
import { Lock, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { updatePassword } from "@/actions/auth";

interface PasswordFormInput {
  currentPassword: string;
  newPassword: string;
  verifyPassword: string;
}

interface ToastState {
  show: boolean;
  type: "success" | "error";
  title: string;
  message: string;
}

const PasswordForm = ({ hasPassword }: { hasPassword: boolean }) => {
  if (!hasPassword) {
    return null;
  }

  const { register, handleSubmit, reset } = useForm<PasswordFormInput>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => {
        setToast((prev) => (prev ? { ...prev, show: false } : null));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const onSubmit: SubmitHandler<PasswordFormInput> = async (data) => {
    const { currentPassword, newPassword, verifyPassword } = data;

    if (!currentPassword || !newPassword || !verifyPassword) {
      setToast({
        show: true,
        type: "error",
        title: "Validation Error",
        message: "Please fill in all the password fields.",
      });
      return;
    }

    if (newPassword !== verifyPassword) {
      setToast({
        show: true,
        type: "error",
        title: "Validation Error",
        message: "The new password and verification password do not match.",
      });
      return;
    }

    if (newPassword.length < 6) {
      setToast({
        show: true,
        type: "error",
        title: "Validation Error",
        message: "New password must be at least 6 characters long.",
      });
      return;
    }

    setIsSubmitting(true);
    setToast(null);

    try {
      const res = await updatePassword(data);

      if (res?.success) {
        setToast({
          show: true,
          type: "success",
          title: "Password Updated",
          message: "Your account password has been changed successfully.",
        });
        reset();
      } else {
        setToast({
          show: true,
          type: "error",
          title: "Update Failed",
          message: res?.message || "Incorrect current password or update error.",
        });
      }
    } catch {
      setToast({
        show: true,
        type: "error",
        title: "System Error",
        message: "A network issue occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {isMounted &&
        toast?.show &&
        createPortal(
          <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
            <div
              className={`bg-[#161616] border border-[#2a2a2a] border-l-4 rounded-lg p-3.5 shadow-xl shadow-black/60 flex items-start gap-3.5 max-w-sm ${
                toast.type === "success" ? "border-l-emerald-500" : "border-l-red-500"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              )}

              {/* Toast Details */}
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-xs font-semibold text-white tracking-tight">{toast.title}</h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{toast.message}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setToast((prev) => (prev ? { ...prev, show: false } : null))}
                className="shrink-0 p-1 text-zinc-500 hover:text-zinc-300 rounded-md hover:bg-white/5 transition-colors cursor-pointer mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>,
          document.body
        )}

      {/* Password Form Content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="surface-card rounded-xl p-6 space-y-5">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Lock className="w-4 h-4" style={{ color: "var(--accent)" }} />
            Update Password Security
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Current Password</label>
              <input
                {...register("currentPassword")}
                type="password"
                placeholder="••••••••"
                disabled={isSubmitting}
                className={`w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500/40 outline-none transition-all ${
                  isSubmitting ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">New Password</label>
              <input
                {...register("newPassword")}
                type="password"
                placeholder="New password"
                disabled={isSubmitting}
                className={`w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500/40 outline-none transition-all ${
                  isSubmitting ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Verify Password</label>
              <input
                {...register("verifyPassword")}
                type="password"
                placeholder="Re-type password"
                disabled={isSubmitting}
                className={`w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500/40 outline-none transition-all ${
                  isSubmitting ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold text-white transition-colors cursor-pointer flex items-center gap-2 ${
              isSubmitting ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Changing Password...
              </>
            ) : (
              "Change Security Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordForm;
