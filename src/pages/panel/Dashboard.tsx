import { useState, useEffect } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardStats {
  totalDevices: number;
  activeDevices: number;
  alerts: number;
}

const Dashboard = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalDevices: 0,
    activeDevices: 0,
    alerts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await apiRequest("/api/v1/collectors");
        const data = response.collectors || [];
        
        // Count total and active devices
        const totalDevices = data.length;
        const activeDevices = data.filter((item: any) => 
          item.collector?.status === "active"
        ).length;

        setStats({
          totalDevices,
          activeDevices,
          alerts: 0, // TODO: Implement alerts API
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated]);

  return (
    <PanelLayout pageTitle={t("dashboard")} onAddClick={() => setAddPanelOpen(true)}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">{t("totalDevices")}</h3>
          <p className="text-3xl font-bold">{loading ? "..." : stats.totalDevices}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">{t("activeDevices")}</h3>
          <p className="text-3xl font-bold">{loading ? "..." : stats.activeDevices}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">{t("alerts")}</h3>
          <p className="text-3xl font-bold">{loading ? "..." : stats.alerts}</p>
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
