import { prisma } from "@/lib/prisma";
import { SyncStatus } from "@prisma/client";

/**
 * Mock sync — generates synthetic insight snapshots for demo.
 * Replace with instagram.syncLatestPosts() when Meta credentials exist.
 *
 * Future: webhook ingestion, TikTok adapter, cron daily.
 */
export async function syncLatestPostsMock(socialAccountId: string) {
  const log = await prisma.syncLog.create({
    data: {
      socialAccountId,
      status: SyncStatus.RUNNING,
      message: "Mock sync started",
    },
  });

  try {
    const account = await prisma.socialAccount.findUnique({
      where: { id: socialAccountId },
    });
    if (!account?.isMock) {
      throw new Error("Live Instagram sync not configured — enable mock account or connect Meta app.");
    }

    const posts = await prisma.mediaPost.findMany({
      where: { socialAccountId },
      include: { insights: { take: 1, orderBy: { snapshotAt: "desc" } } },
    });

    let n = 0;
    for (const post of posts) {
      const last = post.insights[0];
      const jitter = () => 0.95 + Math.random() * 0.1;
      await prisma.mediaInsight.create({
        data: {
          mediaPostId: post.id,
          likes: Math.floor((last?.likes ?? 100) * jitter()),
          comments: Math.floor((last?.comments ?? 10) * jitter()),
          shares: Math.floor((last?.shares ?? 5) * jitter()),
          saves: Math.floor((last?.saves ?? 20) * jitter()),
          reach: Math.floor((last?.reach ?? 5000) * jitter()),
          views: Math.floor((last?.views ?? 8000) * jitter()),
          impressions: Math.floor((last?.impressions ?? 6000) * jitter()),
        },
      });
      n++;
    }

    await prisma.socialAccount.update({
      where: { id: socialAccountId },
      data: { lastSyncedAt: new Date() },
    });

    await prisma.syncLog.update({
      where: { id: log.id },
      data: {
        status: SyncStatus.SUCCESS,
        finishedAt: new Date(),
        postsSynced: n,
        message: `Mock sync: ${n} posts refreshed`,
      },
    });

    return { ok: true as const, postsSynced: n };
  } catch (e) {
    await prisma.syncLog.update({
      where: { id: log.id },
      data: {
        status: SyncStatus.FAILED,
        finishedAt: new Date(),
        message: e instanceof Error ? e.message : "Sync failed",
      },
    });
    throw e;
  }
}
