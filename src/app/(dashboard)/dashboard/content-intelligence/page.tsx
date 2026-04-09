import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentPostsTable, type ContentPostRow } from "@/components/dashboard/content-posts-table";
import { getDashboardWorkspace } from "@/lib/auth/session";
import { loadPostsWithScores } from "@/services/analytics/analytics.service";

export default async function ContentIntelligencePage() {
  const ws = await getDashboardWorkspace();
  if (!ws) return null;

  const { posts } = await loadPostsWithScores(ws.id);

  const rows: ContentPostRow[] = posts.map(({ post, composite, engagementRate }) => ({
    id: post.id,
    publishedAt: post.publishedAt.toISOString(),
    topic: post.classification?.topic ?? "",
    hook: post.classification?.hookType ?? "",
    format: post.classification?.format ?? "",
    composite,
    views: post.insights[0]?.views ?? 0,
    engagementRate,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Content intelligence</h1>
        <p className="text-sm text-muted-foreground">
          Every post with classifier labels, composite score, and engagement. Filter by topic, format, or
          keyword — all from your seeded / synced data.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post library</CardTitle>
          <CardDescription>Composite score uses workspace weights from Settings</CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length ? (
            <ContentPostsTable rows={rows} />
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No posts yet — use Settings → mock Instagram, then run{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">npx prisma db seed</code>.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
