import { runRecommendationsAction } from "@/actions/recommendations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { getDashboardWorkspace } from "@/lib/auth/session";
import { CopyPackButton } from "@/components/dashboard/copy-pack-button";

export default async function RecommendationsPage() {
  const ws = await getDashboardWorkspace();
  if (!ws) return null;

  const lastRun = await prisma.recommendationRun.findFirst({
    where: { workspaceId: ws.id },
    orderBy: { runAt: "desc" },
    include: { recommendations: { orderBy: { rank: "asc" } } },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">What to post next</h1>
          <p className="text-sm text-muted-foreground">
            Ranked ideas from winning clusters vs your baseline. Regenerate after changing weights or
            adding posts.
          </p>
        </div>
        <form action={runRecommendationsAction}>
          <Button type="submit">Regenerate recommendations</Button>
        </form>
      </div>

      {!lastRun?.recommendations.length && (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No recommendations yet — seed the database and click regenerate, or open Settings → sync mock
            data.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {lastRun?.recommendations.map((r) => (
          <Card key={r.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">#{r.rank}</Badge>
                  <CardTitle className="text-lg">{r.title}</CardTitle>
                </div>
                <CardDescription className="mt-2">
                  Confidence {(r.confidence * 100).toFixed(0)}% · Window {r.publishWindow}
                </CardDescription>
              </div>
              <CopyPackButton topic={r.title} format={r.format} />
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-foreground">Hook: </span>
                {r.hook}
              </p>
              <p>
                <span className="font-medium text-foreground">Format: </span>
                {r.format} · <span className="font-medium">CTA: </span>
                {r.cta}
              </p>
              <p className="text-muted-foreground">{r.reasoning}</p>
              {r.avoidNotes && (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 p-2 text-destructive">
                  Avoid: {r.avoidNotes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
