import ModulePageV2 from "@/components/lifeos/module-page-v2";
import { UtensilsCrossed } from "lucide-react";

export default function CardapioPage() {
  return (
    <ModulePageV2
      title="Cardápio"
      subtitle="receitas e planejamento de refeições"
      storageKey="CARDAPIO"
      icon={<UtensilsCrossed size={18} />}
    />
  );
}
