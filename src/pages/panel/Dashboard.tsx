import { useState } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const Dashboard = () => {
  const { t } = useLanguage();
  const [addPanelOpen, setAddPanelOpen] = useState(false);

  return (
    <PanelLayout pageTitle={t("dashboard")} onAddClick={() => setAddPanelOpen(true)}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">{t("totalDevices")}</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">{t("activeDevices")}</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">{t("alerts")}</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>
      </div>

      <Sheet open={addPanelOpen} onOpenChange={setAddPanelOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t("addNew")}</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </PanelLayout>
  );
};

export default Dashboard;
