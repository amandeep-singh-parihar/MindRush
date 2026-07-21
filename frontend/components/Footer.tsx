import { Brain } from "lucide-react";

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

export default function Footer() {
  return (
    <footer
      className="w-full border-t border-white/5 bg-zinc-950/60 backdrop-blur-xl py-6 mt-8 relative overflow-hidden"
      id="contact"
    >
      {/* Background Subtle Ambient Glow */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[500px] h-[100px] bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand & Summary */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2.5 max-w-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-500">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              Mind
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Rush
              </span>
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            AI-powered quiz generation platform. Convert any topic, study notes, or PDF documents
            into interactive quizzes in seconds.
          </p>
        </div>

        {/* Connect Section */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
            Connect With Me
          </span>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/amandeep-singh-parihar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 hover:border-pink-500/30 text-zinc-300 hover:text-white transition-all duration-300 text-xs font-semibold border border-white/10 shadow-lg cursor-pointer group"
            >
              <GithubIcon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/amandeep-singh-parihar-8399aa25a/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 hover:border-blue-500/30 text-zinc-300 hover:text-white transition-all duration-300 text-xs font-semibold border border-white/10 shadow-lg cursor-pointer group"
            >
              <LinkedinIcon className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>&copy; {new Date().getFullYear()} MindRush. All rights reserved.</p>
        <p className="text-[11px] text-zinc-600 font-medium">
          Built with Next.js, TailwindCSS & FastAPI
        </p>
      </div>
    </footer>
  );
}
