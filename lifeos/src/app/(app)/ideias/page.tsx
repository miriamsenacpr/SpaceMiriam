import ModulePageV2 from "@/components/lifeos/module-page-v2";
import { Lightbulb } from "lucide-react";

export default function IdeiasPage() {
  return (
    <ModulePageV2
      title="Ideias"
      subtitle="captura rápida, tags, categorias, prioridades e busca inteligente"
      storageKey="IDEIAS"
      icon={<Lightbulb size={18} />}
    />
  );
}
