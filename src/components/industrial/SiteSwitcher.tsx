import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockSites } from "@/data/mockIndustrialData";
import { Building2, Factory, Globe } from "lucide-react";

interface SiteSwitcherProps {
  selectedSite: string;
  onSiteChange: (siteId: string) => void;
}

export const SiteSwitcher = ({ selectedSite, onSiteChange }: SiteSwitcherProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'factory': return <Factory className="h-4 w-4" />;
      case 'refinery': 
      case 'plant':
      case 'unit':
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  return (
    <Select value={selectedSite} onValueChange={onSiteChange}>
      <SelectTrigger className="w-[280px] bg-[#1a1f2e] border-[#2a3441] text-white">
        <SelectValue placeholder="Select Site">
          <div className="flex items-center gap-2">
            {selectedSite === 'all' ? (
              <>
                <Globe className="h-4 w-4" />
                <span>All Sites</span>
              </>
            ) : (
              <>
                {getIcon(mockSites.find(s => s.id === selectedSite)?.type || 'plant')}
                <span>{mockSites.find(s => s.id === selectedSite)?.name}</span>
              </>
            )}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-[#1a1f2e] border-[#2a3441]">
        <SelectItem value="all" className="text-white hover:bg-[#2a3441]">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>All Sites</span>
            <span className="text-xs text-gray-500 ml-2">(Global Overview)</span>
          </div>
        </SelectItem>
        {mockSites.map((site) => (
          <SelectItem 
            key={site.id} 
            value={site.id}
            className="text-white hover:bg-[#2a3441]"
          >
            <div className="flex items-center gap-2">
              {getIcon(site.type)}
              <span>{site.name}</span>
              <span className={`text-xs ml-2 ${
                site.status === 'running' ? 'text-green-500' : 
                site.status === 'warning' ? 'text-orange-500' : 'text-gray-500'
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
