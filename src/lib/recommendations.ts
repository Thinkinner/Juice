import { RECIPES } from "@/data/recipes";
import type { FlavorPreference, Recipe, SensitivityOption, WellnessGoal } from "@/lib/types";

const GOAL_PRIORITY: Record<
  WellnessGoal,
  { boost: string[]; matchGoals: WellnessGoal[] }
> = {
  Digestion: {
    boost: ["ginger", "mint", "pineapple", "cucumber", "gentle"],
    matchGoals: ["Digestion"],
  },
  Bloating: {
    boost: ["cucumber", "celery", "lemon", "lime", "mint"],
    matchGoals: ["Bloating"],
  },
  Energy: {
    boost: ["beet", "apple", "carrot", "ginger"],
    matchGoals: ["Energy"],
  },
  Hydration: {
    boost: ["watermelon", "cucumber", "coconut", "lime"],
    matchGoals: ["Hydration"],
  },
  "Skin Glow": {
    boost: ["berry", "spinach", "sweet"],
    matchGoals: ["Skin Glow"],
  },
  "Inflammation Support": {
    boost: ["turmeric", "ginger", "pineapple"],
    matchGoals: ["Inflammation Support"],
  },
};

const CITRUS_TAGS = new Set(["citrus", "orange", "grapefruit", "lemon", "lime"]);
const SWEET_TAGS = new Set(["sweet", "pineapple", "watermelon", "apple", "berry", "pear"]);

function hasAnyTag(recipe: Recipe, tags: Set<string>): boolean {
  return recipe.tags.some((t) => tags.has(t));
}

function flavorBoost(recipe: Recipe, flavor: FlavorPreference): number {
  if (flavor === "No preference") return 0;
  const f = flavor.toLowerCase();
  if (f === "sweet" && hasAnyTag(recipe, SWEET_TAGS)) return 1.2;
  if (f === "green" && recipe.tags.includes("green")) return 1.4;
  if (f === "refreshing" && (recipe.tags.includes("mint") || recipe.tags.includes("cucumber")))
    return 1.2;
  if (f === "spicy" && recipe.tags.includes("ginger")) return 1.3;
  return 0;
}

function sensitivityPenalty(recipe: Recipe, sensitivities: SensitivityOption[]): number {
  let penalty = 0;
  const hasNone = sensitivities.includes("None");
  const active = hasNone ? [] : sensitivities;

  if (active.includes("Acid reflux") || active.includes("Citrus sensitivity")) {
    if (hasAnyTag(recipe, CITRUS_TAGS) || recipe.tags.includes("citrus")) {
      penalty += 4;
    }
    if (recipe.name === "Citrus Zing") penalty += 6;
  }

  if (active.includes("Diabetes / blood sugar concerns")) {
    if (hasAnyTag(recipe, SWEET_TAGS)) penalty += 2.5;
    if (recipe.tags.includes("sweet")) penalty += 1;
  }

  return penalty;
}

function ibsBoost(recipe: Recipe, sensitivities: SensitivityOption[]): number {
  if (!sensitivities.includes("IBS / sensitive stomach") || sensitivities.includes("None")) {
    return 0;
  }
  if (recipe.tags.includes("gentle") || recipe.tags.includes("ibs")) return 2.5;
  if (recipe.tags.includes("cucumber") && !hasAnyTag(recipe, CITRUS_TAGS)) return 1.2;
  if (hasAnyTag(recipe, CITRUS_TAGS)) return -1;
  return 0;
}

export function scoreRecipe(
  recipe: Recipe,
  goal: WellnessGoal,
  sensitivities: SensitivityOption[],
  flavor: FlavorPreference,
): number {
  const cfg = GOAL_PRIORITY[goal];
  let score = 0;

  if (cfg.matchGoals.includes(recipe.goal)) score += 3;
  else if (recipe.goal === goal) score += 4;

  for (const b of cfg.boost) {
    if (recipe.tags.includes(b) || recipe.ingredients.some((i) => i.toLowerCase().includes(b))) {
      score += 1.1;
    }
  }

  score += flavorBoost(recipe, flavor);
  score += ibsBoost(recipe, sensitivities);
  score -= sensitivityPenalty(recipe, sensitivities);

  return score;
}

export function getRecommendedRecipes(
  goal: WellnessGoal,
  sensitivities: SensitivityOption[],
  flavor: FlavorPreference,
  limit = 3,
): Recipe[] {
  const ranked = [...RECIPES]
    .map((r) => ({ r, s: scoreRecipe(r, goal, sensitivities, flavor) }))
    .sort((a, b) => b.s - a.s);
  return ranked.slice(0, limit).map((x) => x.r);
}
