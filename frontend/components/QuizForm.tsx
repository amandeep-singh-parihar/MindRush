"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Sparkles,
  ChevronDown,
  Plus,
  Minus,
  BookOpen,
  FileText,
  Upload,
  X,
  AlertCircle,
} from "lucide-react";

interface QuizFormProps {
  isLoggedIn: boolean;
}

interface ToastState {
  show: boolean;
  title: string;
  message: string;
}

type InputMode = "topic" | "content";

export default function QuizForm({ isLoggedIn }: QuizFormProps) {
  const [inputMode, setInputMode] = useState<InputMode>("topic");
  const [topic, setTopic] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionsCount, setQuestionsCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => {
        setToast((prev) => (prev ? { ...prev, show: false } : null));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputMode === "topic" && !topic.trim()) return;
    if (inputMode === "content" && !pastedText.trim() && !pdfFile) return;

    setIsGenerating(true);
    try {
      // 1. creating native formData object
      const formData = new FormData();

      // 2. appending general fields
      formData.append("difficulty", difficulty);
      formData.append("questions_count", questionsCount.toString());

      // 3. append input data according to inputMode
      if (inputMode === "topic") {
        formData.append("input_type", "topic");
        formData.append("topic", topic);
      } else if (pdfFile) {
        formData.append("input_type", "pdf");
        formData.append("file", pdfFile);
      } else {
        formData.append("input_type", "text");
        formData.append("text", pastedText);
      }

      // 4. send requset
      const response = await fetch(`${API_URL}/generate-quiz`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to generate quiz");
      }

      const data = await response.json();

      // Store quiz payload in sessionStorage keyed by session_id,
      // then navigate to the quiz play page.
      sessionStorage.setItem(
        `quiz_${data.session_id}`,
        JSON.stringify({
          questions: data.quiz.questions,
          difficulty,
          questionsCount,
        })
      );

      window.location.href = `/dashboard/quiz/${data.session_id}`;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setToast({
        show: true,
        title: "Generation Failed",
        message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleIncrement = () => {
    setQuestionsCount((prev) => Math.min(prev + 1, 10));
  };

  const handleDecrement = () => {
    setQuestionsCount((prev) => Math.max(prev - 1, 1));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    }
  };

  const removePdf = () => {
    setPdfFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      {/* ── Toast Notification (Portal — renders on body to escape stacking context) ── */}
      {isMounted &&
        toast?.show &&
        createPortal(
          <div className="fixed top-6 right-6 z-[9999] animate-slideIn">
            <div className="rounded-2xl p-4 border border-red-500/30 bg-[#0d0b14] backdrop-blur-xl shadow-2xl shadow-red-500/10 flex items-start gap-3.5 max-w-sm">
              <div className="shrink-0 mt-0.5 p-1.5 bg-red-500/10 rounded-xl text-red-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-sm font-bold text-white tracking-tight">{toast.title}</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => setToast((prev) => (prev ? { ...prev, show: false } : null))}
                className="shrink-0 p-1 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>,
          document.body
        )}

      <form
        onSubmit={handleSubmit}
        className="w-full glass-card rounded-2xl p-6 relative overflow-hidden border border-white/5 shadow-2xl shadow-purple-950/20"
      >
        <div className="flex flex-col gap-5">
          {/* ── Tab Switcher ── */}
          <div className="relative flex bg-zinc-900/60 border border-white/8 rounded-xl p-1 gap-1">
            {/* Sliding pill */}
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-gradient-to-r from-pink-600/30 to-purple-600/30 border border-pink-500/30 transition-transform duration-300 ease-in-out"
              style={{
                transform:
                  inputMode === "topic" ? "translateX(0%)" : "translateX(calc(100% + 8px))",
              }}
            />

            <button
              type="button"
              onClick={() => setInputMode("topic")}
              className={`cursor-pointer relative z-10 flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-200 ${
                inputMode === "topic" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Topic
            </button>

            <button
              type="button"
              onClick={() => setInputMode("content")}
              className={`cursor-pointer relative z-10 flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-200 ${
                inputMode === "content" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Paste PDF / Text
            </button>
          </div>

          {/* ── Input Panel ── */}
          {inputMode === "topic" ? (
            /* Topic text input */
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="topic"
                className="text-xs font-semibold text-zinc-400 tracking-wider uppercase"
              >
                Topic
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Machine Learning"
                required
                minLength={3}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 transition-all duration-200"
              />
            </div>
          ) : (
            /* Paste text + PDF upload */
            <div className="flex flex-col gap-3">
              {/* Paste text area */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="pastedText"
                  className="text-xs font-semibold text-zinc-400 tracking-wider uppercase"
                >
                  Paste Text
                </label>
                <textarea
                  id="pastedText"
                  rows={4}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your notes, article, or any text here…"
                  required={!pdfFile}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 transition-all duration-200 resize-none"
                />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 text-zinc-600">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-xs font-medium">or</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              {/* PDF upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">
                  Upload PDF
                </label>

                {pdfFile ? (
                  /* PDF selected — show chip */
                  <div className="flex items-center gap-3 bg-zinc-900/50 border border-pink-500/30 rounded-xl px-4 py-3">
                    <FileText className="w-4 h-4 text-pink-400 shrink-0" />
                    <span className="flex-1 text-sm text-white truncate">{pdfFile.name}</span>
                    <button
                      type="button"
                      onClick={removePdf}
                      className="text-zinc-500 hover:text-white transition-colors"
                      aria-label="Remove PDF"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* Upload trigger */
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 w-full bg-zinc-900/50 border border-dashed border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-500 hover:text-white hover:border-pink-500/40 transition-all duration-200"
                  >
                    <Upload className="w-4 h-4" />
                    Click to upload a PDF
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* ── Difficulty & Question Count (always visible) ── */}
          <div className="grid grid-cols-2 gap-4">
            {/* Difficulty */}
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
                  <Minus className="w-4 h-4 cursor-pointer" />
                </button>
                <input
                  id="questionsCount"
                  type="number"
                  min="1"
                  max="10"
                  value={questionsCount}
                  onChange={(e) =>
                    setQuestionsCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))
                  }
                  className="w-full bg-transparent border-none text-center text-sm font-semibold text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="px-3 py-3 text-zinc-400 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors"
                  aria-label="Increase question count"
                >
                  <Plus className="w-4 h-4 cursor-pointer" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Generate Button ── */}
          <button
            onClick={(e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                setToast({
                  show: true,
                  title: "Login Required",
                  message: "Please sign in to generate a quiz.",
                });
              }
            }}
            type="submit"
            disabled={isGenerating}
            className="btn-gradient w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed shadow-xl shadow-pink-500/20 mt-1"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
            {isGenerating ? "Creating Quiz..." : "Generate Quiz"}
          </button>
        </div>
      </form>
    </>
  );
}
