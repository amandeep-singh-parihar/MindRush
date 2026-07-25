"use client";

import { useState } from "react";
import { Sparkles, ChevronRight, X, AlertCircle, Zap, Shield, Flame } from "lucide-react";
import QuizLoadingModal from "./QuizLoadingModal";
import { saveGeneratedQuizAction } from "@/actions/quiz";

interface TopicTemplate {
  topic: string;
  category: string;
  questions: number;
  color: string;
}

const TEMPLATES: TopicTemplate[] = [
  {
    topic: "CSS Grid & Flexbox",
    category: "Design",
    questions: 10,
    color: "from-amber-500 to-orange-600",
  },
  {
    topic: "TypeScript Advanced Types",
    category: "Coding",
    questions: 10,
    color: "from-blue-500 to-indigo-600",
  },
  {
    topic: "Ancient Roman Empire",
    category: "History",
    questions: 8,
    color: "from-emerald-500 to-teal-600",
  },
  {
    topic: "Machine Learning Basics",
    category: "AI/ML",
    questions: 10,
    color: "from-purple-500 to-pink-600",
  },
];

export default function QuickTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<TopicTemplate | null>(null);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [questionsCount, setQuestionsCount] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const openTemplateModal = (template: TopicTemplate) => {
    setSelectedTemplate(template);
    setQuestionsCount(template.questions);
    setDifficulty("Medium");
    setErrorMsg(null);
  };

  const closeModal = () => {
    if (isGenerating) return;
    setSelectedTemplate(null);
    setErrorMsg(null);
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("input_type", "topic");
      formData.append("topic", selectedTemplate.topic);
      formData.append("difficulty", difficulty);
      formData.append("questions_count", questionsCount.toString());

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_URL}/generate-quiz`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errDetail = "Our servers are facing high traffic, please try again shortly.";
        try {
          const errData = await response.json();
          if (errData?.detail) errDetail = errData.detail;
        } catch {
          // ignore
        }
        throw new Error(errDetail);
      }

      const data = await response.json();

      // Persist in PostgreSQL DB
      let dbQuizId: number | undefined;
      if (data.quiz?.questions) {
        try {
          const saveRes = await saveGeneratedQuizAction({
            title: `${selectedTemplate.topic} Quiz`,
            topic: selectedTemplate.topic,
            difficulty,
            questionsCount,
            description: `AI Template quiz generated on ${selectedTemplate.topic}`,
            timeLimit: questionsCount * 2,
            questions: data.quiz.questions,
          });
          if (saveRes.success && saveRes.quizId) {
            dbQuizId = saveRes.quizId;
          }
        } catch (dbErr) {
          console.error("Failed to save template quiz to DB:", dbErr);
        }
      }

      // Save payload in sessionStorage
      sessionStorage.setItem(
        `quiz_${data.session_id}`,
        JSON.stringify({
          dbQuizId,
          questions: data.quiz.questions,
          difficulty,
          questionsCount,
        })
      );

      // Navigate to play page
      window.location.href = `/dashboard/quiz/${data.session_id}`;
    } catch (err: unknown) {
      console.error("[ERROR] Template Quiz Generation Failed:", err);
      setIsGenerating(false);
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong while generating quiz."
      );
    }
  };

  return (
    <>
      {/* Animated Loading Modal when quiz generation is active */}
      <QuizLoadingModal
        isOpen={isGenerating}
        topicOrSource={selectedTemplate?.topic}
        difficulty={difficulty}
        questionsCount={questionsCount}
      />

      {/* Grid of Templates */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-500" />
          Quick AI Templates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEMPLATES.map((tmpl, i) => (
            <div
              key={i}
              onClick={() => openTemplateModal(tmpl)}
              className="glass-card rounded-2xl p-5 hover:border-pink-500/40 transition-all duration-300 cursor-pointer relative group overflow-hidden block"
            >
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${tmpl.color} opacity-[0.05] group-hover:opacity-15 rounded-full blur-xl transition-all duration-300`}
              />
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/5 font-semibold">
                {tmpl.category}
              </span>
              <h4 className="text-base font-bold text-white mt-3 group-hover:text-pink-400 transition-colors">
                {tmpl.topic}
              </h4>
              <p className="text-xs text-zinc-500 mt-1">{tmpl.questions} AI questions • 10m</p>
              <div className="flex items-center gap-1 text-xs text-pink-500 font-semibold mt-4 group-hover:gap-2 transition-all">
                Generate Now
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty Selection Dialog Modal */}
      {selectedTemplate && !isGenerating && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={closeModal}
          />

          <div className="relative glass-card w-full max-w-md rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl shadow-purple-950/50 animate-scale-up z-10">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Template Title Banner */}
            <div className="flex items-start gap-3 mb-6">
              <div className="p-3 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400 rounded-2xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <span className="text-[10px] uppercase font-bold text-pink-400 tracking-wider">
                  {selectedTemplate.category} Template
                </span>
                <h3 className="text-lg font-extrabold text-white tracking-tight leading-snug truncate">
                  {selectedTemplate.topic}
                </h3>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Difficulty Selector */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                  Select Difficulty Level
                </label>

                <div className="grid grid-cols-3 gap-2.5">
                  {(["Easy", "Medium", "Hard"] as const).map((lvl) => {
                    const isSelected = difficulty === lvl;
                    let activeStyles = "border-white/5 bg-white/[0.02] text-zinc-400 hover:text-white";

                    if (isSelected) {
                      if (lvl === "Easy") {
                        activeStyles = "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold shadow-lg shadow-emerald-500/10";
                      } else if (lvl === "Medium") {
                        activeStyles = "bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold shadow-lg shadow-amber-500/10";
                      } else {
                        activeStyles = "bg-red-500/15 border-red-500/40 text-red-300 font-bold shadow-lg shadow-red-500/10";
                      }
                    }

                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setDifficulty(lvl)}
                        className={`py-3 px-3 rounded-2xl border text-xs tracking-wide transition-all cursor-pointer flex flex-col items-center gap-1 ${activeStyles}`}
                      >
                        {lvl === "Easy" && <Shield className="w-4 h-4" />}
                        {lvl === "Medium" && <Zap className="w-4 h-4" />}
                        {lvl === "Hard" && <Flame className="w-4 h-4" />}
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Number of questions selector */}
              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                  Number of Questions
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 8, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionsCount(num)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        questionsCount === num
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                          : "bg-white/[0.02] text-zinc-400 border-white/5 hover:text-zinc-200"
                      }`}
                    >
                      {num} Questions
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="btn-gradient w-full py-3.5 rounded-xl text-sm font-semibold text-white shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Quiz ✨
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
