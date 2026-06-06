"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, CheckCircle2, Loader2, Sparkles, X, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { saveDataToModule } from "@/lib/storage";

export default function AssistentePage() {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [extractionResult, setExtractionResult] = useState<{
    modulo: string;
    dados: string;
    confianca?: string;
  } | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para captura de texto
  const [textLink, setTextLink] = useState("");
  const [textContent, setTextContent] = useState("");
  const [isSubmittingText, setIsSubmittingText] = useState(false);
  const [textSubmitted, setTextSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
    }
  };

  const simulateExtraction = () => {
    if (!file) return;
    
    setIsUploading(true);
    setStatus("processing");
    
    // Simulação de processamento OCR + LLM
    setTimeout(() => {
      setIsUploading(false);
      setStatus("success");
      
      // Simulação de dados extraídos baseados no nome do arquivo ou aleatório
      const fileName = file.name.toLowerCase();
      let result = {
        modulo: "Geral",
        dados: "Informação processada com sucesso.",
        confianca: "98%"
      };

      if (fileName.includes("prova") || fileName.includes("estudo") || fileName.includes("faculdade")) {
        result = { modulo: "Faculdade", dados: "Nova prova de Cálculo detectada para 15/06", confianca: "95%" };
      } else if (fileName.includes("compra") || fileName.includes("mercado") || fileName.includes("casa")) {
        result = { modulo: "Casa", dados: "Lista de compras: Leite, Pão, Ovos", confianca: "99%" };
      } else if (fileName.includes("receita") || fileName.includes("comida")) {
        result = { modulo: "Cardápio", dados: "Receita de Lasanha Vegana extraída", confianca: "92%" };
      }

      setExtractionResult(result);
    }, 2000);
  };

  const clearFile = () => {
    setFile(null);
    setStatus("idle");
    setExtractionResult(null);
    setIsSaved(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleConfirmSave = () => {
    if (extractionResult) {
      saveDataToModule(extractionResult.modulo, extractionResult.dados);
      setIsSaved(true);
      setTimeout(() => {
        clearFile();
      }, 2000);
    }
  };

  const handleSubmitText = () => {
    if (!textContent.trim()) return;
    
    setIsSubmittingText(true);
    
    // Simulação de processamento
    setTimeout(() => {
      setIsSubmittingText(false);
      setTextSubmitted(true);
      
      // Salvar o texto em um módulo apropriado
      saveDataToModule("Ideias", textContent);
      
      // Limpar após 2 segundos
      setTimeout(() => {
        setTextLink("");
        setTextContent("");
        setTextSubmitted(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles size={18} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">IA Inteligente</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter">Assistente</h1>
        <p className="text-muted-foreground font-medium">Extraia dados de documentos e imagens para seus módulos</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Card className="bg-card/30 backdrop-blur-xl border-primary/10 shadow-2xl overflow-hidden rounded-3xl">
            <CardHeader className="pb-2 border-b border-primary/5">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary/70 flex items-center gap-2">
                <Upload size={16} /> Ingestão de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer group",
                  file ? "border-primary/40 bg-primary/5" : "border-primary/10 hover:border-primary/30 hover:bg-primary/5"
                )}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*,.pdf,.doc,.docx"
                />
                
                {file ? (
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="size-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                      {file.type.startsWith('image/') ? <ImageIcon size={32} /> : <FileText size={32} />}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{file.name}</div>
                      <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); clearFile(); }} className="text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-full">
                      <X size={14} className="mr-1" /> Remover
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Upload size={40} />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xl font-bold">Clique para Upload</div>
                      <p className="text-sm text-muted-foreground">Arraste imagens ou documentos aqui</p>
                    </div>
                  </div>
                )}
              </div>

              {file && status === "idle" && (
                <Button 
                  onClick={simulateExtraction} 
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold shadow-lg shadow-primary/20"
                >
                  <Sparkles size={20} className="mr-2" /> Iniciar Extração
                </Button>
              )}

              {status === "processing" && (
                <div className="flex flex-col items-center py-6 space-y-4">
                  <Loader2 className="size-10 text-primary animate-spin" />
                  <div className="text-center">
                    <div className="font-bold">Processando com IA...</div>
                    <p className="text-xs text-muted-foreground italic">Extraindo textos e classificando informações</p>
                  </div>
                </div>
              )}

              {status === "success" && extractionResult && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-start gap-4">
                    <div className="size-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-green-500">Extração Concluída</div>
                        <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                          Destino: {extractionResult.modulo}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{extractionResult.dados}</p>
                      <div className="flex gap-2 mt-4">
                        {isSaved ? (
                          <Button size="sm" disabled className="rounded-xl bg-green-600 text-white font-bold">
                            <CheckCircle2 size={14} className="mr-1" /> Salvo no Módulo!
                          </Button>
                        ) : (
                          <>
                            <Button onClick={handleConfirmSave} size="sm" className="rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold">
                              Confirmar e Salvar
                            </Button>
                            <Button size="sm" variant="outline" onClick={clearFile} className="rounded-xl border-primary/20 text-primary font-bold">
                              Descartar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/30 backdrop-blur-xl border-primary/10 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-50">Captura de Texto Direta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                placeholder="Cole um link relevante..." 
                className="bg-background/50 border-primary/10 rounded-xl" 
                value={textLink}
                onChange={(e) => setTextLink(e.target.value)}
              />
              <Textarea 
                placeholder="Cole anotações ou textos rápidos aqui..." 
                className="min-h-[100px] bg-background/50 border-primary/10 rounded-xl" 
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
              />
              <Button 
                onClick={handleSubmitText}
                disabled={isSubmittingText || textSubmitted}
                variant={textSubmitted ? "secondary" : "default"}
                className="w-full rounded-xl font-bold"
              >
                {isSubmittingText && <Loader2 size={16} className="mr-2 animate-spin" />}
                {textSubmitted ? "✓ Texto Salvo!" : "Enviar Texto"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/10 rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Status do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">OCR Engine</span>
                <Badge variant="outline" className="text-[9px] border-green-500/20 text-green-500 bg-green-500/5">ONLINE</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">LLM Classifier</span>
                <Badge variant="outline" className="text-[9px] border-green-500/20 text-green-500 bg-green-500/5">READY</Badge>
              </div>
              <div className="pt-4 border-t border-primary/5">
                <div className="text-[10px] font-bold uppercase text-primary/60 mb-2">Últimos Processamentos</div>
                <div className="space-y-2">
                  {[1, 2].map(i => (
                    <div key={i} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <div className="size-1 rounded-full bg-primary" />
                      <span>Documento_{i}.pdf - Sucesso</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
