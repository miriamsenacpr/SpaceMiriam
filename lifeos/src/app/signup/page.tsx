"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success("Conta criada! Agora você pode entrar.");
      router.replace("/login");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erro ao criar conta");
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
          <CardTitle className="text-3xl font-black tracking-tighter">Criar conta</CardTitle>
          <p className="text-sm text-muted-foreground">Seu workspace pessoal premium.</p>
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
            placeholder="Senha (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl bg-background/50"
            onKeyDown={(e) => e.key === "Enter" && signUp()}
          />
          <Button
            className="w-full rounded-xl bg-primary hover:bg-primary/90 font-bold"
            onClick={signUp}
            disabled={loading || !email || password.length < 6}
          >
            {loading ? "Criando..." : "Criar conta"}
          </Button>

          <div className="text-xs text-muted-foreground text-center">
            Já tem conta?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
