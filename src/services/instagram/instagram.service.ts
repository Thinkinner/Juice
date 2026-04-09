/**
 * Instagram Graph API facade.
 * TODO: Implement with long-lived token + ig-user-id when Meta app approved.
 * Never import this from client components.
 */
import type { IgInsightDTO, IgMediaDTO } from "./instagram.types";

export async function fetchMediaPage(): Promise<IgMediaDTO[]> {
  throw new Error("Live Instagram fetch not wired — use mock sync or connect Meta app.");
}

export async function fetchMediaInsights(): Promise<IgInsightDTO | null> {
  return null;
}
