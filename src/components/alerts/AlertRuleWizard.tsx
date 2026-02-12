import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { AlertRuleWizardStep, ConditionOperator, AlertSeverity, RuleType, LogicOperator } from "@/types/alerts";
import { mockEscalationPolicies, mockNotificationChannels } from "@/data/mockAlertData";

const severityColors: Record<string, string> = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-white",
  low: "bg-blue-500 text-white",
};

const STEPS: AlertRuleWizardStep[] = ['scope', 'conditions', 'severity', 'escalation', 'notifications', 'assignment'];

interface AlertRuleWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ConditionRow {
  id: string;
  tag: string;
  operator: ConditionOperator;
  value: string;
  valueTo: string;
  timeWindow: string;
}

interface ConditionGroupData {
  id: string;
  logic: LogicOperator;
  conditions: ConditionRow[];
}

export const AlertRuleWizard = ({ open, onOpenChange }: AlertRuleWizardProps) => {
  const { t, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1: Scope
  const [ruleName, setRuleName] = useState("");
  const [ruleDescription, setRuleDescription] = useState("");
  const [ruleType, setRuleType] = useState<RuleType>("threshold");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [deviceType, setDeviceType] = useState("");
  const [locationScope, setLocationScope] = useState("");

  // Step 2: Conditions
  const [conditionGroups, setConditionGroups] = useState<ConditionGroupData[]>([
    { id: 'g1', logic: 'AND', conditions: [{ id: 'c1', tag: '', operator: '>', value: '', valueTo: '', timeWindow: '' }] }
  ]);

  // Step 3: Severity
  const [severity, setSeverity] = useState<AlertSeverity>("medium");

  // Step 4: Escalation
  const [escalationPolicyId, setEscalationPolicyId] = useState("");

  // Step 5: Notifications
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['NC-001']);

  // Step 6: Assignment
  const [assignedTeam, setAssignedTeam] = useState("");

  const addCondition = (groupId: string) => {
    setConditionGroups(prev => prev.map(g =>
      g.id === groupId
        ? { ...g, conditions: [...g.conditions, { id: `c${Date.now()}`, tag: '', operator: '>' as ConditionOperator, value: '', valueTo: '', timeWindow: '' }] }
        : g
    ));
  };

  const removeCondition = (groupId: string, condId: string) => {
    setConditionGroups(prev => prev.map(g =>
      g.id === groupId
        ? { ...g, conditions: g.conditions.filter(c => c.id !== condId) }
        : g
    ));
  };

  const updateCondition = (groupId: string, condId: string, field: keyof ConditionRow, value: string) => {
    setConditionGroups(prev => prev.map(g =>
      g.id === groupId
        ? { ...g, conditions: g.conditions.map(c => c.id === condId ? { ...c, [field]: value } : c) }
        : g
    ));
  };

  const addConditionGroup = () => {
    setConditionGroups(prev => [...prev, {
      id: `g${Date.now()}`,
      logic: 'OR',
      conditions: [{ id: `c${Date.now()}`, tag: '', operator: '>' as ConditionOperator, value: '', valueTo: '', timeWindow: '' }],
    }]);
  };

  const handleCreate = () => {
    console.log('Creating rule:', { ruleName, ruleType, severity, conditionGroups, escalationPolicyId, selectedChannels, assignedTeam });
    onOpenChange(false);
    // Reset
    setCurrentStep(0);
    setRuleName('');
    setRuleDescription('');
  };

  const stepLabels = [
    t("alertStepScope"),
    t("alertStepConditions"),
    t("alertStepSeverity"),
    t("alertStepEscalation"),
    t("alertStepNotifications"),
    t("alertStepAssignment"),
  ];

  const telemetryTags = ['temperature', 'pressure', 'vibration_rms', 'humidity', 'flow_rate', 'power_consumption', 'device_status', 'heartbeat'];
  const operators: ConditionOperator[] = ['>', '<', '=', '!=', '>=', '<=', 'between', 'change_rate'];
  const deviceTypes = ['temperature_sensor', 'vibration_sensor', 'pressure_sensor', 'flow_meter', 'power_meter', 'pump', 'compressor', 'furnace'];
  const mockDevices = ['DEV-101 Furnace Temp', 'DEV-102 Reactor Temp', 'DEV-205 Compressor VIB', 'DEV-310 Feed Pump', 'DEV-412 Pressure TX'];
  const mockLocations = ['LOC-TAJ TAJ – Sulfonation Unit', 'LOC-PLB Plant B – Processing'];

  const BackIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isRTL ? "left" : "right"} className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("alertCreateRule")}</SheetTitle>
        </SheetHeader>

        {/* Step Indicators */}
        <div className="flex items-center gap-1 mt-4 mb-6 overflow-x-auto pb-2">
          {STEPS.map((_, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                i === currentStep ? 'bg-primary text-primary-foreground' :
                i < currentStep ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                {i + 1}
              </div>
              <span className={`text-xs whitespace-nowrap hidden sm:inline ${i === currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {stepLabels[i]}
              </span>
              {i < STEPS.length - 1 && <div className="w-4 h-px bg-border shrink-0" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-4 min-h-[300px]">
          {/* Step 1: Scope */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("alertRuleName")}</Label>
                <Input value={ruleName} onChange={e => setRuleName(e.target.value)} placeholder={t("alertEnterRuleName")} />
              </div>
              <div className="space-y-2">
                <Label>{t("alertRuleDescription")}</Label>
                <Textarea value={ruleDescription} onChange={e => setRuleDescription(e.target.value)} placeholder={t("alertEnterRuleDescription")} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>{t("alertRuleType")}</Label>
                <Select value={ruleType} onValueChange={v => setRuleType(v as RuleType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="threshold">{t("alertTypeThreshold")}</SelectItem>
                    <SelectItem value="condition">{t("alertTypeCondition")}</SelectItem>
                    <SelectItem value="time_window">{t("alertTypeTimeWindow")}</SelectItem>
                    <SelectItem value="device_state">{t("alertTypeDeviceState")}</SelectItem>
                    <SelectItem value="heartbeat">{t("alertTypeHeartbeat")}</SelectItem>
                    <SelectItem value="anomaly">{t("alertTypeAnomaly")}</SelectItem>
                    <SelectItem value="cross_device">{t("alertTypeCrossDevice")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("alertScopeDevices")}</Label>
                <div className="space-y-1 max-h-32 overflow-y-auto border rounded-md p-2">
                  {mockDevices.map(dev => {
                    const id = dev.split(' ')[0];
                    return (
                      <label key={id} className="flex items-center gap-2 py-1 cursor-pointer">
                        <Checkbox
                          checked={selectedDevices.includes(id)}
                          onCheckedChange={(checked) => {
                            setSelectedDevices(prev => checked ? [...prev, id] : prev.filter(d => d !== id));
                          }}
                        />
                        <span className="text-sm">{dev}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("alertScopeDeviceType")}</Label>
                <Select value={deviceType} onValueChange={setDeviceType}>
                  <SelectTrigger><SelectValue placeholder={t("alertSelectDeviceType")} /></SelectTrigger>
                  <SelectContent>
                    {deviceTypes.map(dt => <SelectItem key={dt} value={dt}>{dt.replace('_', ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("alertScopeLocation")}</Label>
                <Select value={locationScope} onValueChange={setLocationScope}>
                  <SelectTrigger><SelectValue placeholder={t("alertSelectLocation")} /></SelectTrigger>
                  <SelectContent>
                    {mockLocations.map(loc => {
                      const [id, ...rest] = loc.split(' ');
                      return <SelectItem key={id} value={id}>{rest.join(' ')}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Conditions */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{t("alertConditionBuilderDesc")}</p>
              {conditionGroups.map((group, gi) => (
                <div key={group.id} className="border rounded-lg p-3 space-y-3 bg-muted/30">
                  {gi > 0 && (
                    <div className="flex items-center gap-2">
                      <Select value={group.logic} onValueChange={v => setConditionGroups(prev => prev.map(g => g.id === group.id ? { ...g, logic: v as LogicOperator } : g))}>
                        <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AND">AND</SelectItem>
                          <SelectItem value="OR">OR</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-xs text-muted-foreground">{t("alertConditionGroupLabel")}</span>
                    </div>
                  )}
                  {group.conditions.map((cond, ci) => (
                    <div key={cond.id} className="space-y-2 p-2 border rounded bg-card">
                      {ci > 0 && (
                        <Badge variant="outline" className="mb-1">{group.logic}</Badge>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">{t("alertTelemetryTag")}</Label>
                          <Select value={cond.tag} onValueChange={v => updateCondition(group.id, cond.id, 'tag', v)}>
                            <SelectTrigger className="h-8"><SelectValue placeholder={t("alertSelectTag")} /></SelectTrigger>
                            <SelectContent>
                              {telemetryTags.map(tag => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">{t("alertOperator")}</Label>
                          <Select value={cond.operator} onValueChange={v => updateCondition(group.id, cond.id, 'operator', v)}>
                            <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {operators.map(op => <SelectItem key={op} value={op}>{op}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">{t("alertValue")}</Label>
                          <Input className="h-8" type="number" value={cond.value} onChange={e => updateCondition(group.id, cond.id, 'value', e.target.value)} />
                        </div>
                        {cond.operator === 'between' && (
                          <div>
                            <Label className="text-xs">{t("alertValueTo")}</Label>
                            <Input className="h-8" type="number" value={cond.valueTo} onChange={e => updateCondition(group.id, cond.id, 'valueTo', e.target.value)} />
                          </div>
                        )}
                        <div>
                          <Label className="text-xs">{t("alertTimeWindow")}</Label>
                          <Input className="h-8" type="number" value={cond.timeWindow} onChange={e => updateCondition(group.id, cond.id, 'timeWindow', e.target.value)} placeholder={t("alertMinutes")} />
                        </div>
                      </div>
                      {group.conditions.length > 1 && (
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeCondition(group.id, cond.id)}>
                          <Trash2 className="h-3 w-3 me-1" />{t("delete")}
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addCondition(group.id)}>
                    <Plus className="h-3 w-3 me-1" />{t("alertAddCondition")}
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addConditionGroup}>
                <Plus className="h-3 w-3 me-1" />{t("alertAddConditionGroup")}
              </Button>
            </div>
          )}

          {/* Step 3: Severity */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <Label>{t("alertSelectSeverity")}</Label>
              <div className="grid grid-cols-2 gap-3">
                {(['critical', 'high', 'medium', 'low'] as AlertSeverity[]).map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSeverity(sev)}
                    className={`p-4 rounded-lg border-2 text-start transition-colors ${
                      severity === sev ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <Badge className={`${severityColors[sev]} mb-2`}>
                      {t(`alert${sev.charAt(0).toUpperCase() + sev.slice(1)}` as any)}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{t(`alertSeverity${sev.charAt(0).toUpperCase() + sev.slice(1)}Desc` as any)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Escalation */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <Label>{t("alertSelectEscalation")}</Label>
              <div className="space-y-3">
                {mockEscalationPolicies.map(policy => (
                  <button
                    key={policy.id}
                    onClick={() => setEscalationPolicyId(policy.id)}
                    className={`w-full p-4 rounded-lg border-2 text-start transition-colors ${
                      escalationPolicyId === policy.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <p className="font-medium">{policy.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{policy.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {policy.levels.map(level => (
                        <Badge key={level.level} variant="outline" className="text-xs">
                          L{level.level}: {level.role} ({level.delayMinutes}min)
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">SLA: {policy.slaMinutes} min</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Notifications */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <Label>{t("alertSelectChannels")}</Label>
              <div className="space-y-2">
                {mockNotificationChannels.map(channel => (
                  <label key={channel.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/30">
                    <Checkbox
                      checked={selectedChannels.includes(channel.id)}
                      onCheckedChange={(checked) => {
                        setSelectedChannels(prev => checked ? [...prev, channel.id] : prev.filter(c => c !== channel.id));
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{channel.name}</p>
                      <p className="text-xs text-muted-foreground">{channel.type.toUpperCase()}</p>
                    </div>
                    <Badge variant={channel.enabled ? "default" : "secondary"}>
                      {channel.enabled ? t("enabled") : t("disabled")}
                    </Badge>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Assignment */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("alertAssignTeam")}</Label>
                <Select value={assignedTeam} onValueChange={setAssignedTeam}>
                  <SelectTrigger><SelectValue placeholder={t("alertSelectTeam")} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operations">{t("alertTeamOperations")}</SelectItem>
                    <SelectItem value="maintenance">{t("alertTeamMaintenance")}</SelectItem>
                    <SelectItem value="management">{t("alertTeamManagement")}</SelectItem>
                    <SelectItem value="safety">{t("alertTeamSafety")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Summary */}
              <div className="border rounded-lg p-4 bg-muted/30 space-y-2 mt-6">
                <p className="font-medium">{t("alertRuleSummary")}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">{t("name")}:</span>
                  <span>{ruleName || '—'}</span>
                  <span className="text-muted-foreground">{t("alertRuleType")}:</span>
                  <span>{ruleType}</span>
                  <span className="text-muted-foreground">{t("alertSeverity")}:</span>
                  <Badge className={`${severityColors[severity]} w-fit`}>{severity}</Badge>
                  <span className="text-muted-foreground">{t("alertStepNotifications")}:</span>
                  <span>{selectedChannels.length} {t("alertChannelsSelected")}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => currentStep === 0 ? onOpenChange(false) : setCurrentStep(prev => prev - 1)}
          >
            <BackIcon className="h-4 w-4 me-1" />
            {currentStep === 0 ? t("cancel") : t("back")}
          </Button>
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={() => setCurrentStep(prev => prev + 1)}>
              {t("next")}
              <NextIcon className="h-4 w-4 ms-1" />
            </Button>
          ) : (
            <Button onClick={handleCreate}>{t("alertCreateRule")}</Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
