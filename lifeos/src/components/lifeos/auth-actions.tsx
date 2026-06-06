"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { LogOut, LogIn } from "lucide-react";
import Link from "next/link";

export function AuthActions() {
  const supabaseEnabled = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    if (!supabaseEnabled) return;

    const supabase = createSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(Boolean(data.session));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(Boolean(session));
    });

    return () => subscription.unsubscribe();
  }, [supabaseEnabled]);

  if (!supabaseEnabled) return null;

  if (!isAuthed) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center justify-center rounded-xl border border-primary/20 bg-background/40 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-primary/5"
      >
        <LogIn className="size-4 mr-2" />
        Entrar
      </Link>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-xl border-primary/20"
      onClick={async () => {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
        window.location.href = "/";
      }}
    >
      <LogOut className="size-4 mr-2" />
      Sair
    </Button>
  );
}
