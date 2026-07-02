import QuizPreview from "./QuizPreview";
import { Cpu, BookOpen, Zap, LineChart, Smartphone, Calendar } from "lucide-react";

export default function WhyChooseUs() {
  const points = [
    {
      icon: Cpu,
      title: "Powered by AI",
      description: "Harnesses cutting-edge language models for advanced quiz synthesis.",
    },
    {
      icon: BookOpen,
      title: "Personalized Learning",
      description: "Adapts topics and quiz style based on your learning speed.",
    },
    {
      icon: Zap,
      title: "Fast Quiz Generation",
      description: "Generate comprehensive tests in under 5 seconds.",
    },
    {
      icon: LineChart,
      title: "Beautiful Analytics",
      description: "Sleek dashboards tracking score trends and skill weak points.",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Fully responsive layout to study anywhere on any device.",
    },
    {
      icon: Calendar,
      title: "Daily Challenges",
      description: "Earn experience points and build study habits with daily tasks.",
    },
  ];

  return (
    <section className="w-full flex flex-col gap-6 py-10" id="why-choose-us">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-bold text-white font-sans tracking-tight">
          Why Choose MindRush
        </h2>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          AI-powered quiz generation platform for personalized learning
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mt-6">
        {/* Left Column: Interactive Quiz Preview Card */}
        <div className="lg:col-span-6 order-2 lg:order-1 relative">
          {/* Ambient background glow */}
          <div className="absolute w-[250px] h-[250px] md:w-[350px] md:h-[350px] -left-12 -top-12 bg-pink-500/10 rounded-full blur-[80px] pointer-events-none z-0"></div>
          <div className="relative z-10 w-full">
            <QuizPreview />
          </div>
        </div>

        {/* Right Column: Bullets Grid */}
        <div className="lg:col-span-6 flex flex-col gap-5 order-1 lg:order-2 relative">
          <div className="absolute w-[200px] h-[200px] -right-12 -bottom-12 bg-purple-500/10 rounded-full blur-[70px] pointer-events-none z-0"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
            {points.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 glass-card rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 group"
              >
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                  <point.icon className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                    {point.title}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
