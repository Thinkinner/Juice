import Link from "next/link";
import { analyzeInstagramHandleAction } from "@/actions/analyze-handle";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const q = await searchParams;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <BarChart3 className="h-6 w-6 text-primary" />
            IG Brain
          </div>
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            Team sign-in
          </Link>
        </div>
      </header>
      <main className="mx-auto flex max-w-3xl flex-1 flex-col justify-center px-4 py-16">
        <p className="text-sm font-medium text-primary">Instagram analytics</p>
        <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Analyze an Instagram from day one
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Enter a handle. We generate a full mock post history (topics, hooks, performance) and run the
          recommendation engine — no password and no Meta connection required for the demo.
        </p>

        {q.error && (
          <p className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {q.error}
          </p>
        )}

        <form action={analyzeInstagramHandleAction} className="mt-8 flex max-w-md flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="handle">Instagram username</Label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Input
                id="handle"
                name="handle"
                type="text"
                required
                autoComplete="off"
                placeholder="yourbrand"
                className="sm:flex-1"
              />
              <Button type="submit" size="lg" className="shrink-0 sm:w-auto">
                Analyze
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Demo uses synthetic data labeled with your handle until live Instagram sync is connected.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
