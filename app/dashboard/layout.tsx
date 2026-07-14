import { auth } from "@/auth";
import DashboardLayoutClient from "@/app/dashboard/DashboardLayoutClient";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return <DashboardLayoutClient initialSession={session}>{children}</DashboardLayoutClient>;
}
