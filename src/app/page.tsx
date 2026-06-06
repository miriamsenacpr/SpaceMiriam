import Link from "next/link";
import { Star, Rocket, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center p-6 relative overflow-hidden">
      {/* Decorative stars */}
      <div className="absolute top-10 left-10 text-primary/20 animate-pulse"><Star size={40} fill="currentColor" /></div>
      <div className="absolute bottom-20 right-10 text-primary/10 animate-bounce"><Star size={60} fill="currentColor" /></div>
      
      <div className="rounded-3xl border border-primary/20 bg-card/30 backdrop-blur-2xl p-8 shadow-2xl relative z-10">
        <div className="flex items-center gap-3">
          <Rocket className="text-primary animate-bounce" size={32} />
          <div className="text-3xl font-black tracking-tighter text-primary">Space Girl</div>
        </div>
        <p className="mt-4 text-lg font-medium text-foreground/80 leading-relaxed">
          Sua galáxia pessoal de organização. Explore seu potencial com o comando estelar.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95"
          >
            <Sparkles size={18} />
            Iniciar Missão
          </Link>
          <Link
            href="/assistente"
            className="flex items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-white/5 px-8 py-4 text-base font-bold backdrop-blur-sm transition-colors hover:bg-primary/10"
          >
            Falar com a IA
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-primary/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary/60 uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Sistemas Estelares Online
          </div>
        </div>
      </div>
    </div>
  );
}
