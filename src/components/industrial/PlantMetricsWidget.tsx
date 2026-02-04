import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getKPIBySite } from "@/data/mockIndustrialData";
import { Gauge } from "lucide-react";

interface PlantMetricsWidgetProps {
  siteId: string;
}

export const PlantMetricsWidget = ({ siteId }: PlantMetricsWidgetProps) => {
  const kpi = getKPIBySite(siteId);
  
  if (!kpi) return null;

  // Calculated metrics
  const oee = 36.5; // Overall Equipment Effectiveness
  const carbonPerHour = 36.5;

  return (
    <Card className="bg-[#1a1f2e] border-[#2a3441]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-white flex items-center gap-2">
          <Gauge className="h-4 w-4 text-primary" />
          Plant Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {/* Gauge visualization */}
        <div className="flex justify-center mb-4">
          <div className="relative w-32 h-20">
            <svg viewBox="0 0 100 50" className="w-full h-full">
              {/* Background arc */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#2a3441"
                strokeWidth="8"
              />
              {/* Value arc - gradient from red to green */}
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="8"
                strokeDasharray={`${(oee / 100) * 126} 126`}
              />
              {/* Center text */}
              <text x="50" y="45" textAnchor="middle" className="text-xl font-bold" fill="white">
                {oee}%
              </text>
            </svg>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-400 mb-4">
          Rect loc Ioq
          <span className="text-xs ml-2 text-gray-500">Last T daip</span>
        </div>
        
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>5.9dis</span>
            <span>4.9Mts</span>
          </div>
          <div className="flex justify-between">
            <span>0.3dis</span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-[#232a3b] rounded text-center">
          <span className="text-2xl font-bold text-white">{carbonPerHour}</span>
          <span className="text-sm text-gray-400 ml-1">hons CO₂</span>
        </div>
      </CardContent>
    </Card>
  );
};
