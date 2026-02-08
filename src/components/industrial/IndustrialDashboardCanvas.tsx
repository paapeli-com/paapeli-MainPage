import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Menu, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  RefreshCw, 
  Pause, 
  Pencil,
  ArrowLeft,
  Settings
} from "lucide-react";
import { LocationSwitcher } from "./LocationSwitcher";
import { PlantHealthWidget } from "./PlantHealthWidget";
import { ActiveAlarmsWidget } from "./ActiveAlarmsWidget";
import { CriticalAssetsWidget } from "./CriticalAssetsWidget";
import { ForecastSummaryWidget } from "./ForecastSummaryWidget";
import { EnergyConsumptionWidget } from "./EnergyConsumptionWidget";
import { DowntimeRiskWidget } from "./DowntimeRiskWidget";
import { KeyMetricsWidget } from "./KeyMetricsWidget";
import { OverviewKPIWidget } from "./OverviewKPIWidget";
import { CarbonFootprintWidget } from "./CarbonFootprintWidget";
import { TrendsInsightsWidget } from "./TrendsInsightsWidget";
import { PlantMetricsWidget } from "./PlantMetricsWidget";
import { IndustrialDashboard, DashboardRole } from "@/types/industrial";

interface IndustrialDashboardCanvasProps {
  dashboard: IndustrialDashboard;
  onBack: () => void;
}

export const IndustrialDashboardCanvas = ({ dashboard, onBack }: IndustrialDashboardCanvasProps) => {
  const { isRTL } = useLanguage();
  const { t } = useLanguage();
  const [selectedSite, setSelectedSite] = useState(dashboard.siteId);

  const currentDate = new Date().toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isOperationsDashboard = dashboard.role === 'operator' || dashboard.role === 'maintenance';
  const isManagementDashboard = dashboard.role === 'manager' || dashboard.role === 'executive';

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Dashboard Header */}
      <header className="h-14 bg-[#1a1f2e] text-white flex items-center px-4 justify-between border-b border-[#2a3441]">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="hover:bg-white/10 p-2 rounded">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Menu className="h-5 w-5 cursor-pointer" />
          <h1 className="text-lg font-medium">{dashboard.name}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Location Switcher */}
          <LocationSwitcher 
            selectedLocation={selectedSite} 
            onLocationChange={setSelectedSite} 
          />

          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{currentDate} - Now</span>
            <ChevronLeft className="h-4 w-4 rotate-90" />
          </div>
          
          <div className="flex items-center gap-1">
            <button className="hover:bg-white/10 p-2 rounded">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="hover:bg-white/10 p-2 rounded">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <button className="hover:bg-white/10 p-2 rounded">
            <Maximize2 className="h-5 w-5" />
          </button>
          <button className="hover:bg-white/10 p-2 rounded">
            <RefreshCw className="h-5 w-5" />
          </button>
          <button className="hover:bg-white/10 p-2 rounded">
            <Pause className="h-5 w-5" />
          </button>
          <button className="hover:bg-white/10 p-2 rounded">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-6">
        {isOperationsDashboard ? (
          // Operations Dashboard Layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <PlantHealthWidget siteId={selectedSite} />
            <ActiveAlarmsWidget siteId={selectedSite} />
            <ForecastSummaryWidget siteId={selectedSite} />
            <CriticalAssetsWidget siteId={selectedSite} />
            <EnergyConsumptionWidget siteId={selectedSite} />
            <DowntimeRiskWidget siteId={selectedSite} />
            <div className="lg:col-span-2">
              <KeyMetricsWidget siteId={selectedSite} />
            </div>
          </div>
        ) : (
          // Management Dashboard Layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <PlantHealthWidget siteId={selectedSite} />
            <OverviewKPIWidget siteId={selectedSite} />
            <ForecastSummaryWidget siteId={selectedSite} />
            <CriticalAssetsWidget siteId={selectedSite} />
            <CarbonFootprintWidget siteId={selectedSite} />
            <TrendsInsightsWidget siteId={selectedSite} />
            <PlantMetricsWidget siteId={selectedSite} />
            <DowntimeRiskWidget siteId={selectedSite} />
          </div>
        )}

        {/* Location Context Indicator */}
        <div className="mt-6 p-4 bg-card rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-muted-foreground text-sm">{t("currentView")}: </span>
              <span className="font-medium">
                {selectedSite === 'all' ? t("allLocations") : t("singleLocation")}
              </span>
            </div>
            {selectedSite === 'all' && (
              <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                {t("highLevelKPIsOnly")}
              </span>
            )}
            {selectedSite !== 'all' && (
              <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded">
                {t("fullSiteData")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
