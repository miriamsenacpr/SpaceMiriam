"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Sparkles,
  Calendar,
  Link as LinkIcon,
  Tag,
  Paperclip,
  X,
  FileText,
  Cloud,
} from "lucide-react";
import { ItemCard, ItemData, DocumentAttachment, UploadDocumentsFn } from "./item-card";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { toast } from "sonner";

interface ModulePageV2Props {
  title: string;
  subtitle: string;
  storageKey: string; // também é o "module" quando usando Supabase
  icon?: React.ReactNode;
}

type NotesRow = {
  id: string;
  title: string | null;
  content: string;
  module: string | null;
  created_at?: string;
  updated_at?: string;
};

function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export default function ModulePageV2({ title, subtitle, storageKey, icon }: ModulePageV2Props) {
  const [items, setItems] = useState<ItemData[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = window.localStorage.getItem(storageKey);
    return saved ? safeJsonParse<ItemData[]>(saved, []) : [];
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newItem, setNewItem] = useState<Partial<ItemData>>({
    title: "",
    description: "",
    date: "",
    link: "",
    tags: [],
    documents: [],
  });

  const supabaseEnabled = useMemo(() => {
    return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }, []);

  const [cloudMode, setCloudMode] = useState<"local" | "cloud">("local");
  const [cloudReady, setCloudReady] = useState(false);

  // ── LOAD ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Se Supabase estiver configurado, tenta modo cloud.
    // (O modo local já é carregado no initializer do useState.)
    if (!supabaseEnabled) return;

    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setCloudMode("local");
          setCloudReady(true);
          return;
        }

        const { data, error } = await supabase
          .from("notes")
          .select("id,title,content,module,created_at,updated_at")
          .eq("module", storageKey)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const mapped = (data as NotesRow[]).map((row) => {
          const payload = safeJsonParse<Partial<ItemData>>(row.content, {});
          return {
            id: row.id,
            title: row.title || payload.title || "(sem título)",
            description: payload.description,
            date: payload.date,
            link: payload.link,
            tags: payload.tags || [],
            documents: payload.documents || [],
          } satisfies ItemData;
        });

        setItems(mapped);
        setCloudMode("cloud");
        setCloudReady(true);

        const channel = supabase
          .channel(`lifeos-notes-${storageKey}`)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "notes", filter: `module=eq.${storageKey}` },
            async () => {
              const { data: fresh } = await supabase
                .from("notes")
                .select("id,title,content,module,created_at,updated_at")
                .eq("module", storageKey)
                .order("created_at", { ascending: false });

              const remapped = ((fresh || []) as NotesRow[]).map((row) => {
                const payload = safeJsonParse<Partial<ItemData>>(row.content, {});
                return {
                  id: row.id,
                  title: row.title || payload.title || "(sem título)",
                  description: payload.description,
                  date: payload.date,
                  link: payload.link,
                  tags: payload.tags || [],
                  documents: payload.documents || [],
                } satisfies ItemData;
              });

              setItems(remapped);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (e: unknown) {
        console.warn(e);
        setCloudMode("local");
        setCloudReady(true);
      }
    })();
  }, [storageKey, supabaseEnabled]);

  const saveItemsLocal = (newItems: ItemData[]) => {
    setItems(newItems);
    localStorage.setItem(storageKey, JSON.stringify(newItems));
  };

  // ── HELPERS ────────────────────────────────────────────────────────────────
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (!tag) return;
    const current = newItem.tags || [];
    if (!current.includes(tag)) setNewItem({ ...newItem, tags: [...current, tag] });
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setNewItem({ ...newItem, tags: (newItem.tags || []).filter((t) => t !== tag) });
  };

  const uploadDocuments: UploadDocumentsFn = async (files) => {
    // Se não tiver cloud, volta para objectURL (modo local)
    if (!supabaseEnabled || cloudMode !== "cloud") {
      return files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
      }));
    }

    const supabase = createSupabaseBrowserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
      }));
    }

    const userId = session.user.id;
    const bucket = "lifeos";

    const uploaded: DocumentAttachment[] = [];

    for (const file of files) {
      const path = `${userId}/${storageKey}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
        upsert: false,
        contentType: file.type || undefined,
      });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);

      uploaded.push({
        name: file.name,
        url: pub.publicUrl,
        type: file.type,
        size: file.size,
      });
    }

    return uploaded;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const docs = await uploadDocuments(Array.from(files));
      setNewItem({ ...newItem, documents: [...(newItem.documents || []), ...docs] });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar arquivos");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveDoc = (idx: number) => {
    const docs = [...(newItem.documents || [])];
    docs.splice(idx, 1);
    setNewItem({ ...newItem, documents: docs });
  };

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleAddItem = async () => {
    if (!newItem.title?.trim()) return;

    if (!supabaseEnabled || cloudMode !== "cloud") {
      const item: ItemData = {
        id: Date.now().toString(),
        title: newItem.title || "",
        description: newItem.description,
        date: newItem.date,
        link: newItem.link,
        documents: newItem.documents || [],
        tags: newItem.tags || [],
      };

      saveItemsLocal([item, ...items]);
      setNewItem({ title: "", description: "", date: "", link: "", tags: [], documents: [] });
      setTagInput("");
      setIsAddingNew(false);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();

      const payload: Partial<ItemData> = {
        title: newItem.title || "",
        description: newItem.description,
        date: newItem.date,
        link: newItem.link,
        tags: newItem.tags || [],
        documents: newItem.documents || [],
      };

      const { error } = await supabase.from("notes").insert({
        title: payload.title,
        content: JSON.stringify(payload),
        module: storageKey,
      });

      if (error) throw error;

      setNewItem({ title: "", description: "", date: "", link: "", tags: [], documents: [] });
      setTagInput("");
      setIsAddingNew(false);
      toast.success("Item criado e sincronizado");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erro ao criar item no cloud");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!supabaseEnabled || cloudMode !== "cloud") {
      saveItemsLocal(items.filter((item) => item.id !== id));
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
      toast.success("Item removido");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erro ao remover");
    }
  };

  const handleUpdateItem = async (id: string, data: Partial<ItemData>) => {
    if (!supabaseEnabled || cloudMode !== "cloud") {
      saveItemsLocal(items.map((item) => (item.id === id ? { ...item, ...data } : item)));
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const current = items.find((i) => i.id === id);
      const merged = { ...current, ...data };

      const payload: Partial<ItemData> = {
        title: merged.title,
        description: merged.description,
        date: merged.date,
        link: merged.link,
        tags: merged.tags || [],
        documents: merged.documents || [],
      };

      const { error } = await supabase
        .from("notes")
        .update({ title: payload.title, content: JSON.stringify(payload) })
        .eq("id", id);

      if (error) throw error;
      toast.success("Item atualizado");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erro ao atualizar");
    }
  };

  const filteredItems = items.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-primary">
            {icon || <Sparkles size={18} />}
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">LifeOS</span>
          </div>

          <Badge
            variant="outline"
            className="bg-primary/5 border-primary/20 text-primary flex items-center gap-1"
          >
            <Cloud size={12} />
            {supabaseEnabled ? (cloudMode === "cloud" ? "Cloud" : cloudReady ? "Local" : "...") : "Local"}
          </Badge>
        </div>

        <h1 className="text-4xl font-black tracking-tighter">{title}</h1>
        <p className="text-muted-foreground font-medium">{subtitle}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por título, descrição ou tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50 border-primary/10 rounded-xl"
          />
        </div>
        <Button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold"
        >
          <Plus size={16} className="mr-2" /> Novo Item
        </Button>
      </div>

      {isAddingNew && (
        <Card className="bg-primary/5 border-primary/25 backdrop-blur-xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-4">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary/70">
              Adicionar Novo Item
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-5 pb-5">
            <Input
              placeholder="Título do item *"
              value={newItem.title || ""}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className="bg-background/50 border-primary/15 rounded-xl font-semibold text-base"
              onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              autoFocus
            />

            <Textarea
              placeholder="Descrição (opcional)..."
              value={newItem.description || ""}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="bg-background/50 border-primary/15 rounded-xl min-h-20 text-sm resize-none"
            />

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-background/50 border border-primary/15 rounded-xl px-3 h-10">
                <Calendar size={14} className="text-primary shrink-0" />
                <input
                  type="date"
                  value={newItem.date || ""}
                  onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                  className="flex-1 bg-transparent text-sm outline-none text-foreground"
                />
              </div>
              <div className="flex items-center gap-2 bg-background/50 border border-primary/15 rounded-xl px-3 h-10">
                <LinkIcon size={14} className="text-primary shrink-0" />
                <input
                  type="url"
                  placeholder="Link (URL)..."
                  value={newItem.link || ""}
                  onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                  className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-background/50 border border-primary/15 rounded-xl px-3 h-10">
                <Tag size={14} className="text-primary shrink-0" />
                <input
                  type="text"
                  placeholder="Adicionar tag e pressionar Enter..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                />
                {tagInput && (
                  <button
                    onClick={handleAddTag}
                    className="text-primary text-xs font-bold hover:text-primary/70"
                    type="button"
                  >
                    + add
                  </button>
                )}
              </div>
              {(newItem.tags || []).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {(newItem.tags || []).map((tag, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="text-xs rounded-full bg-primary/15 text-primary border-0 gap-1"
                    >
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-400" type="button">
                        <X size={10} />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Paperclip size={14} className="text-primary shrink-0" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-primary hover:text-primary/70 font-medium transition-colors"
                >
                  Anexar documento ou arquivo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              {(newItem.documents || []).length > 0 && (
                <div className="space-y-1">
                  {(newItem.documents || []).map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-xl bg-primary/5 border border-primary/10"
                    >
                      <FileText size={13} className="text-primary shrink-0" />
                      <span className="text-xs text-primary truncate flex-1">{doc.name}</span>
                      {doc.size && (
                        <span className="text-xs text-muted-foreground">{formatFileSize(doc.size)}</span>
                      )}
                      <button
                        onClick={() => handleRemoveDoc(i)}
                        className="text-muted-foreground hover:text-red-400"
                        type="button"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                onClick={handleAddItem}
                disabled={!newItem.title?.trim()}
                className="flex-1 rounded-xl bg-primary hover:bg-primary/90 font-bold disabled:opacity-40"
              >
                Criar Item
              </Button>
              <Button
                onClick={() => {
                  setIsAddingNew(false);
                  setNewItem({ title: "", description: "", date: "", link: "", tags: [], documents: [] });
                  setTagInput("");
                }}
                variant="outline"
                className="flex-1 rounded-xl border-primary/20"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredItems.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onDelete={handleDeleteItem}
              onUpdate={handleUpdateItem}
              uploadDocuments={uploadDocuments}
            />
          ))}
        </div>
      ) : (
        <Card className="bg-card/30 backdrop-blur-xl border-primary/10 rounded-2xl">
          <CardContent className="p-12 text-center space-y-4">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
              {icon || <Sparkles size={32} />}
            </div>
            <div>
              <h3 className="font-bold text-lg">{searchTerm ? "Nenhum resultado encontrado" : "Nada por aqui ainda"}</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? `Sem itens para "${searchTerm}"` : "Crie seu primeiro item para começar"}
              </p>
            </div>
            {!searchTerm && (
              <Button
                onClick={() => setIsAddingNew(true)}
                className="rounded-xl bg-primary hover:bg-primary/90 font-bold mx-auto"
              >
                <Plus size={16} className="mr-2" /> Criar Primeiro Item
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center pt-4 border-t border-primary/10">
          <Badge variant="outline" className="bg-primary/5 border-primary/20">
            Total: {items.length}
          </Badge>
          {items.filter((i) => i.date).length > 0 && (
            <Badge variant="outline" className="bg-primary/5 border-primary/20">
              <Calendar size={11} className="mr-1" />
              Com data: {items.filter((i) => i.date).length}
            </Badge>
          )}
          {items.filter((i) => i.link).length > 0 && (
            <Badge variant="outline" className="bg-primary/5 border-primary/20">
              <LinkIcon size={11} className="mr-1" />
              Com link: {items.filter((i) => i.link).length}
            </Badge>
          )}
          {items.filter((i) => i.documents && i.documents.length > 0).length > 0 && (
            <Badge variant="outline" className="bg-primary/5 border-primary/20">
              <Paperclip size={11} className="mr-1" />
              Com docs: {items.filter((i) => i.documents && i.documents.length > 0).length}
            </Badge>
          )}
          {items.filter((i) => i.tags && i.tags.length > 0).length > 0 && (
            <Badge variant="outline" className="bg-primary/5 border-primary/20">
              <Tag size={11} className="mr-1" />
              Com tags: {items.filter((i) => i.tags && i.tags.length > 0).length}
            </Badge>
          )}
        </div>
      )}

      {supabaseEnabled && cloudReady && cloudMode !== "cloud" && (
        <div className="text-center text-xs text-muted-foreground">
          Para ativar sincronização em nuvem, faça login em <span className="text-primary font-semibold">/login</span>.
        </div>
      )}
    </div>
  );
}
