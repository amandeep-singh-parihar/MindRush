interface StatCardProps {
  value: string;
  label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-white/5 relative overflow-hidden transition-all duration-300 hover:border-white/10 hover:bg-white/5 hover:scale-[1.02] group">
      {/* Subtle background glow on hover */}
      <div className="absolute -inset-px bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      {/* Stat Value */}
      <span className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight mb-2">
        {value}
      </span>

      {/* Stat Label */}
      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{label}</span>
    </div>
  );
}
