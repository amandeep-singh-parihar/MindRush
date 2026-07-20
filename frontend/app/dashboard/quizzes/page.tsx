"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Plus, Search, Play, Share2, Trash2 } from "lucide-react";

const MOCK_CREATED_QUIZZES = [
  {
    id: 101,
    title: "React 19 Features & Server Actions",
    topic: "ReactJS",
    difficulty: "Hard",
    questionsCount: 10,
    timeLimit: 15,
    visibility: "public",
    playsCount: 42,
    createdAt: "2026-07-10T12:00:00Z",
  },
  {
    id: 102,
    title: "Docker & Containerization Basics",
    topic: "DevOps",
    difficulty: "Medium",
    questionsCount: 8,
    timeLimit: 12,
    visibility: "private",
    playsCount: 3,
    createdAt: "2026-07-08T09:30:00Z",
  },
  {
    id: 103,
    title: "English Grammar & Vocabulary Builder",
    topic: "Language",
    difficulty: "Easy",
    questionsCount: 15,
    timeLimit: 20,
    visibility: "public",
    playsCount: 128,
    createdAt: "2026-06-25T16:45:00Z",
  },
];

export default function MyQuizzesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQuizzes = MOCK_CREATED_QUIZZES.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShareQuiz = (quizId: number) => {
    alert(`Mock link copied! Share quiz: ${window.location.origin}/quiz/${quizId}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">My Created Quizzes</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Manage, share, and play the customized quizzes you generated.
          </p>
        </div>

        <Link
          href="/dashboard/quizzes?create=true"
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
                  {new Date(quiz.createdAt).toLocaleDateString()}. Contains comprehensive questions
                  to challenge your expertise.
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
                <button className="flex-1 btn-gradient py-2 px-3 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 transition-all duration-200">
                  <Play className="w-3.5 h-3.5 fill-white/10" />
                  Play Quiz
                </button>
                <button
                  onClick={() => handleShareQuiz(quiz.id)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Share Quiz Link"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button className="p-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-400 hover:text-red-300 transition-colors cursor-pointer">
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
            You haven't generated any quizzes with this name yet. Click 'Generate New Quiz' above to
            generate one instantly.
          </p>
        </div>
      )}
    </div>
  );
}
