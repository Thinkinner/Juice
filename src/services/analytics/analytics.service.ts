import { prisma } from "@/lib/prisma";
import { DEFAULT_METRIC_WEIGHTS } from "@/lib/constants/metrics";
import { scorePost, type PostWithInsight } from "@/services/scoring/post-score";

export async function getWorkspaceForUser(userId: string) {
  const membership = await prisma.workspaceMember.findFirst({
    where: { userId },
    include: {
      workspace: {
        include: {
          settings: true,
          socialAccounts: true,
        },
      },
    },
  });
  return membership?.workspace ?? null;
}

export async function ensureWorkspace(userId: string) {
  const existing = await getWorkspaceForUser(userId);
  if (existing) return existing;

  const slug = `ws-${userId.slice(0, 8)}`;
  return prisma.workspace.create({
    data: {
      name: "My Workspace",
      slug,
      ownerId: userId,
      members: { create: { userId, role: "owner" } },
      settings: {
        create: {
          mockMode: true,
          aiClassifierEnabled: true,
          metricWeights: { ...DEFAULT_METRIC_WEIGHTS },
          timezone: "America/New_York",
        },
      },
    },
    include: {
      settings: true,
      socialAccounts: true,
    },
  });
}

export async function loadPostsWithScores(workspaceId: string) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: { settings: true },
  });
  if (!workspace?.settings) return { posts: [], weights: DEFAULT_METRIC_WEIGHTS };

  const weights = {
    ...DEFAULT_METRIC_WEIGHTS,
    ...(workspace.settings.metricWeights as Record<string, number>),
  } as typeof DEFAULT_METRIC_WEIGHTS;

  const account = await prisma.socialAccount.findFirst({
    where: { workspaceId, platform: "INSTAGRAM" },
  });
  if (!account) return { posts: [], weights };

  const posts = (await prisma.mediaPost.findMany({
    where: { socialAccountId: account.id },
    include: {
      insights: { orderBy: { snapshotAt: "desc" }, take: 1 },
      classification: true,
    },
    orderBy: { publishedAt: "desc" },
  })) as PostWithInsight[];

  const now = new Date();
  const insights = posts.map((p) => p.insights[0]).filter(Boolean);
  const maxima = {
    views: Math.max(1, ...insights.map((i) => i!.views)),
    reach: Math.max(1, ...insights.map((i) => i!.reach)),
    engagementRate: Math.max(
      0.0001,
      ...insights.map((i) => {
        const e = i!.likes + i!.comments + i!.saves + i!.shares;
        return e / Math.max(i!.reach, 1);
      }),
    ),
    shareSaveRate: Math.max(
      0.0001,
      ...insights.map((i) => (i!.saves + i!.shares) / Math.max(i!.reach, 1)),
    ),
  };

  const scored = posts.map((p) => ({
    post: p,
    ...scorePost(p, weights, maxima, now),
  }));

  return { posts: scored, weights };
}

export async function aggregatePatterns(workspaceId: string) {
  const { posts } = await loadPostsWithScores(workspaceId);
  if (!posts.length) return { topics: [], hooks: [], hours: [], formats: [] };

  const byTopic = groupBy(posts, (x) => x.post.classification?.topic ?? "unknown");
  const byHook = groupBy(posts, (x) => x.post.classification?.hookType ?? "unknown");
  const byHour = groupBy(posts, (x) => String(x.post.publishedAt.getHours()));
  const byFormat = groupBy(posts, (x) => x.post.classification?.format ?? "unknown");

  return {
    topics: summarize(byTopic),
    hooks: summarize(byHook),
    hours: summarize(byHour),
    formats: summarize(byFormat),
  };
}

function groupBy<T>(arr: T[], key: (t: T) => string) {
  const m = new Map<string, T[]>();
  for (const x of arr) {
    const k = key(x);
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(x);
  }
  return m;
}

function summarize(map: Map<string, { composite: number }[]>) {
  return [...map.entries()]
    .map(([key, rows]) => ({
      key,
      avg: rows.reduce((s, r) => s + r.composite, 0) / rows.length,
      n: rows.length,
    }))
    .sort((a, b) => b.avg - a.avg);
}

export type OverviewStats = {
  lastSync: Date | null;
  totalPosts: number;
  topWinners: { id: string; caption: string; composite: number }[];
  bottomLosers: { id: string; caption: string; composite: number }[];
  trend: { date: string; avgScore: number }[];
};

export async function getOverview(workspaceId: string): Promise<OverviewStats> {
  const account = await prisma.socialAccount.findFirst({
    where: { workspaceId, platform: "INSTAGRAM" },
  });
  const { posts } = await loadPostsWithScores(workspaceId);
  const sorted = [...posts].sort((a, b) => b.composite - a.composite);
  const top = sorted.slice(0, 5).map((x) => ({
    id: x.post.id,
    caption: x.post.caption.slice(0, 80),
    composite: x.composite,
  }));
  const bottom = sorted.slice(-5).reverse().map((x) => ({
    id: x.post.id,
    caption: x.post.caption.slice(0, 80),
    composite: x.composite,
  }));

  const byDay = new Map<string, number[]>();
  for (const row of posts) {
    const d = row.post.publishedAt.toISOString().slice(0, 10);
    if (!byDay.has(d)) byDay.set(d, []);
    byDay.get(d)!.push(row.composite);
  }
  const trend = [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30)
    .map(([date, vals]) => ({
      date,
      avgScore: vals.reduce((a, b) => a + b, 0) / vals.length,
    }));

  return {
    lastSync: account?.lastSyncedAt ?? null,
    totalPosts: posts.length,
    topWinners: top,
    bottomLosers: bottom,
    trend,
  };
}
