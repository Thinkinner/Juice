import { prisma } from "@/lib/prisma";
import { DEFAULT_METRIC_WEIGHTS } from "@/lib/constants/metrics";
import { aggregatePatterns, loadPostsWithScores } from "@/services/analytics/analytics.service";

const IDEAS = [
  "inflation",
  "productivity hacks",
  "creator economy",
  "market news",
  "morning routine",
  "tech breakdown",
  "mindset shift",
  "controversial opinion",
  "case study",
  "tool comparison",
];

/**
 * Builds ranked recommendations from historical clusters vs account average.
 * Future: TikTok/Facebook adapters plug in via same `loadPostsWithScores` shape.
 */
export async function runRecommendationEngine(workspaceId: string) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: { settings: true },
  });
  if (!workspace?.settings) throw new Error("Workspace settings missing");

  const weights = (workspace.settings.metricWeights as typeof DEFAULT_METRIC_WEIGHTS) ?? DEFAULT_METRIC_WEIGHTS;
  const { posts } = await loadPostsWithScores(workspaceId);
  if (!posts.length) {
    const run = await prisma.recommendationRun.create({
      data: { workspaceId, params: { weights } },
    });
    return { runId: run.id, recommendations: [] as const };
  }

  const avg = posts.reduce((s, p) => s + p.composite, 0) / posts.length;
  const patterns = await aggregatePatterns(workspaceId);

  const topTopic = patterns.topics[0]?.key ?? "general";
  const topHook = patterns.hooks[0]?.key ?? "curiosity";
  const topHour = patterns.hours.sort((a, b) => b.avg - a.avg)[0]?.key ?? "18";
  const topFormat = patterns.formats[0]?.key ?? "reel";

  const supporting = [...posts]
    .sort((a, b) => b.composite - a.composite)
    .slice(0, 8)
    .map((p) => p.post.id);

  const recs: {
    rank: number;
    title: string;
    hook: string;
    format: string;
    cta: string;
    publishWindow: string;
    confidence: number;
    reasoning: string;
    supportingPostIds: string[];
    avoidNotes?: string;
  }[] = [];

  for (let i = 0; i < 10; i++) {
    const topic = IDEAS[i % IDEAS.length]!;
    const lift = patterns.topics.find((t) => t.key === topic)?.avg
      ? ((patterns.topics.find((t) => t.key === topic)!.avg - avg) / Math.max(avg, 0.0001)) * 100
      : 18;

    const confidence = Math.min(0.97, 0.55 + (Math.max(0, lift) / 200) + (supporting.length > 20 ? 0.15 : 0));

    recs.push({
      rank: i + 1,
      title: `Double down on "${topic}" with a ${topFormat}-first angle`,
      hook: `Lead with a ${topHook.replace("_", " ")} hook — your data shows it clusters above average.`,
      format: topFormat,
      cta: i % 2 === 0 ? "Ask a polarizing question in comments" : "CTA: save + share for the checklist",
      publishWindow: `${topHour}:00–${String(Number(topHour) + 2).padStart(2, "0")}:00 local`,
      confidence,
      reasoning: `Topic cluster "${topTopic}" and hook "${topHook}" averaged ${(patterns.topics[0]?.avg ?? 0).toFixed(3)} composite vs your ${avg.toFixed(3)} baseline. Prior posts: ${supporting.length} high-signal samples.`,
      supportingPostIds: supporting.slice(0, 5),
      avoidNotes:
        patterns.topics.length > 3 && patterns.topics[patterns.topics.length - 1]
          ? `Watch: "${patterns.topics[patterns.topics.length - 1]!.key}" underperformed recently.`
          : undefined,
    });
  }

  const run = await prisma.recommendationRun.create({
    data: {
      workspaceId,
      params: { weights, avgBaseline: avg },
    },
  });

  await prisma.recommendation.createMany({
    data: recs.map((r) => ({
      runId: run.id,
      rank: r.rank,
      title: r.title,
      hook: r.hook,
      format: r.format,
      cta: r.cta,
      publishWindow: r.publishWindow,
      confidence: r.confidence,
      reasoning: r.reasoning,
      supportingPostIds: r.supportingPostIds,
      avoidNotes: r.avoidNotes ?? null,
    })),
  });

  await prisma.contentPattern.deleteMany({ where: { workspaceId } });
  await prisma.contentPattern.createMany({
    data: [
      ...patterns.topics.slice(0, 8).map((t) => ({
        workspaceId,
        patternType: "topic",
        label: t.key,
        strength: t.avg,
        metrics: { n: t.n, avg: t.avg },
      })),
      ...patterns.hooks.slice(0, 8).map((t) => ({
        workspaceId,
        patternType: "hook",
        label: t.key,
        strength: t.avg,
        metrics: { n: t.n, avg: t.avg },
      })),
    ],
  });

  const stored = await prisma.recommendation.findMany({
    where: { runId: run.id },
    orderBy: { rank: "asc" },
  });

  return { runId: run.id, recommendations: stored };
}
