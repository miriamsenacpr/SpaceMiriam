import ModulePageV2 from "@/components/lifeos/module-page-v2";
import { Library } from "lucide-react";

export default function BibliotecaPage() {
  return (
    <ModulePageV2
      title="Biblioteca"
      subtitle="livros, artigos, PDFs, vídeos salvos e links importantes"
      storageKey="BIBLIOTECA"
      icon={<Library size={18} />}
    />
  );
}
