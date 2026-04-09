import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { createServerClientSupabase } from "@/lib/supabase/server";
import { ensureWorkspace, loadPostsWithScores } from "@/services/analytics/analytics.service";
import { format } from "date-fns";

export default async function ContentPage() {
  const supabase = await createServerClientSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const ws = await ensureWorkspace(user.id);
  const { posts } = await loadPostsWithScores(ws.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Content intelligence</h1>
        <p className="text-sm text-muted-foreground">
          Sortable view of posts, scores, and classifier labels (filters: ship next).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All posts</CardTitle>
          <CardDescription>Composite score uses workspace weights from Settings</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Hook</TableHead>
                <TableHead>Format</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-right">Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map(({ post, composite, engagementRate }) => (
                <TableRow key={post.id}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {format(post.publishedAt, "MMM d, HH:mm")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{post.classification?.topic ?? "—"}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[140px] truncate text-xs">
                    {post.classification?.hookType}
                  </TableCell>
                  <TableCell className="text-xs">{post.classification?.format}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{composite.toFixed(3)}</TableCell>
                  <TableCell className="text-right text-xs">
                    {post.insights[0]?.views ?? "—"}
                    <span className="ml-2 text-muted-foreground">
                      ER {(engagementRate * 100).toFixed(2)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!posts.length && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No posts — connect mock Instagram and run seed.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
