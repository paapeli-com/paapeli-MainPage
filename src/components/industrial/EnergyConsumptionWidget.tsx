import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getKPIBySite } from "@/data/mockIndustrialData";
import { TrendingUp, Zap } from "lucide-react";

interface EnergyConsumptionWidgetProps {
  siteId: string;
}

export const EnergyConsumptionWidget = ({ siteId }: EnergyConsumptionWidgetProps) => {
  const kpi = getKPIBySite(siteId);
  
  if (!kpi) return null;

  // Mock chart data
  const chartData = [40, 35, 45, 50, 42, 38, 55, 60, 58, 52, 48, 45];

  return (
    <Card className="bg-[#1a1f2e] border-[#2a3441]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-white flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-500" />
          Energy Consumption
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-bold text-white">{kpi.energyConsumption}</span>
          <span className="text-lg text-gray-400">{kpi.energyUnit}</span>
        </div>
        
        <div className="relative h-16 flex items-end gap-1">
          {chartData.map((value, index) => (
            <div 
              key={index}
              className="flex-1 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t"
              style={{ height: `${value}%` }}
            />
          ))}
          {/* Trend line overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full">
              <path
                d="M0,40 Q20,35 40,45 T80,42 T120,55 T160,58 T200,48"
                fill="none"
                stroke="rgba(234, 179, 8, 0.5)"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
          <TrendingUp className="h-3 w-3 text-green-500" />
          <span>Predicted linear</span>
        </div>
      </CardContent>
    </Card>
  );
};
