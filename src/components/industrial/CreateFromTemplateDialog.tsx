import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SolutionTemplate } from "@/types/industrial";
import { mockSites } from "@/data/mockIndustrialData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Factory, Building2, Users, Shield, Globe } from "lucide-react";

interface CreateFromTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: SolutionTemplate | null;
  onCreateDashboard: (name: string, siteId: string) => void;
}

export const CreateFromTemplateDialog = ({ 
  open, 
  onOpenChange, 
  template,
  onCreateDashboard 
}: CreateFromTemplateDialogProps) => {
  const { t } = useLanguage();
  const [dashboardName, setDashboardName] = useState("");
  const [selectedSite, setSelectedSite] = useState(template?.defaultView === 'all_sites' ? 'all' : mockSites[0]?.id || '');

  const handleCreate = () => {
    if (!dashboardName.trim() || !template) return;
    onCreateDashboard(dashboardName, selectedSite);
    setDashboardName("");
    onOpenChange(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'operator': return <Factory className="h-4 w-4" />;
      case 'maintenance': return <Factory className="h-4 w-4" />;
      case 'manager': return <Building2 className="h-4 w-4" />;
      case 'executive': return <Users className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'operator': return 'bg-blue-500/20 text-blue-400';
      case 'maintenance': return 'bg-orange-500/20 text-orange-400';
      case 'manager': return 'bg-purple-500/20 text-purple-400';
      case 'executive': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {t("createDashboardFromTemplate")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Template Info */}
          <div className="p-4 bg-accent/50 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium">{template.name}</h3>
              <Badge className={getRoleBadgeColor(template.role)}>
                {getRoleIcon(template.role)}
                <span className="ml-1 capitalize">{template.role}</span>
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{template.description}</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <span>{t("defaultLocation")}:</span>
              <Badge variant="outline" className="text-xs">
                {template.defaultView === 'all_sites' ? t("allLocations") : t("singleLocation")}
              </Badge>
            </div>
          </div>

          {/* Dashboard Name */}
          <div className="space-y-2">
            <Label>{t("dashboardNameLabel")} *</Label>
            <Input
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              placeholder="e.g., Main Operations Dashboard"
            />
          </div>

          {/* Location Selection */}
          <div className="space-y-2">
            <Label>{t("defaultLocation")}</Label>
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger>
                <SelectValue placeholder={t("allLocations")} />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>{t("allLocations")}</span>
                    <span className="text-xs text-muted-foreground ml-2">({t("aggregatedView")})</span>
                  </div>
                </SelectItem>
                {mockSites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>{site.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {selectedSite === 'all' 
                ? t("highLevelKPIsOnly")
                : t("fullSiteData")}
            </p>
          </div>

          {/* Package Warning */}
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-600 dark:text-yellow-400">
            <strong>Note:</strong> {t("packageNote")}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
          >
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={!dashboardName.trim()}
          >
            {t("createDashboard")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
