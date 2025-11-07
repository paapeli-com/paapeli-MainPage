import { useState } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PanelHome = () => {
  const { t } = useLanguage();
  const [addPanelOpen, setAddPanelOpen] = useState(false);

  return (
    <PanelLayout pageTitle={t("home")} onAddClick={() => setAddPanelOpen(true)}>
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">{t("welcomeToPanel")}</h2>
          <p className="text-muted-foreground">{t("homePanelDesc")}</p>
        </Card>
      </div>

      <Sheet open={addPanelOpen} onOpenChange={setAddPanelOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t("addNew")}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div>
              <Label>{t("name")}</Label>
              <Input placeholder={t("enterName")} />
            </div>
            <Button className="w-full">{t("create")}</Button>
          </div>
        </SheetContent>
      </Sheet>
    </PanelLayout>
  );
};

export default PanelHome;
