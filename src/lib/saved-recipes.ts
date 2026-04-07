"use client";

import type { Recipe } from "@/lib/types";
import { getRecipeById } from "@/data/recipes";

const SAVED_KEY = "juice-finder-saved-v1";

export function getSavedRecipeIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function isRecipeSaved(id: string): boolean {
  return getSavedRecipeIds().includes(id);
}

export function toggleSavedRecipe(id: string): boolean {
  if (typeof window === "undefined") return false;
  const cur = getSavedRecipeIds();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  return next.includes(id);
}

export function getSavedRecipes(): Recipe[] {
  return getSavedRecipeIds()
    .map((id) => getRecipeById(id))
    .filter((r): r is Recipe => Boolean(r));
}
