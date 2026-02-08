import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockSites } from "@/data/mockIndustrialData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Building2, Factory, Globe } from "lucide-react";

interface LocationSwitcherProps {
  selectedLocation: string;
  onLocationChange: (locationId: string) => void;
}

export const LocationSwitcher = ({ selectedLocation, onLocationChange }: LocationSwitcherProps) => {
  const { t } = useLanguage();

  const getIcon = (type: string) => {
    switch (type) {
      case 'factory': return <Factory className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  return (
    <Select value={selectedLocation} onValueChange={onLocationChange}>
      <SelectTrigger className="w-[280px] bg-card border-border">
        <SelectValue placeholder={t("allLocations")}>
          <div className="flex items-center gap-2">
            {selectedLocation === 'all' ? (
              <>
                <Globe className="h-4 w-4" />
                <span>{t("allLocations")}</span>
              </>
            ) : (
              <>
                {getIcon(mockSites.find(s => s.id === selectedLocation)?.type || 'plant')}
                <span>{mockSites.find(s => s.id === selectedLocation)?.name}</span>
              </>
            )}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-popover border-border z-50">
        <SelectItem value="all">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>{t("allLocations")}</span>
            <span className="text-xs text-muted-foreground ml-2">({t("globalOverview")})</span>
          </div>
        </SelectItem>
        {mockSites.map((site) => (
          <SelectItem key={site.id} value={site.id}>
            <div className="flex items-center gap-2">
              {getIcon(site.type)}
              <span>{site.name}</span>
              <span className={`text-xs ml-2 ${
                site.status === 'running' ? 'text-green-500' : 
                site.status === 'warning' ? 'text-orange-500' : 'text-muted-foreground'
              }`}>
                {site.healthScore}%
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
