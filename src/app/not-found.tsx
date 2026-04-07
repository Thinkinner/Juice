import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      <SiteHeader />
      <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 text-center sm:max-w-2xl">
        <p className="text-sm font-semibold text-emerald-800">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-stone-900">Page not found</h1>
        <p className="mt-2 text-stone-600">Let&apos;s get you back to something refreshing.</p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25"
        >
          Go home
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
