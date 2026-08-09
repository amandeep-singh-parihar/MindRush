import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  glowColor: "purple" | "green" | "yellow" | "blue" | "orange" | "pink";
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="surface-card rounded-xl p-5 flex flex-col items-start text-left transition-colors duration-200 hover:border-[#383838]">
      {/* Icon */}
      <div className="p-2.5 rounded-lg mb-4" style={{ background: "var(--surface-2)" }}>
        <Icon className="w-5 h-5" style={{ color: "var(--accent)" }} />
      </div>

      {/* Content */}
      <h3 className="text-sm font-semibold text-white mb-1.5 tracking-tight">{title}</h3>
      <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {description}
      </p>
    </div>
  );
}
