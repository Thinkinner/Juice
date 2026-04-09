"use server";

import { revalidatePath } from "next/cache";
import { runRecommendationEngine } from "@/services/recommendation/recommendation.service";
import { ensureWorkspace } from "@/services/analytics/analytics.service";
import { createServerClientSupabase } from "@/lib/supabase/server";

export async function runRecommendationsAction() {
  const supabase = await createServerClientSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) throw new Error("Unauthorized");

  const ws = await ensureWorkspace(user.id);
  await runRecommendationEngine(ws.id);
  revalidatePath("/dashboard/next");
}
