import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAssetsBySite } from "@/data/mockIndustrialData";
import { TrendingUp, TrendingDown, Minus, Gauge, Activity, Thermometer } from "lucide-react";

interface KeyMetricsWidgetProps {
  siteId: string;
}

export const KeyMetricsWidget = ({ siteId }: KeyMetricsWidgetProps) => {
  const assets = getAssetsBySite(siteId);
  
  const getIcon = (name: string) => {
    if (name.toLowerCase().includes('pressure')) return <Gauge className="h-4 w-4 text-blue-500" />;
    if (name.toLowerCase().includes('vibration')) return <Activity className="h-4 w-4 text-orange-500" />;
    if (name.toLowerCase().includes('temperature')) return <Thermometer className="h-4 w-4 text-red-500" />;
    return <Gauge className="h-4 w-4 text-gray-500" />;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-red-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-green-500" />;
      default: return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const metrics = assets.flatMap(asset => 
    asset.metrics.map(metric => ({
      ...metric,
      assetName: asset.name,
    }))
  ).slice(0, 4);

  return (
    <Card className="bg-[#1a1f2e] border-[#2a3441]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-white">Key Metrics</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded bg-[#232a3b]">
            <div className="flex items-center gap-3">
              {getIcon(metric.name)}
              <div>
                <span className="text-white text-sm">{metric.assetName}</span>
                <span className="text-gray-400 text-xs block">{metric.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-white font-medium">{metric.value}</span>
                <span className="text-gray-400 text-sm ml-1">{metric.unit}</span>
              </div>
              {getTrendIcon(metric.trend)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
