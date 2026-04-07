import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50/80">
      <div className="mx-auto max-w-lg px-4 py-10 text-sm text-stone-600 sm:max-w-2xl">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/" className="hover:text-stone-900">
            Home
          </Link>
          <Link href="/quiz" className="hover:text-stone-900">
            Quiz
          </Link>
          <Link href="/saved" className="hover:text-stone-900">
            Saved recipes
          </Link>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-stone-500">
          This app is for informational wellness purposes only and is not medical advice. Juice Finder
          does not diagnose, treat, or cure any condition. Always consult a qualified professional for
          health concerns.
        </p>
        <p className="mt-3 text-xs text-stone-400">© {new Date().getFullYear()} Juice Finder</p>
      </div>
    </footer>
  );
}
