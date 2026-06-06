import ModulePageV2 from "@/components/lifeos/module-page-v2";
import { GraduationCap } from "lucide-react";

export default function FaculdadePage() {
  return (
    <ModulePageV2
      title="Faculdade"
      subtitle="matérias, trabalhos, provas e anotações"
      storageKey="FACULDADE"
      icon={<GraduationCap size={18} />}
    />
  );
}
