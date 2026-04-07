export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-xs leading-relaxed text-amber-950/80 ${className}`}
    >
      <span className="font-semibold text-amber-950">Disclaimer:</span> This app is for informational
      wellness purposes only and is not medical advice.
    </p>
  );
}
