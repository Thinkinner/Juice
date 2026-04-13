import { NextResponse, type NextRequest } from "next/server";
import { ensureDemoUserInDb } from "@/lib/auth/ensure-demo-user";
import { DEMO_USER_ID } from "@/lib/auth/demo-user";
import { DEMO_COOKIE_NAME, isDemoAuthEnabled } from "@/lib/auth/session";

const MAX_AGE = 60 * 60 * 24 * 30;

/**
 * GET /api/demo-login — sets demo cookie via Set-Cookie on a redirect response.
 * More reliable than server-action POST + redirect in some browsers (demo user only).
 */
export async function GET(request: NextRequest) {
  if (!isDemoAuthEnabled()) {
    return NextResponse.redirect(
      new URL("/login?error=" + encodeURIComponent("Demo login is disabled"), request.url),
    );
  }

  try {
    await ensureDemoUserInDb();
  } catch {
    return NextResponse.redirect(
      new URL(
        "/login?error=" +
          encodeURIComponent(
            "Database unreachable — check POSTGRES_PRISMA_URL on Vercel, redeploy, then npx prisma db push",
          ),
        request.url,
      ),
    );
  }

  const target = new URL("/dashboard/overview", request.url);
  const res = NextResponse.redirect(target);
  res.cookies.set(DEMO_COOKIE_NAME, DEMO_USER_ID, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}

export const dynamic = "force-dynamic";
