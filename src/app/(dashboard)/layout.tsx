import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/actions/auth";
import { createServerClientSupabase } from "@/lib/supabase/server";
import { ensureWorkspace } from "@/services/analytics/analytics.service";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClientSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  await ensureWorkspace(user.id);

  return (
    <div className="flex min-h-screen flex-1">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-end border-b border-border px-4">
          <form action={signOutAction}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
