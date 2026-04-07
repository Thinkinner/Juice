import { MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { JuiceSpot } from "@/lib/types";

export function JuiceSpotCard({ spot }: { spot: JuiceSpot }) {
  return (
    <article className="flex flex-col gap-3 rounded-3xl border border-stone-200/80 bg-white p-5 shadow-[0_6px_24px_rgb(0,0,0,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-stone-900">{spot.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-stone-500">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden />
            {spot.city}, {spot.state} · {spot.distance_miles.toFixed(1)} mi
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
            spot.is_open ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-700"
          }`}
        >
          {spot.is_open ? "Open" : "Closed"}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-stone-700">
        <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
        <span className="font-medium">{spot.rating.toFixed(1)}</span>
        <span className="text-stone-400">·</span>
        <span className="text-stone-500">Near {spot.zip_code}</span>
      </div>
      <Button type="button" variant="secondary" fullWidth className="!py-3">
        View details
      </Button>
      <p className="text-[11px] leading-relaxed text-stone-400">
        Placeholder listing — wire Google Places or your own directory later.
      </p>
    </article>
  );
}
