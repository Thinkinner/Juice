import { prisma } from "@/lib/prisma";
import { loadPostsWithScores, aggregatePatterns } from "@/services/analytics/analytics.service";

/**
 * Grounded strategist: only uses DB analytics (no hallucinated metrics).
 *
 * BONUS / future: plug OpenAI with `OPENAI_API_KEY` — pass `facts` JSON only, never raw tokens.
 */
export async function strategistAnswer(workspaceId: string, question: string) {
  const { posts } = await loadPostsWithScores(workspaceId);
  const patterns = await aggregatePatterns(workspaceId);

  const facts = {
    postCount: posts.length,
    topTopics: patterns.topics.slice(0, 5),
    topHooks: patterns.hooks.slice(0, 5),
    bestHours: patterns.hours.slice(0, 5),
    topFormats: patterns.formats.slice(0, 5),
    topPosts: [...posts]
      .sort((a, b) => b.composite - a.composite)
      .slice(0, 5)
      .map((p) => ({
        id: p.post.id,
        excerpt: p.post.caption.slice(0, 120),
        score: p.composite,
        topic: p.post.classification?.topic,
        hook: p.post.classification?.hookType,
      })),
    bottomPosts: [...posts]
      .sort((a, b) => a.composite - b.composite)
      .slice(0, 5)
      .map((p) => ({
        id: p.post.id,
        excerpt: p.post.caption.slice(0, 120),
        score: p.composite,
      })),
  };

  const key = question.toLowerCase();
  let answer =
    "Here’s what your stored performance data supports (informational, not guarantees):\n\n";

  if (key.includes("hook")) {
    answer += `Best hook clusters by composite: ${facts.topHooks.map((h) => `${h.key} (${h.avg.toFixed(3)})`).join(", ") || "insufficient data"}.\n`;
  }
  if (key.includes("reel") || key.includes("falling")) {
    const reelScores = posts.filter(
      (p) => p.post.mediaType === "REELS" || p.post.classification?.format === "reel",
    );
    const avgReel =
      reelScores.length > 0 ? reelScores.reduce((s, p) => s + p.composite, 0) / reelScores.length : 0;
    answer += `Reel-like posts analyzed: ${reelScores.length}. Average composite: ${avgReel.toFixed(3)} vs overall ${(posts.reduce((s, p) => s + p.composite, 0) / Math.max(posts.length, 1)).toFixed(3)}.\n`;
  }
  if (key.includes("today") || key.includes("post")) {
    const h = facts.bestHours[0]?.key ?? "18";
    answer += `Highest-scoring publish hour bucket in dataset: ${h}:00 (based on historical composites).\n`;
  }
  if (key.includes("idea")) {
    answer += `Top topics to riff on: ${facts.topTopics.map((t) => t.key).join(", ")}.\n`;
  }

  answer += `\nSupporting top posts (IDs): ${facts.topPosts.map((p) => p.id).join(", ")}.\n`;
  answer += `Weakest recent signals (IDs): ${facts.bottomPosts.map((p) => p.id).join(", ")}.\n`;

  await prisma.aiSummary.create({
    data: {
      workspaceId,
      scope: "strategist",
      content: answer,
      metadata: { question, groundedFacts: facts },
    },
  });

  return { answer, facts, source: "rules" as const };
}
