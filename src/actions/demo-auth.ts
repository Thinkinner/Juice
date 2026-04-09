"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_USER_EMAIL, DEMO_USER_ID } from "@/lib/auth/demo-user";
import { DEMO_COOKIE_NAME, isDemoAuthEnabled } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const DEMO_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/** One-click demo: Prisma user + httpOnly cookie (no Supabase). */
export async function enterDemoModeAction() {
  if (!isDemoAuthEnabled()) {
    redirect("/login?error=" + encodeURIComponent("Demo login is disabled"));
  }

  await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    create: {
      id: DEMO_USER_ID,
      email: DEMO_USER_EMAIL,
      name: "Demo creator",
    },
    update: { email: DEMO_USER_EMAIL },
  });

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
