import Image from "next/image";

export default function Testimonials() {
  const testimonials = [
    {
      avatar: "/user_headshot_1.png",
      name: "James Preston",
      role: "Software Engineer",
      text: "The AI quiz generator has transformed my exam prep. The instant feedback and explanation of concepts saved me hours of textbook scrolling.",
    },
    {
      avatar: "/user_headshot_2.png",
      name: "Emma Steiner",
      role: "Product Designer",
      text: "I love the clean aesthetics and the interactive code preview. Generating custom quizzes on the fly makes self-testing super engaging and fun.",
    },
    {
      avatar: "/user_headshot_3.png",
      name: "Alex Chen",
      role: "Computer Science Student",
      text: "I can enter any niche technical topic, and MindRush outputs accurate, challenging questions with a timed environment that simulates real tests.",
    },
  ];

  return (
    <section className="w-full flex flex-col gap-6 py-10" id="testimonials">
      <h2 className="text-2xl font-bold text-white text-center font-sans tracking-tight">
        Testimonials
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden transition-all duration-300 hover:border-white/10 hover:bg-white/5 hover:scale-[1.02] flex flex-col gap-4 group"
          >
            {/* Ambient hover glow */}
            <div className="absolute -inset-px bg-gradient-to-tr from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

            {/* Header with Avatar */}
            <div className="flex items-center gap-4 relative z-10">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10">
                <Image src={item.avatar} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-wide">{item.name}</span>
                <span className="text-xs text-zinc-500">{item.role}</span>
              </div>
            </div>

            {/* Testimonial Text */}
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed italic relative z-10">
              &ldquo;{item.text}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
