import { Search, BrainCircuit, ClipboardList, BarChart3, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Enter Topic",
      description: "Type in any concept, upload documents, or paste text.",
    },
    {
      icon: BrainCircuit,
      title: "AI Generation",
      description: "Our LLM generates custom questions customized for you.",
    },
    {
      icon: ClipboardList,
      title: "Take Quiz",
      description: "Answer questions in our timed interactive environment.",
    },
    {
      icon: BarChart3,
      title: "Analyze Results",
      description: "Get detailed progress analytics and explanations.",
    },
  ];

  return (
    <section className="w-full flex flex-col gap-6 py-10" id="how-it-works">
      <h2 className="text-2xl font-bold text-white text-center font-sans tracking-tight">
        How It Works
      </h2>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mt-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col lg:flex-row items-center w-full lg:w-auto flex-1"
          >
            {/* Step Card */}
            <div className="flex-1 w-full glass-card rounded-2xl p-6 flex flex-col items-center text-center border border-white/5 relative overflow-hidden transition-all duration-300 hover:border-white/10 hover:bg-white/5 hover:scale-[1.02] group">
              <div className="absolute -inset-px bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <step.icon className="w-6 h-6" />
              </div>

              <span className="text-sm font-semibold text-zinc-400 mb-1">Step 0{index + 1}</span>
              <h3 className="text-base font-bold text-white mb-2 font-sans">{step.title}</h3>
              <p className="text-xs text-zinc-500 max-w-[200px] leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Connecting Arrow */}
            {index < steps.length - 1 && (
              <div className="flex items-center justify-center py-4 lg:py-0 lg:px-4 text-zinc-600">
                <ArrowRight className="w-6 h-6 rotate-90 lg:rotate-0" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
