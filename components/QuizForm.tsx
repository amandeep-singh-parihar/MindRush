"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, Plus, Minus } from "lucide-react";

export default function QuizForm() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionsCount, setQuestionsCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Generating ${questionsCount} ${difficulty} level questions for: "${topic}"`);
    }, 2000);
  };

  const handleIncrement = () => {
    setQuestionsCount((prev) => Math.min(prev + 1, 50));
  };

  const handleDecrement = () => {
    setQuestionsCount((prev) => Math.max(prev - 1, 1));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full glass-card rounded-2xl p-6 relative overflow-hidden border border-white/5 shadow-2xl shadow-purple-950/20"
    >
      <div className="flex flex-col gap-5">
        {/* Topic Input */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="topic"
            className="text-xs font-semibold text-zinc-400 tracking-wider uppercase"
          >
            Topic
          </label>
          <div className="relative">
            <input
              id="topic"
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="(e.g., Machine Learning)"
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 transition-all duration-200"
            />
          </div>
        </div>

        {/* Row for Difficulty & Question Count */}
        <div className="grid grid-cols-2 gap-4">
          {/* Difficulty Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="difficulty"
              className="text-xs font-semibold text-zinc-400 tracking-wider uppercase"
            >
              Difficulty
            </label>
            <div className="relative">
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full appearance-none bg-zinc-900/50 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 transition-all duration-200 cursor-pointer"
              >
                <option value="Easy" className="bg-zinc-950">
                  Easy
                </option>
                <option value="Medium" className="bg-zinc-950">
                  Medium
                </option>
                <option value="Hard" className="bg-zinc-950">
                  Hard
                </option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Number of Questions */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="questionsCount"
              className="text-xs font-semibold text-zinc-400 tracking-wider uppercase"
            >
              Number of Questions
            </label>
            <div className="relative flex items-center bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={handleDecrement}
                className="px-3 py-3 text-zinc-400 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors"
                aria-label="Decrease question count"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                id="questionsCount"
                type="number"
                min="1"
                max="50"
                value={questionsCount}
                onChange={(e) =>
                  setQuestionsCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))
                }
                className="w-full bg-transparent border-none text-center text-sm font-semibold text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={handleIncrement}
                className="px-3 py-3 text-zinc-400 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors"
                aria-label="Increase question count"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isGenerating}
          className="btn-gradient w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed shadow-xl shadow-pink-500/20 mt-1"
        >
          <Sparkles className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
          {isGenerating ? "Creating Quiz..." : "Generate Quiz"}
        </button>
      </div>
    </form>
  );
}
