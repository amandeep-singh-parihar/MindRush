import Image from "next/image";
import Navbar from "../components/Navbar";
import QuizForm from "../components/QuizForm";
import Stats from "../components/Stats";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen w-full relative flex flex-col font-sans overflow-x-hidden selection:bg-pink-500/30 selection:text-pink-200">
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 grid-bg opacity-[0.2] pointer-events-none z-0"></div>

      {/* Header / Navbar */}
      <Navbar />

      {/* Main Page Wrapper */}
      <main className="relative flex-1 w-full max-w-7xl mx-auto pt-32 md:pt-40 pb-20 z-10 flex flex-col gap-16 md:gap-24">
        {/* Hero Section */}
        <section
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
          id="home"
        >
          {/* Hero Left Column (Content & Form) */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
                Generate AI Quizzes <br />
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                  in Seconds
                </span>
              </h1>
              <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-xl">
                Enter any topic, difficulty, and number of questions. MindRush instantly creates
                personalized quizzes using AI to help you learn faster.
              </p>
            </div>

            {/* Modular Quiz Form Component */}
            <div className="max-w-md w-full">
              <QuizForm />
            </div>
          </div>

          {/* Hero Right Column (3D Brain Illustration) */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            {/* Glowing background behind image */}
            <div className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none z-0 animate-pulse"></div>
            <div className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-pink-500/10 rounded-full blur-[80px] pointer-events-none z-0"></div>

            {/* Responsive Floating Brain Platform Image */}
            <div className="relative z-10 floating-brain w-full max-w-[450px] aspect-square flex items-center justify-center">
              <Image
                src="/brain_platform.png"
                alt="MindRush AI brain platform"
                width={500}
                height={500}
                priority
                className="w-full h-auto object-contain drop-shadow-[0_0_35px_rgba(168,85,247,0.3)]"
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <Stats />

        {/* Features Section */}
        <Features />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Why Choose Us Section */}
        <WhyChooseUs />

        {/* Testimonials Section */}
        <Testimonials />

        {/* FAQ Section */}
        <FAQ />

        {/* CTA Section */}
        <CTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
