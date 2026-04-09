import Link from "next/link";
import { enterDemoModeAction } from "@/actions/demo-auth";
import { signInAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isDemoAuthEnabled } from "@/lib/auth/session";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; checkEmail?: string }>;
}) {
  const q = await searchParams;
  const demo = isDemoAuthEnabled();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in with email, or use the demo workspace (no account).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {q.error && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {q.error}
            </p>
          )}
          {q.checkEmail && (
            <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
              Check your email to confirm your account, then sign in.
            </p>
          )}

          {demo && (
            <form action={enterDemoModeAction} className="space-y-2">
              <Button type="submit" className="w-full" variant="secondary">
                Open demo app (mock data)
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Full dashboard with seeded posts — no password.
              </p>
            </form>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or email</span>
            </div>
          </div>

          <form action={signInAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
