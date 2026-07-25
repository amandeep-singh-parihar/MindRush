"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Plus, Search, Play, Share2, Trash2 } from "lucide-react";
import { deleteQuizAction } from "@/actions/quiz";

interface QuizItem {
  id: number;
  title: string;
  topic: string;
  difficulty: string;
  questionsCount: number;
  timeLimit: number;
  visibility: string;
  playsCount: number;
  createdAt: string;
}

export default function QuizzesClient({ initialQuizzes = [] }: { initialQuizzes?: QuizItem[] }) {
  const [quizzes, setQuizzes] = useState<QuizItem[]>(initialQuizzes);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShareQuiz = (quizId: number) => {
    const url = `${window.location.origin}/dashboard/quiz/${quizId}`;
    navigator.clipboard.writeText(url);
    alert(`Link copied to clipboard: ${url}`);
  };

  const handleDelete = async (quizId: number) => {
    if (!confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
      return;
    }
    setDeletingId(quizId);
    try {
      const res = await deleteQuizAction(quizId);
      if (res.success) {
        setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      } else {
        alert(res.message || "Failed to delete quiz");
      }
    } catch (err) {
      console.error("Error deleting quiz:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">My Created Quizzes</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Manage, share, and play the customized quizzes stored in your database.
          </p>
        </div>

        <Link
          href="/"
          className="btn-gradient px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Generate New Quiz
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 glass-card rounded-2xl p-3 border border-white/5 max-w-md w-full">
        <Search className="w-4 h-4 text-zinc-500 shrink-0 ml-1" />
        <input
          type="text"
          placeholder="Search quizzes by title or topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none text-sm text-white placeholder-zinc-500 w-full"
        />
      </div>

      {/* Grid of Quizzes */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 font-semibold border border-white/5">
                    {quiz.topic}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      quiz.visibility === "public"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                        : "bg-zinc-500/10 text-zinc-400 border border-white/5"
                    }`}
                  >
                    {quiz.visibility.toUpperCase()}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white tracking-tight mb-2 line-clamp-1">
                  {quiz.title}
                </h4>
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-4">
                  Custom quiz on {quiz.topic} created on{" "}
                  {new Date(quiz.createdAt).toLocaleDateString()}. Saved in PostgreSQL database.
                </p>

                <div className="flex items-center gap-4 text-xs text-zinc-400 mb-6 bg-white/[0.01] p-2.5 rounded-xl border border-white/5">
                  <div>
                    <span className="font-semibold text-white block">{quiz.questionsCount}</span>
                    Questions
                  </div>
                  <div className="w-px h-6 bg-white/5"></div>
                  <div>
                    <span className="font-semibold text-white block">{quiz.timeLimit}m</span>
                    Time Limit
                  </div>
                  <div className="w-px h-6 bg-white/5"></div>
                  <div>
                    <span className="font-semibold text-white block">{quiz.playsCount}</span>
                    Plays
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <Link
                  href={`/dashboard/quiz/${quiz.id}`}
                  className="flex-1 btn-gradient py-2 px-3 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 transition-all duration-200"
                >
                  <Play className="w-3.5 h-3.5 fill-white/10" />
                  Play Quiz
                </Link>
                <button
                  onClick={() => handleShareQuiz(quiz.id)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Share Quiz Link"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(quiz.id)}
                  disabled={deletingId === quiz.id}
                  className="p-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-400 hover:text-red-300 transition-colors cursor-pointer disabled:opacity-50"
                  title="Delete Quiz"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/5 max-w-xl mx-auto mt-8">
          <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-white">No quizzes found</h4>
          <p className="text-sm text-zinc-400 mt-2 max-w-sm mx-auto">
            You haven't saved any quizzes in your database yet. Generate a quiz using the form to
            create your first one!
          </p>
        </div>
      )}
    </div>
  );
}
