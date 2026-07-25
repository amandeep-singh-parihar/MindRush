import QuizzesClient from "./QuizzesClient";
import { getUserQuizzesData } from "@/actions/quiz";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "My Quizzes",
};

export default async function MyQuizzesPage() {
  const quizzes = await getUserQuizzesData();
  return <QuizzesClient initialQuizzes={quizzes} />;
}
