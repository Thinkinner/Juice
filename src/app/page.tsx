import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Brain, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <BarChart3 className="h-6 w-6 text-primary" />
            IG Brain
          </div>
          <div className="flex gap-2">
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
              Sign in
            </Link>
            <Link href="/signup" className={buttonVariants()}>
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-16 px-4 py-16">
        <section className="space-y-4 text-center">
          <p className="text-sm font-medium text-primary">Instagram professional accounts</p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Know what to post next — backed by your own performance data
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            IG Brain ingests post-level insights, classifies content, surfaces winning patterns, and
            outputs ranked recommendations. Mock mode included for instant demos.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/signup" className={buttonVariants({ size: "lg" })}>
              Create account
            </Link>
            <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Sign in
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Sparkles className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>
                Top 10 next ideas with hooks, formats, CTAs, windows, confidence, and evidence.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <BarChart3 className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Patterns</CardTitle>
              <CardDescription>Topics, hooks, hours, and formats vs your baseline.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Brain className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Strategist</CardTitle>
              <CardDescription>Ask questions grounded in stored analytics — no invented metrics.</CardDescription>
            </CardHeader>
          </Card>
        </section>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Placeholder screenshots</CardTitle>
            <CardDescription>
              Swap in product marketing shots: Overview trend, Patterns bar charts, Next posts list.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-40 rounded-lg bg-muted/40" />
        </Card>
      </main>
    </div>
  );
}
