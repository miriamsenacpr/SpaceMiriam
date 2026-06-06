import ModulePageV2 from "@/components/lifeos/module-page-v2";
import { Film } from "lucide-react";

export default function MidiaPage() {
  return (
    <ModulePageV2
      title="Filmes & Séries"
      subtitle="pendentes, em andamento, favoritos e tempo assistido"
      storageKey="MIDIA"
      icon={<Film size={18} />}
    />
  );
}
