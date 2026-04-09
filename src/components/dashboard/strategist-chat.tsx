"use client";

import { useState } from "react";
import { askStrategistAction } from "@/actions/strategist";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const SUGGESTIONS = [
  "What should I post today?",
  "Why are my reels falling off?",
  "What hook is working best this week?",
  "Give me 20 post ideas based on my top performers.",
];

export function StrategistChat() {
  const [q, setQ] = useState(SUGGESTIONS[0]!);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      const res = await askStrategistAction(q);
      setAnswer(res.answer);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ask (grounded in your data)</CardTitle>
        <CardDescription>
          Answers reference post IDs and aggregates only — no invented metrics.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <Button key={s} type="button" variant="outline" size="sm" onClick={() => setQ(s)}>
              {s}
            </Button>
          ))}
        </div>
        <Textarea value={q} onChange={(e) => setQ(e.target.value)} rows={3} />
        <Button type="button" onClick={submit} disabled={loading}>
          {loading ? "Thinking…" : "Ask strategist"}
        </Button>
        {answer && (
          <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm whitespace-pre-wrap">
            {answer}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
