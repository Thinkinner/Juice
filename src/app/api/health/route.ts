import { NextResponse } from "next/server";

/** Minimal probe for Vercel / DNS debugging — should return 200 when the deployment is reachable. */
export async function GET() {
  return NextResponse.json({ ok: true });
}
