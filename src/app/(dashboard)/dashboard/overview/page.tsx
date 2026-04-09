import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardWorkspace } from "@/lib/auth/session";
import { getOverview } from "@/services/analytics/analytics.service";
import { TrendChart } from "@/components/charts/trend-chart";
import { formatDistanceToNow } from "date-fns";

export default async function OverviewPage() {
  const ws = await getDashboardWorkspace();
  if (!ws) return null;

  const overview = await getOverview(ws.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Performance snapshot from stored Instagram insights (mock or live). Weights come from Settings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Last sync</CardDescription>
            <CardTitle className="text-2xl">
              {overview.lastSync
                ? formatDistanceToNow(overview.lastSync, { addSuffix: true })
                : "Never"}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Posts analyzed</CardDescription>
            <CardTitle className="text-2xl">{overview.totalPosts}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg composite score</CardDescription>
            <CardTitle className="text-2xl font-mono">{overview.avgComposite.toFixed(3)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance trend</CardTitle>
          <CardDescription>Daily average composite score (last ~30 days with data)</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <TrendChart data={overview.trend} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 winners</CardTitle>
            <CardDescription>Highest composite in your dataset</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {overview.topWinners.map((p) => (
              <div key={p.id} className="flex justify-between gap-2 rounded-lg border border-border p-2">
                <span className="line-clamp-2">{p.caption}</span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {p.composite.toFixed(3)}
                </span>
              </div>
            ))}
            {!overview.topWinners.length && (
              <p className="text-muted-foreground">Run seed or sync to see data.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bottom 5</CardTitle>
            <CardDescription>Lowest composite — learn what to avoid</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {overview.bottomLosers.map((p) => (
              <div key={p.id} className="flex justify-between gap-2 rounded-lg border border-border p-2">
                <span className="line-clamp-2">{p.caption}</span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {p.composite.toFixed(3)}
                </span>
              </div>
            ))}
            {!overview.bottomLosers.length && (
              <p className="text-muted-foreground">No posts yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
