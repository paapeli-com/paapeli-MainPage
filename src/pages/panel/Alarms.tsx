import { useState } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertList } from "@/components/alerts/AlertList";
import { AlertRulesList } from "@/components/alerts/AlertRulesList";
import { AlertRuleWizard } from "@/components/alerts/AlertRuleWizard";
import { AlertAnalytics } from "@/components/alerts/AlertAnalytics";
import { EscalationPolicies } from "@/components/alerts/EscalationPolicies";
import { NotificationChannels } from "@/components/alerts/NotificationChannels";
import { AlertTemplates } from "@/components/alerts/AlertTemplates";
import { Bell, List, Activity, Shield, Radio, BarChart3, FileText } from "lucide-react";

const Alarms = () => {
  const { t } = useLanguage();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  return (
    <PanelLayout pageTitle={t("alarms")}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="inline-flex w-auto min-w-full sm:min-w-0">
            <TabsTrigger value="all" className="gap-1.5">
              <Bell className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("alertTabAll")}</span>
            </TabsTrigger>
            <TabsTrigger value="active" className="gap-1.5">
              <Activity className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("alertTabActive")}</span>
            </TabsTrigger>
            <TabsTrigger value="resolved" className="gap-1.5">
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("alertTabResolved")}</span>
            </TabsTrigger>
            <TabsTrigger value="rules" className="gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("alertTabRules")}</span>
            </TabsTrigger>
            <TabsTrigger value="escalation" className="gap-1.5">
              <Radio className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("alertTabEscalation")}</span>
            </TabsTrigger>
            <TabsTrigger value="channels" className="gap-1.5">
              <Radio className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("alertTabChannels")}</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("alertTabAnalytics")}</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("alertTabTemplates")}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all"><AlertList filter="all" /></TabsContent>
        <TabsContent value="active"><AlertList filter="active" /></TabsContent>
        <TabsContent value="resolved"><AlertList filter="resolved" /></TabsContent>
        <TabsContent value="rules"><AlertRulesList onCreateRule={() => setWizardOpen(true)} /></TabsContent>
        <TabsContent value="escalation"><EscalationPolicies /></TabsContent>
        <TabsContent value="channels"><NotificationChannels /></TabsContent>
        <TabsContent value="analytics"><AlertAnalytics /></TabsContent>
        <TabsContent value="templates"><AlertTemplates onUseTemplate={() => setWizardOpen(true)} /></TabsContent>
      </Tabs>

      <AlertRuleWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </PanelLayout>
  );
};

export default Alarms;
