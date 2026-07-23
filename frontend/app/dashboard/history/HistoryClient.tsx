"use client";

import { useState } from "react";
import { History, Search } from "lucide-react";

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

export default function HistoryClient() {
  const [historySearch, setHistorySearch] = useState("");
  const [historyFilter, setHistoryFilter] = useState("all");

  const filteredHistory = MOCK_RECENT_ATTEMPTS.filter((attempt) => {
    const matchesSearch =
      attempt.quizTitle.toLowerCase().includes(historySearch.toLowerCase()) ||
      attempt.topic.toLowerCase().includes(historySearch.toLowerCase());
    const matchesDifficulty =
      historyFilter === "all" || attempt.difficulty.toLowerCase() === historyFilter.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Full Attempt History</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Review all your previous scores, correct answers, and learning progress.
        </p>
      </div>

      {/* Filters / Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3 glass-card rounded-2xl px-4 py-2 border border-white/5 w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-500 shrink-0" />
            <input
              type="text"
              placeholder="Search history by topic..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white placeholder-zinc-500 w-full"
            />
          </div>

          <div className="flex items-center gap-2 glass-card rounded-2xl px-3 py-2 border border-white/5 text-sm text-zinc-300">
            <span>Difficulty:</span>
            <select
              value={historyFilter}
              onChange={(e) => setHistoryFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-white font-semibold cursor-pointer text-xs"
            >
              <option value="all">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-zinc-400 bg-white/5 border border-white/5 px-3 py-2 rounded-xl">
          Showing <span className="font-semibold text-white">{filteredHistory.length}</span>{" "}
          attempts
        </div>
      </div>

      {/* List */}
      {filteredHistory.length > 0 ? (
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="p-4 text-xs font-semibold text-zinc-400">Quiz Title</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400">Date Completed</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400">Difficulty</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400">Score Achieved</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400">Accuracy</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400">Time Spent</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredHistory.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{attempt.quizTitle}</div>
                      <span className="text-[10px] text-zinc-500 bg-white/5 border border-white/5 px-1.5 py-0.5 rounded font-semibold mt-1 inline-block">
                        {attempt.topic}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-zinc-300">
                      {new Date(attempt.completedAt).toLocaleDateString()} at{" "}
                      {new Date(attempt.completedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
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
                        <span
                          className={`text-xs font-semibold ${attempt.percentage >= 80 ? "text-emerald-400" : attempt.percentage >= 60 ? "text-amber-400" : "text-red-400"}`}
                        >
                          {attempt.percentage}%
                        </span>
                        <div className="w-16 bg-white/5 h-1 rounded-full overflow-hidden">
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
                    <td className="p-4 text-xs text-zinc-300">
                      {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
                    </td>
                    <td className="p-4 text-right">
                      <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all cursor-pointer">
                        Detailed Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/5 max-w-xl mx-auto mt-8">
          <History className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-white">No history records matching filters</h4>
          <p className="text-sm text-zinc-400 mt-2">
            Try modifying your search or select "All" from the difficulty filters.
          </p>
        </div>
      )}
    </div>
  );
}
