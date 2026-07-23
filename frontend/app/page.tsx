import Navbar from "../components/Navbar/Navbar";
import QuizForm from "../components/QuizForm";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import WhyChooseUs from "../components/WhyChooseUs";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import { auth } from "@/auth";

export const metadata = {
  title: "Home",
};

export default async function Home() {
  const session = await auth();
  const isLoggedIn = !!session;
  return (
    <div className="min-h-screen w-full relative flex flex-col font-sans overflow-x-hidden selection:bg-pink-500/30 selection:text-pink-200">
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 grid-bg opacity-[0.2] pointer-events-none z-0"></div>

      {/* Header / Navbar */}
      <Navbar />

      {/* Main Page Wrapper */}
      <main className="relative flex-1 w-full max-w-7xl mx-auto pt-20 md:pt-20 pb-8 z-10 flex flex-col gap-10 md:gap-14">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center gap-8 w-full" id="home">
          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight font-sans">
              Generate{" "}
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                AI{" "}
              </span>
              Quizzes
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                {" "}
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
            <QuizForm isLoggedIn={isLoggedIn} />
          </div>
        </section>

        {/* Features Section */}
        <Features />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Why Choose Us Section */}
        <WhyChooseUs />

        {/* FAQ Section */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
