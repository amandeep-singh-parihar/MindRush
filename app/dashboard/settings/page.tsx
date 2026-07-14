import { User, Lock, CreditCard, ExternalLink } from "lucide-react";
import { auth } from "@/auth";

const MOCK_USER = {
  name: "Mock",
  email: "Mock@example.com",
  tier: "Premium Creator",
};

export default async function SettingsPage() {
  const user = await auth();
  // console.log("testing from the settings", user)
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Account Settings</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Configure profile settings, subscriptions, and interface parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Edit Cards (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Basic Info */}
          <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-pink-500" />
              Personal Profile Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.user?.name || ""}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-pink-500/50 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Email Address</label>
                <input
                  readOnly
                  type="email"
                  defaultValue={user?.user?.email || ""}
                  className="hover:cursor-not-allowed w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-pink-500/50 outline-none transition-all"
                />
              </div>
            </div>

            <button className="btn-gradient px-4 py-2.5 rounded-xl text-xs font-semibold text-white cursor-pointer shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 transition-all self-start">
              Save Profiles
            </button>
          </div>

          {/* Password Modification */}
          <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-500" />
              Update Password Security
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-pink-500/50 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">New Password</label>
                <input
                  type="password"
                  placeholder="New password"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-pink-500/50 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Verify Password</label>
                <input
                  type="password"
                  placeholder="Re-type password"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-pink-500/50 outline-none transition-all"
                />
              </div>
            </div>

            <button className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold text-white transition-all cursor-pointer">
              Change Security Password
            </button>
          </div>
        </div>

        {/* Subscriptions Card (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-5 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-pink-500/10 text-pink-500 rounded-xl">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Membership Details</h3>
                <p className="text-[10px] text-zinc-500">Subscription plan & pricing tier</p>
              </div>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Current Plan:</span>
                <span className="text-pink-400 font-bold tracking-wider uppercase text-[10px] px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20">
                  {(user as any)?.tier || MOCK_USER.tier}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Monthly renewal:</span>
                <span className="text-zinc-200 font-semibold">August 10, 2026</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Cost:</span>
                <span className="text-zinc-200 font-semibold">$9.99/mo</span>
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full btn-gradient py-2.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-pink-500/10 animate-pulse">
                Manage Billing Subscription
                <ExternalLink className="w-3 h-3" />
              </button>
              <button className="w-full py-2.5 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-xs font-semibold text-red-400 hover:text-red-300 transition-all cursor-pointer">
                Cancel Subscription Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
