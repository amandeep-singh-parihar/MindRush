import Link from "next/link";
import {
  Flame,
  Target,
  Trophy,
  Clock,
  Sparkles,
  ChevronRight,
  History,
  Calendar,
  BookOpen,
} from "lucide-react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import ActivityHeatmap from "@/components/ActivityHeatmap";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Dashboard",
};

const RECOMMENDED_TOPICS = [
  {
    topic: "CSS Grid & Flexbox",
    category: "Design",
    questions: 10,
    color: "from-amber-500 to-orange-600",
  },
  {
    topic: "TypeScript Advanced Types",
    category: "Coding",
    questions: 10,
    color: "from-blue-500 to-indigo-600",
  },
  {
    topic: "Ancient Roman Empire",
    category: "History",
    questions: 8,
    color: "from-emerald-500 to-teal-600",
  },
  {
    topic: "Machine Learning Basics",
    category: "AI/ML",
    questions: 10,
    color: "from-purple-500 to-pink-600",
  },
];

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
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner Section */}
      <div className="relative glass-card rounded-3xl p-6 md:p-8 overflow-hidden border border-white/5">
        <div className="absolute right-0 top-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                {firstName}
              </span>
              !
            </h2>
            <p className="text-sm md:text-base text-zinc-400 mt-2 max-w-xl">
              Ready to boost your knowledge today? Choose a recommended topic below or construct a
              custom quiz using the power of AI.
            </p>
          </div>

          <Link
            href="/"
            className="btn-gradient shrink-0 px-6 py-3.5 rounded-2xl text-sm font-semibold text-white shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-white/10" />
            Create Custom Quiz
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Item 1: Streak */}
        <div className="glass-card rounded-2xl p-4 md:p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <Flame className="w-5 h-5 fill-amber-500/10 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-medium">Daily Streak</p>
            <h4 className="text-lg md:text-xl font-bold text-white mt-1">
              {userStats.currentStreak}{" "}
              <span className="text-xs font-normal text-zinc-500">days</span>
            </h4>
            <p className="text-[10px] text-amber-500/80 font-medium mt-0.5">
              Best: {userStats.maxStreak} days
            </p>
          </div>
        </div>

        {/* Stat Item 2: Accuracy */}
        <div className="glass-card rounded-2xl p-4 md:p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl">
            <Target className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-400 font-medium">Avg Accuracy</p>
            <h4 className="text-lg md:text-xl font-bold text-white mt-1">{calculatedAccuracy}%</h4>
            <div className="w-full bg-white/5 h-1 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-pink-500 rounded-full"
                style={{ width: `${calculatedAccuracy}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stat Item 3: Total Quizzes */}
        <div className="glass-card rounded-2xl p-4 md:p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-medium">Quizzes Completed</p>
            <h4 className="text-lg md:text-xl font-bold text-white mt-1">
              {userStats.totalQuizzesTaken}
            </h4>
            <p className="text-[10px] text-purple-400/80 font-medium mt-0.5">Real DB Tracker</p>
          </div>
        </div>

        {/* Stat Item 4: Study Time */}
        <div className="glass-card rounded-2xl p-4 md:p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-medium">Study Time</p>
            <h4 className="text-lg md:text-xl font-bold text-white mt-1">
              {Math.floor(userStats.totalStudyTime / 60)}h {userStats.totalStudyTime % 60}m
            </h4>
            <p className="text-[10px] text-indigo-400/80 font-medium mt-0.5">Total Time</p>
          </div>
        </div>
      </div>

      {/* Quick Topics */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-500" />
          Quick AI Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {RECOMMENDED_TOPICS.map((topic, i) => (
            <Link
              key={i}
              href={`/dashboard?create=true&topic=${encodeURIComponent(topic.topic)}`}
              className="glass-card rounded-2xl p-5 hover:border-pink-500/30 transition-all duration-300 cursor-pointer relative group overflow-hidden block"
            >
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${topic.color} opacity-[0.05] group-hover:opacity-10 rounded-full blur-xl transition-all duration-300`}
              ></div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/5 font-semibold">
                {topic.category}
              </span>
              <h4 className="text-base font-bold text-white mt-3 group-hover:text-pink-400 transition-colors">
                {topic.topic}
              </h4>
              <p className="text-xs text-zinc-500 mt-1">{topic.questions} AI questions • 10m</p>
              <div className="flex items-center gap-1 text-xs text-pink-500 font-semibold mt-4 group-hover:gap-2 transition-all">
                Generate Now
                <ChevronRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Learning Intensity / Activity Calendar */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Calendar className="w-4 h-4 text-zinc-400" />
          Learning Activity Log
        </h3>

        <div className="glass-card rounded-2xl p-6 border border-white/5 w-full">
          <ActivityHeatmap
            attemptDates={(dbUser?.attempts || []).map((a) => a.completedAt.toISOString())}
          />
        </div>
      </div>

      {/* Recent Quiz Attempts (Full Width) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-4 h-4 text-zinc-400" />
            Recent Quiz Attempts
          </h3>
          <Link
            href="/dashboard/history"
            className="text-xs text-pink-500 hover:text-pink-400 font-semibold transition-colors flex items-center gap-0.5 cursor-pointer"
          >
            View All History
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {attemptsList.length > 0 ? (
          <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="p-4 text-xs font-semibold text-zinc-400">Quiz Topic</th>
                    <th className="p-4 text-xs font-semibold text-zinc-400">Difficulty</th>
                    <th className="p-4 text-xs font-semibold text-zinc-400">Score</th>
                    <th className="p-4 text-xs font-semibold text-zinc-400">Accuracy</th>
                    <th className="p-4 text-xs font-semibold text-zinc-400">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {attemptsList.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-white text-sm">{attempt.quizTitle}</div>
                        <div className="text-[11px] text-zinc-500">{attempt.topic}</div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            attempt.difficulty === "Easy"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : attempt.difficulty === "Medium"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {attempt.difficulty}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-semibold text-white">
                        {attempt.score} / {attempt.totalQuestions}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-zinc-300">
                            {attempt.percentage}%
                          </span>
                          <div className="w-12 bg-white/5 h-1 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className={`h-full rounded-full ${
                                attempt.percentage >= 80
                                  ? "bg-emerald-500"
                                  : attempt.percentage >= 60
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${attempt.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs text-zinc-400">
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center border border-white/5">
            <BookOpen className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">No quiz attempts recorded yet</h4>
            <p className="text-xs text-zinc-400 mt-1">
              Generate a quiz using the form above to record your first completed attempt in the
              database!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
