import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import DashboardLayoutClient from "@/app/dashboard/DashboardLayoutClient";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) {
    return redirect("/");
  }

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
