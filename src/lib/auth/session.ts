import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ensureDemoUserInDb } from "@/lib/auth/ensure-demo-user";
import { DEMO_USER_EMAIL, DEMO_USER_ID } from "@/lib/auth/demo-user";
import { ensureWorkspace } from "@/services/analytics/analytics.service";
import { prisma } from "@/lib/prisma";
import { createServerClientSupabase, isSupabaseConfigured } from "@/lib/supabase/server";

export { DEMO_USER_EMAIL, DEMO_USER_ID } from "@/lib/auth/demo-user";

export const DEMO_COOKIE_NAME = "igbrain_demo_uid";

export function isDemoAuthEnabled() {
  return process.env.DEMO_AUTH_ENABLED !== "false";
}

/**
 * Supabase session OR httpOnly demo cookie (only accepts the known demo user id).
 * Demo path never calls Supabase — avoids crashes when Supabase env is unset (demo-only deploys).
 */
export async function getAppUserId(): Promise<string | null> {
  if (isDemoAuthEnabled()) {
    const cookieStore = await cookies();
    const raw = cookieStore.get(DEMO_COOKIE_NAME)?.value;
    if (raw === DEMO_USER_ID) {
      try {
        const user = await ensureDemoUserInDb();
        return user.id;
      } catch {
        redirect(
          "/login?error=" +
            encodeURIComponent(
              "Database unreachable — set POSTGRES_PRISMA_URL on Vercel, redeploy, then npx prisma db push",
            ),
        );
      }
    }
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerClientSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function getAppUserEmail(): Promise<string | null> {
  const id = await getAppUserId();
  if (!id) return null;
  const row = await prisma.user.findUnique({ where: { id }, select: { email: true } });
  return row?.email ?? null;
}

/** Use in dashboard routes after layout ensures a session exists. */
export async function getDashboardWorkspace() {
  const userId = await getAppUserId();
  if (!userId) return null;
  return ensureWorkspace(userId);
}

export async function requireUserId(): Promise<string> {
  const id = await getAppUserId();
  if (!id) throw new Error("Unauthorized");
  return id;
}
