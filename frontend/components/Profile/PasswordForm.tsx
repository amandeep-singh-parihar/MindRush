"use client";

import React, { useState, useEffect } from "react";
import { Lock, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
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
    } catch (error) {
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
      {/* ----------------- CUSTOM PREMIUM TOAST NOTIFIER ----------------- */}
      {toast?.show && (
        <div className="fixed top-6 right-6 z-50 animate-slideIn">
          <div
            className={`glass-card rounded-2xl p-4 border flex items-start gap-3.5 max-w-sm shadow-2xl transition-all duration-300 ${
              toast.type === "success"
                ? "border-emerald-500/30 bg-[#050409]/90 shadow-emerald-500/5"
                : "border-red-500/30 bg-[#050409]/90 shadow-red-500/5"
            }`}
          >
            {/* Status Icon */}
            <div className="shrink-0 mt-0.5">
              {toast.type === "success" ? (
                <div className="p-1.5 bg-emerald-500/10 rounded-xl text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-1.5 bg-red-500/10 rounded-xl text-red-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Toast Details */}
            <div className="flex-1 min-w-0 pr-4">
              <h4 className="text-sm font-bold text-white tracking-tight">{toast.title}</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{toast.message}</p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setToast((prev) => (prev ? { ...prev, show: false } : null))}
              className="shrink-0 p-1 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Password Form Content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-500" />
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
                className={`w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-pink-500/50 outline-none transition-all ${
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
                className={`w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-pink-500/50 outline-none transition-all ${
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
                className={`w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-pink-500/50 outline-none transition-all ${
                  isSubmitting ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold text-white transition-all cursor-pointer flex items-center gap-2 ${
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
