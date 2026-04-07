import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email(),
  zip_code: z.string().min(5).max(10),
  goal: z.string().min(1),
  sensitivities: z.array(z.string()),
  flavor_preference: z.string().min(1),
});

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = service ?? anon;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      {
        ok: true,
        warning:
          "Supabase not configured — lead not persisted. Set NEXT_PUBLIC_SUPABASE_URL and keys in .env.local.",
      },
      { status: 200 },
    );
  }

  const { error } = await supabase.from("leads").insert({
    email: parsed.data.email,
    zip_code: parsed.data.zip_code,
    goal: parsed.data.goal,
    sensitivities: parsed.data.sensitivities,
    flavor_preference: parsed.data.flavor_preference,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
