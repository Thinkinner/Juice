import Link from "next/link";
import { signInAction } from "@/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
          <CardTitle>Team sign-in</CardTitle>
          <CardDescription>
            Email access for collaborators. New users: start from the home page with an Instagram handle.
          </CardDescription>
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
            <div className="space-y-2">
              <Link
                href="/api/demo-login"
                className={cn(buttonVariants({ variant: "secondary" }), "flex w-full")}
              >
                Open demo app (mock data)
              </Link>
              <p className="text-center text-xs text-muted-foreground">
                Full dashboard with seeded posts — no password.
              </p>
            </div>
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
            <Link href="/" className="text-primary underline-offset-4 hover:underline">
              ← Analyze a handle (demo)
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
