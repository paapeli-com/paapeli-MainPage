import { useState } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Devices = () => {
  const { t } = useLanguage();
  const [addPanelOpen, setAddPanelOpen] = useState(false);

  return (
    <PanelLayout pageTitle={t("devices")} onAddClick={() => setAddPanelOpen(true)}>
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("noDevicesYet")}</p>
      </div>

      <Sheet open={addPanelOpen} onOpenChange={setAddPanelOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t("addDevice")}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div>
              <Label>{t("deviceName")}</Label>
              <Input placeholder={t("enterDeviceName")} />
            </div>
            <div>
              <Label>{t("deviceId")}</Label>
              <Input placeholder={t("enterDeviceId")} />
            </div>
            <Button className="w-full">{t("addDevice")}</Button>
          </div>
        </SheetContent>
      </Sheet>
    </PanelLayout>
  );
};

export default Devices;
