import { useState } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const Gateways = () => {
  const { t } = useLanguage();
  const [addPanelOpen, setAddPanelOpen] = useState(false);

  return (
    <PanelLayout pageTitle={t("gateways")} onAddClick={() => setAddPanelOpen(true)}>
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("noGatewaysYet")}</p>
      </div>

      <Sheet open={addPanelOpen} onOpenChange={setAddPanelOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t("addGateway")}</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </PanelLayout>
  );
};

export default Gateways;
