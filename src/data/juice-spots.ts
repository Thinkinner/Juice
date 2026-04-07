import type { JuiceSpot } from "@/lib/types";

/** Mock directory; swap for Google Places later—match by ZIP prefix or city */
export const JUICE_SPOTS: JuiceSpot[] = [
  {
    id: "b1111111-1111-4111-8111-111111111101",
    name: "Glow & Press",
    zip_code: "90210",
    city: "Beverly Hills",
    state: "CA",
    rating: 4.8,
    distance_miles: 0.8,
    is_open: true,
  },
  {
    id: "b1111111-1111-4111-8111-111111111102",
    name: "Urban Juicery",
    zip_code: "90210",
    city: "Beverly Hills",
    state: "CA",
    rating: 4.6,
    distance_miles: 1.2,
    is_open: true,
  },
  {
    id: "b1111111-1111-4111-8111-111111111103",
    name: "Sunrise Squeeze",
    zip_code: "10001",
    city: "New York",
    state: "NY",
    rating: 4.7,
    distance_miles: 0.4,
    is_open: false,
  },
  {
    id: "b1111111-1111-4111-8111-111111111104",
    name: "Greenline Cold Press",
    zip_code: "10001",
    city: "New York",
    state: "NY",
    rating: 4.5,
    distance_miles: 0.9,
    is_open: true,
  },
  {
    id: "b1111111-1111-4111-8111-111111111105",
    name: "Harbor Juice Co.",
    zip_code: "94102",
    city: "San Francisco",
    state: "CA",
    rating: 4.9,
    distance_miles: 0.6,
    is_open: true,
  },
  {
    id: "b1111111-1111-4111-8111-111111111106",
    name: "Mission Melon",
    zip_code: "94102",
    city: "San Francisco",
    state: "CA",
    rating: 4.4,
    distance_miles: 1.1,
    is_open: true,
  },
  {
    id: "b1111111-1111-4111-8111-111111111107",
    name: "Lakeview Liquid Bar",
    zip_code: "60614",
    city: "Chicago",
    state: "IL",
    rating: 4.6,
    distance_miles: 0.7,
    is_open: false,
  },
  {
    id: "b1111111-1111-4111-8111-111111111108",
    name: "Prairie Press",
    zip_code: "60614",
    city: "Chicago",
    state: "IL",
    rating: 4.3,
    distance_miles: 1.4,
    is_open: true,
  },
];

export function getSpotsNearZip(zip: string): JuiceSpot[] {
  const cleaned = zip.replace(/\D/g, "").slice(0, 5);
  if (cleaned.length < 5) {
    return JUICE_SPOTS.slice(0, 3).map((s, i) => ({
      ...s,
      distance_miles: 0.5 + i * 0.3,
    }));
  }
  const exact = JUICE_SPOTS.filter((s) => s.zip_code === cleaned);
  if (exact.length) return [...exact].sort((a, b) => a.distance_miles - b.distance_miles);
  const prefix = cleaned.slice(0, 3);
  const partial = JUICE_SPOTS.filter((s) => s.zip_code.startsWith(prefix));
  if (partial.length) return [...partial].sort((a, b) => a.distance_miles - b.distance_miles);
  return JUICE_SPOTS.slice(0, 4).map((s, i) => ({
    ...s,
    distance_miles: 0.6 + i * 0.25,
  }));
}
