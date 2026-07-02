"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: "How does the AI generate quizzes?",
      answer:
        "Our engine uses advanced Large Language Models (LLMs) to parse your topic, find core curriculum concepts, and synthesize high-quality questions with correct options and detailed explanations.",
    },
    {
      question: "What topics can I search for?",
      answer:
        "You can enter literally any topic! From high-level academic fields like Machine Learning and Quantum Mechanics to specific subjects, language studies, or custom text uploads.",
    },
    {
      question: "Can I customize the question limits?",
      answer:
        "Yes, you can generate anywhere from 1 to 50 questions per quiz. You can also select between Easy, Medium, and Hard difficulties depending on your learning objectives.",
    },
    {
      question: "Is there a free trial version?",
      answer:
        "Yes, MindRush offers free credits upon signup so you can generate your first few quizzes. We also offer premium tiers for unlimited quiz generation, analytics dashboard access, and sharing features.",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full flex flex-col gap-6 py-10" id="faq">
      <h2 className="text-2xl font-bold text-white text-center font-sans tracking-tight">FAQ</h2>

      <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 mt-4">
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
                  className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-pink-500" : ""}`}
                />
              </button>

              {/* Accordion Content */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-40 border-t border-white/5" : "max-h-0"
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
