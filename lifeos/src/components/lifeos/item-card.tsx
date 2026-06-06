"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  X,
  FileText,
  Link as LinkIcon,
  Calendar,
  Trash2,
  Copy,
  Pencil,
  ChevronDown,
  ChevronUp,
  Paperclip,
  Tag,
  ExternalLink,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface DocumentAttachment {
  name: string;
  url: string;
  type?: string;
  size?: number;
}

export interface ItemData {
  id: string;
  title: string;
  description?: string;
  date?: string;
  link?: string;
  documents?: DocumentAttachment[];
  tags?: string[];
}

export type UploadDocumentsFn = (files: File[]) => Promise<DocumentAttachment[]>;

interface ItemCardProps {
  item: ItemData;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, data: Partial<ItemData>) => void;
  isEditing?: boolean;
  uploadDocuments?: UploadDocumentsFn;
}

export function ItemCard({
  item,
  onDelete,
  onUpdate,
  isEditing = false,
  uploadDocuments,
}: ItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editMode, setEditMode] = useState(isEditing);
  const [editData, setEditData] = useState<Partial<ItemData>>(item);
  const [tagInput, setTagInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (onUpdate) onUpdate(item.id, editData);
    setEditMode(false);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const parts = [item.title];
    if (item.description) parts.push(item.description);
    if (item.date) parts.push(`Data: ${new Date(item.date + "T12:00:00").toLocaleDateString("pt-BR")}`);
    if (item.link) parts.push(`Link: ${item.link}`);
    if (item.tags?.length) parts.push(`Tags: ${item.tags.join(", ")}`);
    navigator.clipboard.writeText(parts.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (!tag) return;
    const current = editData.tags || [];
    if (!current.includes(tag)) setEditData({ ...editData, tags: [...current, tag] });
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setEditData({ ...editData, tags: (editData.tags || []).filter((t) => t !== tag) });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileList = Array.from(files);
    setUploading(true);
    try {
      let newDocs: DocumentAttachment[];

      if (uploadDocuments) {
        newDocs = await uploadDocuments(fileList);
      } else {
        newDocs = fileList.map((file) => ({
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
          size: file.size,
        }));
      }

      setEditData({ ...editData, documents: [...(editData.documents || []), ...newDocs] });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveDoc = (idx: number) => {
    const docs = [...(editData.documents || [])];
    docs.splice(idx, 1);
    setEditData({ ...editData, documents: docs });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR");
    } catch {
      return dateStr;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  // ── EDIT MODE ──────────────────────────────────────────────────────────────
  if (editMode) {
    return (
      <Card className="bg-card/60 backdrop-blur-xl border-primary/30 shadow-xl overflow-hidden rounded-2xl ring-2 ring-primary/30">
        <CardContent className="p-4 space-y-3">
          <Input
            placeholder="Título..."
            value={editData.title || ""}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="bg-background/50 border-primary/20 rounded-xl font-bold text-base"
          />

          <Textarea
            placeholder="Descrição..."
            value={editData.description || ""}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="bg-background/50 border-primary/20 rounded-xl min-h-20 text-sm resize-none"
          />

          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-primary shrink-0" />
            <Input
              type="date"
              value={editData.date || ""}
              onChange={(e) => setEditData({ ...editData, date: e.target.value })}
              className="bg-background/50 border-primary/20 rounded-xl text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <LinkIcon size={14} className="text-primary shrink-0" />
            <Input
              placeholder="Link (URL)..."
              value={editData.link || ""}
              onChange={(e) => setEditData({ ...editData, link: e.target.value })}
              className="bg-background/50 border-primary/20 rounded-xl text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-primary shrink-0" />
              <Input
                placeholder="Adicionar tag e pressionar Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="bg-background/50 border-primary/20 rounded-xl text-sm"
              />
            </div>
            {(editData.tags || []).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {(editData.tags || []).map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs rounded-full bg-primary/15 text-primary border-0 gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-400 ml-0.5"
                      type="button"
                    >
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg border-primary/20 text-primary hover:bg-primary/10 text-xs"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Enviando..." : "Anexar Documento"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {(editData.documents || []).length > 0 && (
              <div className="space-y-1">
                {(editData.documents || []).map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10"
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
              onClick={handleSave}
              className="flex-1 rounded-xl bg-primary hover:bg-primary/90 font-bold text-sm"
              disabled={uploading}
            >
              Salvar
            </Button>
            <Button
              onClick={() => {
                setEditMode(false);
                setEditData(item);
              }}
              variant="outline"
              className="flex-1 rounded-xl border-primary/20 text-sm"
              disabled={uploading}
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── VIEW MODE ──────────────────────────────────────────────────────────────
  const hasExtras = item.link || (item.documents && item.documents.length > 0);

  return (
    <Card
      className={cn(
        "bg-card/40 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-lg overflow-hidden rounded-2xl group",
        isExpanded && "ring-2 ring-primary/40 bg-card/60"
      )}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {item.date && (
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 text-xs mb-1.5"
              >
                <Calendar size={10} className="mr-1" />
                {formatDate(item.date)}
              </Badge>
            )}
            <h3 className="font-bold text-base leading-tight text-foreground group-hover:text-primary transition-colors truncate">
              {item.title}
            </h3>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditMode(true);
                setIsExpanded(false);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary p-1 rounded-md hover:bg-primary/10"
              title="Editar"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary p-1 rounded-md hover:bg-primary/10"
              title="Copiar"
            >
              {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-400 p-1 rounded-md hover:bg-red-500/10"
              title="Deletar"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {item.description && (
          <p className={cn("text-sm text-muted-foreground leading-relaxed", !isExpanded && "line-clamp-2")}>
            {item.description}
          </p>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="text-xs rounded-full bg-primary/10 text-primary border-0"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {!isExpanded && hasExtras && (
          <div className="flex gap-2 text-xs text-muted-foreground">
            {item.link && (
              <span className="flex items-center gap-1 text-primary/60">
                <LinkIcon size={11} /> link
              </span>
            )}
            {item.documents && item.documents.length > 0 && (
              <span className="flex items-center gap-1 text-primary/60">
                <Paperclip size={11} /> {item.documents.length} doc{item.documents.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {isExpanded && (
          <div className="pt-2 border-t border-primary/10 space-y-2">
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/15 hover:border-primary/30 hover:bg-primary/10 transition-all group/link"
              >
                <LinkIcon size={14} className="text-primary shrink-0" />
                <span className="text-sm text-primary truncate flex-1">{item.link}</span>
                <ExternalLink
                  size={12}
                  className="text-primary/50 opacity-0 group-hover/link:opacity-100 transition-opacity"
                />
              </a>
            )}

            {item.documents && item.documents.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-primary/50 uppercase tracking-widest">Documentos</p>
                {item.documents.map((doc, i) => (
                  <a
                    key={i}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/15 hover:border-primary/30 hover:bg-primary/10 transition-all"
                  >
                    <FileText size={14} className="text-primary shrink-0" />
                    <span className="text-sm text-primary truncate flex-1">{doc.name}</span>
                    {doc.size && (
                      <span className="text-xs text-muted-foreground">{formatFileSize(doc.size)}</span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {(hasExtras || (item.description && item.description.length > 80)) && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-primary/50 hover:text-primary transition-colors w-full justify-center pt-1"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={14} /> Recolher
              </>
            ) : (
              <>
                <ChevronDown size={14} /> Ver mais
              </>
            )}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
