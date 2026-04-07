"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import type { UnlockedSession } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export function ShareCard({ session }: { session: UnlockedSession }) {
  const [copied, setCopied] = useState(false);
  const summary = `My Juice Plan — ${session.goal}. Ideas from Juice Finder (informational wellness only).`;

  async function handleShare() {
    const payload = {
      title: "My Juice Plan",
      text: summary,
      url: typeof window !== "undefined" ? window.location.origin + "/results" : "",
    };
    if (navigator.share) {
      try {
        await navigator.share(payload);
      } catch {
        /* dismissed */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${summary}\n${payload.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="rounded-3xl border border-stone-200 bg-gradient-to-br from-white to-emerald-50/40 p-5 shadow-inner">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
          <Share2 className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-stone-900">My Juice Plan</p>
          <p className="mt-1 text-sm text-stone-600">{summary}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          type="button"
          variant="primary"
          fullWidth
          className="!flex !py-3 !items-center !justify-center gap-2"
          onClick={handleShare}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 shrink-0" />
              Copied link
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 shrink-0" />
              Share
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="!px-4"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(`${summary}\n${window.location.origin}/results`);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {
              /* ignore */
            }
          }}
          aria-label="Copy summary"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
