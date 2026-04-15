"use server";

import { Platform } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { establishDemoSession } from "@/lib/auth/establish-demo-session";
import { DEMO_USER_ID } from "@/lib/auth/demo-user";
import { prisma } from "@/lib/prisma";
import { isDemoAuthEnabled } from "@/lib/auth/session";
import { replaceMockPostHistory } from "@/services/mock/generate-mock-posts";
import { ensureWorkspace } from "@/services/analytics/analytics.service";
import { runRecommendationEngine } from "@/services/recommendation/recommendation.service";

const HANDLE_RE = /^[a-zA-Z0-9._]{1,30}$/;

const DB_POOLER_HINT =
  "Use Supabase POOLER URI (6543, host contains pooler)—not direct :5432. Set POSTGRES_PRISMA_URL on Vercel, redeploy.";

function normalizeHandle(raw: string) {
  let s = raw.trim();
  const fromUrl = s.match(/instagram\.com\/([^/?#]+)/i);
  if (fromUrl?.[1]) s = fromUrl[1];
  return s.replace(/^@+/, "").toLowerCase();
}

/**
 * Demo path: set session, bind mock IG account to the handle, generate full-history mock posts + recommendations.
 */
export async function analyzeInstagramHandleAction(formData: FormData) {
  if (!isDemoAuthEnabled()) {
    redirect("/?error=" + encodeURIComponent("Demo mode is disabled."));
  }

  const raw = String(formData.get("handle") || "");
  const handle = normalizeHandle(raw);
  if (!handle || !HANDLE_RE.test(handle)) {
    redirect("/?error=" + encodeURIComponent("Enter a valid Instagram username (letters, numbers, . and _)."));
  }

  try {
    await establishDemoSession();
  } catch {
    redirect("/?error=" + encodeURIComponent(DB_POOLER_HINT));
  }

  const ws = await ensureWorkspace(DEMO_USER_ID);

  const existing = await prisma.socialAccount.findFirst({
    where: { workspaceId: ws.id, platform: Platform.INSTAGRAM },
  });

  const account = existing
    ? await prisma.socialAccount.update({
        where: { id: existing.id },
        data: {
          username: handle,
          displayName: `${handle} (mock)`,
          externalUserId: `mock_ig_${handle}`,
        },
      })
    : await prisma.socialAccount.create({
        data: {
          workspaceId: ws.id,
          platform: Platform.INSTAGRAM,
          externalUserId: `mock_ig_${handle}`,
          username: handle,
          displayName: `${handle} (mock)`,
          isMock: true,
        },
      });

  await replaceMockPostHistory(prisma, account.id, handle);
  await runRecommendationEngine(ws.id);

  revalidatePath("/", "layout");
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/overview");
}
