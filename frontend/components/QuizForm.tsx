"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import QuizLoadingModal from "./QuizLoadingModal";
import { saveGeneratedQuizAction } from "@/actions/quiz";
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
  Type,
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

  // New states for the redesigned UI
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTextPanel, setShowTextPanel] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Click-outside handler for menus
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

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
        let errorMsg = "Our servers are facing high traffic, please try after some time.";
        try {
          const err = await response.json();
          if (err?.detail) {
            errorMsg = err.detail;
          }
        } catch {
          // Ignore JSON parsing errors for non-JSON responses
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();

      // If user is logged in, save quiz into PostgreSQL database!
      let dbQuizId: number | undefined;
      if (isLoggedIn && data.quiz?.questions) {
        try {
          const saveRes = await saveGeneratedQuizAction({
            title: data.quiz.title || (inputMode === "topic" ? `${topic} Quiz` : "Custom AI Quiz"),
            topic: inputMode === "topic" ? topic : "Custom Content",
            difficulty,
            questionsCount,
            description: data.quiz.description,
            timeLimit: questionsCount * 2,
            questions: data.quiz.questions,
          });
          if (saveRes.success && saveRes.quizId) {
            dbQuizId = saveRes.quizId;
          }
        } catch (err) {
          console.error("Failed to persist quiz in DB:", err);
        }
      }

      // Store quiz payload in sessionStorage keyed by session_id,
      // then navigate to the quiz play page.
      sessionStorage.setItem(
        `quiz_${data.session_id}`,
        JSON.stringify({
          dbQuizId,
          questions: data.quiz.questions,
          difficulty,
          questionsCount,
        })
      );

      window.location.href = `/dashboard/quiz/${data.session_id}`;
    } catch (error: unknown) {
      let message = "Our servers are facing high traffic, please try after some time.";
      if (error instanceof Error && error.message) {
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
          message = "Our servers are facing high traffic, please try after some time.";
        } else {
          message = error.message;
        }
      }

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

  // Menu option handlers
  const selectTopic = () => {
    setInputMode("topic");
    setShowTextPanel(false);
    setMenuOpen(false);
  };

  const selectText = () => {
    setInputMode("content");
    setShowTextPanel(true);
    setPdfFile(null);
    setMenuOpen(false);
  };

  const selectPdf = () => {
    setInputMode("content");
    setShowTextPanel(false);
    setPastedText("");
    setMenuOpen(false);
    fileInputRef.current?.click();
  };

  // Determine placeholder text based on mode
  const getPlaceholder = () => {
    if (inputMode === "topic") return "Enter a topic, e.g. Machine Learning...";
    if (showTextPanel) return "Text mode — type in the panel above...";
    if (pdfFile) return pdfFile.name;
    return "Select an input type from +";
  };

  // Get the active mode label for the badge
  const getModeBadge = () => {
    if (inputMode === "topic")
      return {
        icon: BookOpen,
        label: "Topic",
        color: "text-purple-400 bg-purple-500/15 border-purple-500/25",
      };
    if (showTextPanel)
      return {
        icon: Type,
        label: "Text",
        color: "text-pink-400 bg-pink-500/15 border-pink-500/25",
      };
    if (pdfFile)
      return {
        icon: FileText,
        label: "PDF",
        color: "text-blue-400 bg-blue-500/15 border-blue-500/25",
      };
    return {
      icon: BookOpen,
      label: "Topic",
      color: "text-purple-400 bg-purple-500/15 border-purple-500/25",
    };
  };

  const badge = getModeBadge();
  const BadgeIcon = badge.icon;

  return (
    <>
      {/* ── Toast Notification (Portal — renders on body to escape stacking context) ── */}
      {isMounted &&
        toast?.show &&
        createPortal(
          <div className="fixed top-6 right-6 z-[9999] animate-slide-in-right">
            <div className="rounded-2xl p-3.5 border border-white/10 bg-[#13151f]/95 backdrop-blur-xl shadow-2xl shadow-black/80 flex items-center gap-3.5 max-w-sm">
              <div className="shrink-0 w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center text-red-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-sm font-bold text-red-400 tracking-tight">{toast.title}</h4>
                <p className="text-xs text-zinc-400 mt-0.5 leading-snug">{toast.message}</p>
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

      {/* ── Animated Loading Modal ── */}
      <QuizLoadingModal
        isOpen={isGenerating}
        topicOrSource={
          inputMode === "topic"
            ? topic
            : pdfFile
              ? pdfFile.name
              : pastedText
                ? "Pasted Content"
                : ""
        }
        difficulty={difficulty}
        questionsCount={questionsCount}
      />

      <form onSubmit={handleSubmit} className="w-full relative">
        <div className="flex flex-col gap-3">
          {/* ── Expansion Panel: Text Area (when text mode) ── */}
          {inputMode === "content" && showTextPanel && (
            <div className="animate-expand-panel glass-card rounded-2xl p-4 border border-white/5 shadow-2xl shadow-purple-950/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">
                  Paste your text
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowTextPanel(false);
                    setInputMode("topic");
                    setPastedText("");
                  }}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                id="pastedText"
                rows={5}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your notes, article, or any text here…"
                required={!pdfFile}
                className="w-full bg-zinc-900/50 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 transition-all duration-200 resize-none"
              />
            </div>
          )}

          {/* ── Expansion Panel: PDF File Chip ── */}
          {inputMode === "content" && pdfFile && !showTextPanel && (
            <div className="animate-expand-panel glass-card rounded-2xl px-4 py-3 border border-white/5 shadow-2xl shadow-purple-950/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <span className="flex-1 text-sm text-white truncate">{pdfFile.name}</span>
                <button
                  type="button"
                  onClick={removePdf}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
                  aria-label="Remove PDF"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── Settings Panel (always visible) ── */}
          <div className="glass-card rounded-2xl p-5 border border-white/8 shadow-2xl shadow-purple-950/30 mt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-zinc-300 tracking-wider uppercase">
                Quiz Settings
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Difficulty */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="difficulty"
                  className="text-xs font-medium text-zinc-500 tracking-wide"
                >
                  Difficulty
                </label>
                <div className="relative">
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full appearance-none bg-zinc-900/60 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 transition-all duration-200 cursor-pointer"
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
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              {/* Number of Questions */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="questionsCount"
                  className="text-xs font-medium text-zinc-500 tracking-wide"
                >
                  Questions
                </label>
                <div className="relative flex items-center bg-zinc-900/60 border border-white/10 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    className="px-2.5 py-2.5 text-zinc-400 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Decrease question count"
                  >
                    <Minus className="w-3.5 h-3.5" />
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
                    className="px-2.5 py-2.5 text-zinc-400 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Increase question count"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* ── THE MAIN INPUT BAR ── */}
          {/* ══════════════════════════════════════════════════════════ */}
          <div className="relative flex items-center gap-2 bg-[#0f1117] border border-white/10 rounded-full px-2 py-2 shadow-2xl shadow-black/40 transition-all duration-300 focus-within:border-pink-500/30 focus-within:shadow-pink-500/5">
            {/* ── + Button (Drop-up trigger) ── */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(!menuOpen);
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  menuOpen
                    ? "bg-white/15 text-white rotate-45"
                    : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Plus className="w-5 h-5 transition-transform duration-200" />
              </button>

              {/* ── Drop-up Menu ── */}
              {menuOpen && (
                <div className="absolute bottom-full left-0 mb-2.5 animate-drop-up z-50">
                  <div className="rounded-xl border border-white/10 p-1.5 shadow-2xl shadow-black/60 min-w-[180px] bg-[#13151f]">
                    {/* Topic */}
                    <button
                      type="button"
                      onClick={selectTopic}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                        inputMode === "topic" && !showTextPanel
                          ? "bg-purple-500/15 text-purple-300"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          inputMode === "topic" && !showTextPanel
                            ? "bg-purple-500/20 border border-purple-500/30"
                            : "bg-white/5 border border-white/8"
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Topic</div>
                        <div className="text-[10px] text-zinc-600 leading-tight">
                          Enter any subject
                        </div>
                      </div>
                    </button>

                    {/* Text */}
                    <button
                      type="button"
                      onClick={selectText}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                        inputMode === "content" && showTextPanel
                          ? "bg-pink-500/15 text-pink-300"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          inputMode === "content" && showTextPanel
                            ? "bg-pink-500/20 border border-pink-500/30"
                            : "bg-white/5 border border-white/8"
                        }`}
                      >
                        <Type className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Text</div>
                        <div className="text-[10px] text-zinc-600 leading-tight">
                          Paste notes or articles
                        </div>
                      </div>
                    </button>

                    {/* PDF */}
                    <button
                      type="button"
                      onClick={selectPdf}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                        inputMode === "content" && pdfFile && !showTextPanel
                          ? "bg-blue-500/15 text-blue-300"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          inputMode === "content" && pdfFile && !showTextPanel
                            ? "bg-blue-500/20 border border-blue-500/30"
                            : "bg-white/5 border border-white/8"
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">PDF</div>
                        <div className="text-[10px] text-zinc-600 leading-tight">
                          Upload a document
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Active Mode Badge ── */}
            <div
              className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.color} tracking-wide`}
            >
              <BadgeIcon className="w-3 h-3" />
              {badge.label}
            </div>

            {/* ── Input Field ── */}
            {inputMode === "topic" ? (
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={getPlaceholder()}
                required
                minLength={3}
                className="flex-1 bg-[#0f1117] border-none text-sm text-white placeholder-zinc-500 focus:outline-none min-w-0 caret-pink-400 autofill:bg-[#0f1117] autofill:text-white [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_#0f1117_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
              />
            ) : (
              <div className="flex-1 text-sm text-zinc-500 truncate min-w-0 select-none">
                {pdfFile
                  ? pdfFile.name
                  : showTextPanel
                    ? "Type in the panel above..."
                    : "Select an input type"}
              </div>
            )}

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
              className="shrink-0 w-10 h-10 rounded-full btn-gradient flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-pink-500/25"
              title="Generate Quiz"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* ── Subtle hint text ── */}
          <div className="flex items-center justify-center gap-3 text-[11px] text-zinc-600">
            <span>Press + to switch input type</span>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </form>
    </>
  );
}
