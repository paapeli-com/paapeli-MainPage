import { useState } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { mockSites, mockAssets, mockSiteKPIs, getAlarmsBySite } from "@/data/mockIndustrialData";
import {
  MapPin,
  Building2,
  Factory,
  ChevronRight,
  ChevronDown,
  Search,
  Plus,
  Settings,
  Shield,
  LayoutDashboard,
  Cpu,
  AlertTriangle,
  Activity,
  Thermometer,
  Gauge,
  Wrench,
  MoreHorizontal,
} from "lucide-react";

// Hierarchy node types
interface TreeNode {
  id: string;
  name: string;
  type: "organization" | "location" | "area" | "asset";
  status?: string;
  healthScore?: number;
  children?: TreeNode[];
  siteId?: string;
  deviceCount?: number;
}

// Build mock tree from existing data
const buildTree = (): TreeNode => {
  return {
    id: "org-root",
    name: "Paapeli Corp",
    type: "organization",
    children: mockSites.map((site) => ({
      id: site.id,
      name: site.name,
      type: "location" as const,
      status: site.status,
      healthScore: site.healthScore,
      siteId: site.id,
      children: [
        {
          id: `${site.id}-process`,
          name: site.type === "refinery" ? "Distillation Unit" : site.type === "factory" ? "Production Line A" : "Process Area",
          type: "area" as const,
          siteId: site.id,
          children: mockAssets
            .filter((a) => a.siteId === site.id)
            .map((asset) => ({
              id: asset.id,
              name: asset.name,
              type: "asset" as const,
              status: asset.status,
              siteId: site.id,
              deviceCount: 2 + Math.floor(Math.random() * 4),
            })),
        },
        {
          id: `${site.id}-utilities`,
          name: "Utilities",
          type: "area" as const,
          siteId: site.id,
          children: [],
        },
      ],
    })),
  };
};

const Locations = () => {
  const { t, isRTL } = useLanguage();
  const [tree] = useState<TreeNode>(buildTree);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(["org-root", ...mockSites.map((s) => s.id)])
  );
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const getNodeIcon = (type: string, status?: string) => {
    switch (type) {
      case "organization":
        return <Building2 className="h-4 w-4 text-primary" />;
      case "location":
        return <MapPin className={`h-4 w-4 ${status === "warning" ? "text-orange-400" : "text-green-400"}`} />;
      case "area":
        return <Factory className="h-4 w-4 text-blue-400" />;
      case "asset":
        return (
          <Cpu
            className={`h-4 w-4 ${
              status === "critical" ? "text-destructive" : status === "warning" ? "text-orange-400" : "text-green-400"
            }`}
          />
        );
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "organization": return t("locations") || "Locations";
      case "location": return t("locationLabel");
      case "area": return t("areaUnit");
      case "asset": return t("assets");
      default: return type;
    }
  };

  const renderTreeNode = (node: TreeNode, depth = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;

    if (searchQuery && !node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      const childMatch = node.children?.some((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.children?.some((gc) => gc.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      if (!childMatch) return null;
    }

    return (
      <div key={node.id}>
        <button
          onClick={() => {
            setSelectedNode(node);
            if (hasChildren) toggleExpand(node.id);
          }}
          className={`w-full flex items-center gap-2 py-2 px-3 rounded-md text-sm transition-colors hover:bg-accent ${
            isSelected ? "bg-primary/10 text-primary border-primary/20 border" : ""
          }`}
          style={{ [isRTL ? "paddingRight" : "paddingLeft"]: `${depth * 20 + 12}px` }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            )
          ) : (
            <span className="w-3.5 shrink-0" />
          )}
          {getNodeIcon(node.type, node.status)}
          <span className="truncate flex-1 text-start">{node.name}</span>
          {node.healthScore !== undefined && (
            <Badge
              variant="outline"
              className={`text-xs ${
                node.healthScore >= 90
                  ? "border-green-500/30 text-green-400"
                  : node.healthScore >= 80
                  ? "border-orange-500/30 text-orange-400"
                  : "border-destructive/30 text-destructive"
              }`}
            >
              {node.healthScore}%
            </Badge>
          )}
          {node.deviceCount !== undefined && (
            <span className="text-xs text-muted-foreground">{node.deviceCount} {t("devicesLabel")}</span>
          )}
        </button>
        {hasChildren && isExpanded && node.children!.map((child) => renderTreeNode(child, depth + 1))}
      </div>
    );
  };

  const renderDetailPanel = () => {
    if (!selectedNode) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-20">
          <MapPin className="h-12 w-12 mb-4 opacity-30" />
          <p>{t("selectLocationPrompt")}</p>
        </div>
      );
    }

    const siteId = selectedNode.siteId || "all";
    const kpi = mockSiteKPIs.find((k) => k.siteId === siteId);
    const alarms = getAlarmsBySite(siteId);
    const assets = mockAssets.filter((a) => a.siteId === siteId);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {getNodeIcon(selectedNode.type, selectedNode.status)}
              <h2 className="text-xl font-semibold">{selectedNode.name}</h2>
            </div>
            <Badge variant="outline" className="text-xs capitalize">
              {getTypeLabel(selectedNode.type)}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* KPIs (for location nodes) */}
        {(selectedNode.type === "location" || selectedNode.type === "organization") && kpi && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-muted-foreground">{t("plantHealthScore")}</span>
                </div>
                <p className="text-2xl font-bold">{kpi.healthScore}%</p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-xs text-muted-foreground">{t("activeAlarms")}</span>
                </div>
                <p className="text-2xl font-bold">{kpi.activeAlarms.critical + kpi.activeAlarms.warning}</p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Gauge className="h-4 w-4 text-blue-400" />
                  <span className="text-xs text-muted-foreground">{t("energyConsumption")}</span>
                </div>
                <p className="text-2xl font-bold">{kpi.energyConsumption} {kpi.energyUnit}</p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Thermometer className="h-4 w-4 text-orange-400" />
                  <span className="text-xs text-muted-foreground">{t("downtimeRisk")}</span>
                </div>
                <p className="text-2xl font-bold">{kpi.downTimeRisk}%</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Assets List (for location / area) */}
        {(selectedNode.type === "location" || selectedNode.type === "area") && assets.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{t("assets")} ({assets.length})</CardTitle>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {assets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <Cpu
                      className={`h-4 w-4 ${
                        asset.status === "critical" ? "text-destructive" : asset.status === "warning" ? "text-orange-400" : "text-green-400"
                      }`}
                    />
                    <div>
                      <span className="text-sm font-medium">{asset.name}</span>
                      <p className="text-xs text-muted-foreground capitalize">{asset.type.replace("_", " ")}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs capitalize ${
                      asset.status === "critical"
                        ? "border-destructive/30 text-destructive"
                        : asset.status === "warning"
                        ? "border-orange-500/30 text-orange-400"
                        : "border-green-500/30 text-green-400"
                    }`}
                  >
                    {asset.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Alarms */}
        {alarms.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{t("alarms")} ({alarms.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {alarms.slice(0, 5).map((alarm) => (
                <div key={alarm.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <AlertTriangle
                      className={`h-4 w-4 ${alarm.severity === "critical" ? "text-destructive" : "text-orange-400"}`}
                    />
                    <span className="text-sm">{alarm.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{alarm.timestamp}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Related Dashboards placeholder */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{t("relatedDashboards")}</CardTitle>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 rounded-md bg-accent/50">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{t("operationsDashboard")}</p>
                <p className="text-xs text-muted-foreground">{t("heavyIndustryTemplates")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t("permissionsAccess")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 rounded-md bg-accent/50">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t("members")}: 4</p>
                <p className="text-xs text-muted-foreground">2 {t("managersLabel")}, 2 {t("operatorsLabel")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <PanelLayout pageTitle={t("locations")}>
      <div className="mb-2">
        <p className="text-sm text-muted-foreground">{t("locationsSubtitle")}</p>
      </div>
      <div className="flex gap-4 h-[calc(100vh-180px)]">
        {/* Left: Tree */}
        <Card className="w-80 shrink-0 flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{t("allLocations")}</CardTitle>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative mt-2">
              <Search className="absolute top-2.5 h-4 w-4 text-muted-foreground" style={{ [isRTL ? "right" : "left"]: 8 }} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search")}
                className="h-9 text-sm"
                style={{ [isRTL ? "paddingRight" : "paddingLeft"]: 32 }}
              />
            </div>
          </CardHeader>
          <ScrollArea className="flex-1 px-2 pb-2">
            {renderTreeNode(tree)}
          </ScrollArea>
        </Card>

        {/* Right: Details */}
        <Card className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-6">{renderDetailPanel()}</ScrollArea>
        </Card>
      </div>
    </PanelLayout>
  );
};

export default Locations;
