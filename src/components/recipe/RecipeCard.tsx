"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useEffect, useState } from "react";
import type { Recipe, SensitivityOption } from "@/lib/types";
import { buildDisplayCaution } from "@/lib/caution-copy";
import { isRecipeSaved, toggleSavedRecipe } from "@/lib/saved-recipes";

function IngredientStrip({ ingredients }: { ingredients: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ingredients.map((ing) => (
        <span
          key={ing}
          className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700"
        >
          {ing}
        </span>
      ))}
    </div>
  );
}

export function RecipeCard({
  recipe,
  sensitivities,
  blurIngredients = false,
}: {
  recipe: Recipe;
  sensitivities: SensitivityOption[];
  blurIngredients?: boolean;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isRecipeSaved(recipe.id));
  }, [recipe.id]);

  const caution = buildDisplayCaution(recipe, sensitivities);

  return (
    <article className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
      <div
        className="h-28 w-full bg-gradient-to-br from-emerald-100 via-lime-50 to-amber-50"
        aria-hidden
      />
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-stone-900">{recipe.name}</h3>
            <p className="mt-1 text-sm text-stone-600">{recipe.description}</p>
          </div>
          <button
            type="button"
            onClick={() => setSaved(toggleSavedRecipe(recipe.id))}
            className="shrink-0 rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-stone-700 hover:bg-white"
            aria-label={saved ? "Remove from saved" : "Save recipe"}
          >
            {saved ? <BookmarkCheck className="h-5 w-5 text-emerald-600" /> : <Bookmark className="h-5 w-5" />}
          </button>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Ingredients</p>
          <div className={`mt-2 ${blurIngredients ? "select-none blur-sm" : ""}`}>
            <IngredientStrip ingredients={recipe.ingredients} />
          </div>
        </div>

        <div className="rounded-2xl bg-emerald-50/60 p-4">
          <p className="text-xs font-semibold text-emerald-900">Why it may help</p>
          <p className="mt-1 text-sm text-emerald-950/90">{recipe.why_it_may_help}</p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-4">
          <p className="text-xs font-semibold text-amber-950">Caution</p>
          <p className="mt-1 text-sm text-amber-950/85">{caution}</p>
        </div>

        {blurIngredients && (
          <p className="text-center text-xs text-stone-500">Unlock your plan to see full ingredients.</p>
        )}
      </div>
    </article>
  );
}
