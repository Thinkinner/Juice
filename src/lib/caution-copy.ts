import type { Recipe, SensitivityOption } from "@/lib/types";

const CITRUS_HINT = /citrus|lemon|lime|orange|grapefruit/i;

export function buildDisplayCaution(
  recipe: Recipe,
  sensitivities: SensitivityOption[],
): string {
  const lines: string[] = [recipe.caution_note];
  const active = sensitivities.filter((s) => s !== "None");

  if (
    active.some((s) => s === "Acid reflux" || s === "Citrus sensitivity") &&
    (recipe.tags.includes("citrus") || CITRUS_HINT.test(recipe.ingredients.join(" ")))
  ) {
    lines.push(
      "Because you noted citrus or reflux concerns, consider asking for modifications or a milder option. Informational only.",
    );
  }

  if (
    active.includes("Diabetes / blood sugar concerns") &&
    recipe.tags.includes("sweet")
  ) {
    lines.push(
      "This blend trends sweeter—many people monitoring glucose prefer smaller portions or dilution. Informational only.",
    );
  }

  if (active.includes("IBS / sensitive stomach")) {
    lines.push(
      "For sensitive digestion, start with a small amount and adjust based on how you feel. Informational only.",
    );
  }

  return Array.from(new Set(lines)).join(" ");
}
