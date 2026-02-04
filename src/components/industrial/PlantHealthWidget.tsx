import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteKPI, Site } from "@/types/industrial";
import { getKPIBySite, mockSites } from "@/data/mockIndustrialData";

interface PlantHealthWidgetProps {
  siteId: string;
}

export const PlantHealthWidget = ({ siteId }: PlantHealthWidgetProps) => {
  const kpi = getKPIBySite(siteId);
  const site = siteId === 'all' ? null : mockSites.find(s => s.id === siteId);
  
  if (!kpi) return null;

  const getStatusColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = (score: number) => {
    if (score >= 90) return 'RUNNING';
    if (score >= 75) return 'NORMAL';
    return 'WARNING';
  };

  return (
    <Card className="bg-[#1a1f2e] border-[#2a3441]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-400">Plant Status:</span>
          <Badge className={`${getStatusColor(kpi.healthScore)} text-white text-xs`}>
            {getStatusText(kpi.healthScore)}
          </Badge>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* Circular progress */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#2a3441"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#22c55e"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(kpi.healthScore / 100) * 352} 352`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{kpi.healthScore}%</span>
            </div>
          </div>
        </div>
        
        <p className="text-center text-sm text-gray-400 mt-4">
          {siteId === 'all' ? 'Overall Health Score' : 'Plant Health Score'}
        </p>
      </CardContent>
    </Card>
  );
};
