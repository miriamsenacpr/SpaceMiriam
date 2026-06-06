import ModulePage from "@/components/lifeos/module-page";

export default function CardapioPage() {
  return (
    <ModulePage
      title="Cardápio"
      subtitle="receitas e planejamento de refeições"
      placeholder="Nova receita ou refeição..."
      storageKey="CARDAPIO"
    />
  );
}
