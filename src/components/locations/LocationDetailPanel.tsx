import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MapPin,
  Building2,
  Factory,
  Cpu,
  Settings,
  Smartphone,
  LayoutDashboard,
  Shield,
  ExternalLink,
} from "lucide-react";
import type { TreeNode } from "./LocationTreeNode";

interface LocationDetailPanelProps {
  node: TreeNode | null;
}

const getNodeIcon = (type: string) => {
  switch (type) {
    case "organization":
      return <Building2 className="h-5 w-5 text-primary" />;
    case "location":
      return <MapPin className="h-5 w-5 text-muted-foreground" />;
    case "area":
      return <Factory className="h-5 w-5 text-muted-foreground" />;
    case "asset":
      return <Cpu className="h-5 w-5 text-muted-foreground" />;
    default:
      return <MapPin className="h-5 w-5" />;
  }
};

export const LocationDetailPanel = ({ node }: LocationDetailPanelProps) => {
  const { t, isRTL, language } = useLanguage();
  const navigate = useNavigate();

  const getLocalizedPath = (path: string) => {
    return language === "en" ? path : `/${language}${path}`;
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "organization":
        return t("organization");
      case "location":
        return t("locationLabel");
      case "area":
        return t("areaUnit");
      case "asset":
        return t("assets");
      default:
        return type;
    }
  };

  if (!node) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-20">
        <MapPin className="h-12 w-12 mb-4 opacity-20" />
        <p className="text-sm">{t("selectLocationPrompt")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {getNodeIcon(node.type)}
            <h2 className="text-lg font-semibold">{node.name}</h2>
          </div>
          <Badge variant="outline" className="text-xs capitalize">
            {getTypeLabel(node.type)}
          </Badge>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" disabled>
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("settingsComingSoon")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Separator />

      {/* Empty state - no devices or dashboards */}
      <div className="rounded-lg border border-dashed border-border p-8 text-center space-y-4">
        <div className="flex justify-center gap-3 text-muted-foreground">
          <Smartphone className="h-8 w-8 opacity-30" />
          <LayoutDashboard className="h-8 w-8 opacity-30" />
        </div>
        <div>
          <p className="font-medium text-sm">{t("emptyLocationTitle")}</p>
          <p className="text-xs text-muted-foreground mt-1">{t("emptyLocationDesc")}</p>
        </div>
        <div className="flex justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(getLocalizedPath("/devices"))}
          >
            <Smartphone className="h-4 w-4" />
            {t("assignDevices")}
          </Button>
          <Button
            size="sm"
            onClick={() => navigate(getLocalizedPath("/dashboard"))}
          >
            <LayoutDashboard className="h-4 w-4" />
            {t("createDashboard")}
          </Button>
        </div>
      </div>

      {/* Permissions shortcut */}
      <button
        onClick={() => navigate(getLocalizedPath("/members"))}
        className="w-full flex items-center gap-3 p-3 rounded-md border border-border hover:bg-accent transition-colors text-start"
      >
        <Shield className="h-5 w-5 text-muted-foreground shrink-0" />
        <span className="text-sm flex-1">{t("manageAccess")}</span>
        <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
      </button>
    </div>
  );
};
