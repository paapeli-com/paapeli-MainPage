import { useState } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const Alarms = () => {
  const { t } = useLanguage();
  const [addPanelOpen, setAddPanelOpen] = useState(false);

  return (
    <PanelLayout pageTitle={t("alarms")} onAddClick={() => setAddPanelOpen(true)}>
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("noAlarmsYet")}</p>
      </div>

      <Sheet open={addPanelOpen} onOpenChange={setAddPanelOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t("addAlarm")}</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </PanelLayout>
  );
};

export default Alarms;
