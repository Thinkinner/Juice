"use server";

import { DEMO_COOKIE_NAME } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { createServerClientSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();
  if (!email || !password) {
    redirect("/signup?error=" + encodeURIComponent("Email and password required"));
  }

  if (!isSupabaseConfigured()) {
    redirect("/signup?error=" + encodeURIComponent("Supabase is not configured — use Open demo on the home page."));
  }

  const supabase = await createServerClientSupabase();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) redirect("/signup?error=" + encodeURIComponent(error.message));

  const userId = data.user?.id;
  if (userId) {
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId, email, name: name || null },
      update: { email, name: name || null },
    });
  }

  revalidatePath("/", "layout");
  redirect("/login?checkEmail=1");
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) {
    redirect("/login?error=" + encodeURIComponent("Email and password required"));
  }

  if (!isSupabaseConfigured()) {
    redirect("/login?error=" + encodeURIComponent("Supabase is not configured — use Open demo instead."));
  }

  const supabase = await createServerClientSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/login?error=" + encodeURIComponent(error.message));

  const userId = data.user?.id;
  if (userId) {
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId, email, name: data.user.user_metadata?.name ?? null },
      update: { email },
    });
  }

  revalidatePath("/", "layout");
  redirect("/dashboard/overview");
}

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_COOKIE_NAME);
  if (isSupabaseConfigured()) {
    const supabase = await createServerClientSupabase();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/login");
}
