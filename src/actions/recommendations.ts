"use server";

import { revalidatePath } from "next/cache";
import { runRecommendationEngine } from "@/services/recommendation/recommendation.service";
import { ensureWorkspace } from "@/services/analytics/analytics.service";
import { requireUserId } from "@/lib/auth/session";

export async function runRecommendationsAction() {
  const userId = await requireUserId();
  const ws = await ensureWorkspace(userId);
  await runRecommendationEngine(ws.id);
  revalidatePath("/dashboard/recommendations");
}
