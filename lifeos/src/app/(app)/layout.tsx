import { AppSidebar } from "@/components/lifeos/app-sidebar";
import { ThemeToggle } from "@/components/lifeos/theme-toggle";
import { AuthActions } from "@/components/lifeos/auth-actions";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[radial-gradient(1200px_circle_at_20%_20%,hsl(var(--primary)/0.15),transparent_60%),radial-gradient(1000px_circle_at_80%_0%,hsl(var(--ring)/0.12),transparent_55%)]">
      <div className="mx-auto flex w-full max-w-7xl gap-4 p-3 md:p-6">
        <AppSidebar />

        <main className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              LifeOS • Organize sua vida • MVP
            </div>
            <div className="flex items-center gap-2">
              <AuthActions />
              <ThemeToggle />
            </div>
          </div>

          <div className="rounded-2xl border bg-card/40 backdrop-blur-xl shadow-sm">
            <div className="p-4 md:p-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
