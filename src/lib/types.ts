export const WELLNESS_GOALS = [
  "Digestion",
  "Bloating",
  "Energy",
  "Hydration",
  "Skin Glow",
  "Inflammation Support",
] as const;

export type WellnessGoal = (typeof WELLNESS_GOALS)[number];

export const SENSITIVITY_OPTIONS = [
  "Acid reflux",
  "Diabetes / blood sugar concerns",
  "IBS / sensitive stomach",
  "Citrus sensitivity",
  "None",
] as const;

export type SensitivityOption = (typeof SENSITIVITY_OPTIONS)[number];

export const FLAVOR_OPTIONS = [
  "Sweet",
  "Green",
  "Refreshing",
  "Spicy",
  "No preference",
] as const;

export type FlavorPreference = (typeof FLAVOR_OPTIONS)[number];

export interface Recipe {
  id: string;
  name: string;
  goal: WellnessGoal;
  description: string;
  ingredients: string[];
  why_it_may_help: string;
  caution_note: string;
  image_url?: string | null;
  /** Lower-level tags for matching (ginger, citrus, sweet, etc.) */
  tags: string[];
}

export interface JuiceSpot {
  id: string;
  name: string;
  zip_code: string;
  city: string;
  state: string;
  rating: number;
  distance_miles: number;
  is_open: boolean;
}

export interface QuizAnswers {
  goal: WellnessGoal;
  sensitivities: SensitivityOption[];
  flavor: FlavorPreference;
  zip: string;
  email?: string;
}

export interface UnlockedSession {
  goal: WellnessGoal;
  sensitivities: SensitivityOption[];
  flavor: FlavorPreference;
  zip: string;
  email: string;
  recipeIds: string[];
  unlockedAt: string;
}
