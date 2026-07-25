"use client";

import { CheckCircle2, Sparkles, Clock, Target, BarChart2 } from "lucide-react";

interface AnalyticsData {
  stats: {
    totalQuizzesTaken: number;
    totalQuestionsAnswered: number;
    correctlyAnswered: number;
    accuracy: number;
    totalStudyTime: number;
  };
  categoryBreakdown: Array<{
    topic: string;
    accuracy: number;
  }>;
  scoreProgressions: Array<{
    date: string;
    percentage: number;
  }>;
}

export default function AnalyticsClient({ data }: { data?: AnalyticsData }) {
  const stats = data?.stats || {
    totalQuizzesTaken: 0,
    totalQuestionsAnswered: 0,
    correctlyAnswered: 0,
    accuracy: 0,
    totalStudyTime: 0,
  };

  const categoryBreakdown = data?.categoryBreakdown || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Performance Analytics</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Real-time insights on your learning accuracy, completed attempts, and subject mastery.
        </p>
      </div>

      {/* Grid Section: Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-5 border border-white/5">
          <p className="text-xs text-zinc-400">Questions Correctly Answered</p>
          <h4 className="text-2xl font-extrabold text-white mt-1.5">
            {stats.correctlyAnswered}{" "}
            <span className="text-xs text-zinc-500 font-normal">
              / {stats.totalQuestionsAnswered}
            </span>
          </h4>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-400/10" />
            Overall accuracy at {stats.accuracy}%
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/5">
          <p className="text-xs text-zinc-400">Total Quiz-taking Sessions</p>
          <h4 className="text-2xl font-extrabold text-white mt-1.5">{stats.totalQuizzesTaken}</h4>
          <div className="flex items-center gap-1 text-[11px] text-pink-400 mt-2 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Completed quizzes & practice sessions
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/5">
          <p className="text-xs text-zinc-400">Total Quiz Study Time</p>
          <h4 className="text-2xl font-extrabold text-white mt-1.5">
            {Math.floor(stats.totalStudyTime / 60)}h {stats.totalStudyTime % 60}m
          </h4>
          <div className="flex items-center gap-1 text-[11px] text-indigo-400 mt-2 font-medium">
            <Clock className="w-3.5 h-3.5" />
            Active time spent solving questions
          </div>
        </div>
      </div>

      {/* Category Strength Breakdown */}
      <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-pink-400" />
            Topic Strength Breakdown
          </h3>
          <p className="text-xs text-zinc-500">Average accuracy by category based on DB records</p>
        </div>

        {categoryBreakdown.length > 0 ? (
          <div className="space-y-4 max-w-xl">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-white font-semibold">{cat.topic}</span>
                  <span className="text-pink-400 font-semibold">{cat.accuracy}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                    style={{ width: `${cat.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed border-white/10 rounded-xl">
            <BarChart2 className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-400">
              No topic statistics recorded yet. Complete quizzes to build your subject mastery
              profile!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
