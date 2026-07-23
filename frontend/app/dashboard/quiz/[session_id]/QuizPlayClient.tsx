"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, ChevronRight, Trophy, Home, Clock, Sparkles } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface QuizPayload {
  questions: Question[];
  difficulty: string;
  questionsCount: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SECONDS_PER_QUESTION = 60;

// ─── Difficulty badge helper ──────────────────────────────────────────────────
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function QuizPlayClient() {
  const params = useParams();
  const router = useRouter();
  const session_id = params.session_id as string;

  const [quiz, setQuiz] = useState<QuizPayload | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Quiz progress state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);

  // Timer
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Load quiz from sessionStorage ──────────────────────────────────────────
  useEffect(() => {
    const raw = sessionStorage.getItem(`quiz_${session_id}`);
    if (!raw) {
      setNotFound(true);
      return;
    }
    try {
      const payload: QuizPayload = JSON.parse(raw);
      setQuiz(payload);
      setAnswers(new Array(payload.questions.length).fill(null));
    } catch {
      setNotFound(true);
    }
  }, [session_id]);

  // ── Timer logic ────────────────────────────────────────────────────────────
  const handleTimeUp = useCallback(() => {
    if (isRevealed) return;
    setIsRevealed(true);
    setSelectedAnswer(null); // timed out — no answer selected
  }, [isRevealed]);

  useEffect(() => {
    if (!quiz || isRevealed) return;
    setTimeLeft(SECONDS_PER_QUESTION);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [currentIndex, quiz, isRevealed, handleTimeUp]);

  // ── Answer selection ───────────────────────────────────────────────────────
  const handleSelect = (option: string) => {
    if (isRevealed) return;
    clearInterval(timerRef.current!);
    setSelectedAnswer(option);
    setIsRevealed(true);

    const correct = quiz!.questions[currentIndex].answer;
    if (option === correct) setScore((s) => s + 1);

    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = option;
      return next;
    });
  };

  // ── Next question ──────────────────────────────────────────────────────────
  const handleNext = () => {
    if (!quiz) return;
    const isLast = currentIndex + 1 >= quiz.questions.length;

    // Compute final answers including the current question
    const finalAnswers = [...answers];
    if (selectedAnswer !== null) finalAnswers[currentIndex] = selectedAnswer;

    if (isLast) {
      // Save results to sessionStorage and navigate to results page (sidebar visible there)
      const finalScore = finalAnswers.filter((ans, i) => ans === quiz.questions[i].answer).length;

      sessionStorage.setItem(
        `results_${session_id}`,
        JSON.stringify({
          questions: quiz.questions,
          answers: finalAnswers,
          score: finalScore,
          difficulty: quiz.difficulty,
          questionsCount: quiz.questionsCount,
        })
      );
      router.push(`/dashboard/quiz/${session_id}/results`);
      return;
    }

    setCurrentIndex((i) => i + 1);
    setSelectedAnswer(null);
    setIsRevealed(false);
  };

  // ── Not found ──────────────────────────────────────────────────────────────
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
          <XCircle className="w-12 h-12 text-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Quiz Not Found</h2>
          <p className="text-zinc-400 text-sm mt-2">
            This quiz session has expired or doesn&apos;t exist. Please generate a new one.
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

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="w-8 h-8 text-pink-500 animate-spin" />
          <p className="text-zinc-400 text-sm">Loading quiz…</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const progressPct = ((currentIndex + (isRevealed ? 1 : 0)) / totalQuestions) * 100;
  const timerPct = (timeLeft / SECONDS_PER_QUESTION) * 100;
  const timerColor =
    timeLeft > 15 ? "bg-emerald-500" : timeLeft > 7 ? "bg-amber-500" : "bg-red-500";

  // ════════════════════════════════════════════════════════════════════════════
  // QUIZ SCREEN
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fadeIn py-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-zinc-400">
            Question <span className="text-white font-bold">{currentIndex + 1}</span>/
            {totalQuestions}
          </span>
          <DifficultyBadge difficulty={quiz.difficulty} />
        </div>

        {/* Timer pill */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-colors ${
            timeLeft > 15
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : timeLeft > 7
                ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                : "border-red-500/30 bg-red-500/10 text-red-400 animate-pulse"
          }`}
        >
          <Clock className="w-3 h-3" />
          {timeLeft}s
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Timer bar */}
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${timerColor} rounded-full transition-all duration-1000 linear`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Question card */}
      <div className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
        <p className="text-lg font-bold text-white leading-snug relative z-10">
          {currentQuestion.question}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {currentQuestion.options.map((option, i) => {
          const isCorrect = option === currentQuestion.answer;
          const isSelected = option === selectedAnswer;

          let optionStyle =
            "bg-white/[0.03] border-white/8 text-zinc-300 hover:border-pink-500/40 hover:bg-white/[0.06]";

          if (isRevealed) {
            if (isCorrect) {
              optionStyle = "bg-emerald-500/10 border-emerald-500/40 text-emerald-300";
            } else if (isSelected && !isCorrect) {
              optionStyle = "bg-red-500/10 border-red-500/40 text-red-300";
            } else {
              optionStyle = "bg-white/[0.02] border-white/5 text-zinc-500";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(option)}
              disabled={isRevealed}
              className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center gap-3 cursor-pointer disabled:cursor-default ${optionStyle}`}
            >
              {/* Option letter */}
              <span className="shrink-0 w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-bold text-zinc-400">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 cursor-pointer">{option}</span>
              {isRevealed && isCorrect && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {isRevealed && isSelected && !isCorrect && (
                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Next / Finish button — only shown after reveal */}
      {isRevealed && (
        <button
          onClick={handleNext}
          className="cursor-pointer btn-gradient w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          {currentIndex + 1 >= totalQuestions ? (
            <>
              <Trophy className="w-4 h-4" />
              See Results
            </>
          ) : (
            <>
              Next Question
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      )}

      {/* Score tracker */}
      <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
        <span>
          Score:{" "}
          <span className="text-white font-semibold">
            {score}/{currentIndex + (isRevealed ? 1 : 0)}
          </span>
        </span>
        <span>
          {totalQuestions - currentIndex - 1} question
          {totalQuestions - currentIndex - 1 !== 1 ? "s" : ""} remaining
        </span>
      </div>
    </div>
  );
}
