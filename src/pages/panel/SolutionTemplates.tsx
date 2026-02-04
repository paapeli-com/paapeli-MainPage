import { useState } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { solutionTemplates, mockSites } from "@/data/mockIndustrialData";
import { CreateFromTemplateDialog } from "@/components/industrial/CreateFromTemplateDialog";
import { IndustrialDashboardCanvas } from "@/components/industrial/IndustrialDashboardCanvas";
import { SolutionTemplate, IndustrialDashboard, DashboardRole } from "@/types/industrial";
import { 
  Factory, 
  Building2, 
  Users, 
  Shield, 
  ArrowRight, 
  LayoutDashboard,
  Trash2
} from "lucide-react";

const SolutionTemplates = () => {
  const { t } = useLanguage();
  const [selectedTemplate, setSelectedTemplate] = useState<SolutionTemplate | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createdDashboards, setCreatedDashboards] = useState<IndustrialDashboard[]>([]);
  const [activeDashboard, setActiveDashboard] = useState<IndustrialDashboard | null>(null);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'operator': return <Factory className="h-5 w-5" />;
      case 'maintenance': return <Factory className="h-5 w-5" />;
      case 'manager': return <Building2 className="h-5 w-5" />;
      case 'executive': return <Users className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'operator': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'maintenance': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'manager': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'executive': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleSelectTemplate = (template: SolutionTemplate) => {
    setSelectedTemplate(template);
    setCreateDialogOpen(true);
  };

  const handleCreateDashboard = (name: string, siteId: string) => {
    if (!selectedTemplate) return;

    const newDashboard: IndustrialDashboard = {
      id: `dashboard-${Date.now()}`,
      name,
      templateId: selectedTemplate.id,
      siteId,
      role: selectedTemplate.role as DashboardRole,
      createdAt: new Date().toISOString(),
      widgets: [],
    };

    setCreatedDashboards([...createdDashboards, newDashboard]);
    setActiveDashboard(newDashboard);
    setSelectedTemplate(null);
  };

  const handleDeleteDashboard = (dashboardId: string) => {
    setCreatedDashboards(createdDashboards.filter(d => d.id !== dashboardId));
  };

  // If a dashboard is active, show the industrial canvas
  if (activeDashboard) {
    return (
      <IndustrialDashboardCanvas 
        dashboard={activeDashboard}
        onBack={() => setActiveDashboard(null)}
      />
    );
  }

  return (
    <PanelLayout pageTitle={t("solutionTemplates")}>
      <div className="space-y-8">
        {/* Templates Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Heavy Industry Templates</h2>
            <Badge variant="outline" className="text-xs">
              Industrial IoT
            </Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {solutionTemplates.map((template) => (
              <Card 
                key={template.id}
                className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group"
                onClick={() => handleSelectTemplate(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {template.icon === 'factory' ? (
                          <Factory className="h-6 w-6" />
                        ) : (
                          <Building2 className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <Badge 
                          variant="outline" 
                          className={`mt-1 text-xs ${getRoleBadgeColor(template.role)}`}
                        >
                          {getRoleIcon(template.role)}
                          <span className="ml-1 capitalize">{template.role}</span>
                        </Badge>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Default:</span>
                      <Badge variant="secondary" className="text-xs">
                        {template.defaultView === 'all_sites' ? 'All Sites' : 'Single Site'}
                      </Badge>
                    </div>
                    <span className="text-muted-foreground">
                      {template.widgets.length} widgets
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Created Dashboards Section */}
        {createdDashboards.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Your Dashboards</h2>
              <Badge variant="outline" className="text-xs">
                {createdDashboards.length} dashboards
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {createdDashboards.map((dashboard) => {
                const template = solutionTemplates.find(t => t.id === dashboard.templateId);
                const site = dashboard.siteId === 'all' 
                  ? { name: 'All Sites' } 
                  : mockSites.find(s => s.id === dashboard.siteId);

                return (
                  <Card 
                    key={dashboard.id}
                    className="bg-card border-border hover:border-primary/50 transition-all"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <LayoutDashboard className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{dashboard.name}</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDashboard(dashboard.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>Template:</span>
                          <span className="text-foreground">{template?.name.split('–')[1]?.trim() || template?.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Site:</span>
                          <span className="text-foreground">{site?.name}</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-4"
                        onClick={() => setActiveDashboard(dashboard)}
                      >
                        Open Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Empty State */}
        {createdDashboards.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <LayoutDashboard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a template above to create your first industrial dashboard</p>
          </div>
        )}
      </div>

      <CreateFromTemplateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        template={selectedTemplate}
        onCreateDashboard={handleCreateDashboard}
      />
    </PanelLayout>
  );
};

export default SolutionTemplates;
