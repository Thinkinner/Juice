import { ClassifierSource } from "@prisma/client";

/** Rule-based fallback when AI disabled or unavailable. */
export function classifyCaptionRules(caption: string) {
  const lower = caption.toLowerCase();
  const topic =
    lower.includes("money") || lower.includes("market")
      ? "finance"
      : lower.includes("ai") || lower.includes("tech")
        ? "tech"
        : "general";

  const hookType = lower.includes("?") ? "question" : lower.includes("stop") ? "bold_claim" : "curiosity";
  const format = lower.includes("reel") ? "reel" : lower.includes("carousel") ? "carousel" : "static";

  return {
    topic,
    subtopic: "auto",
    format,
    tone: "direct",
    emotion: "curiosity",
    hookType,
    ctaType: "comment",
    visualStyle: "text_overlay",
    contentPillar: "education",
    lengthBucket: caption.length > 140 ? "long" : caption.length > 70 ? "medium" : "short",
    tags: ["rule_based"],
    source: ClassifierSource.RULES,
  };
}
