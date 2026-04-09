"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { syncLatestPostsMock } from "@/services/sync/sync.service";
import { ensureWorkspace } from "@/services/analytics/analytics.service";

export async function syncPostsAction() {
  const { requireUserId } = await import("@/lib/auth/session");
  const userId = await requireUserId();
  const ws = await ensureWorkspace(userId);
  const account = await prisma.socialAccount.findFirst({
    where: { workspaceId: ws.id, platform: "INSTAGRAM" },
  });
  if (!account) throw new Error("Connect Instagram (mock) first in Settings");

  await syncLatestPostsMock(account.id);
  revalidatePath("/dashboard", "layout");
}
