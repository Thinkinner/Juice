import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/health — liveness (always safe).
 * GET /api/health?db=1 — checks Prisma/Postgres (use on Vercel to verify DATABASE wiring).
 */
export async function GET(req: Request) {
  const db = new URL(req.url).searchParams.get("db");
  if (db === "1") {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return NextResponse.json({ ok: true, db: "up" });
    } catch {
      return NextResponse.json(
        { ok: false, db: "down", hint: "POSTGRES_PRISMA_URL missing/invalid or DB unreachable" },
        { status: 503 },
      );
    }
  }
  return NextResponse.json({ ok: true });
}
