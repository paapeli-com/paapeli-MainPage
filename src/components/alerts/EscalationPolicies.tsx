import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Edit, Clock, Users, ArrowRight } from "lucide-react";
import { mockEscalationPolicies } from "@/data/mockAlertData";

interface EscalationPoliciesProps {
  onCreateClick?: () => void;
}

export const EscalationPolicies = ({ onCreateClick }: EscalationPoliciesProps) => {
  const { t } = useLanguage();
  const [policies, setPolicies] = useState(mockEscalationPolicies);

  const togglePolicy = (id: string) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {policies.length} {t("alertEscalationPoliciesCount")}
        </p>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" onClick={onCreateClick} disabled={!onCreateClick}>
              <Plus className="h-4 w-4 me-1" />
              {t("alertCreateEscalation")}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{onCreateClick ? "" : t("settingsComingSoon")}</TooltipContent>
        </Tooltip>
      </div>

      <div className="grid gap-4">
        {policies.map(policy => (
          <Card key={policy.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{policy.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Switch checked={policy.enabled} onCheckedChange={() => togglePolicy(policy.id)} />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" disabled>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t("settingsComingSoon")}</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{policy.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">SLA: <strong>{policy.slaMinutes} min</strong></span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {policy.levels.map((level, i) => (
                  <div key={level.level} className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted border border-border">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium">L{level.level}: {level.role}</p>
                        <p className="text-xs text-muted-foreground">{level.delayMinutes === 0 ? t("alertImmediate") : `+${level.delayMinutes}min`}</p>
                      </div>
                    </div>
                    {i < policy.levels.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
