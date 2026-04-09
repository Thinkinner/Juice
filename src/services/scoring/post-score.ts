import type { MediaInsight, MediaPost, PostClassification } from "@prisma/client";
import type { MetricWeights } from "@/lib/constants/metrics";

export type PostWithInsight = MediaPost & {
  insights: MediaInsight[];
  classification: PostClassification | null;
};

/** Normalize 0–1 using account maxima (rolling). */
export function normalize(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(1, value / max);
}

/**
 * Composite performance score using workspace weights.
 * shareSave blends saves+shares as "quality" signal vs reach.
 */
export function scorePost(
  post: PostWithInsight,
  weights: MetricWeights,
  maxima: {
    views: number;
    reach: number;
    engagementRate: number;
    shareSaveRate: number;
  },
  now: Date,
): {
  composite: number;
  engagementRate: number;
  saveRate: number;
  commentRate: number;
  likeRate: number;
  velocity: number;
  recencyFactor: number;
} {
  const insight = post.insights[0];
  if (!insight) {
    return {
      composite: 0,
      engagementRate: 0,
      saveRate: 0,
      commentRate: 0,
      likeRate: 0,
      velocity: 0,
      recencyFactor: 0,
    };
  }

  const reach = Math.max(insight.reach, 1);
  const engagement = insight.likes + insight.comments + insight.saves + insight.shares;
  const engagementRate = engagement / reach;
  const saveRate = (insight.saves + insight.shares) / reach;
  const commentRate = insight.comments / reach;
  const likeRate = insight.likes / reach;

  const hoursOld = (now.getTime() - post.publishedAt.getTime()) / 3600000;
  const recencyFactor = Math.exp(-hoursOld / (24 * 14));

  const nViews = normalize(insight.views, maxima.views);
  const nEng = normalize(engagementRate, maxima.engagementRate);
  const nSS = normalize(saveRate, maxima.shareSaveRate);

  const composite =
    weights.views * nViews +
    weights.shareSave * nSS +
    weights.comments * normalize(commentRate, maxima.engagementRate) +
    weights.engagementRate * nEng +
    weights.recency * recencyFactor;

  const velocity = engagement / Math.max(1, hoursOld / 24);

  return {
    composite,
    engagementRate,
    saveRate,
    commentRate,
    likeRate,
    velocity,
    recencyFactor,
  };
}
