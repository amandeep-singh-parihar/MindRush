import StatCard from "./StatCard";

export default function Stats() {
  const statsData = [
    { value: "50K+", label: "Quizzes Generated" },
    { value: "15K+", label: "Users" },
    { value: "100+", label: "Categories" },
    { value: "98%", label: "Satisfaction" },
  ];

  return (
    <section className="w-full flex flex-col gap-6 py-10" id="stats">
      <h2 className="text-2xl font-bold text-white font-sans tracking-tight">Stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatCard key={index} value={stat.value} label={stat.label} />
        ))}
      </div>
    </section>
  );
}
