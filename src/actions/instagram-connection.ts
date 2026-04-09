"use server";

import { Platform } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ensureWorkspace } from "@/services/analytics/analytics.service";
import { requireUserId } from "@/lib/auth/session";

/** Creates a mock Instagram professional account row for demos (no Meta token). */
export async function connectMockInstagramAction() {
  const userId = await requireUserId();
  const ws = await ensureWorkspace(userId);

  const existing = await prisma.socialAccount.findFirst({
    where: { workspaceId: ws.id, platform: Platform.INSTAGRAM },
  });
  if (existing) {
    return;
  }

  await prisma.socialAccount.create({
    data: {
      workspaceId: ws.id,
      platform: Platform.INSTAGRAM,
      externalUserId: `mock_${userId.slice(0, 8)}`,
      username: "your_brand (mock)",
      displayName: "Mock IG Professional",
      isMock: true,
    },
  });

  revalidatePath("/dashboard/settings");
}
