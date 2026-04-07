"use client";

import { Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { JuiceSpotCard } from "@/components/spots/JuiceSpotCard";
import { ShareCard } from "@/components/share/ShareCard";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { Button } from "@/components/ui/Button";
import { getRecipeById } from "@/data/recipes";
import { getSpotsNearZip } from "@/data/juice-spots";
import type { Recipe, UnlockedSession } from "@/lib/types";
import { loadSession } from "@/lib/quiz-storage";

export function ResultsView() {
  const router = useRouter();
  const [session, setSession] = useState<UnlockedSession | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = loadSession();
    if (!s) {
      router.replace("/quiz");
      return;
    }
    setSession(s);
    const list = s.recipeIds.map((id) => getRecipeById(id)).filter((r): r is Recipe => Boolean(r));
    setRecipes(list);
    setLoading(false);
  }, [router]);

  if (loading || !session) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-stone-600">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm">Loading your plan…</p>
      </div>
    );
  }

  const spots = getSpotsNearZip(session.zip);

  return (
    <div className="space-y-8 pb-12 pt-2">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Your juice plan</p>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
          Ideas for {session.goal.toLowerCase()}
        </h1>
        <p className="text-sm text-stone-600">
          Saved for <span className="font-medium text-stone-800">{session.email}</span> — wellness
          suggestions only, not medical advice.
        </p>
      </header>

      <ShareCard session={session} />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-stone-900">Your preferences</h2>
        <div className="rounded-3xl border border-stone-200 bg-white p-4 text-sm text-stone-700 shadow-sm">
          <p>
            <span className="font-medium text-stone-900">Goal:</span> {session.goal}
          </p>
          <p className="mt-2">
            <span className="font-medium text-stone-900">Sensitivities:</span>{" "}
            {session.sensitivities.filter((x) => x !== "None").join(", ") || "None noted"}
          </p>
          <p className="mt-2">
            <span className="font-medium text-stone-900">Flavor:</span> {session.flavor}
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-stone-900">Recommended recipes</h2>
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              sensitivities={session.sensitivities}
              blurIngredients={false}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-emerald-700" aria-hidden />
          <h2 className="text-sm font-semibold text-stone-900">Juice spots near your ZIP code</h2>
        </div>
        <p className="text-xs text-stone-500">
          Showing mock listings for <span className="font-mono font-medium">{session.zip}</span> — plug in
          Google Places when you&apos;re ready.
        </p>
        <div className="grid gap-4">
          {spots.map((spot) => (
            <JuiceSpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </section>

      <Disclaimer />

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant="secondary"
          fullWidth
          className="!py-3"
          onClick={() => router.push("/quiz")}
        >
          Retake quiz
        </Button>
        <Button type="button" fullWidth className="!py-3" onClick={() => router.push("/saved")}>
          View saved recipes
        </Button>
      </div>
    </div>
  );
}
