import AnalyticsClient from "./AnalyticsClient";
import { getUserAnalyticsData } from "@/actions/quiz";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Analytics",
};

export default async function AnalyticsPage() {
  const analyticsData = await getUserAnalyticsData();
  return <AnalyticsClient data={analyticsData} />;
}
