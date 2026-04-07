import type { Recipe } from "@/lib/types";

/** Static catalog aligned with `supabase/seed.sql` UUIDs */
export const RECIPES: Recipe[] = [
  {
    id: "a1111111-1111-4111-8111-111111111101",
    name: "Ginger Glow",
    goal: "Digestion",
    description:
      "A warming blend with ginger and apple—commonly chosen when people want something comforting for digestion.",
    ingredients: ["Ginger root", "Green apple", "Lemon (optional)", "Filtered water"],
    why_it_may_help:
      "Ginger is widely used in wellness routines for digestive comfort; apple adds gentle sweetness.",
    caution_note:
      "If citrus bothers you, ask for lemon on the side or omit. Informational only—not medical advice.",
    tags: ["ginger", "apple", "lemon", "citrus", "digestion"],
  },
  {
    id: "a1111111-1111-4111-8111-111111111102",
    name: "Green Reset",
    goal: "Bloating",
    description:
      "Cool cucumber and celery with a hint of mint—often described as light and refreshing.",
    ingredients: ["Cucumber", "Celery", "Mint", "Lime (optional)"],
    why_it_may_help:
      "Cucumber and celery are hydrating and commonly used in wellness-focused routines for a lighter feel.",
    caution_note:
      "If you have citrus sensitivity, request lime omitted. Informational only.",
    tags: ["cucumber", "celery", "mint", "lime", "citrus", "bloating"],
  },
  {
    id: "a1111111-1111-4111-8111-111111111103",
    name: "Pineapple Calm",
    goal: "Digestion",
    description:
      "Tropical pineapple with mint—sweet and smooth, popular for an easy-drinking option.",
    ingredients: ["Pineapple", "Mint", "Coconut water"],
    why_it_may_help:
      "Pineapple and mint are often paired in wellness recipes for a gentle, refreshing experience.",
    caution_note:
      "Pineapple is naturally sweet—worth noting if you are watching sugar intake. Informational only.",
    tags: ["pineapple", "mint", "sweet", "digestion"],
  },
  {
    id: "a1111111-1111-4111-8111-111111111104",
    name: "Mint Cooler",
    goal: "Bloating",
    description:
      "Crisp cucumber-forward juice with mint—designed to feel hydrating and easy.",
    ingredients: ["Cucumber", "Mint", "Green apple", "Filtered water"],
    why_it_may_help:
      "Cucumber and mint are commonly associated with hydration and a ‘lighter’ feeling.",
    caution_note: "Contains apple—naturally contains sugar. Informational only.",
    tags: ["cucumber", "mint", "apple", "sweet", "bloating"],
  },
  {
    id: "a1111111-1111-4111-8111-111111111105",
    name: "Morning Hydrator",
    goal: "Hydration",
    description:
      "Watermelon and cucumber with a squeeze of lime—bright and thirst-quenching.",
    ingredients: ["Watermelon", "Cucumber", "Lime"],
    why_it_may_help:
      "High water content from watermelon and cucumber may support hydration goals as part of a balanced routine.",
    caution_note:
      "Watermelon is naturally sweet. If citrus is a concern, omit lime. Informational only.",
    tags: ["watermelon", "cucumber", "lime", "citrus", "sweet", "hydration"],
  },
  {
    id: "a1111111-1111-4111-8111-111111111106",
    name: "Beet Sunrise",
    goal: "Energy",
    description:
      "Earthy beet with carrot and apple—bold color, smooth flavor.",
    ingredients: ["Beet", "Carrot", "Apple", "Ginger"],
    why_it_may_help:
      "Beets, carrots, and ginger are popular in wellness recipes when people want a vibrant, energizing-feeling option.",
    caution_note:
      "Naturally higher in carbohydrates from beets and apple—consider if you monitor blood sugar. Informational only.",
    tags: ["beet", "carrot", "apple", "ginger", "sweet", "energy"],
  },
  {
    id: "a1111111-1111-4111-8111-111111111107",
    name: "Citrus Zing",
    goal: "Energy",
    description:
      "Orange and grapefruit with a ginger kick—bright and punchy.",
    ingredients: ["Orange", "Grapefruit", "Ginger"],
    why_it_may_help:
      "Citrus and ginger are commonly used for a lively, refreshing taste experience.",
    caution_note:
      "Contains aggressive citrus—avoid if you have reflux or citrus sensitivity. Informational only.",
    tags: ["orange", "grapefruit", "ginger", "citrus", "energy"],
  },
  {
    id: "a1111111-1111-4111-8111-111111111108",
    name: "Cucumber Silk",
    goal: "Digestion",
    description:
      "Gentle cucumber and pear—mild and easy for sensitive routines.",
    ingredients: ["Cucumber", "Pear", "Filtered water"],
    why_it_may_help:
      "A mild profile is often preferred when someone wants something simple and gentle.",
    caution_note:
      "Pear adds natural sugar. If you have IBS triggers, start small. Informational only.",
    tags: ["cucumber", "pear", "gentle", "digestion", "ibs"],
  },
  {
    id: "a1111111-1111-4111-8111-111111111109",
    name: "Carrot Ginger Lift",
    goal: "Energy",
    description:
      "Carrot and ginger with a touch of lemon—smooth and familiar.",
    ingredients: ["Carrot", "Ginger", "Lemon"],
    why_it_may_help:
      "Carrot and ginger are classic pairings in many wellness-focused juice ideas.",
    caution_note:
      "Contains lemon—omit if citrus is a concern. Informational only.",
    tags: ["carrot", "ginger", "lemon", "citrus", "energy"],
  },
  {
    id: "a1111111-1111-4111-8111-111111111110",
    name: "Berry Balance",
    goal: "Skin Glow",
    description:
      "Mixed berries with spinach—sweet with a subtle green note.",
    ingredients: ["Blueberries", "Strawberries", "Spinach", "Apple juice base"],
    why_it_may_help:
      "Berries and leafy greens are popular in wellness conversations around antioxidants and variety.",
    caution_note:
      "Naturally sweet—consider dilution or smaller portions if you watch sugar intake. Informational only.",
    tags: ["berry", "spinach", "sweet", "green", "skin glow"],
  },
  {
    id: "a1111111-1111-4111-8111-111111111111",
    name: "Turmeric Dawn",
    goal: "Inflammation Support",
    description:
      "Turmeric and pineapple with black pepper—golden, tropical, and aromatic.",
    ingredients: ["Turmeric", "Pineapple", "Black pepper (pinch)", "Coconut water"],
    why_it_may_help:
      "Turmeric is commonly discussed in wellness contexts; pineapple adds sweetness and drinkability.",
    caution_note:
      "Pineapple is sweet; pepper may not suit everyone—ask for adjustments. Not a treatment. Informational only.",
    tags: ["turmeric", "pineapple", "sweet", "pepper", "inflammation"],
  },
];

export function getRecipeById(id: string): Recipe | undefined {
  return RECIPES.find((r) => r.id === id);
}
