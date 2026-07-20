import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="w-full py-16 relative" id="cta">
      {/* Glow backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="relative z-10 glass-card rounded-3xl p-10 md:p-16 border border-white/5 max-w-4xl mx-auto text-center flex flex-col items-center gap-6 overflow-hidden">
        {/* Subtle background mesh lines */}
        <div className="absolute inset-0 grid-bg opacity-[0.05] pointer-events-none"></div>

        {/* Decorative Star Icon Top Right */}
        <div className="absolute -right-6 -bottom-6 text-purple-500/20 w-32 h-32 pointer-events-none">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full animate-pulse">
            <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
          </svg>
        </div>

        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          CTA Section
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight max-w-xl font-sans tracking-tight">
          Start Learning Smarter with AI
        </h2>
        <p className="text-xs md:text-sm text-zinc-400 max-w-md leading-relaxed">
          Join thousands of students and professionals leveraging customized AI quizzes to master
          complex subjects and track progress.
        </p>
        <Link
          href="#home"
          className="btn-gradient flex items-center gap-2 text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-xl shadow-pink-500/20 mt-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          Generate Your First Quiz
        </Link>
      </div>
    </section>
  );
}
