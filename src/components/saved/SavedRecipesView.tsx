"use client";

import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { Button } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { getRecipeById } from "@/data/recipes";
import type { Recipe } from "@/lib/types";
import { getSavedRecipeIds } from "@/lib/saved-recipes";

const DEFAULT_SENSITIVITIES = ["None"] as const;

export function SavedRecipesView() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const ids = getSavedRecipeIds();
    setRecipes(ids.map((id) => getRecipeById(id)).filter((r): r is Recipe => Boolean(r)));
  }, []);

  if (recipes.length === 0) {
    return (
      <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-3xl border border-dashed border-stone-200 bg-white px-6 py-14 text-center shadow-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500">
          <Bookmark className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="mt-4 text-xl font-semibold text-stone-900">No saved recipes yet</h1>
        <p className="mt-2 max-w-sm text-sm text-stone-600">
          Save blends from your results — we keep them in this browser for now (Supabase auth-ready
          later).
        </p>
        <Button
          type="button"
          fullWidth
          className="mt-8 w-full max-w-xs !py-3.5"
          onClick={() => router.push("/quiz")}
        >
          Take the quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 pt-2">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Saved recipes</h1>
        <p className="mt-1 text-sm text-stone-600">
          Stored locally on this device. Sign-in can be added later without changing the UI much.
        </p>
      </header>
      <div className="space-y-4">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            sensitivities={[...DEFAULT_SENSITIVITIES]}
            blurIngredients={false}
          />
        ))}
      </div>
      <Disclaimer />
    </div>
  );
}
