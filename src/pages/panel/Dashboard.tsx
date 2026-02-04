import { useState } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { AddDashboardDialog, DashboardConfig } from "@/components/dashboard/AddDashboardDialog";
import { DashboardCanvas } from "@/components/dashboard/DashboardCanvas";

const Dashboard = () => {
  const { t } = useLanguage();
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [dashboards, setDashboards] = useState<DashboardConfig[]>([]);
  const [activeDashboard, setActiveDashboard] = useState<DashboardConfig | null>(null);

  const handleSaveDashboard = (config: DashboardConfig) => {
    setDashboards([...dashboards, config]);
    setActiveDashboard(config);
  };

  const handleBackFromCanvas = () => {
    setActiveDashboard(null);
  };

  // If a dashboard is active, show the canvas view
  if (activeDashboard) {
    return (
      <DashboardCanvas 
        dashboard={activeDashboard} 
        onBack={handleBackFromCanvas}
      />
    );
  }

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

      {/* List of created dashboards */}
      {dashboards.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">{t("dashboard")}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dashboards.map((dashboard, index) => (
              <Card 
                key={index} 
                className="p-4 cursor-pointer hover:border-primary transition-colors"
                onClick={() => setActiveDashboard(dashboard)}
              >
                <h3 className="font-medium">{dashboard.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {dashboard.dynamicDashboard} • {dashboard.width}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      <AddDashboardDialog 
        open={addPanelOpen} 
        onOpenChange={setAddPanelOpen}
        onSave={handleSaveDashboard}
      />
    </PanelLayout>
  );
};

export default Dashboard;
