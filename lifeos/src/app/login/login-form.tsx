"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Bem-vinda ao LifeOS");
      router.replace(next);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center p-6">
      <Card className="bg-card/40 backdrop-blur-2xl border-primary/20 rounded-3xl shadow-2xl">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="size-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">LifeOS</span>
          </div>
          <CardTitle className="text-3xl font-black tracking-tighter">Entrar</CardTitle>
          <p className="text-sm text-muted-foreground">Organize sua vida. Expanda seu potencial.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl bg-background/50"
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl bg-background/50"
            onKeyDown={(e) => e.key === "Enter" && signIn()}
          />
          <Button
            className="w-full rounded-xl bg-primary hover:bg-primary/90 font-bold"
            onClick={signIn}
            disabled={loading || !email || !password}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="text-xs text-muted-foreground text-center">
            Ainda não tem conta?{" "}
            <Link href="/signup" className="text-primary font-bold hover:underline">
              Criar agora
            </Link>
          </div>

          <div className="text-[10px] text-muted-foreground/80 text-center">
            Dica: se você ainda não configurou o Supabase (.env), o app funciona em modo local.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
