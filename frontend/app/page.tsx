import Navbar from "../components/Navbar/Navbar";
import QuizForm from "../components/QuizForm";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import WhyChooseUs from "../components/WhyChooseUs";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import { auth } from "@/auth";

export const metadata = {
  title: {
    absolute: "MindRush",
  },
  description: "Generate personalized AI quizzes in seconds with MindRush.",
};

export default async function Home() {
  const session = await auth();
  const isLoggedIn = !!session;
  return (
    <div className="min-h-screen w-full relative flex flex-col font-sans overflow-x-hidden">
      {/* Header / Navbar */}
      <Navbar />

      {/* Main Page Wrapper */}
      <main className="relative flex-1 w-full max-w-7xl mx-auto pt-20 md:pt-20 pb-8 z-10 flex flex-col gap-10 md:gap-14 mt-4">
        {/* Hero Section */}
        <section
          className="flex flex-col items-center justify-center text-center gap-8 w-full min-h-[82vh]"
          id="home"
        >
          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-tight max-w-2xl mx-auto">
              Generate <span style={{ color: "var(--accent)" }}>AI Quizzes</span> in seconds
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed max-w-2xl"
              style={{ color: "var(--text-muted)" }}
            >
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
