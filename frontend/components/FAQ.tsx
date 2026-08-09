"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: "How does MindRush generate quizzes from my input?",
      answer:
        "MindRush uses advanced Large Language Models (LLMs) combined with Retrieval-Augmented Generation (RAG). Whether you enter a topic, paste text, or upload a PDF, our system extracts key concepts and retrieves context to synthesize accurate questions with clear explanations.",
    },
    {
      question: "Can I generate quizzes from my own notes or PDF documents?",
      answer:
        "Yes! Simply switch to the 'Paste PDF / Text' tab on the homepage or dashboard, upload your study PDF or paste raw text notes, and MindRush will extract key topics and build a custom quiz directly from your source material.",
    },
    {
      question: "What customization options are available for quiz generation?",
      answer:
        "You can customize your quiz by choosing between Easy, Medium, and Hard difficulty levels, as well as setting the exact number of questions you want (from 1 to 10 questions).",
    },
    {
      question: "Do I need an account to generate and take quizzes?",
      answer:
        "Signing up for a free account unlocks your personal learning dashboard where you can track your daily streaks, review detailed quiz attempt statistics, and access your full history.",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full flex flex-col gap-4 py-4" id="faq">
      <h2 className="text-2xl font-bold text-white text-center tracking-tight">
        Frequently Asked Questions
      </h2>

      <div className="w-full max-w-3xl mx-auto flex flex-col gap-2 mt-2">
        {faqData.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="surface-card rounded-xl overflow-hidden transition-colors duration-200 hover:border-[#383838]"
            >
              {/* Accordion Trigger */}
              <button
                onClick={() => handleToggle(index)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-white cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  style={{ color: isOpen ? "var(--accent)" : "var(--text-muted)" }}
                />
              </button>

              {/* Accordion Content */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-96 border-t" : "max-h-0"
                } overflow-hidden`}
                style={{ borderColor: "var(--border)" }}
              >
                <p className="p-5 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
