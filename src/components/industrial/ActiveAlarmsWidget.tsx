import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getKPIBySite } from "@/data/mockIndustrialData";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface ActiveAlarmsWidgetProps {
  siteId: string;
}

export const ActiveAlarmsWidget = ({ siteId }: ActiveAlarmsWidgetProps) => {
  const kpi = getKPIBySite(siteId);
  
  if (!kpi) return null;

  return (
    <Card className="bg-[#1a1f2e] border-[#2a3441]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-white">Active Alarms</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center">
            <Badge className="bg-red-600 text-white px-3 py-1 text-xs mb-1">CRTCL</Badge>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-2xl font-bold text-white">{kpi.activeAlarms.critical}</span>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <span className="text-xs text-gray-400">Critical</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Badge className="bg-orange-500 text-white px-3 py-1 text-xs mb-1">⚠</Badge>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-2xl font-bold text-white">{kpi.activeAlarms.warning}</span>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </div>
            <span className="text-xs text-gray-400">Warning</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Badge className="bg-blue-500 text-white px-3 py-1 text-xs mb-1">ℹ</Badge>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-2xl font-bold text-white">{kpi.activeAlarms.info}</span>
              <Info className="h-4 w-4 text-blue-500" />
            </div>
            <span className="text-xs text-gray-400">Info</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
