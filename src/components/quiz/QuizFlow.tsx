"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import {
  FLAVOR_OPTIONS,
  SENSITIVITY_OPTIONS,
  WELLNESS_GOALS,
  type FlavorPreference,
  type SensitivityOption,
  type WellnessGoal,
} from "@/lib/types";
import { getRecommendedRecipes } from "@/lib/recommendations";
import {
  clearQuizProgress,
  loadQuizProgress,
  saveQuizProgress,
  saveSession,
  type StoredQuizProgress,
} from "@/lib/quiz-storage";
import { emailSchema, usZipSchema } from "@/lib/validators";

const TOTAL_STEPS = 5;

const emailFormSchema = z.object({
  email: emailSchema,
});

type EmailForm = z.infer<typeof emailFormSchema>;

function ProgressBar({ step }: { step: number }) {
  const pct = Math.round((step / TOTAL_STEPS) * 100);
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-stone-500">
        <span>
          Step {step} of {TOTAL_STEPS}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-stone-200">
        <motion.div
          className="h-full rounded-full bg-emerald-600"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}

function toggleSensitivity(
  current: SensitivityOption[],
  next: SensitivityOption,
): SensitivityOption[] {
  if (next === "None") return ["None"];
  const withoutNone = current.filter((s) => s !== "None");
  if (withoutNone.includes(next)) {
    const removed = withoutNone.filter((s) => s !== next);
    return removed.length ? removed : ["None"];
  }
  return [...withoutNone, next];
}

export function QuizFlow() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<WellnessGoal | null>(null);
  const [sensitivities, setSensitivities] = useState<SensitivityOption[]>(["None"]);
  const [flavor, setFlavor] = useState<FlavorPreference | null>(null);
  const [zip, setZip] = useState("");
  const [zipError, setZipError] = useState<string | null>(null);
  const [step5Phase, setStep5Phase] = useState<"teaser" | "email" | "success">("teaser");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailForm>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: "" },
  });

  const emailDraft = watch("email");

  const persist = useCallback(() => {
    const data: StoredQuizProgress = {
      step,
      goal: goal ?? undefined,
      sensitivities,
      flavor: flavor ?? undefined,
      zip,
      emailDraft: emailDraft?.trim() ? emailDraft : undefined,
    };
    saveQuizProgress(data);
  }, [step, goal, sensitivities, flavor, zip, emailDraft]);

  useEffect(() => {
    const loaded = loadQuizProgress();
    if (loaded) {
      setStep(loaded.step ?? 1);
      if (loaded.goal) setGoal(loaded.goal);
      if (loaded.sensitivities?.length) setSensitivities(loaded.sensitivities);
      if (loaded.flavor) setFlavor(loaded.flavor);
      if (loaded.zip) setZip(loaded.zip);
      if (loaded.emailDraft) reset({ email: loaded.emailDraft });
    }
    setHydrated(true);
  }, [reset]);

  useEffect(() => {
    if (!hydrated) return;
    persist();
  }, [hydrated, persist]);

  const previewRecipes = useMemo(() => {
    if (!goal || !flavor) return [];
    return getRecommendedRecipes(goal, sensitivities, flavor, 3);
  }, [goal, sensitivities, flavor]);

  function validateZip(): boolean {
    const r = usZipSchema.safeParse(zip);
    if (!r.success) {
      setZipError(r.error.issues[0]?.message ?? "Invalid ZIP");
      return false;
    }
    setZipError(null);
    return true;
  }

  function goNext() {
    setSubmitError(null);
    if (step === 1 && !goal) {
      setSubmitError("Choose a wellness goal to continue.");
      return;
    }
    if (step === 2 && sensitivities.length === 0) {
      setSubmitError("Select at least one option (or None).");
      return;
    }
    if (step === 3 && !flavor) {
      setSubmitError("Pick a flavor preference or No preference.");
      return;
    }
    if (step === 4) {
      if (!validateZip()) return;
      setStep(5);
      setStep5Phase("teaser");
      return;
    }
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  }

  function goBack() {
    setSubmitError(null);
    if (step === 5 && step5Phase !== "teaser") {
      setStep5Phase("teaser");
      return;
    }
    if (step > 1) setStep((s) => s - 1);
  }

  const onEmailSubmit = handleSubmit(async (data) => {
    if (!goal || !flavor) return;
    setPending(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          zip_code: zip,
          goal,
          sensitivities: sensitivities.filter((s) => s !== "None"),
          flavor_preference: flavor,
        }),
      });
      const json = (await res.json()) as { error?: string; ok?: boolean };
      if (!res.ok) {
        throw new Error(json.error ?? "Could not save — try again.");
      }
      const recipeIds = previewRecipes.map((r) => r.id);
      saveSession({
        goal,
        sensitivities,
        flavor,
        zip,
        email: data.email,
        recipeIds,
        unlockedAt: new Date().toISOString(),
      });
      clearQuizProgress();
      setStep5Phase("success");
      setTimeout(() => {
        router.push("/results");
      }, 1200);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  });

  const slide = {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -16 },
    transition: { duration: 0.22 },
  };

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null || step >= 5) return;
    const end = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const dx = end - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 56) return;
    if (dx < 0) goNext();
    else goBack();
  }

  return (
    <div
      className="touch-pan-y pb-28 pt-2"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <ProgressBar step={step} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="s1" {...slide} className="space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
              What would you like support with?
            </h1>
            <p className="text-sm text-stone-600">
              Choose a wellness goal — suggestions are informational only and not medical advice.
            </p>
            <div className="grid gap-2">
              {WELLNESS_GOALS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className={`rounded-2xl border px-4 py-4 text-left text-sm font-medium transition ${
                    goal === g
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" {...slide} className="space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
              Do you have any sensitivities or things to watch out for?
            </h1>
            <p className="text-sm text-stone-600">
              We&apos;ll tune suggestions and caution notes — not a medical screening.
            </p>
            <div className="grid gap-2">
              {SENSITIVITY_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${
                    sensitivities.includes(opt)
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-stone-200 bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-600"
                    checked={sensitivities.includes(opt)}
                    onChange={() => setSensitivities((prev) => toggleSensitivity(prev, opt))}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" {...slide} className="space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
              What flavors do you prefer?
            </h1>
            <div className="grid gap-2">
              {FLAVOR_OPTIONS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFlavor(f)}
                  className={`rounded-2xl border px-4 py-4 text-left text-sm font-medium ${
                    flavor === f
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="s4" {...slide} className="space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
              Enter your ZIP code
            </h1>
            <p className="text-sm text-stone-600">
              We&apos;ll show mock juice spots nearby — swap in Google Places later.
            </p>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                US ZIP code
              </span>
              <input
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="e.g. 90210"
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-base outline-none ring-emerald-600/0 transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
              />
              {zipError && <p className="mt-2 text-sm text-red-600">{zipError}</p>}
            </label>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="s5" {...slide} className="space-y-5">
            {step5Phase === "teaser" && (
              <>
                <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-sm font-semibold">Preview</span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-stone-900">
                    We found 3 juice suggestions for your goal
                  </h2>
                  <p className="mt-2 text-sm text-stone-600">
                    Unlock with your email to see full recipes, ingredients, and local spots. No spam —
                    just your plan.
                  </p>
                  <ul className="mt-4 space-y-2">
                    {previewRecipes.map((r) => (
                      <li
                        key={r.id}
                        className="flex items-center justify-between rounded-2xl bg-white/80 px-3 py-2 text-sm font-medium text-stone-800 ring-1 ring-stone-200/80"
                      >
                        <span>{r.name}</span>
                        <Lock className="h-4 w-4 text-stone-400" aria-hidden />
                      </li>
                    ))}
                  </ul>
                </div>
                <Disclaimer />
              </>
            )}

            {step5Phase === "email" && (
              <form
                id="unlock-form"
                className="space-y-4"
                onSubmit={onEmailSubmit}
                noValidate
              >
                <h2 className="text-xl font-semibold text-stone-900">Enter your email to unlock</h2>
                <p className="text-sm text-stone-600">
                  We&apos;ll save your preferences so you can revisit your plan.
                </p>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Email
                  </span>
                  <input
                    {...register("email")}
                    type="email"
                    autoComplete="email"
                    className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-base outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                    placeholder="you@email.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </label>
                {submitError && <p className="text-sm text-red-600">{submitError}</p>}
                <Disclaimer />
                <p className="text-center text-xs text-stone-500">
                  Tap the button below to unlock your plan.
                </p>
              </form>
            )}

            {step5Phase === "success" && (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-emerald-200 bg-emerald-50/80 px-6 py-12 text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                >
                  <Sparkles className="h-7 w-7" />
                </motion.div>
                <p className="text-lg font-semibold text-emerald-950">You&apos;re in!</p>
                <p className="mt-1 text-sm text-emerald-900/80">Loading your personalized plan…</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {submitError && step !== 5 && <p className="mt-4 text-sm text-red-600">{submitError}</p>}

      {/* Sticky footer actions */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-stone-200/80 bg-[color:var(--surface)]/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg gap-2 sm:max-w-2xl">
          {(step > 1 && !(step === 5 && step5Phase === "success")) && (
            <Button
              type="button"
              variant="secondary"
              className="!px-4"
              onClick={goBack}
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          {step < 4 && (
            <Button type="button" fullWidth className="!py-4" onClick={goNext}>
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
          {step === 4 && (
            <Button type="button" fullWidth className="!py-4" onClick={goNext}>
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
          {step === 5 && step5Phase === "teaser" && (
            <Button type="button" fullWidth className="!py-4" onClick={() => setStep5Phase("email")}>
              Continue to email
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
          {step === 5 && step5Phase === "email" && (
            <div className="flex w-full flex-col gap-2">
              <Button
                type="submit"
                form="unlock-form"
                disabled={pending}
                fullWidth
                className="!py-4"
              >
                {pending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Unlock my juice plan"
                )}
              </Button>
              <p className="text-center text-xs text-stone-500">
                or{" "}
                <Link href="/" className="font-medium text-emerald-700 underline-offset-2 hover:underline">
                  cancel
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
