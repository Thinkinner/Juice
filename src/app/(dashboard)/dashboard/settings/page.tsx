import { connectMockInstagramAction } from "@/actions/instagram-connection";
import { syncPostsAction } from "@/actions/sync";
import { updateFlagsAction, updateMetricWeightsAction } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";
import { DEFAULT_METRIC_WEIGHTS } from "@/lib/constants/metrics";
import { createServerClientSupabase } from "@/lib/supabase/server";
import { ensureWorkspace } from "@/services/analytics/analytics.service";

export default async function SettingsPage() {
  const supabase = await createServerClientSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const ws = await ensureWorkspace(user.id);
  const settings = await prisma.workspaceSettings.findUnique({
    where: { workspaceId: ws.id },
  });
  const weights = (settings?.metricWeights as typeof DEFAULT_METRIC_WEIGHTS) ?? DEFAULT_METRIC_WEIGHTS;
  const account = await prisma.socialAccount.findFirst({
    where: { workspaceId: ws.id, platform: "INSTAGRAM" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Metric weights, mock mode, and Instagram connection (tokens stay server-side only).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instagram</CardTitle>
          <CardDescription>
            Professional accounts only. Mock connection stores no Meta secret — live path uses server env.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <form action={connectMockInstagramAction}>
            <Button type="submit" variant="secondary">
              {account ? "Mock account connected" : "Connect mock Instagram"}
            </Button>
          </form>
          <form action={syncPostsAction}>
            <Button type="submit" disabled={!account}>
              Sync latest posts (mock refresh)
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scoring weights</CardTitle>
          <CardDescription>Must sum to 1.0</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateMetricWeightsAction} className="grid max-w-md gap-3">
            {(
              [
                ["views", "Views"],
                ["shareSave", "Shares + saves quality"],
                ["comments", "Comments"],
                ["engagementRate", "Engagement rate"],
                ["recency", "Recency"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="grid gap-2">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  name={key}
                  type="number"
                  step="0.01"
                  defaultValue={String(weights[key as keyof typeof weights])}
                />
              </div>
            ))}
            <Button type="submit">Save weights</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature flags</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateFlagsAction} className="space-y-4">
            <label className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="font-medium">Mock mode</p>
                <p className="text-xs text-muted-foreground">Skip live Meta API</p>
              </div>
              <input
                type="checkbox"
                name="mockMode"
                value="on"
                defaultChecked={settings?.mockMode ?? true}
                className="h-4 w-4 accent-primary"
              />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="font-medium">AI classifier</p>
                <p className="text-xs text-muted-foreground">When off, rules-only labels</p>
              </div>
              <input
                type="checkbox"
                name="aiClassifier"
                value="on"
                defaultChecked={settings?.aiClassifierEnabled ?? true}
                className="h-4 w-4 accent-primary"
              />
            </label>
            <Button type="submit">Save flags</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
