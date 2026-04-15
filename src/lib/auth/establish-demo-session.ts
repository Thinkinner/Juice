import { cookies } from "next/headers";
import { ensureDemoUserInDb } from "@/lib/auth/ensure-demo-user";
import { DEMO_USER_ID } from "@/lib/auth/demo-user";
import { DEMO_COOKIE_NAME } from "@/lib/auth/session";

const DEMO_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/** Prisma demo user row + httpOnly session cookie (no Supabase). */
export async function establishDemoSession() {
  await ensureDemoUserInDb();
  const cookieStore = await cookies();
  cookieStore.set(DEMO_COOKIE_NAME, DEMO_USER_ID, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DEMO_COOKIE_MAX_AGE,
  });
}
