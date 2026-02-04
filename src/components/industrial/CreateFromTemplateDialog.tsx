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
      <DialogContent className="bg-[#1a1f2e] border-[#2a3441] text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            Create Dashboard from Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Template Info */}
          <div className="p-4 bg-[#232a3b] rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-white">{template.name}</h3>
              <Badge className={getRoleBadgeColor(template.role)}>
                {getRoleIcon(template.role)}
                <span className="ml-1 capitalize">{template.role}</span>
              </Badge>
            </div>
            <p className="text-sm text-gray-400">{template.description}</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
              <span>Default View:</span>
              <Badge variant="outline" className="text-xs">
                {template.defaultView === 'all_sites' ? 'All Sites' : 'Single Site'}
              </Badge>
            </div>
          </div>

          {/* Dashboard Name */}
          <div className="space-y-2">
            <Label className="text-gray-300">Dashboard Name *</Label>
            <Input
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              placeholder="e.g., Main Operations Dashboard"
              className="bg-[#232a3b] border-[#2a3441] text-white"
            />
          </div>

          {/* Site Selection */}
          <div className="space-y-2">
            <Label className="text-gray-300">Default Site / Plant</Label>
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger className="bg-[#232a3b] border-[#2a3441] text-white">
                <SelectValue placeholder="Select a site" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1f2e] border-[#2a3441]">
                <SelectItem value="all" className="text-white hover:bg-[#2a3441]">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>All Sites</span>
                    <span className="text-xs text-gray-500 ml-2">(Aggregated View)</span>
                  </div>
                </SelectItem>
                {mockSites.map((site) => (
                  <SelectItem 
                    key={site.id} 
                    value={site.id}
                    className="text-white hover:bg-[#2a3441]"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>{site.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {selectedSite === 'all' 
                ? 'Shows high-level KPIs across all sites. No raw SCADA data.'
                : 'Shows detailed asset data, alarms, and SCADA references for the selected site.'}
            </p>
          </div>

          {/* Package Warning */}
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-400">
            <strong>Note:</strong> Some widgets may be limited based on your subscription package.
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={!dashboardName.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            Create Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
