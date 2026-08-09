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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Main Glass Modal */}
      <div className="relative max-w-md w-full surface-card rounded-xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col items-center text-center animate-scale-up z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-semibold text-orange-400 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MindRush AI Engine</span>
        </div>

        {/* Central Graphic Container */}
        <div className="relative flex items-center justify-center my-2 mb-6">
          <div className="w-16 h-16 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <StageIcon className="w-7 h-7 text-orange-400 animate-scale-up" key={activeStage} />
          </div>
        </div>

        {/* Topic Context Pill if available */}
        {topicOrSource && (
          <p className="text-xs font-semibold text-zinc-500 tracking-wide mb-1 uppercase truncate max-w-xs">
            Creating {questionsCount} {difficulty} Questions for
          </p>
        )}
        {topicOrSource && (
          <h4 className="text-sm font-bold text-white mb-4 truncate max-w-xs">
            &ldquo;{topicOrSource}&rdquo;
          </h4>
        )}

        {/* Dynamic Changing Stage Title & Subtitle */}
        <div className="min-h-[64px] flex flex-col items-center justify-center mb-6">
          <h3
            key={`title-${activeStage}`}
            className="text-base font-bold text-white tracking-tight animate-fade-in"
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
              <Zap className="w-3.5 h-3.5 text-orange-400" />
              Generating Quiz...
            </span>
            <span className="text-orange-400 font-mono font-bold text-sm">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-2.5 bg-zinc-900 border border-white/5 rounded-full relative overflow-hidden">
            <div
              className="h-full rounded-full bg-orange-500 transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer sweep effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
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
                  className={`w-full h-1 rounded-full transition-all duration-500 ${
                    isCompleted ? "bg-orange-500" : isCurrent ? "bg-orange-500/40" : "bg-white/10"
                  }`}
                />
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/25"
                      : isCurrent
                        ? "bg-orange-500/20 text-orange-300 border border-orange-500/45"
                        : "bg-white/5 text-zinc-600 border border-white/5"
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 text-orange-400" /> : idx + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rotating Educational Tip Card */}
        <div className="w-full bg-[#161616] border border-white/5 rounded-xl p-3.5 flex items-start gap-3 text-left">
          <div className="shrink-0 p-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400 mt-0.5">
            <Brain className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase font-bold text-orange-400 tracking-wider mb-0.5">
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
