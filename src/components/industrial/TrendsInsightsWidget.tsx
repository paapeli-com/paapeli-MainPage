import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Check, Info, FileText } from "lucide-react";

interface TrendsInsightsWidgetProps {
  siteId: string;
}

export const TrendsInsightsWidget = ({ siteId }: TrendsInsightsWidgetProps) => {
  const insights = [
    "Realth hmeolats fron princtico",
    "Reposing al Hister is 12:28 ove",
  ];

  return (
    <Card className="bg-[#1a1f2e] border-[#2a3441]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-white flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Trends & Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-sm text-gray-300 mb-3">
          Check coolant levels in: <span className="text-primary">Compressor</span>
        </div>
        
        <div className="space-y-2 mb-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Check className="h-3 w-3 text-green-500" />
              <span className="text-gray-400">{insight}</span>
            </div>
          ))}
        </div>
        
        <Button variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary/10">
          <FileText className="h-4 w-4 mr-2" />
          Bottled Repret
        </Button>
      </CardContent>
    </Card>
  );
};
