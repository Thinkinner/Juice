import { QuizFlow } from "@/components/quiz/QuizFlow";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata = {
  title: "Quiz | Juice Finder",
  description: "Short wellness quiz for personalized juice ideas.",
};

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 pb-8 pt-4 sm:max-w-2xl">
        <QuizFlow />
      </main>
      <SiteFooter />
    </div>
  );
}
