"use server";

import { strategistAnswer } from "@/services/ai/ai-strategist.service";
import { ensureWorkspace } from "@/services/analytics/analytics.service";
import { createServerClientSupabase } from "@/lib/supabase/server";

export async function askStrategistAction(question: string) {
  const supabase = await createServerClientSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) throw new Error("Unauthorized");

  const ws = await ensureWorkspace(user.id);
  return strategistAnswer(ws.id, question);
}
