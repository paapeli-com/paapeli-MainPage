import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, Trash2, Plus, Zap, Wifi, Brain, Activity, Clock, AlertTriangle, Layers } from "lucide-react";
import { mockAlertRules } from "@/data/mockAlertData";
import type { AlertRule, RuleType, AlertSeverity } from "@/types/alerts";

const ruleTypeIcons: Record<RuleType, any> = {
  threshold: Zap,
  condition: Activity,
  time_window: Clock,
  device_state: Wifi,
  heartbeat: Activity,
  anomaly: Brain,
  cross_device: Layers,
};

const ruleTypeLabels: Record<RuleType, string> = {
  threshold: 'Threshold',
  condition: 'Condition',
  time_window: 'Time Window',
  device_state: 'Device State',
  heartbeat: 'Heartbeat',
  anomaly: 'AI Anomaly',
  cross_device: 'Cross-Device',
};

const severityColors: Record<AlertSeverity, string> = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-white",
  low: "bg-blue-500 text-white",
};

interface AlertRulesListProps {
  onCreateRule: () => void;
}

export const AlertRulesList = ({ onCreateRule }: AlertRulesListProps) => {
  const { t } = useLanguage();
  const [rules, setRules] = useState<AlertRule[]>(mockAlertRules);

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {rules.length} {t("alertRulesCount")}
        </p>
        <Button size="sm" onClick={onCreateRule}>
          <Plus className="h-4 w-4 me-1" />
          {t("alertCreateRule")}
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("alertRuleName")}</TableHead>
              <TableHead>{t("alertRuleType")}</TableHead>
              <TableHead>{t("alertSeverity")}</TableHead>
              <TableHead className="hidden md:table-cell">{t("alertTriggerCount")}</TableHead>
              <TableHead className="hidden lg:table-cell">{t("alertRuleScope")}</TableHead>
              <TableHead>{t("enabled")}</TableHead>
              <TableHead className="w-[80px]">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => {
              const TypeIcon = ruleTypeIcons[rule.ruleType];
              return (
                <TableRow key={rule.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{rule.name}</p>
                      <p className="text-xs text-muted-foreground">{rule.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <TypeIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{ruleTypeLabels[rule.ruleType]}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={severityColors[rule.severity]}>
                      {t(`alert${rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)}` as any)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-sm">{rule.triggerCount}</TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                    {rule.deviceIds.length > 0 ? `${rule.deviceIds.length} devices` : rule.locationId || 'All'}
                  </TableCell>
                  <TableCell>
                    <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" disabled>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("settingsComingSoon")}</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" disabled>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("settingsComingSoon")}</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
