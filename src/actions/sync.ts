"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { syncLatestPostsMock } from "@/services/sync/sync.service";
import { ensureWorkspace } from "@/services/analytics/analytics.service";

export async function syncPostsAction() {
  const { createServerClientSupabase } = await import("@/lib/supabase/server");
  const supabase = await createServerClientSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) throw new Error("Unauthorized");

  const ws = await ensureWorkspace(user.id);
  const account = await prisma.socialAccount.findFirst({
    where: { workspaceId: ws.id, platform: "INSTAGRAM" },
  });
  if (!account) throw new Error("Connect Instagram (mock) first in Settings");

  await syncLatestPostsMock(account.id);
  revalidatePath("/dashboard");
}
