"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Search, Filter, Rocket, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePersistedData, STORAGE_KEYS } from "@/lib/storage";

interface Item {
  id: string;
  title: string;
  category?: string;
  date?: string;
}

function ModulePage({ 
  title, 
  subtitle, 
  placeholder = "Adicionar novo item...",
  storageKey = "FACULDADE"
}: { 
  title: string; 
  subtitle: string;
  placeholder?: string;
  storageKey?: keyof typeof STORAGE_KEYS;
}) {
  const { data: items, setData: setItems, addItem: addNewItem } = usePersistedData<Item[]>(
    STORAGE_KEYS[storageKey],
    []
  );
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    addNewItem({
      id: Math.random().toString(36).substring(7),
      title: inputValue,
      date: new Date().toLocaleDateString('pt-BR'),
    });
    setInputValue("");
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };


  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Rocket size={18} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">LifeOS</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter">{title}</h1>
          <p className="text-muted-foreground font-medium">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full border-primary/20 text-primary">
            <Search size={16} />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full border-primary/20 text-primary">
            <Filter size={16} />
          </Button>
        </div>
      </div>

      <Card className="bg-primary/5 border-primary/10 backdrop-blur-xl shadow-2xl overflow-hidden rounded-3xl">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-primary/40 group-focus-within:text-primary transition-colors">
                <Star size={16} fill="currentColor" />
              </div>
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder={placeholder}
                className="pl-11 h-14 bg-background/50 border-primary/20 focus-visible:ring-primary rounded-2xl text-base shadow-inner"
              />
            </div>
            <Button onClick={handleAdd} className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95">
              <Plus className="mr-2 size-5" /> Inserir
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
            <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Rocket size={40} className="text-primary" />
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold uppercase tracking-widest">Nada por aqui</div>
              <p className="text-sm">Adicione novos itens para começar.</p>
            </div>
          </div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="bg-card/30 backdrop-blur-md border-primary/5 hover:border-primary/20 transition-all group overflow-hidden rounded-2xl">
              <CardContent className="p-5">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-[9px] uppercase tracking-tighter border-primary/20 text-primary font-bold">
                      {item.date}
                    </Badge>
                    <div className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default ModulePage;
