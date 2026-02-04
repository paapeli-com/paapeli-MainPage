import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getKPIBySite } from "@/data/mockIndustrialData";
import { Leaf } from "lucide-react";

interface CarbonFootprintWidgetProps {
  siteId: string;
}

export const CarbonFootprintWidget = ({ siteId }: CarbonFootprintWidgetProps) => {
  const kpi = getKPIBySite(siteId);
  
  if (!kpi) return null;

  // Mock historical data
  const chartData = [30, 35, 32, 38, 42, 40, 45, 50, 48, 52, 55];
  const maxValue = Math.max(...chartData);

  return (
    <Card className="bg-[#1a1f2e] border-[#2a3441]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-white flex items-center gap-2">
          <Leaf className="h-4 w-4 text-green-500" />
          MT Carbon Footprint
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-sm text-gray-400">Today</span>
          <span className="text-2xl font-bold text-white">{kpi.carbonFootprint}</span>
          <span className="text-sm text-gray-400">tong CO₂</span>
          <span className="text-xs text-gray-500 ml-auto">50 mp – 36.3 tens CO₂</span>
        </div>
        
        <div className="relative h-20">
          <div className="flex items-end gap-1 h-full">
            {chartData.map((value, index) => (
              <div 
                key={index}
                className="flex-1 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t"
                style={{ height: `${(value / maxValue) * 100}%` }}
              />
            ))}
          </div>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-8">
            <span>50%</span>
            <span>30%</span>
            <span>90%</span>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>23 ms</span>
          <span>14 ms</span>
          <span>118 ms</span>
          <span>123 110</span>
          <span>12 Reg</span>
        </div>
      </CardContent>
    </Card>
  );
};
