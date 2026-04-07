import { Loader2 } from "lucide-react";

export default function QuizLoading() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-stone-600">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" aria-hidden />
      <p className="text-sm">Loading quiz…</p>
    </div>
  );
}
