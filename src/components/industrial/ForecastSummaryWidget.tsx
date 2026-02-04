import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getForecastsBySite } from "@/data/mockIndustrialData";
import { AlertTriangle, Thermometer, Activity } from "lucide-react";

interface ForecastSummaryWidgetProps {
  siteId: string;
}

export const ForecastSummaryWidget = ({ siteId }: ForecastSummaryWidgetProps) => {
  const forecasts = getForecastsBySite(siteId);
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500';
      case 'moderate': return 'text-orange-500';
      default: return 'text-green-500';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'moderate': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-green-500/20 text-green-400';
    }
  };

  const getIcon = (prediction: string) => {
    if (prediction.toLowerCase().includes('temperature') || prediction.toLowerCase().includes('oil')) {
      return <Thermometer className="h-4 w-4" />;
    }
    if (prediction.toLowerCase().includes('vibration')) {
      return <Activity className="h-4 w-4" />;
    }
    return <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <Card className="bg-[#1a1f2e] border-[#2a3441]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-white">Forecast Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {forecasts.slice(0, 3).map((forecast) => (
          <div key={forecast.id} className="flex items-start gap-3 p-2 rounded bg-[#232a3b]">
            <div className={`mt-1 ${getSeverityColor(forecast.severity)}`}>
              {getIcon(forecast.prediction)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-white text-sm font-medium truncate">{forecast.assetName}</span>
                <Badge className={`text-xs ${getSeverityBadge(forecast.severity)}`}>
                  {forecast.severity.charAt(0).toUpperCase() + forecast.severity.slice(1)}
                </Badge>
              </div>
              <p className="text-gray-400 text-xs mt-1">{forecast.prediction}</p>
              <p className="text-gray-500 text-xs">{forecast.timeframe}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
