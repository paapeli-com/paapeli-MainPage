import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Copy } from "lucide-react";
import { mockAlertTemplates } from "@/data/mockAlertData";
import type { AlertSeverity } from "@/types/alerts";

const severityColors: Record<AlertSeverity, string> = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-white",
  low: "bg-blue-500 text-white",
};

interface AlertTemplatesProps {
  onUseTemplate: () => void;
}

export const AlertTemplates = ({ onUseTemplate }: AlertTemplatesProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {t("alertTemplatesDesc")}
        </p>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" disabled>
              <Plus className="h-4 w-4 me-1" />
              {t("alertCreateTemplate")}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("settingsComingSoon")}</TooltipContent>
        </Tooltip>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {mockAlertTemplates.map(template => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{template.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                </div>
                <Badge className={severityColors[template.severity]}>{template.severity}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{template.ruleType}</Badge>
                <Badge variant="outline" className="text-xs">{template.category}</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {template.conditionGroups[0]?.conditions.map(c => (
                  <span key={c.id} className="font-mono">
                    {c.telemetryTag} {c.operator} {c.value}
                  </span>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={onUseTemplate}>
                <Copy className="h-3 w-3 me-1" />
                {t("alertUseTemplate")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
