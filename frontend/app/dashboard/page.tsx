import Link from "next/link";
import {
  Flame,
  Target,
  Trophy,
  Clock,
  ChevronRight,
  History,
  Calendar,
  BookOpen,
  Plus,
} from "lucide-react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import QuickTemplates from "@/components/QuickTemplates";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Dashboard",
};

export default async function OverviewPage() {
  const session = await auth();

  let dbUser = null;
  if (session?.user?.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        statistics: true,
        attempts: {
          include: {
            quiz: {
              include: {
                questions: true,
              },
            },
          },
          orderBy: { completedAt: "desc" },
          take: 5,
        },
      },
    });
  }

  const name = dbUser?.name || session?.user?.name || "User";
  const firstName = name.split(" ")[0];

  // User Real Statistics
  const userStats = dbUser?.statistics || {
    totalQuizzesTaken: dbUser?.attempts?.length || 0,
    totalQuestionsAnswered:
      dbUser?.attempts?.reduce((acc, a) => acc + (a.quiz?.questions?.length || 5), 0) || 0,
    correctlyAnswered: dbUser?.attempts?.reduce((acc, a) => acc + a.score, 0) || 0,
    accuracy: 0,
    currentStreak: dbUser?.attempts?.length ? 1 : 0,
    maxStreak: dbUser?.attempts?.length ? 1 : 0,
    totalStudyTime: 0,
  };

  const calculatedAccuracy =
    userStats.totalQuestionsAnswered > 0
      ? Math.round((userStats.correctlyAnswered / userStats.totalQuestionsAnswered) * 100)
      : Math.round(userStats.accuracy || 0);

  const attemptsList = (dbUser?.attempts || []).map((att) => ({
    id: att.id,
    quizTitle: att.quiz.title,
    topic: att.quiz.topic,
    difficulty: att.quiz.difficulty,
    score: att.score,
    totalQuestions: att.quiz.questions.length || 5,
    percentage: Math.round(att.percentage),
    completedAt: att.completedAt.toISOString(),
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div
        className="rounded-xl p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Welcome back, <span style={{ color: "var(--accent)" }}>{firstName}</span>!
          </h2>
          <p className="text-sm mt-1 max-w-xl" style={{ color: "var(--text-muted)" }}>
            Ready to boost your knowledge today? Choose a recommended topic below or construct a
            custom quiz using the power of AI.
          </p>
        </div>

        <Link
          href="/"
          className="accent-btn shrink-0 px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Quiz
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Streak */}
        <div
          className="rounded-xl p-4 md:p-5 flex items-center gap-3"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="p-2.5 rounded-lg" style={{ background: "var(--surface-2)" }}>
            <Flame className="w-4 h-4" style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Daily Streak
            </p>
            <h4 className="text-lg font-bold text-white mt-0.5">
              {userStats.currentStreak}{" "}
              <span className="text-xs font-normal" style={{ color: "var(--text-subtle)" }}>
                days
              </span>
            </h4>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--text-subtle)" }}>
              Best: {userStats.maxStreak}d
            </p>
          </div>
        </div>

        {/* Accuracy */}
        <div
          className="rounded-xl p-4 md:p-5 flex items-center gap-3"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="p-2.5 rounded-lg" style={{ background: "var(--surface-2)" }}>
            <Target className="w-4 h-4" style={{ color: "var(--accent)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Avg Accuracy
            </p>
            <h4 className="text-lg font-bold text-white mt-0.5">{calculatedAccuracy}%</h4>
            <div
              className="w-full h-1 rounded-full mt-1.5 overflow-hidden"
              style={{ background: "var(--surface-2)" }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${calculatedAccuracy}%`, background: "var(--accent)" }}
              />
            </div>
          </div>
        </div>

        {/* Total Quizzes */}
        <div
          className="rounded-xl p-4 md:p-5 flex items-center gap-3"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="p-2.5 rounded-lg" style={{ background: "var(--surface-2)" }}>
            <Trophy className="w-4 h-4" style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Quizzes Completed
            </p>
            <h4 className="text-lg font-bold text-white mt-0.5">{userStats.totalQuizzesTaken}</h4>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--text-subtle)" }}>
              Total
            </p>
          </div>
        </div>

        {/* Study Time */}
        <div
          className="rounded-xl p-4 md:p-5 flex items-center gap-3"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="p-2.5 rounded-lg" style={{ background: "var(--surface-2)" }}>
            <Clock className="w-4 h-4" style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Study Time
            </p>
            <h4 className="text-lg font-bold text-white mt-0.5">
              {Math.floor(userStats.totalStudyTime / 60)}h {userStats.totalStudyTime % 60}m
            </h4>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--text-subtle)" }}>
              Total
            </p>
          </div>
        </div>
      </div>

      {/* Quick AI Templates */}
      <QuickTemplates />

      {/* Activity Heatmap */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
          Learning Activity
        </h3>

        <div
          className="rounded-xl p-5 w-full"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <ActivityHeatmap
            attemptDates={(dbUser?.attempts || []).map((a) => a.completedAt.toISOString())}
          />
        </div>
      </div>

      {/* Recent Quiz Attempts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <History className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            Recent Attempts
          </h3>
          <Link
            href="/dashboard/history"
            className="text-xs font-medium flex items-center gap-0.5 transition-colors hover:opacity-80 cursor-pointer"
            style={{ color: "var(--accent)" }}
          >
            View All
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {attemptsList.length > 0 ? (
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th
                      className="p-4 text-xs font-semibold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Quiz Topic
                    </th>
                    <th
                      className="p-4 text-xs font-semibold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Difficulty
                    </th>
                    <th
                      className="p-4 text-xs font-semibold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Score
                    </th>
                    <th
                      className="p-4 text-xs font-semibold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Accuracy
                    </th>
                    <th
                      className="p-4 text-xs font-semibold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attemptsList.map((attempt) => (
                    <tr
                      key={attempt.id}
                      className="transition-colors hover:bg-white/[0.02]"
                      style={{ borderBottom: "1px solid var(--border)" }}
                    >
                      <td className="p-4">
                        <div className="font-medium text-white text-sm">{attempt.quizTitle}</div>
                        <div className="text-[11px] mt-0.5" style={{ color: "var(--text-subtle)" }}>
                          {attempt.topic}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className="text-[10px] px-2 py-0.5 rounded font-medium"
                          style={{
                            background:
                              attempt.difficulty === "Easy"
                                ? "rgba(34,197,94,0.1)"
                                : attempt.difficulty === "Medium"
                                  ? "rgba(234,179,8,0.1)"
                                  : "rgba(239,68,68,0.1)",
                            color:
                              attempt.difficulty === "Easy"
                                ? "#4ade80"
                                : attempt.difficulty === "Medium"
                                  ? "#facc15"
                                  : "#f87171",
                            border: `1px solid ${
                              attempt.difficulty === "Easy"
                                ? "rgba(34,197,94,0.2)"
                                : attempt.difficulty === "Medium"
                                  ? "rgba(234,179,8,0.2)"
                                  : "rgba(239,68,68,0.2)"
                            }`,
                          }}
                        >
                          {attempt.difficulty}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-semibold text-white">
                        {attempt.score} / {attempt.totalQuestions}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-white">
                            {attempt.percentage}%
                          </span>
                          <div
                            className="w-12 h-1 rounded-full overflow-hidden hidden sm:block"
                            style={{ background: "var(--surface-2)" }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${attempt.percentage}%`,
                                background:
                                  attempt.percentage >= 80
                                    ? "#4ade80"
                                    : attempt.percentage >= 60
                                      ? "#facc15"
                                      : "#f87171",
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs" style={{ color: "var(--text-muted)" }}>
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div
            className="rounded-xl p-8 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <BookOpen className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--text-subtle)" }} />
            <h4 className="text-sm font-semibold text-white">No quiz attempts yet</h4>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Generate a quiz using the form above to record your first attempt.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
