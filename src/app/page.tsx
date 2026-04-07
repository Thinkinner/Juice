import Link from "next/link";
import {
  CheckCircle2,
  Droplets,
  Leaf,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

const GOALS = [
  { label: "Digestion", icon: Leaf },
  { label: "Bloating", icon: Droplets },
  { label: "Energy", icon: Zap },
  { label: "Hydration", icon: Droplets },
  { label: "Skin Glow", icon: Sparkles },
];

const PROOF = [
  { title: "Personalized wellness juice ideas", body: "Matched to the goal you pick — informational only." },
  { title: "Ingredient-based suggestions", body: "See what goes in each blend before you try it." },
  { title: "Save your favorite recipes", body: "Keep a shortlist locally while you explore." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-lg px-4 pb-16 pt-10 sm:max-w-2xl sm:pt-14">
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Wellness quiz · ~30 seconds
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            Find juices for your wellness goals
          </h1>
          <p className="mt-4 text-lg text-stone-600">
            Tell us how you feel and get personalized juice suggestions in under 30 seconds.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/quiz"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 active:scale-[0.99] sm:w-auto"
            >
              Get my juice plan
            </Link>
            <Link
              href="/saved"
              className="text-center text-sm font-semibold text-emerald-800 hover:text-emerald-950 sm:px-4"
            >
              View saved recipes
            </Link>
          </div>

          <div className="mt-12 rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_12px_40px_rgb(0,0,0,0.06)]">
            <p className="text-sm font-semibold text-stone-900">Example goals people choose</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {GOALS.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-2xl bg-stone-50 px-3 py-3 text-sm font-medium text-stone-800 ring-1 ring-stone-100"
                >
                  <Icon className="h-4 w-4 text-emerald-700" aria-hidden />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 space-y-4">
            {PROOF.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-3xl border border-stone-200/80 bg-white/90 p-5 shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/25">
                  <CheckCircle2 className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-stone-900">{item.title}</p>
                  <p className="mt-1 text-sm text-stone-600">{item.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-start gap-3 rounded-3xl border border-stone-200 bg-stone-50 p-5">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-stone-500" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-stone-900">Informational only</p>
              <p className="mt-1 text-sm text-stone-600">
                Juice Finder does not position juices as curing or treating diseases. Language like
                &quot;may support digestion&quot; or &quot;commonly used for bloating&quot; reflects general
                wellness interest — not a diagnosis or treatment plan.
              </p>
            </div>
          </div>

          <Disclaimer className="mt-6" />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
