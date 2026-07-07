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
import { auth } from "@/auth";

export default async function Home() {
  const s = await auth();
  console.log("this is the s -> ",s);
  return (
    <div className="min-h-screen w-full relative flex flex-col font-sans overflow-x-hidden selection:bg-pink-500/30 selection:text-pink-200">
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 grid-bg opacity-[0.2] pointer-events-none z-0"></div>

      {/* Header / Navbar */}
      <Navbar />

      {/* Main Page Wrapper */}
      <main className="relative flex-1 w-full max-w-7xl mx-auto pt-24 md:pt-30 pb-20 z-10 flex flex-col gap-16 md:gap-24">
        {/* Hero Section */}
        <section
          className="flex flex-col items-center text-center gap-8 w-full"
          id="home"
        >
          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight font-sans">
              Generate AI Quizzes <br />
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                in Seconds
              </span>
            </h1>
            <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-2xl">
              Enter any topic, difficulty, and number of questions. MindRush instantly creates
              personalized quizzes using AI to help you learn faster.
            </p>
          </div>

          {/* Modular Quiz Form Component */}
          <div className="max-w-lg w-full">
            <QuizForm />
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
