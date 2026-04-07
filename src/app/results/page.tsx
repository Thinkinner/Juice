import { ResultsView } from "@/components/results/ResultsView";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata = {
  title: "Your plan | Juice Finder",
  description: "Personalized juice ideas based on your quiz.",
};

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 pb-12 pt-4 sm:max-w-2xl">
        <ResultsView />
      </main>
      <SiteFooter />
    </div>
  );
}
