import { useState } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const OTA = () => {
  const { t } = useLanguage();
  const [addPanelOpen, setAddPanelOpen] = useState(false);

  return (
    <PanelLayout pageTitle={t("otaUpdate")} onAddClick={() => setAddPanelOpen(true)}>
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("noOTAUpdatesYet")}</p>
      </div>

      <Sheet open={addPanelOpen} onOpenChange={setAddPanelOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t("addOTAUpdate")}</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </PanelLayout>
  );
};

export default OTA;
