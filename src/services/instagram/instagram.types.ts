/** Instagram Graph API shapes (subset) — expand when wiring live tokens. */

export type IgMediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";

export interface IgMediaDTO {
  id: string;
  caption?: string;
  media_type: IgMediaType;
  permalink: string;
  media_url?: string;
  thumbnail_url?: string;
  timestamp: string;
}

export interface IgInsightDTO {
  likes: number;
  comments: number;
  reach: number;
  impressions?: number;
  saved?: number;
  shares?: number;
  video_views?: number;
}
