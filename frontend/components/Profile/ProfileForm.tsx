"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { User, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { createPortal } from "react-dom";
import { updateProfileName } from "@/actions/auth";

interface UpdateFormInput {
  name: string;
  email: string;
}

interface ToastState {
  show: boolean;
  type: "success" | "error";
  title: string;
  message: string;
}

const ProfileForm = ({ user }: { user: any }) => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<UpdateFormInput>();
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

  useEffect(() => {
    reset({
      name: user?.user?.name,
      email: user?.user?.email,
    });
  }, [user, reset]);

  const onSubmit: SubmitHandler<UpdateFormInput> = async (data) => {
    setIsSubmitting(true);
    setToast(null);

    try {
      const res = await updateProfileName(data);

      if (res.success) {
        setToast({
          show: true,
          type: "success",
          title: "Profile Updated",
          message: "Your profile details have been saved successfully.",
        });
        // Revalidate Next.js Server Components (such as layout.tsx) so the sidebar displays the updated name immediately!
        router.refresh();
      } else {
        setToast({
          show: true,
          type: "error",
          title: "Update Failed",
          message: res.message || "An error occurred while updating your profile.",
        });
      }
    } catch {
      setToast({
        show: true,
        type: "error",
        title: "System Error",
        message: "A connection error occurred. Please try again.",
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

      {/* Profile Form Content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="surface-card rounded-xl p-6 space-y-5">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <User className="w-4 h-4" style={{ color: "var(--accent)" }} />
            Personal Profile Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Full Name</label>
              <input
                {...register("name")}
                type="text"
                // defaultValue={user?.user?.name || ""}
                disabled={isSubmitting}
                className={`w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500/40 outline-none transition-all ${
                  isSubmitting ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Email Address</label>
              <input
                disabled
                {...register("email")}
                type="email"
                defaultValue={user?.user?.email || ""}
                className="hover:cursor-not-allowed w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white opacity-40 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`accent-btn px-4 py-2 rounded-lg text-xs font-semibold text-white cursor-pointer transition-colors flex items-center gap-2 ${
              isSubmitting ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save Profiles"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
