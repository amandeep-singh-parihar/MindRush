"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { User, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
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
    } catch (error) {
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
      {/* ----------------- CUSTOM PREMIUM TOAST NOTIFIER ----------------- */}
      {toast?.show && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
          <div className="rounded-2xl p-3.5 border border-white/10 bg-[#13151f]/95 backdrop-blur-xl shadow-2xl shadow-black/80 flex items-center gap-3.5 max-w-sm">
            {/* Status Icon */}
            <div
              className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border ${
                toast.type === "success"
                  ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/15 border-red-500/20 text-red-400"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
            </div>

            {/* Toast Details */}
            <div className="flex-1 min-w-0 pr-2">
              <h4
                className={`text-sm font-bold tracking-tight ${
                  toast.type === "success" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {toast.title}
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5 leading-snug">{toast.message}</p>
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

      {/* Profile Form Content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-pink-500" />
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
                className={`w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-pink-500/50 outline-none transition-all ${
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
            className={`btn-gradient px-5 py-2.5 rounded-xl text-xs font-semibold text-white cursor-pointer shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 transition-all flex items-center gap-2 ${
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
