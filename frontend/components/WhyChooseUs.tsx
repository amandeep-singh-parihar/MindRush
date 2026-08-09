import QuizPreview from "./QuizPreview";
import { Cpu, BookOpen, Zap, LineChart, Smartphone, Trophy } from "lucide-react";

export default function WhyChooseUs() {
  const points = [
    {
      icon: Cpu,
      title: "Powered by AI & RAG",
      description:
        "Uses LLMs and vector retrieval to synthesize accurate questions with grounded explanations.",
    },
    {
      icon: BookOpen,
      title: "PDF & Notes Upload",
      description:
        "Upload study notes or PDFs. MindRush automatically extracts key topics & concepts.",
    },
    {
      icon: Zap,
      title: "Instant 5s Generation",
      description:
        "Build full 10-question comprehensive tests in under 5 seconds with zero wait time.",
    },
    {
      icon: LineChart,
      title: "Smart Difficulty Scaling",
      description:
        "Customize questions across Easy, Medium, and Hard difficulty tiers to suit your level.",
    },
    {
      icon: Trophy,
      title: "Streak & Analytics",
      description:
        "Track your daily study streak, activity heatmaps, and accuracy rate on your dashboard.",
    },
    {
      icon: Smartphone,
      title: "Mobile & Tablet Ready",
      description: "Fully responsive design that works seamlessly on any device or screen size.",
    },
  ];

  return (
    <section className="w-full flex flex-col gap-6 py-4" id="why-choose-us">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Why Choose <span style={{ color: "var(--accent)" }}>MindRush</span>
        </h2>
        <p
          className="text-sm max-w-xl mx-auto leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          Transform raw text, complex topics, and PDF study material into interactive, retentive
          quizzes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-2">
        {/* Left Column: Interactive Quiz Preview Card */}
        <div className="lg:col-span-6 order-2 lg:order-1">
          <QuizPreview />
        </div>

        {/* Right Column: Bullets Grid */}
        <div className="lg:col-span-6 flex flex-col gap-3 order-1 lg:order-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {points.map((point, index) => {
              const Icon = point.icon;
              return (
                <div
                  key={index}
                  className="surface-card rounded-xl p-4 flex items-start gap-3 transition-colors duration-200 hover:border-[#383838]"
                >
                  <div
                    className="p-2 rounded-lg shrink-0"
                    style={{ background: "var(--surface-2)" }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "var(--accent)" }} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-sm font-semibold text-white">{point.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      {point.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
