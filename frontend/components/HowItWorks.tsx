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
    <section className="w-full flex flex-col gap-5 py-4" id="how-it-works">
      <h2 className="text-2xl font-bold text-white text-center tracking-tight">How It Works</h2>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mt-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col lg:flex-row items-center w-full lg:w-auto flex-1"
          >
            {/* Step Card */}
            <div className="surface-card rounded-xl p-6 flex flex-col items-center text-center w-full transition-colors duration-200 hover:border-[#383838]">
              <div className="p-3 rounded-lg mb-4" style={{ background: "var(--surface-2)" }}>
                <step.icon className="w-5 h-5" style={{ color: "var(--accent)" }} />
              </div>

              <span className="text-xs font-medium mb-1" style={{ color: "var(--text-subtle)" }}>
                Step 0{index + 1}
              </span>
              <h3 className="text-sm font-semibold text-white mb-1.5">{step.title}</h3>
              <p
                className="text-xs max-w-[200px] leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {step.description}
              </p>
            </div>

            {/* Connecting Arrow */}
            {index < steps.length - 1 && (
              <div
                className="flex items-center justify-center py-3 lg:py-0 lg:px-3"
                style={{ color: "var(--border-hover)" }}
              >
                <ArrowRight className="w-5 h-5 rotate-90 lg:rotate-0" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
