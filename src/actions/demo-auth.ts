"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { establishDemoSession } from "@/lib/auth/establish-demo-session";
import { isDemoAuthEnabled } from "@/lib/auth/session";

const DB_POOLER_HINT =
  "Use Supabase POOLER URI (6543, host contains pooler)—not direct :5432. Set POSTGRES_PRISMA_URL on Vercel, redeploy.";

/** One-click demo: Prisma user + httpOnly cookie (no Supabase). */
export async function enterDemoModeAction() {
  if (!isDemoAuthEnabled()) {
    redirect("/login?error=" + encodeURIComponent("Demo login is disabled"));
  }

  try {
    await establishDemoSession();
  } catch {
    redirect("/login?error=" + encodeURIComponent(DB_POOLER_HINT));
  }

  revalidatePath("/", "layout");
  redirect("/dashboard/overview");
}
