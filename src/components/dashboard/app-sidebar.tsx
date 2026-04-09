"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Brain, Home, LineChart, Settings, Sparkles, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const links = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/content", label: "Content intelligence", icon: Table2 },
  { href: "/dashboard/patterns", label: "Patterns", icon: LineChart },
  { href: "/dashboard/next", label: "What to post next", icon: Sparkles },
  { href: "/dashboard/strategist", label: "AI strategist", icon: Brain },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-card/40">
      <div className="flex items-center gap-2 border-b border-border px-4 py-4">
        <BarChart3 className="h-6 w-6 text-primary" />
        <div>
          <p className="text-sm font-semibold tracking-tight">IG Brain</p>
          <p className="text-xs text-muted-foreground">Performance OS</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                buttonVariants({ variant: active ? "secondary" : "ghost" }),
                "w-full justify-start gap-2",
                active && "bg-secondary",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
