import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getKPIBySite } from "@/data/mockIndustrialData";
import { Clock, AlertTriangle } from "lucide-react";

interface DowntimeRiskWidgetProps {
  siteId: string;
}

export const DowntimeRiskWidget = ({ siteId }: DowntimeRiskWidgetProps) => {
  const kpi = getKPIBySite(siteId);
  
  if (!kpi) return null;

  const getRiskColor = (risk: number) => {
    if (risk <= 5) return 'text-green-500';
    if (risk <= 10) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="bg-[#1a1f2e] border-[#2a3441]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-white flex items-center gap-2">
          <Clock className="h-4 w-4 text-orange-500" />
          Downtime Risk
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-sm text-gray-400">Up to</span>
            <span className={`text-4xl font-bold ${getRiskColor(kpi.downTimeRisk)}`}>
              {kpi.downTimeRisk}
            </span>
            <span className="text-lg text-gray-400">hours</span>
          </div>
          <span className="text-sm text-gray-500">{kpi.riskTimeframe}</span>
        </div>
        
        {/* Risk visualization bar */}
        <div className="mt-4 h-2 bg-[#2a3441] rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${kpi.downTimeRisk <= 5 ? 'bg-green-500' : kpi.downTimeRisk <= 10 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(kpi.downTimeRisk * 5, 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
