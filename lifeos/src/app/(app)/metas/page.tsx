import ModulePageV2 from "@/components/lifeos/module-page-v2";
import { Target } from "lucide-react";

export default function MetasPage() {
  return (
    <ModulePageV2
      title="Metas"
      subtitle="seus objetivos de curto e longo prazo"
      storageKey="METAS"
      icon={<Target size={18} />}
    />
  );
}
