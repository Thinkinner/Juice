/** Default scoring weights (sum should be 1). Tunable in Settings. */
export const DEFAULT_METRIC_WEIGHTS = {
  views: 0.4,
  shareSave: 0.2,
  comments: 0.15,
  engagementRate: 0.15,
  recency: 0.1,
} as const;

export type MetricWeights = {
  views: number;
  shareSave: number;
  comments: number;
  engagementRate: number;
  recency: number;
};
