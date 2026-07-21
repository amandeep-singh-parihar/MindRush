"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, RotateCcw, Home, Trophy, Target, Sparkles } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface ResultsPayload {
  questions: Question[];
  answers: (string | null)[];
  score: number;
  difficulty: string;
  questionsCount: number;
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    Easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    Medium: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    Hard: "bg-red-500/15 text-red-400 border-red-500/20",
  };
  return (
    <span
      className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold ${colors[difficulty] ?? colors["Medium"]}`}
    >
      {difficulty}
    </span>
  );
}

export default function QuizResultsPage() {
  const params = useParams();
  const router = useRouter();
  const session_id = params.session_id as string;

  const [results, setResults] = useState<ResultsPayload | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(`results_${session_id}`);
    if (!raw) {
      setNotFound(true);
      return;
    }
    try {
      setResults(JSON.parse(raw));
    } catch {
      setNotFound(true);
    }
  }, [session_id]);

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
          <XCircle className="w-12 h-12 text-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Results Not Found</h2>
          <p className="text-zinc-400 text-sm mt-2">
            This session has expired. Please generate a new quiz.
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="btn-gradient px-6 py-3 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="w-8 h-8 text-pink-500 animate-spin" />
          <p className="text-zinc-400 text-sm">Loading results…</p>
        </div>
      </div>
    );
  }

  const { questions, answers, score, difficulty } = results;
  const totalQuestions = questions.length;
  const pct = Math.round((score / totalQuestions) * 100);
  const grade =
    pct >= 80
      ? "Excellent!"
      : pct >= 60
        ? "Good Job!"
        : pct >= 40
          ? "Keep Practicing"
          : "Needs Improvement";
  const gradeColor =
    pct >= 80
      ? "from-emerald-400 to-teal-400"
      : pct >= 60
        ? "from-amber-400 to-orange-400"
        : "from-red-400 to-pink-400";

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn py-4">
      {/* Score card */}
      <div className="glass-card rounded-3xl p-8 border border-white/5 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 pointer-events-none" />
        <div className="relative z-10">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-5">
            <Trophy className="w-9 h-9 text-yellow-400" />
          </div>
          <h2
            className={`text-3xl font-extrabold bg-gradient-to-r ${gradeColor} bg-clip-text text-transparent`}
          >
            {grade}
          </h2>
          <p className="text-zinc-400 text-sm mt-2">Quiz complete!</p>

          <div className="mt-6 flex items-center justify-center gap-6">
            <div>
              <p className="text-4xl font-black text-white">
                {score}
                <span className="text-zinc-500 text-2xl font-semibold">/{totalQuestions}</span>
              </p>
              <p className="text-xs text-zinc-500 mt-1">Correct</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <p className="text-4xl font-black text-white">{pct}%</p>
              <p className="text-xs text-zinc-500 mt-1">Accuracy</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <DifficultyBadge difficulty={difficulty} />
              <p className="text-xs text-zinc-500 mt-1">Difficulty</p>
            </div>
          </div>
        </div>
      </div>

      {/* Answer breakdown */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/5 flex items-center gap-2">
          <Target className="w-4 h-4 text-pink-500" />
          <h3 className="text-sm font-bold text-white">Answer Review</h3>
        </div>
        <div className="divide-y divide-white/5">
          {questions.map((q, i) => {
            const userAns = answers[i];
            const isCorrect = userAns === q.answer;
            return (
              <div key={i} className="px-5 py-4 flex gap-3">
                <div className="shrink-0 mt-0.5">
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium leading-snug">{q.question}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Your answer:{" "}
                    <span className={isCorrect ? "text-emerald-400" : "text-red-400"}>
                      {userAns ?? "Timed out"}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p className="text-xs text-zinc-500">
                      Correct: <span className="text-emerald-400">{q.answer}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => router.push(`/dashboard/quiz/${session_id}`)}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-semibold text-white transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Retry Quiz
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="flex-1 btn-gradient flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white shadow-lg shadow-pink-500/20 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </button>
      </div>
    </div>
  );
}
