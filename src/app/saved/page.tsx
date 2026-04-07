import { SavedRecipesView } from "@/components/saved/SavedRecipesView";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata = {
  title: "Saved recipes | Juice Finder",
  description: "Recipes you saved from Juice Finder.",
};

export default function SavedPage() {
  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 pb-8 pt-4 sm:max-w-2xl">
        <SavedRecipesView />
      </main>
      <SiteFooter />
    </div>
  );
}
