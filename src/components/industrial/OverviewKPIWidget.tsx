import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getKPIBySite, mockSites } from "@/data/mockIndustrialData";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Zap, Leaf } from "lucide-react";

interface OverviewKPIWidgetProps {
  siteId: string;
}

export const OverviewKPIWidget = ({ siteId }: OverviewKPIWidgetProps) => {
  const kpi = getKPIBySite(siteId);
  
  if (!kpi) return null;

  return (
    <Card className="bg-[#1a1f2e] border-[#2a3441]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-white">Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-4">
          {/* Critical Alarms */}
          <div className="text-center p-3 rounded bg-[#232a3b]">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-red-500">{kpi.activeAlarms.critical}</span>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <span className="text-xs text-gray-400">Critical</span>
          </div>
          
          {/* Warnings */}
          <div className="text-center p-3 rounded bg-[#232a3b]">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-orange-500">{kpi.activeAlarms.warning}</span>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </div>
            <span className="text-xs text-gray-400">Warning</span>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-gray-400">Balance</span>
            </div>
            <span className="text-white">Gefence</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-gray-400">Loop vertes</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
