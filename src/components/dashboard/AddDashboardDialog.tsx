import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Plus, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface DashboardConfig {
  name: string;
  tags: string[];
  defaultTimeRange: string;
  dynamicDashboard: string;
  width: string;
  alignment: string;
  dateFormat: string;
  dashboardType: string;
  customPageUrl: string;
  filters: string[];
  customStyle: string;
  widgetSpacingX: number;
  widgetSpacingY: number;
  floatingWidgets: boolean;
  hideWidgetsHeader: boolean;
  backgroundImage: string;
}

interface AddDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: DashboardConfig) => void;
}

export const AddDashboardDialog = ({ open, onOpenChange, onSave }: AddDashboardDialogProps) => {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("settings");
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const [config, setConfig] = useState<DashboardConfig>({
    name: "New Dashboard",
    tags: [],
    defaultTimeRange: "Last 24 hours",
    dynamicDashboard: "Static",
    width: "Auto",
    alignment: "Center",
    dateFormat: new Date().toISOString().slice(0, 16).replace('T', ' '),
    dashboardType: "Default",
    customPageUrl: "",
    filters: [],
    customStyle: "Custom style",
    widgetSpacingX: 10,
    widgetSpacingY: 10,
    floatingWidgets: false,
    hideWidgetsHeader: false,
    backgroundImage: "",
  });

  const handleSave = () => {
    onSave(config);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
        <div className="bg-primary text-primary-foreground p-6 text-center">
          <DialogTitle className="text-2xl font-normal">Add new Dashboard</DialogTitle>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-center bg-transparent border-b rounded-none h-auto p-0">
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-8 py-3 text-base font-medium"
            >
              SETTINGS
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-8 py-3 text-base font-medium text-muted-foreground"
            >
              APPEARANCE
            </TabsTrigger>
          </TabsList>
          
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <TabsContent value="settings" className="mt-0 space-y-6">
              {/* Name */}
              <div className="grid grid-cols-[180px_1fr] gap-4 items-center">
                <Label className="font-medium">Name</Label>
                <Input 
                  value={config.name} 
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  className="border-gray-300"
                />
              </div>

              {/* Tags */}
              <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                <div>
                  <Label className="font-medium">Tags</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Custom identifiers that can be attached to one or more users.
                  </p>
                </div>
                <Input 
                  placeholder="Add new tag"
                  className="border-gray-300"
                />
              </div>

              {/* Default time range */}
              <div className="grid grid-cols-[180px_1fr] gap-4 items-center">
                <Label className="font-medium">Default time range</Label>
                <div className="relative">
                  <Select value={config.defaultTimeRange} onValueChange={(v) => setConfig({ ...config, defaultTimeRange: v })}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Last 24 hours">Last 24 hours</SelectItem>
                      <SelectItem value="Last 7 days">Last 7 days</SelectItem>
                      <SelectItem value="Last 30 days">Last 30 days</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dynamic Dashboard */}
              <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                <div>
                  <Label className="font-medium">Dynamic Dashboard</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Update widgets based on selected Device
                  </p>
                </div>
                <Select value={config.dynamicDashboard} onValueChange={(v) => setConfig({ ...config, dynamicDashboard: v })}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Static">Static</SelectItem>
                    <SelectItem value="Dynamic">Dynamic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Width */}
              <div className="grid grid-cols-[180px_1fr] gap-4 items-center">
                <Label className="font-medium">Width</Label>
                <Select value={config.width} onValueChange={(v) => setConfig({ ...config, width: v })}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Auto">Auto</SelectItem>
                    <SelectItem value="Full">Full</SelectItem>
                    <SelectItem value="Fixed">Fixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Alignment */}
              <div className="grid grid-cols-[180px_1fr] gap-4 items-center">
                <Label className="font-medium">Alignment</Label>
                <Select value={config.alignment} onValueChange={(v) => setConfig({ ...config, alignment: v })}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Center">Center</SelectItem>
                    <SelectItem value="Left">Left</SelectItem>
                    <SelectItem value="Right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date format */}
              <div className="grid grid-cols-[180px_1fr] gap-4 items-center">
                <Label className="font-medium">Date format</Label>
                <Select value={config.dateFormat} onValueChange={(v) => setConfig({ ...config, dateFormat: v })}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={config.dateFormat}>{config.dateFormat}</SelectItem>
                    <SelectItem value="DD/MM/YYYY HH:mm">DD/MM/YYYY HH:mm</SelectItem>
                    <SelectItem value="MM/DD/YYYY HH:mm">MM/DD/YYYY HH:mm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dashboard type */}
              <div className="grid grid-cols-[180px_1fr] gap-4 items-center">
                <Label className="font-medium">Dashboard type</Label>
                <Select value={config.dashboardType} onValueChange={(v) => setConfig({ ...config, dashboardType: v })}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Default">Default</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom page URL */}
              <div className="grid grid-cols-[180px_1fr] gap-4 items-center">
                <Label className="font-medium">Custom page URL</Label>
                <Input 
                  value={config.customPageUrl} 
                  onChange={(e) => setConfig({ ...config, customPageUrl: e.target.value })}
                  className="border-gray-300 bg-gray-100"
                  disabled
                />
              </div>

              {/* Filters */}
              <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                  <Label className="font-medium cursor-pointer">Filters</Label>
                  <ChevronUp className={`h-4 w-4 transition-transform ${filtersOpen ? "" : "rotate-180"}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="pt-4 flex justify-center">
                    <Button variant="ghost" className="text-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      ADD FILTER
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="appearance" className="mt-0 space-y-6">
              {/* Custom style */}
              <div className="grid grid-cols-[180px_1fr] gap-4 items-center">
                <Label className="font-medium">Custom style</Label>
                <div className="relative">
                  <Input 
                    value={config.customStyle} 
                    onChange={(e) => setConfig({ ...config, customStyle: e.target.value })}
                    className="border-gray-300 pr-10"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ✏️
                  </button>
                </div>
              </div>

              {/* Widgets' minimal spacing */}
              <div className="grid grid-cols-[180px_1fr] gap-4 items-center">
                <Label className="font-medium">Widgets' minimal spacing</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number"
                    value={config.widgetSpacingX} 
                    onChange={(e) => setConfig({ ...config, widgetSpacingX: parseInt(e.target.value) || 0 })}
                    className="border-gray-300 w-20"
                  />
                  <span className="text-muted-foreground">px</span>
                  <Input 
                    type="number"
                    value={config.widgetSpacingY} 
                    onChange={(e) => setConfig({ ...config, widgetSpacingY: parseInt(e.target.value) || 0 })}
                    className="border-gray-300 w-20"
                  />
                  <span className="text-muted-foreground">px</span>
                </div>
              </div>

              {/* Floating widgets */}
              <div className="grid grid-cols-[180px_1fr] gap-4 items-center">
                <Label className="font-medium">Floating widgets</Label>
                <Switch 
                  checked={config.floatingWidgets}
                  onCheckedChange={(checked) => setConfig({ ...config, floatingWidgets: checked })}
                />
              </div>

              {/* Hide widgets' header */}
              <div className="grid grid-cols-[180px_1fr] gap-4 items-center">
                <Label className="font-medium">Hide widgets' header</Label>
                <Switch 
                  checked={config.hideWidgetsHeader}
                  onCheckedChange={(checked) => setConfig({ ...config, hideWidgetsHeader: checked })}
                />
              </div>

              {/* Background image */}
              <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                <Label className="font-medium">Background image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <span className="text-muted-foreground">🖼️</span>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="p-4 border-t bg-gray-50">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            CANCEL
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            SAVE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
