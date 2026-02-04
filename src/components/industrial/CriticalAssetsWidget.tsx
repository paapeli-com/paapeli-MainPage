import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAssetsBySite } from "@/data/mockIndustrialData";

interface CriticalAssetsWidgetProps {
  siteId: string;
}

export const CriticalAssetsWidget = ({ siteId }: CriticalAssetsWidgetProps) => {
  const assets = getAssetsBySite(siteId);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-500';
      case 'warning': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="bg-[#1a1f2e] border-[#2a3441]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-white">Critical Assets Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#2a3441]">
                <th className="text-left py-2">Asset</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Predicted</th>
                <th className="text-left py-2">Last Anomaly</th>
              </tr>
            </thead>
            <tbody>
              {assets.slice(0, 5).map((asset) => (
                <tr key={asset.id} className="border-b border-[#2a3441] last:border-0">
                  <td className="py-2 text-white">{asset.name}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(asset.status)}`} />
                      <span className="capitalize text-gray-300">{asset.status}</span>
                    </div>
                  </td>
                  <td className="py-2 text-gray-400">{asset.predictedFailure || '—'}</td>
                  <td className="py-2 text-gray-400">{asset.lastAnomaly || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
