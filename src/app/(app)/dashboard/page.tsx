"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, Clock, Star, Sparkles, Rocket, GraduationCap, Film, Target } from "lucide-react";
import { cn } from "@/lib/utils";

function Widget({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon?: any }) {
  return (
    <Card className="bg-card/30 backdrop-blur-xl border-primary/10 hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-primary/5 group">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-bold tracking-widest uppercase text-primary/80">{title}</CardTitle>
        {Icon && <Icon className="size-4 text-primary/40 group-hover:text-primary transition-colors" />}
      </CardHeader>
      <CardContent className="text-sm">{children}</CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [events, setEvents] = useState([
    { id: 1, time: "09:00", title: "Decolagem: Reunião de Planejamento", type: "trabalho" },
    { id: 2, time: "14:30", title: "Órbita: Estudo de Astrofísica", type: "estudo" },
    { id: 3, time: "19:00", title: "Jantar na Estação Espacial", type: "pessoal" },
  ]);

  const [newEvent, setNewEvent] = useState("");

  const addEvent = () => {
    if (!newEvent) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setEvents([...events, { id: Date.now(), time, title: newEvent, type: "pessoal" }]);
    setNewEvent("");
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Rocket className="size-6 animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">Status: Em Órbita</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter mt-1">Dashboard</h1>
          <p className="text-muted-foreground font-medium">Bem-vinda ao seu centro de comando</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary px-3 py-1 rounded-full">
            <Star className="size-3 mr-1 fill-primary" /> 2026 Space Era
          </Badge>
          <Badge variant="outline" className="bg-accent/5 border-accent/20 text-accent px-3 py-1 rounded-full">
            <Sparkles className="size-3 mr-1 fill-accent" /> Premium UI
          </Badge>
        </div>
      </div>

      {/* Agenda Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="text-primary size-5" />
          <h2 className="text-xl font-bold tracking-tight">Agenda</h2>
        </div>
        <Card className="bg-primary/5 border-primary/20 backdrop-blur-2xl shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-[1fr_300px]">
              <div className="p-6 space-y-4 border-b md:border-b-0 md:border-r border-primary/10">
                <div className="flex gap-2">
                  <Input 
                    placeholder="O que temos para hoje?" 
                    className="bg-background/50 border-primary/20 focus-visible:ring-primary rounded-xl"
                    value={newEvent}
                    onChange={(e) => setNewEvent(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addEvent()}
                  />
                  <Button onClick={addEvent} className="rounded-xl bg-primary hover:bg-primary/90">
                    <Plus className="size-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center gap-4 p-3 rounded-2xl bg-background/40 border border-primary/5 hover:border-primary/20 transition-all group">
                      <div className="flex flex-col items-center justify-center min-w-12 py-1 rounded-xl bg-primary/10 text-primary font-bold text-xs">
                        <Clock className="size-3 mb-1" />
                        {event.time}
                      </div>
                      <div className="flex-1 font-medium text-sm group-hover:translate-x-1 transition-transform">
                        {event.title}
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase tracking-tighter border-primary/20 opacity-50">
                        {event.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-primary/5 flex flex-col justify-center items-center text-center space-y-3">
                <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-pulse">
                  <CalendarIcon size={32} />
                </div>
                <div>
                  <div className="text-lg font-bold">Hoje é dia 06</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Junho, 2026</div>
                </div>
                <Button variant="ghost" className="text-xs font-bold text-primary hover:bg-primary/10 rounded-full px-6">
                  Ver Calendário Completo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Widgets Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Widget title="Próximas Provas" icon={GraduationCap}>
          <div className="space-y-3 mt-2">
            <div className="flex justify-between items-center border-b border-primary/5 pb-2">
              <span className="font-medium">Cálculo III</span>
              <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Amanhã</Badge>
            </div>
            <Input placeholder="Adicionar prova..." className="h-8 text-xs bg-transparent border-primary/10" />
          </div>
        </Widget>
        
        <Widget title="Compras Urgentes" icon={Star}>
          <div className="space-y-2 mt-2">
            {["Combustível Estelar", "Suprimentos"].map(item => (
              <div key={item} className="flex items-center gap-2 text-xs">
                <div className="size-1.5 rounded-full bg-primary" />
                {item}
              </div>
            ))}
            <Input placeholder="Item de mercado..." className="h-8 text-xs bg-transparent border-primary/10" />
          </div>
        </Widget>

        <Widget title="Cardápio de Hoje" icon={Clock}>
          <div className="mt-2 p-3 rounded-xl bg-primary/5 border border-primary/10 italic text-xs text-center">
            "Sopa de Galáxia com Croutons de Meteoro"
            <div className="mt-2 flex gap-1 justify-center">
              <Badge variant="outline" className="text-[9px]">Almoço</Badge>
              <Badge variant="outline" className="text-[9px]">12:30</Badge>
            </div>
          </div>
        </Widget>

        <Widget title="Filmes Pendentes" icon={Film}>
          <div className="space-y-2 mt-2">
            <div className="flex justify-between text-xs">
              <span>Interestelar 2</span>
              <span className="text-primary font-bold">8.9</span>
            </div>
            <Input placeholder="Novo filme..." className="h-8 text-xs bg-transparent border-primary/10" />
          </div>
        </Widget>

        <Widget title="Metas da Semana" icon={Target}>
          <div className="mt-2 space-y-2">
            <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[65%]" />
            </div>
            <div className="text-[10px] flex justify-between font-bold text-primary/60">
              <span>PROGRESSO GERAL</span>
              <span>65%</span>
            </div>
            <Input placeholder="Nova meta..." className="h-8 text-xs bg-transparent border-primary/10" />
          </div>
        </Widget>

        <Widget title="Resumo IA" icon={Sparkles}>
          <div className="mt-2 text-[11px] leading-relaxed text-muted-foreground bg-white/5 p-3 rounded-xl border border-white/5">
            Você tem 3 missões hoje. O clima em sua região está favorável para observação estelar. Não esqueça de revisar Cálculo III!
          </div>
        </Widget>
      </div>
    </div>
  );
}
