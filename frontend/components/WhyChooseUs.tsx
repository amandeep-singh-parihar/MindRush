import QuizPreview from "./QuizPreview";
import { Cpu, BookOpen, Zap, LineChart, Smartphone, Trophy, Sparkles } from "lucide-react";

export default function WhyChooseUs() {
  const points = [
    {
      icon: Cpu,
      title: "Powered by AI & RAG",
      description:
        "Uses LLMs and vector retrieval to synthesize accurate questions with grounded explanations.",
      color: "from-pink-500/20 to-purple-500/20 text-pink-400 border-pink-500/30",
    },
    {
      icon: BookOpen,
      title: "PDF & Notes Upload",
      description:
        "Upload study notes or PDFs. MindRush automatically extracts key topics & concepts.",
      color: "from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30",
    },
    {
      icon: Zap,
      title: "Instant 5s Generation",
      description:
        "Build full 10-question comprehensive tests in under 5 seconds with zero wait time.",
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
    },
    {
      icon: LineChart,
      title: "Smart Difficulty Scaling",
      description:
        "Customize questions across Easy, Medium, and Hard difficulty tiers to suit your level.",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      icon: Trophy,
      title: "Streak & Analytics",
      description:
        "Track your daily study streak, activity heatmaps, and accuracy rate on your dashboard.",
      color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
    },
    {
      icon: Smartphone,
      title: "Mobile & Tablet Ready",
      description:
        "Fully responsive, state-of-the-art glassmorphic design that works on any device.",
      color: "from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30",
    },
  ];

  return (
    <section className="w-full flex flex-col gap-6 py-4 relative" id="why-choose-us">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 blur-[120px] pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Next-Gen AI Learning
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white font-sans tracking-tight">
          Why Choose{" "}
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            MindRush
          </span>
        </h2>
        <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Transform raw text, complex topics, and PDF study material into interactive, retentive
          quizzes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-2">
        {/* Left Column: Interactive Quiz Preview Card */}
        <div className="lg:col-span-6 order-2 lg:order-1 relative">
          <div className="absolute -top-3 left-6 z-20 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-[10px] font-bold text-pink-400 uppercase tracking-wider shadow-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
            Interactive Live Preview
          </div>
          <div className="relative z-10 w-full">
            <QuizPreview />
          </div>
        </div>

        {/* Right Column: Bullets Grid */}
        <div className="lg:col-span-6 flex flex-col gap-4 order-1 lg:order-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {points.map((point, index) => {
              const Icon = point.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4.5 glass-card rounded-2xl border border-white/5 hover:border-pink-500/20 hover:bg-white/[0.03] transition-all duration-300 group shadow-lg"
                >
                  <div
                    className={`p-2.5 rounded-xl bg-gradient-to-br ${point.color} border shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                      {point.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{point.description}</p>
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
