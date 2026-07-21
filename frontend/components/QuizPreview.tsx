"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function QuizPreview() {
  const [selectedOption, setSelectedOption] = useState<string | null>("list");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(true);

  const options = [
    { id: "list", text: "list", isCorrect: true },
    { id: "tuple", text: "tuple", isCorrect: false },
    { id: "dict", text: "dict", isCorrect: false },
    { id: "set", text: "set", isCorrect: false },
  ];

  const handleCheck = () => {
    if (!selectedOption) return;
    const correct = options.find((opt) => opt.id === selectedOption)?.isCorrect || false;
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedOption("list");
    setSubmitted(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="glass-card rounded-2xl p-6 border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
          <div className="flex items-center gap-3">
            {/* Python SVG Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12.0003 2C10.7416 2.0006 9.5392 2.1528 8.4239 2.4503L8.6015 3.1259C9.6582 2.8441 10.7967 2.6997 12.0003 2.6997C15.6565 2.6997 16.3117 3.327 16.3117 7.0272V9.3361H12.0003C9.0967 9.3361 7.2144 10.5906 7.2144 13.5262V15.8351C7.2144 16.8906 6.3353 17.7697 5.2798 17.7697H3.9168C2.8613 17.7697 2 16.8906 2 15.8351V12.5317C2 8.8315 2.6552 8.2042 6.3113 8.2042H8.6202V5.8953C8.6202 2.9598 10.4907 2 13.3943 2H12.0003ZM12.0003 22C13.259 21.9994 14.4614 21.8472 15.5767 21.5497L15.3991 20.8741C14.3424 21.1559 13.2039 21.3003 12.0003 21.3003C8.3441 21.3003 7.6889 20.673 7.6889 16.9728V14.6639H12.0003C14.9039 14.6639 16.7862 13.4094 16.7862 10.4738V8.1649C16.7862 7.1094 17.6653 6.2303 18.7208 6.2303H20.0838C21.1393 6.2303 22 7.1094 22 8.1649V11.4683C22 15.1685 21.3448 15.7958 17.6887 15.7958H15.3798V18.1047C15.3798 21.0402 13.5093 22 10.6057 22H12.0003Z"
                fill="url(#python-gradient)"
              />
              <defs>
                <linearGradient
                  id="python-gradient"
                  x1="2"
                  y1="2"
                  x2="22"
                  y2="22"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#38bdf8" />
                  <stop offset="0.5" stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#e879f9" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-sm font-bold text-white tracking-wide">Python</span>
          </div>
          {/* Menu dots */}
          <div className="flex gap-1 text-zinc-500 cursor-pointer hover:text-white">
            <span className="text-lg leading-none">•</span>
            <span className="text-lg leading-none">•</span>
            <span className="text-lg leading-none">•</span>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <p className="text-sm md:text-base text-zinc-300 font-medium leading-relaxed">
            What is the output of:{" "}
            <code className="bg-zinc-950/70 border border-white/5 text-emerald-400 px-2 py-0.5 rounded font-mono text-sm">
              print(type([]))
            </code>
            ?
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            let borderClass = "border-white/5 bg-zinc-900/30";
            let radioColor = "border-zinc-600";
            let glowEffect = "";

            if (isSelected) {
              borderClass = "border-pink-500/50 bg-pink-500/5";
              radioColor = "border-pink-500 bg-pink-500";
              glowEffect = "shadow-lg shadow-pink-500/10";
            }

            if (submitted) {
              if (opt.isCorrect) {
                borderClass = "border-emerald-500/50 bg-emerald-500/5";
                radioColor = "border-emerald-500 bg-emerald-500";
              } else if (isSelected && !opt.isCorrect) {
                borderClass = "border-red-500/50 bg-red-500/5";
                radioColor = "border-red-500 bg-red-500";
              }
            }

            return (
              <button
                key={opt.id}
                disabled={submitted}
                onClick={() => setSelectedOption(opt.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 hover:border-white/10 hover:bg-white/5 disabled:cursor-not-allowed ${borderClass} ${glowEffect}`}
              >
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${radioColor}`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </span>
                <span className="text-sm font-semibold text-white font-mono">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        {!submitted ? (
          <button
            onClick={handleCheck}
            disabled={!selectedOption}
            className="cursor-pointer btn-gradient w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-pink-500/20"
          >
            Check Answer
          </button>
        ) : (
          <div className="flex flex-col gap-4">
            <button
              onClick={handleReset}
              className="w-full bg-zinc-800/80 hover:bg-zinc-800 text-white font-bold py-3.5 rounded-xl border border-white/10 transition-colors cursor-pointer"
            >
              Try Again
            </button>

            <div
              className={`flex items-start gap-3 p-4 rounded-xl border text-sm leading-relaxed ${
                isCorrect
                  ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                  : "border-red-500/20 bg-red-500/5 text-red-400"
              }`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>
                    <strong>Correct!</strong> <code>[]</code> creates an empty list.{" "}
                    <code>type([])</code> returns <code>&lt;class &apos;list&apos;&gt;</code>.
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>
                    <strong>Incorrect.</strong> Square brackets <code>[]</code> define a list.{" "}
                    <code>()</code> is a tuple, <code>&#123;&#125;</code> is a dict/set.
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
