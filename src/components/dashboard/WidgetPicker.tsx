import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Search, 
  ChevronUp,
  Battery,
  Gauge,
  CircleDot,
  Hash,
  Circle,
  Container,
  Thermometer,
  BarChart3,
  Activity,
  LineChart,
  PieChart,
  Table,
  Grid3X3,
  AlertTriangle,
  TableProperties,
  Map,
  FormInput,
  SlidersHorizontal,
  Power,
} from "lucide-react";

export interface WidgetType {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  isPro?: boolean;
}

const widgetCategories = [
  {
    name: "Metrics",
    widgets: [
      { id: "battery", name: "Battery", icon: Battery },
      { id: "gauge", name: "Gauge", icon: Gauge },
      { id: "indicator", name: "Indicator", icon: CircleDot },
      { id: "metric", name: "Metric", icon: Hash },
      { id: "ring-gauge", name: "Ring gauge", icon: Circle, isPro: true },
      { id: "tank", name: "Tank", icon: Container },
      { id: "thermometer", name: "Thermometer", icon: Thermometer },
    ],
  },
  {
    name: "Charts",
    widgets: [
      { id: "bar-chart", name: "Bar chart", icon: BarChart3 },
      { id: "frequency-chart", name: "Frequency chart", icon: Activity, isPro: true },
      { id: "histogram", name: "Histogram", icon: BarChart3 },
      { id: "line-chart", name: "Line chart", icon: LineChart },
      { id: "pie-chart", name: "Pie chart", icon: PieChart },
      { id: "rose-chart", name: "Rose chart", icon: PieChart },
    ],
  },
  {
    name: "Tables",
    widgets: [
      { id: "devices-table", name: "Devices Table", icon: Table },
      { id: "heatmap-table", name: "Heatmap Table", icon: Grid3X3, isPro: true },
      { id: "incidents", name: "Incidents", icon: AlertTriangle, isPro: true },
      { id: "values-table", name: "Values table", icon: TableProperties },
      { id: "variables-table", name: "Variables table", icon: TableProperties },
    ],
  },
  {
    name: "Maps",
    widgets: [
      { id: "map", name: "Map", icon: Map },
    ],
  },
  {
    name: "Control",
    widgets: [
      { id: "manual-input", name: "Manual input", icon: FormInput },
      { id: "slider", name: "Slider", icon: SlidersHorizontal },
      { id: "switch", name: "Switch", icon: Power },
    ],
  },
];

interface WidgetPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboardName: string;
  onSelectWidget: (widget: WidgetType) => void;
}

export const WidgetPicker = ({ open, onOpenChange, dashboardName, onSelectWidget }: WidgetPickerProps) => {
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(widgetCategories.map(c => [c.name, true]))
  );

  const toggleCategory = (categoryName: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const filteredCategories = widgetCategories.map(category => ({
    ...category,
    widgets: category.widgets.filter(widget => 
      widget.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.widgets.length > 0);

  const handleWidgetClick = (widget: typeof widgetCategories[0]["widgets"][0], category: string) => {
    onSelectWidget({
      ...widget,
      category,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side={isRTL ? "left" : "right"} 
        className="w-[400px] sm:max-w-[400px] p-0 overflow-hidden"
      >
        <div className="bg-primary text-primary-foreground p-6 text-center">
          <p className="text-sm opacity-80">{dashboardName}</p>
          <SheetTitle className="text-2xl font-normal text-primary-foreground mt-1">
            Add new widget
          </SheetTitle>
        </div>
        
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-200px)] px-4">
          {filteredCategories.map((category) => (
            <Collapsible 
              key={category.name}
              open={openCategories[category.name]}
              onOpenChange={() => toggleCategory(category.name)}
              className="mb-4"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-b">
                <span className="font-medium text-sm">{category.name}</span>
                <ChevronUp className={`h-4 w-4 transition-transform ${openCategories[category.name] ? "" : "rotate-180"}`} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-6 gap-3 py-4">
                  {category.widgets.map((widget) => (
                    <button
                      key={widget.id}
                      onClick={() => handleWidgetClick(widget, category.name)}
                      className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors group relative"
                    >
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <widget.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                      </div>
                      <span className="text-xs text-center leading-tight">{widget.name}</span>
                      {widget.isPro && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] px-1 rounded">
                          ★
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
