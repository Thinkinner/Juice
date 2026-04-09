"use client";

import { useState } from "react";
import { generateCopyPackAction } from "@/actions/copy-helper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CopyPackButton({ topic, format }: { topic: string; format: string }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const pack = await generateCopyPackAction(topic, format);
      setText(
        [
          `CAPTION:\n${pack.caption}`,
          `\nHOOKS:\n${pack.hooks.join("\n")}`,
          `\nCTAS:\n${pack.ctas.join("\n")}`,
          `\nREEL SCRIPT:\n${pack.reelScript}`,
          `\nCAROUSEL:\n${pack.carouselOutline}`,
        ].join("\n"),
      );
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button type="button" variant="secondary" size="sm" onClick={run} disabled={loading}>
        {loading ? "…" : "Copy pack"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Grounded copy pack</DialogTitle>
            <DialogDescription>
              Pulled from your analytics context (hooks/CTAs are templates referencing top posts).
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] rounded-md border border-border p-3">
            <pre className="whitespace-pre-wrap text-xs">{text}</pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
