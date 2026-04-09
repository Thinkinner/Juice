import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncLatestPostsMock } from "@/services/sync/sync.service";

/**
 * Daily sync endpoint — protect with CRON_SECRET.
 * Vercel Cron: add header Authorization: Bearer $CRON_SECRET
 *
 * Future: webhook ingestion, per-workspace queues, TikTok jobs.
 */
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accounts = await prisma.socialAccount.findMany({
    where: { isMock: true },
  });

  let total = 0;
  for (const a of accounts) {
    await syncLatestPostsMock(a.id);
    total++;
  }

  return NextResponse.json({ ok: true, accounts: total });
}
