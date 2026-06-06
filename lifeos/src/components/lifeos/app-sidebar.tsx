"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  GraduationCap,
  Home,
  UtensilsCrossed,
  Film,
  BookOpen,
  Lightbulb,
  Target,
  Library,
  Sparkles,
  Layers,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/faculdade", label: "Faculdade", icon: GraduationCap },
  { href: "/casa", label: "Casa", icon: Home },
  { href: "/cardapio", label: "Cardápio", icon: UtensilsCrossed },
  { href: "/midia", label: "Filmes & Séries", icon: Film },
  { href: "/estudos", label: "Estudos", icon: BookOpen },
  { href: "/ideias", label: "Ideias", icon: Lightbulb },
  { href: "/metas", label: "Metas", icon: Target },
  { href: "/biblioteca", label: "Biblioteca", icon: Library },
  { href: "/assistente", label: "Assistente", icon: Sparkles },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-72 md:flex-col">
      <div className="m-4 rounded-2xl border bg-card/40 backdrop-blur-xl shadow-sm border-primary/20">
        <div className="px-4 py-6">
          <div className="text-xl font-bold tracking-tighter text-primary flex items-center gap-2">
            <Layers className="size-5" />
            LifeOS
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
            Organize sua vida • Premium UI
          </div>
        </div>
        <div className="px-2 pb-3 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "animate-bounce" : "")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
