import ModulePageV2 from "@/components/lifeos/module-page-v2";
import { Home } from "lucide-react";

export default function CasaPage() {
  return (
    <ModulePageV2
      title="Casa"
      subtitle="organização doméstica, suprimentos e manutenção"
      storageKey="CASA"
      icon={<Home size={18} />}
    />
  );
}
