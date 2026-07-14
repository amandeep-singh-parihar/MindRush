import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import DashboardLayoutClient from "@/app/dashboard/DashboardLayoutClient";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // console.log("session", session);

  let dbUser = null;
  if (session?.user?.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { name: true },
    });
  }

  const initialSession =
    session && dbUser
      ? {
          ...session,
          user: {
            ...session.user,
            name: dbUser.name,
          },
        }
      : session;

  return <DashboardLayoutClient initialSession={initialSession}>{children}</DashboardLayoutClient>;
}
