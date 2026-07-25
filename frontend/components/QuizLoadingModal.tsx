"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  BookOpen,
  Wand2,
  Lightbulb,
  Layers,
  Rocket,
  Sparkles,
  Check,
  Brain,
  Zap,
} from "lucide-react";

interface QuizLoadingModalProps {
  isOpen: boolean;
  topicOrSource?: string;
  difficulty?: string;
  questionsCount?: number;
}

const STAGES = [
  {
    id: 1,
    title: "Analyzing Topic & Source",
    description: "Extracting core concepts, keywords, and structural domain...",
    icon: BookOpen,
    threshold: 20,
  },
  {
    id: 2,
    title: "Crafting AI Questions",
    description: "Formulating challenging multiple-choice questions...",
    icon: Wand2,
    threshold: 45,
  },
  {
    id: 3,
    title: "Formulating Options & Answers",
    description: "Designing smart distractors and accurate explanations...",
    icon: Lightbulb,
    threshold: 70,
  },
  {
    id: 4,
    title: "Polishing & Balancing Difficulty",
    description: "Refining quality standards and verifying response structure...",
    icon: Layers,
    threshold: 90,
  },
  {
    id: 5,
    title: "Quiz Ready! Launching Session",
    description: "Preparing your personalized quiz environment...",
    icon: Rocket,
    threshold: 98,
  },
];

const TIPS = [
  "Active recall testing improves long-term memory retention by up to 150%!",
  "Taking short quizzes right after studying boosts comprehension significantly.",
  "Mistakes during practice quizzes actually help lock in correct answers faster.",
  "MindRush AI creates smart distractor options to test deep understanding.",
  "Spaced repetition is the secret key to mastering complex topics effortlessly!",
];

export default function QuizLoadingModal({
  isOpen,
  topicOrSource,
  difficulty = "Medium",
  questionsCount = 5,
}: QuizLoadingModalProps) {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset or simulate smooth progress bar and step transitions when modal opens
  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setActiveStage(0);
      return;
    }

    // 1. Progress Bar Timer
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev; // Hold near 95% until backend completes
        // Fast at start, slower as it approaches 95%
        const increment = Math.max(0.3, (95 - prev) * 0.05);
        return Math.min(95, prev + increment);
      });
    }, 100);

    // 2. Stage index update based on progress
    const stageInterval = setInterval(() => {
      setActiveStage((prevStage) => {
        if (prevStage < STAGES.length - 1) {
          return prevStage + 1;
        }
        return prevStage;
      });
    }, 2200);

    // 3. Tip Rotator Timer
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 4000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
      clearInterval(tipInterval);
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const currentStage = STAGES[activeStage] || STAGES[0];
  const StageIcon = currentStage.icon;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glass Modal */}
      <div className="relative max-w-md w-full glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl shadow-purple-950/60 overflow-hidden flex flex-col items-center text-center animate-scale-up z-10">
        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-pink-300 mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" />
          <span>MindRush AI Engine</span>
        </div>

        {/* Central Graphic Container with Dynamic Glow Rings */}
        <div className="relative flex items-center justify-center my-2 mb-6">
          {/* Outer Pulsing Outer Halo */}
          <div className="absolute w-28 h-28 rounded-full border border-pink-500/25 animate-ping opacity-30 pointer-events-none" />
          <div className="absolute w-24 h-24 rounded-full border border-purple-500/40 animate-pulse pointer-events-none" />

          {/* Decorative Glowing Backdrop Pill */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 p-0.5 shadow-2xl shadow-pink-500/30 animate-float-slow flex items-center justify-center">
            <div className="w-full h-full bg-[#0d0914] rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 animate-pulse" />
              <StageIcon
                className="w-9 h-9 text-pink-400 relative z-10 animate-scale-up"
                key={activeStage}
              />
            </div>
          </div>
        </div>

        {/* Topic Context Pill if available */}
        {topicOrSource && (
          <p className="text-xs font-semibold text-zinc-400 tracking-wide mb-1 uppercase truncate max-w-xs">
            Creating {questionsCount} {difficulty} Questions for
          </p>
        )}
        {topicOrSource && (
          <h4 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-indigo-200 mb-4 truncate max-w-xs">
            &ldquo;{topicOrSource}&rdquo;
          </h4>
        )}

        {/* Dynamic Changing Stage Title & Subtitle */}
        <div className="min-h-[64px] flex flex-col items-center justify-center mb-6">
          <h3
            key={`title-${activeStage}`}
            className="text-lg font-extrabold text-white tracking-tight animate-fade-in flex items-center gap-2"
          >
            {currentStage.title}
          </h3>
          <p
            key={`desc-${activeStage}`}
            className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed animate-fade-in"
          >
            {currentStage.description}
          </p>
        </div>

        {/* Progress Bar Section */}
        <div className="w-full mb-6">
          <div className="flex justify-between items-center text-xs font-medium text-zinc-400 mb-2">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Generating Quiz...
            </span>
            <span className="text-pink-400 font-mono font-bold text-sm">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-3 bg-zinc-900/90 border border-white/10 rounded-full p-0.5 relative overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-300 ease-out relative overflow-hidden shadow-lg shadow-pink-500/30"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer sweep effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Visual Step Checklist */}
        <div className="w-full grid grid-cols-5 gap-1.5 mb-6">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < activeStage;
            const isCurrent = idx === activeStage;
            return (
              <div
                key={stage.id}
                className="flex flex-col items-center gap-1.5 group cursor-default"
                title={stage.title}
              >
                <div
                  className={`w-full h-1.5 rounded-full transition-all duration-500 ${
                    isCompleted
                      ? "bg-pink-500 shadow-sm shadow-pink-500/50"
                      : isCurrent
                        ? "bg-purple-400 animate-pulse shadow-sm shadow-purple-500/50"
                        : "bg-white/10"
                  }`}
                />
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-pink-500/20 text-pink-400 border border-pink-500/40"
                      : isCurrent
                        ? "bg-purple-500/30 text-purple-300 border border-purple-400 animate-bounce"
                        : "bg-white/5 text-zinc-600 border border-white/5"
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 text-pink-400" /> : idx + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rotating Educational Tip Card */}
        <div className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl p-3.5 flex items-start gap-3 text-left shadow-inner">
          <div className="shrink-0 p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 mt-0.5">
            <Brain className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase font-bold text-amber-400 tracking-wider mb-0.5">
              Did You Know?
            </p>
            <p
              key={tipIndex}
              className="text-xs text-zinc-300 leading-snug animate-fade-in font-sans"
            >
              {TIPS[tipIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
