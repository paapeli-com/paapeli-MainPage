import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Smartphone, 
  Bell, 
  LayoutDashboard, 
  Plus, 
  FileCode, 
  BellRing, 
  BookOpen, 
  GraduationCap 
} from "lucide-react";

const PanelHome = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const stats = [
    { title: t("totalDevices"), value: "0", icon: Smartphone },
    { title: t("activeDevices"), value: "0", icon: Smartphone },
    { title: t("alerts"), value: "0", icon: Bell },
  ];

  const actions = [
    { 
      title: t("createDashboard"), 
      icon: LayoutDashboard, 
      onClick: () => navigate("/dashboard"),
      variant: "default" as const
    },
    { 
      title: t("addNewDevice"), 
      icon: Plus, 
      onClick: () => navigate("/devices"),
      variant: "default" as const
    },
    { 
      title: t("addNewTemplate"), 
      icon: FileCode, 
      onClick: () => navigate("/solution-templates"),
      variant: "default" as const
    },
    { 
      title: t("createAlarm"), 
      icon: BellRing, 
      onClick: () => navigate("/alarms"),
      variant: "default" as const
    },
  ];

  return (
    <PanelLayout pageTitle={t("home")}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {actions.map((action, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={action.onClick}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-center">{action.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Links */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:border-primary transition-colors">
            <CardContent className="p-6">
              <a 
                href="https://docs.paapeli.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">{t("helpCenter")}</h3>
                  <p className="text-sm text-muted-foreground">{t("helpCenterDesc")}</p>
                </div>
              </a>
            </CardContent>
          </Card>
          
          <Card className="hover:border-primary transition-colors">
            <CardContent className="p-6">
              <a 
                href="https://docs.paapeli.com/docs/category/tutorials" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">{t("tutorials")}</h3>
                  <p className="text-sm text-muted-foreground">{t("tutorialsDesc")}</p>
                </div>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </PanelLayout>
  );
};

export default PanelHome;
