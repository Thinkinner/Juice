"use server";

import { ensureWorkspace, loadPostsWithScores } from "@/services/analytics/analytics.service";
import { requireUserId } from "@/lib/auth/session";

/** Generates copy prompts grounded in top-performing clusters (no external LLM required). */
export async function generateCopyPackAction(topic: string, format: string) {
  const userId = await requireUserId();
  const ws = await ensureWorkspace(userId);
  const { posts } = await loadPostsWithScores(ws.id);
  const top = [...posts].sort((a, b) => b.composite - a.composite).slice(0, 5);

  const hooks = [
    `Stop scrolling — ${topic} in 20 seconds (${format})`,
    `Unpopular opinion: ${topic} (data inside)`,
    `3 signals that ${topic} is shifting`,
    `Why everyone is wrong about ${topic}`,
    `Save this before ${topic} changes again`,
  ];

  const ctas = [
    "Comment your take — agree or disagree?",
    "Save + send to a friend who needs this",
    "Follow for part 2 tomorrow",
  ];

  const caption = `(${format}) ${topic}: pulling language patterns from your top ${top.length} posts by composite score. IDs: ${top.map((p) => p.post.id).join(", ")}.`;

  const reelScript = `Hook (0-2s): pattern interrupt.\nBody (3-25s): 3 bullets tied to ${topic}.\nCTA (26-30s): ${ctas[0]}`;

  const carousel = `Slide 1: headline on ${topic}\nSlides 2-4: proof from your historical winners\nSlide 5: CTA — ${ctas[1]}`;

  return { caption, hooks, ctas, reelScript, carouselOutline: carousel };
}
