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
      <h2 className="text-2xl font-bold text-white text-center font-sans tracking-tight">
        Frequently Asked Questions
      </h2>

      <div className="w-full max-w-3xl mx-auto flex flex-col gap-3 mt-2">
        {faqData.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="glass-card rounded-xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/10"
            >
              {/* Accordion Trigger Header */}
              <button
                onClick={() => handleToggle(index)}
                className="w-full flex items-center justify-between p-5 text-left text-sm md:text-base font-bold text-white transition-colors hover:bg-white/5 cursor-pointer"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-pink-500" : ""
                  }`}
                />
              </button>

              {/* Accordion Content */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-96 border-t border-white/5" : "max-h-0"
                } overflow-hidden`}
              >
                <p className="p-5 text-xs md:text-sm text-zinc-400 leading-relaxed bg-zinc-950/20">
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
