import Link from "next/link";
import { Sparkles, Layers, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center p-6 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 size-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="rounded-3xl border border-primary/20 bg-card/30 backdrop-blur-2xl p-8 shadow-2xl relative z-10">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center text-primary">
            <Layers className="size-5" />
          </div>
          <div>
            <div className="text-3xl font-black tracking-tighter text-primary">LifeOS</div>
            <div className="text-xs text-muted-foreground uppercase tracking-[0.25em] font-bold">
              Workspace pessoal premium
            </div>
          </div>
        </div>

        <p className="mt-4 text-lg font-medium text-foreground/80 leading-relaxed">
          Organize sua vida. Expanda seu potencial.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95"
          >
            <Sparkles size={18} />
            Abrir LifeOS
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-white/5 px-8 py-4 text-base font-bold backdrop-blur-sm transition-colors hover:bg-primary/10"
          >
            Entrar
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-primary/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary/60 uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Sistema pronto para evoluir (MVP)
          </div>
        </div>
      </div>
    </div>
  );
}
