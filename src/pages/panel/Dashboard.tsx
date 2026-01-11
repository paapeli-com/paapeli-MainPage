import { useState, useEffect } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface Gateway {
  id: string;
  name: string;
  status: string;
  [key: string]: unknown;
}

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
        // Fetch devices
        const devicesResponse = await apiRequest("/api/v1/gateways");
        const devicesData = devicesResponse.data || [];

        // Count total and active devices
        const totalDevices = devicesData.length;
        const activeDevices = devicesData.filter((item: Gateway) =>
          item.status === "active"
        ).length;

        // Fetch alerts count
        let alertsCount = 0;
        try {
          const alertsResponse = await apiRequest("/api/v1/alerts/count");
          alertsCount = alertsResponse.total || 0;
        } catch (alertsError) {
          console.warn("Failed to fetch alerts count:", alertsError);
          // Keep alerts as 0 if API fails
        }

        setStats({
          totalDevices,
          activeDevices,
          alerts: alertsCount,
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
