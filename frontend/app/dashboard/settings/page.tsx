import { User, Lock, CreditCard, ExternalLink } from "lucide-react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import ProfileForm from "@/components/Profile/ProfileForm";
import PasswordForm from "@/components/Profile/PasswordForm";

const MOCK_USER = {
  name: "Mock",
  email: "Mock@example.com",
  tier: "Premium Creator",
};

export default async function SettingsPage() {
  const session = await auth();

  let dbUser = null;
  if (session?.user?.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
  }

  const user =
    session && dbUser
      ? {
          ...session,
          user: {
            ...session.user,
            name: dbUser.name,
            email: dbUser.email,
          },
        }
      : session;

  // console.log("page -> ", user);

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
          <ProfileForm user={user} />

          {/* Password Modification */}
          <PasswordForm hasPassword={!!dbUser?.password} />
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
