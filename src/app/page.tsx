import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <BarChart3 className="h-6 w-6 text-primary" />
            IG Brain
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              Sign in
            </Link>
            <Link href="/api/demo-login" className={cn(buttonVariants({ size: "sm" }))}>
              Open demo app
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto flex max-w-3xl flex-1 flex-col justify-center px-4 py-16">
        <p className="text-sm font-medium text-primary">Instagram analytics</p>
        <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Dashboard for patterns, content intel, and what to post next
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Use mock data instantly — no Instagram credentials required. Sign in with Supabase, or open the
          demo to explore the full product.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/api/demo-login" className={cn(buttonVariants({ size: "lg" }))}>
            Enter demo workspace
          </Link>
          <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            Sign in with email
          </Link>
        </div>
      </main>
    </div>
  );
}
