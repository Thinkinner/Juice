"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ensureDemoUserInDb } from "@/lib/auth/ensure-demo-user";
import { DEMO_USER_ID } from "@/lib/auth/demo-user";
import { DEMO_COOKIE_NAME, isDemoAuthEnabled } from "@/lib/auth/session";

const DEMO_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/** One-click demo: Prisma user + httpOnly cookie (no Supabase). */
export async function enterDemoModeAction() {
  if (!isDemoAuthEnabled()) {
    redirect("/login?error=" + encodeURIComponent("Demo login is disabled"));
  }

  try {
    await ensureDemoUserInDb();
  } catch {
    redirect(
      "/login?error=" +
        encodeURIComponent(
          "Database unreachable. On Vercel set POSTGRES_PRISMA_URL (Supabase pooler), redeploy, then run: npx prisma db push",
        ),
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(DEMO_COOKIE_NAME, DEMO_USER_ID, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DEMO_COOKIE_MAX_AGE,
  });

  revalidatePath("/", "layout");
  redirect("/dashboard/overview");
}
