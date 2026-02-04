import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Menu, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  RefreshCw, 
  Pause, 
  Pencil,
  Plus,
  ArrowLeft
} from "lucide-react";
import { DashboardConfig } from "./AddDashboardDialog";
import { WidgetPicker, WidgetType } from "./WidgetPicker";
import { WidgetSettings } from "./WidgetSettings";

interface DashboardWidget {
  id: string;
  type: WidgetType;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface DashboardCanvasProps {
  dashboard: DashboardConfig;
  onBack: () => void;
}

export const DashboardCanvas = ({ dashboard, onBack }: DashboardCanvasProps) => {
  const { isRTL } = useLanguage();
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [widgetPickerOpen, setWidgetPickerOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<WidgetType | null>(null);
  const [widgetSettingsOpen, setWidgetSettingsOpen] = useState(false);

  const handleAddWidgetClick = () => {
    setWidgetPickerOpen(true);
  };

  const handleSelectWidget = (widget: WidgetType) => {
    setSelectedWidget(widget);
    setWidgetPickerOpen(false);
    setWidgetSettingsOpen(true);
  };

  const handleSaveWidget = () => {
    if (selectedWidget) {
      const newWidget: DashboardWidget = {
        id: `widget-${Date.now()}`,
        type: selectedWidget,
        position: { x: 0, y: widgets.length * 200 },
        size: { width: 300, height: 200 },
      };
      setWidgets([...widgets, newWidget]);
      setWidgetSettingsOpen(false);
      setSelectedWidget(null);
    }
  };

  const handleBackFromSettings = () => {
    setWidgetSettingsOpen(false);
    setWidgetPickerOpen(true);
  };

  const currentDate = new Date().toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <header className="h-14 bg-[#2d3748] text-white flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="hover:bg-white/10 p-2 rounded">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Menu className="h-5 w-5 cursor-pointer" />
          <h1 className="text-lg font-medium">{dashboard.name}</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{currentDate} - Now</span>
            <ChevronLeft className="h-4 w-4 rotate-90" />
          </div>
          
          <div className="flex items-center gap-1">
            <button className="hover:bg-white/10 p-2 rounded">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="hover:bg-white/10 p-2 rounded">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <button className="hover:bg-white/10 p-2 rounded">
            <Maximize2 className="h-5 w-5" />
          </button>
          <button className="hover:bg-white/10 p-2 rounded">
            <RefreshCw className="h-5 w-5" />
          </button>
          <button className="hover:bg-white/10 p-2 rounded">
            <Pause className="h-5 w-5" />
          </button>
          <button className="hover:bg-white/10 p-2 rounded">
            <Pencil className="h-5 w-5" />
          </button>

          <Button 
            onClick={handleAddWidgetClick}
            size="icon" 
            className="ml-2 rounded-full bg-primary hover:bg-primary/90 h-10 w-10"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Canvas Area */}
      <div className="p-6">
        {widgets.length === 0 ? (
          <div 
            onClick={handleAddWidgetClick}
            className="border-2 border-dashed border-gray-300 rounded-lg h-[250px] w-[280px] flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors group"
          >
            <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl text-gray-400 group-hover:text-primary transition-colors">
              Add new Widget
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className="border border-border rounded-lg p-4 bg-card min-h-[200px]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <widget.type.icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{widget.type.name}</span>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  No data configured
                </div>
              </div>
            ))}
            
            {/* Add widget card */}
            <div 
              onClick={handleAddWidgetClick}
              className="border-2 border-dashed border-gray-300 rounded-lg min-h-[200px] flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors group"
            >
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mb-3 group-hover:bg-primary transition-colors">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <span className="text-gray-400 group-hover:text-primary transition-colors">
                Add Widget
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Widget Picker */}
      <WidgetPicker
        open={widgetPickerOpen}
        onOpenChange={setWidgetPickerOpen}
        dashboardName={dashboard.name}
        onSelectWidget={handleSelectWidget}
      />

      {/* Widget Settings */}
      <WidgetSettings
        open={widgetSettingsOpen}
        onOpenChange={setWidgetSettingsOpen}
        widget={selectedWidget}
        onBack={handleBackFromSettings}
        onSave={handleSaveWidget}
      />
    </div>
  );
};
