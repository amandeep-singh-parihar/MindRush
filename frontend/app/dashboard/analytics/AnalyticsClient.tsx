"use client";

import { CheckCircle2, Sparkles, Clock } from "lucide-react";

const MOCK_STATS = {
  totalQuizzesTaken: 34,
  totalQuestionsAnswered: 340,
  correctlyAnswered: 272,
  accuracy: 80,
};

export default function AnalyticsClient() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Performance Analytics</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Get an inside look at your learning patterns, strength distribution, and accuracy growth.
        </p>
      </div>

      {/* Grid Section: Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-5 border border-white/5">
          <p className="text-xs text-zinc-400">Questions Correctly Answered</p>
          <h4 className="text-2xl font-extrabold text-white mt-1.5">
            {MOCK_STATS.correctlyAnswered}{" "}
            <span className="text-xs text-zinc-500 font-normal">
              / {MOCK_STATS.totalQuestionsAnswered}
            </span>
          </h4>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-400/10" />
            Overall accuracy at {MOCK_STATS.accuracy}%
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/5">
          <p className="text-xs text-zinc-400">Total Quiz-taking Sessions</p>
          <h4 className="text-2xl font-extrabold text-white mt-1.5">
            {MOCK_STATS.totalQuizzesTaken}
          </h4>
          <div className="flex items-center gap-1 text-[11px] text-pink-400 mt-2 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Avg difficulty level: Medium-Hard
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/5">
          <p className="text-xs text-zinc-400">Est. Average Completion Time</p>
          <h4 className="text-2xl font-extrabold text-white mt-1.5">285 seconds</h4>
          <div className="flex items-center gap-1 text-[11px] text-indigo-400 mt-2 font-medium">
            <Clock className="w-3.5 h-3.5" />
            Faster than 72% of users on same topics
          </div>
        </div>
      </div>

      {/* Graphic Charts: Line chart and category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Score Trend Card (SVG Chart) */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-6 border border-white/5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Score Progression Trend</h3>
            <p className="text-xs text-zinc-500">Weekly accuracy growth across previous attempts</p>
          </div>

          {/* SVG Chart Area */}
          <div className="relative w-full h-64 bg-white/[0.01] rounded-xl border border-white/5 flex items-center justify-center p-4">
            <svg viewBox="0 0 500 200" className="w-full h-full text-pink-500 overflow-visible">
              <line
                x1="0"
                y1="50"
                x2="500"
                y2="50"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="100"
                x2="500"
                y2="100"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="150"
                x2="500"
                y2="150"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1"
              />

              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>

              <polygon
                points="20,180 100,80 200,120 300,60 400,90 480,40 480,180"
                fill="url(#chartGlow)"
              />

              <path
                d="M 20,180 L 100,80 L 200,120 L 300,60 L 400,90 L 480,40"
                fill="none"
                stroke="url(#gradientLine)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle
                cx="20"
                cy="180"
                r="5"
                className="fill-[#050409] stroke-pink-500 stroke-[3.5] hover:scale-125 transition-transform"
              />
              <circle
                cx="100"
                cy="80"
                r="5"
                className="fill-[#050409] stroke-pink-500 stroke-[3.5] hover:scale-125 transition-transform"
              />
              <circle
                cx="200"
                cy="120"
                r="5"
                className="fill-[#050409] stroke-purple-500 stroke-[3.5] hover:scale-125 transition-transform"
              />
              <circle
                cx="300"
                cy="60"
                r="5"
                className="fill-[#050409] stroke-purple-500 stroke-[3.5] hover:scale-125 transition-transform"
              />
              <circle
                cx="400"
                cy="90"
                r="5"
                className="fill-[#050409] stroke-indigo-500 stroke-[3.5] hover:scale-125 transition-transform"
              />
              <circle
                cx="480"
                cy="40"
                r="5"
                className="fill-[#050409] stroke-indigo-500 stroke-[3.5] hover:scale-125 transition-transform"
              />

              <text x="445" y="25" fill="#f4f4f5" fontSize="10" fontWeight="bold">
                90% Max
              </text>
            </svg>

            <div className="absolute bottom-2 left-6 right-6 flex justify-between text-[9px] text-zinc-500 font-semibold uppercase">
              <span>May 2026</span>
              <span>June 2026</span>
              <span>July 2026</span>
            </div>
          </div>
        </div>

        {/* Category Strength Breakdown (4 cols on desktop) */}
        <div className="lg:col-span-4 glass-card rounded-2xl p-6 border border-white/5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Strength Breakdown</h3>
            <p className="text-xs text-zinc-500">Average accuracy sorted by category</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-white">Coding & Tech</span>
                <span className="text-pink-400 font-semibold">88%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                  style={{ width: "88%" }}
                ></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-white">Science & Logic</span>
                <span className="text-purple-400 font-semibold">75%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-white">Language & Gram.</span>
                <span className="text-indigo-400 font-semibold">70%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                  style={{ width: "70%" }}
                ></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-white">World History</span>
                <span className="text-zinc-400 font-semibold">55%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-600 rounded-full" style={{ width: "55%" }}></div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-pink-500/5 border border-pink-500/10 rounded-xl mt-4 flex gap-2">
            <Sparkles className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              <span className="text-white font-bold">AI Tip:</span> You show excellent prowess in{" "}
              <span className="text-pink-400">Coding</span>! Try generating a{" "}
              <span className="text-white">World History</span> quiz today to strengthen your
              weaknesses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
