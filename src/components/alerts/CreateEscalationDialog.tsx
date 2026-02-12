import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface EscalationLevel {
  level: number;
  role: string;
  delayMinutes: number;
}

interface CreateEscalationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateEscalationDialog = ({ open, onOpenChange }: CreateEscalationDialogProps) => {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slaMinutes, setSlaMinutes] = useState("60");
  const [levels, setLevels] = useState<EscalationLevel[]>([
    { level: 1, role: "Operator", delayMinutes: 0 },
  ]);

  const handleAddLevel = () => {
    setLevels([...levels, { level: levels.length + 1, role: "", delayMinutes: 15 }]);
  };

  const handleRemoveLevel = (level: number) => {
    setLevels(levels.filter(l => l.level !== level));
  };

  const handleUpdateLevel = (level: number, field: string, value: string | number) => {
    setLevels(levels.map(l => l.level === level ? { ...l, [field]: value } : l));
  };

  const handleCreate = () => {
    console.log("Creating escalation:", { name, description, slaMinutes, levels });
    onOpenChange(false);
    setName("");
    setDescription("");
    setSlaMinutes("60");
    setLevels([{ level: 1, role: "Operator", delayMinutes: 0 }]);
  };

  const roles = ["Operator", "Supervisor", "Admin", "Manager", "Director"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("alertCreateEscalation")}</DialogTitle>
          <DialogDescription>
            Define multi-level escalation policy for alerts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label>{t("name")}</Label>
            <Input
              placeholder={t("alertEnterRuleName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>{t("alertRuleDescription")}</Label>
            <Textarea
              placeholder={t("alertEnterRuleDescription")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* SLA */}
          <div className="space-y-2">
            <Label>SLA ({t("alertMinutes")})</Label>
            <Input
              type="number"
              value={slaMinutes}
              onChange={(e) => setSlaMinutes(e.target.value)}
            />
          </div>

          {/* Escalation Levels */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t("alertEscalationPoliciesCount")}</Label>
              <Button size="sm" variant="outline" onClick={handleAddLevel}>
                <Plus className="h-3 w-3 me-1" />
                {t("add")}
              </Button>
            </div>

            {levels.map((level, idx) => (
              <div key={level.level} className="grid grid-cols-3 gap-2 p-3 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-xs">Level</Label>
                  <div className="text-sm font-medium">{level.level}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t("alertTeamOperations")}</Label>
                  <Select value={level.role} onValueChange={(v) => handleUpdateLevel(level.level, "role", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t("alertMinutes")}</Label>
                  <div className="flex gap-1">
                    <Input
                      type="number"
                      value={level.delayMinutes}
                      onChange={(e) => handleUpdateLevel(level.level, "delayMinutes", parseInt(e.target.value) || 0)}
                      className="flex-1"
                    />
                    {idx > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveLevel(level.level)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-muted/50 p-3 rounded-lg space-y-2">
            <p className="text-xs font-medium">{t("alertRuleSummary")}</p>
            <div className="flex flex-wrap gap-2">
              {levels.map(l => (
                <Badge key={l.level} variant="outline">
                  L{l.level}: {l.role} ({l.delayMinutes}m)
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">SLA: {slaMinutes} minutes</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleCreate} disabled={!name || levels.length === 0}>
            {t("create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
