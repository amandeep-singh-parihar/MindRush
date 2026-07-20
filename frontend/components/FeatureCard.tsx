import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  glowColor: "purple" | "green" | "yellow" | "blue" | "orange" | "pink";
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  glowColor,
}: FeatureCardProps) {
  // Map colors to Tailwind styles for icons and custom glow shadows
  const colorMap = {
    purple: {
      bg: "bg-purple-500/10",
      border: "hover:border-purple-500/30",
      text: "text-purple-400",
      glow: "group-hover:shadow-purple-500/10",
    },
    green: {
      bg: "bg-emerald-500/10",
      border: "hover:border-emerald-500/30",
      text: "text-emerald-400",
      glow: "group-hover:shadow-emerald-500/10",
    },
    yellow: {
      bg: "bg-amber-500/10",
      border: "hover:border-amber-500/30",
      text: "text-amber-400",
      glow: "group-hover:shadow-amber-500/10",
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "hover:border-blue-500/30",
      text: "text-blue-400",
      glow: "group-hover:shadow-blue-500/10",
    },
    orange: {
      bg: "bg-orange-500/10",
      border: "hover:border-orange-500/30",
      text: "text-orange-400",
      glow: "group-hover:shadow-orange-500/10",
    },
    pink: {
      bg: "bg-pink-500/10",
      border: "hover:border-pink-500/30",
      text: "text-pink-400",
      glow: "group-hover:shadow-pink-500/10",
    },
  };

  const theme = colorMap[glowColor];

  return (
    <div
      className={`glass-card rounded-2xl p-5 flex flex-col items-start text-left border border-white/5 relative overflow-hidden transition-all duration-300 hover:bg-white/5 hover:-translate-y-1 ${theme.border} group shadow-lg ${theme.glow}`}
    >
      {/* Icon */}
      <div
        className={`p-3 rounded-xl ${theme.bg} ${theme.text} mb-4 relative z-10 transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <h3 className="text-base font-bold text-white mb-2 relative z-10 font-sans tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-zinc-400 leading-relaxed relative z-10">{description}</p>

      {/* Glow highlight inside */}
      <div className="absolute -inset-px bg-gradient-to-tr from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}
