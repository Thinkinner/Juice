"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ensureWorkspace } from "@/services/analytics/analytics.service";
import { requireUserId } from "@/lib/auth/session";

const weightsSchema = z.object({
  views: z.number().min(0).max(1),
  shareSave: z.number().min(0).max(1),
  comments: z.number().min(0).max(1),
  engagementRate: z.number().min(0).max(1),
  recency: z.number().min(0).max(1),
});

export async function updateMetricWeightsAction(formData: FormData) {
  const userId = await requireUserId();
  const ws = await ensureWorkspace(userId);
  const raw = {
    views: Number(formData.get("views")),
    shareSave: Number(formData.get("shareSave")),
    comments: Number(formData.get("comments")),
    engagementRate: Number(formData.get("engagementRate")),
    recency: Number(formData.get("recency")),
  };
  const parsed = weightsSchema.safeParse(raw);
  if (!parsed.success) {
    redirect("/dashboard/settings?error=" + encodeURIComponent("Invalid weights"));
  }

  const sum =
    parsed.data.views +
    parsed.data.shareSave +
    parsed.data.comments +
    parsed.data.engagementRate +
    parsed.data.recency;
  if (Math.abs(sum - 1) > 0.02) {
    redirect("/dashboard/settings?error=" + encodeURIComponent("Weights must sum to 1.0"));
  }

  await prisma.workspaceSettings.update({
    where: { workspaceId: ws.id },
    data: { metricWeights: parsed.data },
  });

  revalidatePath("/dashboard/settings");
  redirect("/dashboard/settings?saved=1");
}

export async function updateFlagsAction(formData: FormData) {
  const userId = await requireUserId();
  const ws = await ensureWorkspace(userId);
  const mockMode = formData.has("mockMode");
  const aiClassifier = formData.has("aiClassifier");

  await prisma.workspaceSettings.update({
    where: { workspaceId: ws.id },
    data: { mockMode, aiClassifierEnabled: aiClassifier },
  });

  revalidatePath("/dashboard/settings");
  redirect("/dashboard/settings?saved=1");
}
