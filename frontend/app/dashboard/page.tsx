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
} from "lucide-react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const MOCK_USER = {
  name: "Amandeep Singh",
  email: "amandeep@example.com",
};

const MOCK_STATS = {
  totalQuizzesTaken: 34,
  totalQuestionsAnswered: 340,
  correctlyAnswered: 272,
  accuracy: 80,
  currentStreak: 5,
  maxStreak: 12,
  totalStudyTime: 245,
};

const MOCK_RECOMMENDED_TOPICS = [
  {
    topic: "CSS Grid & Flexbox",
    category: "Design",
    questions: 10,
    color: "from-amber-500 to-orange-600",
  },
  {
    topic: "TypeScript Advanced Types",
    category: "Coding",
    questions: 12,
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

const MOCK_RECENT_ATTEMPTS = [
  {
    id: 1,
    quizTitle: "Next.js 15 App Router Deep Dive",
    topic: "Web Development",
    difficulty: "Hard",
    score: 8,
    totalQuestions: 10,
    percentage: 80,
    timeTaken: 380,
    completedAt: "2026-07-14T18:24:00Z",
  },
  {
    id: 2,
    quizTitle: "Quantum Mechanics Fundamentals",
    topic: "Physics",
    difficulty: "Medium",
    score: 9,
    totalQuestions: 10,
    percentage: 90,
    timeTaken: 290,
    completedAt: "2026-07-13T10:15:00Z",
  },
  {
    id: 3,
    quizTitle: "Modern World History 1900s",
    topic: "History",
    difficulty: "Easy",
    score: 7,
    totalQuestions: 10,
    percentage: 70,
    timeTaken: 195,
    completedAt: "2026-07-11T14:40:00Z",
  },
  {
    id: 4,
    quizTitle: "Data Structures & Algorithms in JS",
    topic: "Computer Science",
    difficulty: "Hard",
    score: 6,
    totalQuestions: 8,
    percentage: 75,
    timeTaken: 450,
    completedAt: "2026-07-09T21:05:00Z",
  },
];

export default async function OverviewPage() {
  const session = await auth();

  let dbUser = null;
  if (session?.user?.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { name: true },
    });
  }

  const name = dbUser?.name || session?.user?.name || MOCK_USER.name;
  const firstName = name.split(" ")[0];

  const heatmapSeed = [
    0, 1, 2, 0, 3, 1, 0, 2, 4, 1, 0, 0, 2, 3, 1, 0, 4, 2, 1, 0, 3, 2, 0, 1, 4, 0, 2, 1, 3, 0, 1,
    1, 2, 4, 0, 3, 1, 2, 0, 1, 0, 3, 2, 4, 1, 0, 2, 1, 0, 3, 4, 1, 2, 0, 1, 3, 1, 4, 2, 0, 1, 3,
    2, 0, 4, 1, 3, 0, 2, 1, 0, 4, 3, 2, 1, 0, 2, 4, 1, 0, 3, 2, 1, 4, 0, 2, 1, 3, 0, 4, 1, 2, 0,
    3, 1, 0, 2, 4, 1, 2, 0, 3, 1, 0, 4, 2, 1, 0, 2, 3, 4, 1, 0, 2, 1, 3, 0, 4, 2, 1, 0, 3, 2, 1,
  ];

  const totalHeatmapDays = 400;
  const heatmapData = Array.from({ length: totalHeatmapDays }, (_, i) => heatmapSeed[i % heatmapSeed.length]);
  const activeDaysCount = heatmapData.filter((level) => level > 0).length;

  const renderHeatmap = () => {
    return heatmapData.map((level, i) => {
      let bgClass = "bg-white/5";
      if (level === 1) bgClass = "bg-pink-500/25";
      else if (level === 2) bgClass = "bg-pink-500/50";
      else if (level === 3) bgClass = "bg-purple-500/75";
      else if (level === 4) bgClass = "bg-purple-400 shadow-sm shadow-purple-500/50";

      return (
        <div
          key={i}
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] transition-all duration-200 hover:scale-125 hover:ring-2 hover:ring-pink-400 hover:z-10 shrink-0 ${bgClass}`}
          title={`Day ${i + 1}: ${level > 0 ? `${level} quiz attempts` : "No activity"}`}
        />
      );
    });
  };

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
              {MOCK_STATS.currentStreak}{" "}
              <span className="text-xs font-normal text-zinc-500">days</span>
            </h4>
            <p className="text-[10px] text-amber-500/80 font-medium mt-0.5">
              Best: {MOCK_STATS.maxStreak} days
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
            <h4 className="text-lg md:text-xl font-bold text-white mt-1">{MOCK_STATS.accuracy}%</h4>
            <div className="w-full bg-white/5 h-1 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-pink-500 rounded-full"
                style={{ width: `${MOCK_STATS.accuracy}%` }}
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
              {MOCK_STATS.totalQuizzesTaken}
            </h4>
            <p className="text-[10px] text-purple-400/80 font-medium mt-0.5">Top 8% this week</p>
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
              {Math.round(MOCK_STATS.totalStudyTime / 60)}h {MOCK_STATS.totalStudyTime % 60}m
            </h4>
            <p className="text-[10px] text-indigo-400/80 font-medium mt-0.5">+15% vs last week</p>
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
          {MOCK_RECOMMENDED_TOPICS.map((topic, i) => (
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

      {/* Learning Intensity (Full Width) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Calendar className="w-4 h-4 text-zinc-400" />
          Learning Intensity
        </h3>

        <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col gap-5 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Activity Log (Past 52 Weeks)</p>
              <h4 className="text-2xl font-extrabold text-white mt-1">{activeDaysCount} Active Days</h4>
            </div>

            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-zinc-400 flex items-center gap-2.5 max-w-md">
              <Flame className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="font-semibold text-white">Daily Streak Active!</span> Keep
                answering quizzes everyday to unlock premium achievements.
              </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto pb-2 scrollbar-none">
            <div className="flex flex-col gap-2.5 min-w-max">
              <div className="grid grid-flow-col grid-rows-7 gap-1.5 justify-start">
                {renderHeatmap()}
              </div>
              <div className="flex justify-between items-center text-[10px] text-zinc-500 px-0.5">
                <span>Less</span>
                <div className="flex gap-1.5 items-center">
                  <div className="w-2.5 h-2.5 rounded-sm bg-white/5"></div>
                  <div className="w-2.5 h-2.5 rounded-sm bg-pink-500/20"></div>
                  <div className="w-2.5 h-2.5 rounded-sm bg-pink-500/40"></div>
                  <div className="w-2.5 h-2.5 rounded-sm bg-purple-500/60"></div>
                  <div className="w-2.5 h-2.5 rounded-sm bg-purple-500/90"></div>
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
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
                  <th className="p-4 text-xs font-semibold text-zinc-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_RECENT_ATTEMPTS.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-white text-sm">{attempt.quizTitle}</div>
                      <div className="text-[11px] text-zinc-500">{attempt.topic}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-medium ${attempt.difficulty === "Easy"
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
                            className={`h-full rounded-full ${attempt.percentage >= 80
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
                    <td className="p-4 text-right">
                      <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all cursor-pointer">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
