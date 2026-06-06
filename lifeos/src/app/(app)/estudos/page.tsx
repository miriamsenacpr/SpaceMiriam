import ModulePageV2 from "@/components/lifeos/module-page-v2";
import { BookOpen } from "lucide-react";

export default function EstudosPage() {
  return (
    <ModulePageV2
      title="Estudos"
      subtitle="cursos, vídeos, livros, artigos, podcasts e progresso"
      storageKey="ESTUDOS"
      icon={<BookOpen size={18} />}
    />
  );
}
