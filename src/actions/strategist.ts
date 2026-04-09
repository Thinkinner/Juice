"use server";

import { strategistAnswer } from "@/services/ai/ai-strategist.service";
import { ensureWorkspace } from "@/services/analytics/analytics.service";
import { requireUserId } from "@/lib/auth/session";

export async function askStrategistAction(question: string) {
  const userId = await requireUserId();
  const ws = await ensureWorkspace(userId);
  return strategistAnswer(ws.id, question);
}
