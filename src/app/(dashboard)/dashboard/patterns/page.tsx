import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarListChart } from "@/components/charts/bar-list-chart";
import { aggregatePatterns } from "@/services/analytics/analytics.service";
import { getDashboardWorkspace } from "@/lib/auth/session";

export default async function PatternsPage() {
  const ws = await getDashboardWorkspace();
  if (!ws) return null;
  const p = await aggregatePatterns(ws.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Patterns</h1>
        <p className="text-sm text-muted-foreground">
          What clusters beat your baseline — topics, hooks, hours, formats.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Topics</CardTitle>
            <CardDescription>Avg composite by topic</CardDescription>
          </CardHeader>
          <CardContent>
            <BarListChart data={p.topics} dataKey="avg" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hooks</CardTitle>
            <CardDescription>Hook types vs composite</CardDescription>
          </CardHeader>
          <CardContent>
            <BarListChart data={p.hooks} dataKey="avg" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hour of day</CardTitle>
            <CardDescription>UTC hour bucket from publish time</CardDescription>
          </CardHeader>
          <CardContent>
            <BarListChart data={p.hours} dataKey="avg" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Formats</CardTitle>
            <CardDescription>Classifier format label</CardDescription>
          </CardHeader>
          <CardContent>
            <BarListChart data={p.formats} dataKey="avg" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
