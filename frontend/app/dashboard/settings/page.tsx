import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import ProfileForm from "@/components/Profile/ProfileForm";
import PasswordForm from "@/components/Profile/PasswordForm";

export const metadata = {
  title: "Settings",
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

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Account Settings</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Configure profile settings, account details, and password preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <ProfileForm user={user} />

        {/* Password Modification */}
        <PasswordForm hasPassword={!!dbUser?.password} />
      </div>
    </div>
  );
}
