"use client";

import { useMemo } from "react";
import { CheckCircle2, Sparkles, Clock, Target, BarChart2, TrendingUp } from "lucide-react";

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
  const scoreProgressions = data?.scoreProgressions || [];

  // Generate dynamic SVG points for the Score Progression Trend chart
  const { hasData, pathData, polygonPoints, points, maxScore, dates } = useMemo(() => {
    if (scoreProgressions.length >= 2) {
      const chartWidth = 450;
      const startX = 25;
      const maxPts = scoreProgressions.length;
      const stepX = chartWidth / Math.max(1, maxPts - 1);

      const parsedPoints = scoreProgressions.map((item, idx) => {
        const x = startX + idx * stepX;
        // map percentage 0..100 to y 170..40
        const y = 170 - (item.percentage / 100) * 130;
        return { x, y, percentage: item.percentage, date: item.date };
      });

      const maxPt = parsedPoints.reduce(
        (prev, curr) => (curr.percentage > prev.percentage ? curr : prev),
        parsedPoints[0]
      );

      const pathStr = parsedPoints.reduce((acc, pt, i) => {
        return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
      }, "");

      const polyStr = `${parsedPoints[0].x},180 ${parsedPoints
        .map((p) => `${p.x},${p.y}`)
        .join(" ")} ${parsedPoints[parsedPoints.length - 1].x},180`;

      return {
        hasData: true,
        pathData: pathStr,
        polygonPoints: polyStr,
        points: parsedPoints,
        maxScore: maxPt.percentage,
        dates: [
          parsedPoints[0].date,
          parsedPoints[Math.floor(parsedPoints.length / 2)].date,
          parsedPoints[parsedPoints.length - 1].date,
        ],
      };
    } else if (scoreProgressions.length === 1) {
      const single = scoreProgressions[0];
      const y = 170 - (single.percentage / 100) * 130;
      const singlePoint = { x: 245, y, percentage: single.percentage, date: single.date };
      return {
        hasData: true,
        pathData: `M 25,${y} L 475,${y}`,
        polygonPoints: `25,180 25,${y} 475,${y} 475,180`,
        points: [singlePoint],
        maxScore: single.percentage,
        dates: ["-", single.date, "-"],
      };
    }

    // Flat plain baseline when no attempt data exists yet
    return {
      hasData: false,
      pathData: "M 25,170 L 475,170",
      polygonPoints: "",
      points: [],
      maxScore: 0,
      dates: [],
    };
  }, [scoreProgressions]);

  const maxPoint =
    points.length > 0
      ? points.reduce((prev, curr) => (curr.percentage >= prev.percentage ? curr : prev), points[0])
      : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Performance Analytics</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Real-time insights on your learning accuracy, completed attempts, and subject mastery.
        </p>
      </div>

      {/* Grid Section: Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="surface-card rounded-xl p-5">
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Questions Correctly Answered
          </p>
          <h4 className="text-2xl font-bold text-white mt-1.5">
            {stats.correctlyAnswered}{" "}
            <span className="text-xs font-normal" style={{ color: "var(--text-subtle)" }}>
              / {stats.totalQuestionsAnswered}
            </span>
          </h4>
          <div className="text-[11px] mt-2 font-medium" style={{ color: "var(--text-muted)" }}>
            Overall accuracy at {stats.accuracy}%
          </div>
        </div>

        <div className="surface-card rounded-xl p-5">
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Total Quiz-taking Sessions
          </p>
          <h4 className="text-2xl font-bold text-white mt-1.5">{stats.totalQuizzesTaken}</h4>
          <div className="text-[11px] mt-2 font-medium" style={{ color: "var(--text-muted)" }}>
            Completed quizzes & practice sessions
          </div>
        </div>

        <div className="surface-card rounded-xl p-5">
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Total Quiz Study Time
          </p>
          <h4 className="text-2xl font-bold text-white mt-1.5">
            {Math.floor(stats.totalStudyTime / 60)}h {stats.totalStudyTime % 60}m
          </h4>
          <div className="text-[11px] mt-2 font-medium" style={{ color: "var(--text-muted)" }}>
            Active time spent solving questions
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Score Progression Trend Chart + Category Strength Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Score Progression Trend SVG Chart Card (8 cols) */}
        <div className="lg:col-span-8 surface-card rounded-xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: "var(--accent)" }} />
              Score Progression Trend
            </h3>
            <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
              Weekly accuracy growth across previous attempts
            </p>
          </div>

          {/* SVG Chart Area */}
          <div
            className="relative w-full h-64 rounded-xl border flex items-center justify-center p-4"
            style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
          >
            <svg
              viewBox="0 0 500 200"
              className="w-full h-full overflow-visible"
              style={{ color: "var(--accent)" }}
            >
              <line
                x1="0"
                y1="45"
                x2="500"
                y2="45"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="95"
                x2="500"
                y2="95"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="145"
                x2="500"
                y2="145"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1"
              />

              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <polygon points={polygonPoints} fill="url(#chartGlow)" />

              <path
                d={pathData}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {points.map((pt, idx) => (
                <g key={idx} className="group cursor-pointer">
                  {/* Invisible hit area to prevent mouse leave jitter */}
                  <circle cx={pt.x} cy={pt.y} r="12" fill="transparent">
                    <title>{`${pt.date}: ${pt.percentage}%`}</title>
                  </circle>
                  {/* Visible data point circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    className="fill-[#0d0d0d] stroke-orange-500 stroke-[2.5] group-hover:scale-125 transition-transform duration-200"
                  />
                </g>
              ))}

              {/* High Score Badge Callout */}
              {hasData && maxPoint && (
                <text
                  x={Math.min(430, Math.max(20, maxPoint.x - 25))}
                  y={maxPoint.y - 12}
                  fill="var(--text-primary)"
                  fontSize="11"
                  fontWeight="bold"
                >
                  {maxScore}% Max
                </text>
              )}
            </svg>

            <div
              className="absolute bottom-2 left-6 right-6 flex justify-between text-[9px] font-semibold uppercase"
              style={{ color: "var(--text-subtle)" }}
            >
              <span>{dates[0]}</span>
              <span>{dates[1]}</span>
              <span>{dates[2]}</span>
            </div>
          </div>
        </div>

        {/* Category Strength Breakdown (4 cols) */}
        <div className="lg:col-span-4 surface-card rounded-xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Target className="w-4 h-4" style={{ color: "var(--accent)" }} />
              Topic Strength
            </h3>
            <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
              Average accuracy by category
            </p>
          </div>

          {categoryBreakdown.length > 0 ? (
            <div className="space-y-4">
              {categoryBreakdown.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-white font-semibold">{cat.topic}</span>
                    <span className="font-semibold" style={{ color: "var(--accent)" }}>
                      {cat.accuracy}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${cat.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-white/5 rounded-xl">
              <BarChart2 className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-xs text-zinc-400">
                No topic statistics recorded yet. Complete quizzes to build your subject mastery
                profile!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
