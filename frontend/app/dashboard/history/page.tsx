import HistoryClient from "./HistoryClient";
import { getUserHistoryData } from "@/actions/quiz";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Attempt History",
};

export default async function HistoryPage() {
  const history = await getUserHistoryData();
  return <HistoryClient initialHistory={history} />;
}
