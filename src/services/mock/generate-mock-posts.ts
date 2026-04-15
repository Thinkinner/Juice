import { ClassifierSource, MediaType, PrismaClient, SyncStatus } from "@prisma/client";
import { createHash } from "crypto";

const TOPICS = [
  "finance",
  "productivity",
  "fitness",
  "tech",
  "news",
  "lifestyle",
  "marketing",
  "mindset",
];
const HOOKS = [
  "question",
  "bold_claim",
  "story",
  "contrarian",
  "listicle",
  "fear",
  "curiosity",
  "social_proof",
  "pattern_interrupt",
];
const FORMATS = ["reel", "carousel", "static", "talking_head", "b_roll"];
const TONES = ["direct", "warm", "provocative", "analytical", "humorous"];
const EMOTIONS = ["hope", "anger", "curiosity", "fear", "joy", "trust"];
const CTAS = ["comment", "save", "share", "follow", "link_in_bio", "dm"];
const VISUAL = ["face_forward", "text_overlay", "screenshot", "headline_card", "b_roll"];
const PILLARS = ["education", "entertainment", "promotion", "community"];
const TAG_POOLS = [
  ["educational", "listicle"],
  ["opinion", "news"],
  ["meme", "entertainment"],
  ["curiosity", "hook_heavy"],
  ["social_proof", "case_study"],
  ["outrage", "contrarian"],
];

function rnd(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(rnd(seed) * arr.length)]!;
}

/** Replace all posts for a mock IG account with ~`count` synthetic posts (historical spread). */
export async function replaceMockPostHistory(
  prisma: PrismaClient,
  socialAccountId: string,
  igHandle: string,
  count = 100,
) {
  await prisma.mediaPost.deleteMany({ where: { socialAccountId } });

  const now = Date.now();
  const safeHandle = igHandle.replace(/[^a-zA-Z0-9._]/g, "").slice(0, 30) || "profile";

  for (let i = 0; i < count; i++) {
    const seed = i * 9973;
    const daysAgo = Math.floor(rnd(seed) * 400);
    const publishedAt = new Date(now - daysAgo * 86400000 - Math.floor(rnd(seed + 1) * 3600000));
    const topic = pick(TOPICS, seed + 2);
    const hook = pick(HOOKS, seed + 3);
    const format = pick(FORMATS, seed + 4);
    const mediaType =
      format === "reel" || rnd(seed + 5) > 0.55
        ? rnd(seed + 6) > 0.4
          ? MediaType.REELS
          : MediaType.VIDEO
        : rnd(seed + 7) > 0.5
          ? MediaType.CAROUSEL_ALBUM
          : MediaType.IMAGE;

    const baseViews = 2000 + Math.floor(rnd(seed + 8) * 80000 * (hook === "curiosity" ? 1.3 : 1));
    const erBoost = topic === "finance" && format === "reel" ? 1.35 : topic === "news" ? 0.85 : 1;
    const views = Math.floor(baseViews * erBoost * (0.7 + rnd(seed + 9) * 0.6));
    const likes = Math.floor(views * (0.02 + rnd(seed + 10) * 0.08));
    const comments = Math.floor(likes * (0.05 + rnd(seed + 11) * 0.25));
    const saves = Math.floor(likes * (0.08 + rnd(seed + 12) * 0.35));
    const shares = Math.floor(likes * (0.02 + rnd(seed + 13) * 0.12));
    const reach = Math.floor(views * (0.85 + rnd(seed + 14) * 0.25));

    const caption = `@${safeHandle} · ${hook.replace("_", " ")} on ${topic} — ${format}. Mock historical performance data for IG Brain.`;
    const extId = `mock_${safeHandle}_${i}_${createHash("md5").update(`${i}-${socialAccountId}`).digest("hex").slice(0, 12)}`;

    await prisma.mediaPost.create({
      data: {
        socialAccountId,
        externalMediaId: extId,
        caption,
        mediaType,
        permalink: `https://instagram.com/p/${extId}/`,
        publishedAt,
        insights: {
          create: {
            likes,
            comments,
            shares,
            saves,
            reach,
            views,
            impressions: reach,
          },
        },
        classification: {
          create: {
            topic,
            subtopic: pick(["macro", "micro", "tools", "mindset"], seed),
            format,
            tone: pick(TONES, seed + 20),
            emotion: pick(EMOTIONS, seed + 21),
            hookType: hook,
            ctaType: pick(CTAS, seed + 22),
            visualStyle: pick(VISUAL, seed + 23),
            contentPillar: pick(PILLARS, seed + 24),
            lengthBucket: caption.length > 120 ? "long" : caption.length > 60 ? "medium" : "short",
            tags: pick(TAG_POOLS, seed + 25),
            hasFaceLikely: format === "talking_head" || rnd(seed) > 0.55,
            textHeavyVisual: rnd(seed + 26) > 0.62,
            source: rnd(seed + 27) > 0.85 ? ClassifierSource.AI : ClassifierSource.RULES,
            modelVersion: "rules-v1",
          },
        },
      },
    });
  }

  await prisma.syncLog.create({
    data: {
      socialAccountId,
      status: SyncStatus.SUCCESS,
      message: `Mock full-history analysis for @${safeHandle}`,
      postsSynced: count,
      finishedAt: new Date(),
    },
  });

  await prisma.socialAccount.update({
    where: { id: socialAccountId },
    data: { lastSyncedAt: new Date() },
  });

  return { count, handle: safeHandle };
}
