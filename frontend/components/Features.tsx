import {
  Brain,
  BarChart3,
  MessageSquareCode,
  Timer,
  TrendingUp,
  Trophy,
  HelpCircle,
  Share2,
} from "lucide-react";
import FeatureCard from "./FeatureCard";

export default function Features() {
  const featuresData = [
    {
      icon: Brain,
      title: "AI Quiz Generation",
      description:
        "AI-powered engine generates personalized quizzes on any topic instantly using advanced AI models.",
      glowColor: "purple" as const,
    },
    {
      icon: BarChart3,
      title: "Multiple Difficulty Levels",
      description:
        "Choose from multiple difficulty levels to match your skill level and progressive learning path.",
      glowColor: "green" as const,
    },
    {
      icon: MessageSquareCode,
      title: "Instant Feedback",
      description:
        "Get immediate answers, grades, and detailed explanations to learn from your mistakes.",
      glowColor: "yellow" as const,
    },
    {
      icon: Timer,
      title: "Timed Quiz Mode",
      description:
        "Challenge yourself with custom time limits to prepare for real exams and boost speed.",
      glowColor: "blue" as const,
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Track your score history, strength areas, and performance metrics over time.",
      glowColor: "purple" as const,
    },
    {
      icon: Trophy,
      title: "Beautiful Leaderboards",
      description: "Compete with users worldwide, earn achievements, and showcase your knowledge.",
      glowColor: "orange" as const,
    },
    {
      icon: HelpCircle,
      title: "AI Explanations",
      description:
        "Dive deeper with conversational AI chat that explains answers and complex concepts.",
      glowColor: "blue" as const,
    },
    {
      icon: Share2,
      title: "Share Quiz with Friends",
      description:
        "Challenge friends, share quiz results, and study collaboratively with your peer group.",
      glowColor: "pink" as const,
    },
  ];

  return (
    <section className="w-full flex flex-col gap-6 py-4" id="features">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white font-sans tracking-tight">
          Features
        </h2>
        <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
          Everything you need to generate, customize, and master AI quizzes effortlessly.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {featuresData.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            glowColor={feature.glowColor}
          />
        ))}
      </div>
    </section>
  );
}
