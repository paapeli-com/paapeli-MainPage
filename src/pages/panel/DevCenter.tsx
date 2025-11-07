import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";

const DevCenter = () => {
  const { t } = useLanguage();

  return (
    <PanelLayout pageTitle={t("devCenter")}>
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">{t("apiDocumentation")}</h2>
          <p className="text-muted-foreground">{t("apiDocDesc")}</p>
        </Card>
      </div>
    </PanelLayout>
  );
};

export default DevCenter;
