import Link from "next/link";
import { GlassWater } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[color:var(--surface)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4 sm:max-w-2xl">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-stone-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
            <GlassWater className="h-5 w-5" aria-hidden />
          </span>
          <span>Juice Finder</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium text-stone-600">
          <Link href="/quiz" className="rounded-full px-3 py-1.5 hover:bg-stone-100 hover:text-stone-900">
            Quiz
          </Link>
          <Link href="/saved" className="rounded-full px-3 py-1.5 hover:bg-stone-100 hover:text-stone-900">
            Saved
          </Link>
        </nav>
      </div>
    </header>
  );
}
