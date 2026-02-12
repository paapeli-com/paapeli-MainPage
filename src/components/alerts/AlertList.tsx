import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, Search, Download, RefreshCw, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { mockAlerts } from "@/data/mockAlertData";
import type { Alert, AlertSeverity, AlertStatus } from "@/types/alerts";

const severityColors: Record<AlertSeverity, string> = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-white",
  low: "bg-blue-500 text-white",
};

const statusColors: Record<AlertStatus, string> = {
  active: "bg-destructive/15 text-destructive border-destructive/30",
  acknowledged: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30",
  resolved: "bg-green-500/15 text-green-700 border-green-500/30",
  suppressed: "bg-muted text-muted-foreground border-border",
};

interface AlertListProps {
  filter?: 'all' | 'active' | 'resolved';
}

export const AlertList = ({ filter = 'all' }: AlertListProps) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredAlerts = mockAlerts.filter(alert => {
    if (filter === 'active' && alert.status !== 'active' && alert.status !== 'acknowledged') return false;
    if (filter === 'resolved' && alert.status !== 'resolved') return false;
    if (searchQuery && !alert.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !alert.ruleName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !alert.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
    if (locationFilter !== 'all' && alert.locationId !== locationFilter) return false;
    if (statusFilter !== 'all' && alert.status !== statusFilter) return false;
    return true;
  });

  const locations = [...new Set(mockAlerts.map(a => a.locationId))];

  const handleAcknowledge = (alertId: string) => {
    // In a real app, this would call an API
    console.log('Acknowledge alert:', alertId);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Severity', 'Device', 'Location', 'Condition', 'Start Time', 'Duration', 'Status', 'Assigned To'];
    const rows = filteredAlerts.map(a => [a.id, a.severity, a.deviceName, a.locationName, a.triggerCondition, a.startTime, a.duration, a.status, a.assignedTo || '']);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'alerts_export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 me-1" />
            {t("alertFilters")}
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleExportCSV}>
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("alertExportCSV")}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("refresh")}</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 p-3 rounded-lg border border-border bg-card">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t("alertSeverity")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("alertAllSeverities")}</SelectItem>
              <SelectItem value="critical">{t("alertCritical")}</SelectItem>
              <SelectItem value="high">{t("alertHigh")}</SelectItem>
              <SelectItem value="medium">{t("alertMedium")}</SelectItem>
              <SelectItem value="low">{t("alertLow")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("locations")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allLocations")}</SelectItem>
              {locations.map(loc => (
                <SelectItem key={loc} value={loc}>
                  {mockAlerts.find(a => a.locationId === loc)?.locationName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t("alertStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("alertAllStatuses")}</SelectItem>
              <SelectItem value="active">{t("alertStatusActive")}</SelectItem>
              <SelectItem value="acknowledged">{t("alertStatusAcknowledged")}</SelectItem>
              <SelectItem value="resolved">{t("alertStatusResolved")}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" onClick={() => { setSeverityFilter('all'); setLocationFilter('all'); setStatusFilter('all'); }}>
            <X className="h-3 w-3 me-1" />
            {t("reset")}
          </Button>
        </div>
      )}

      {/* Summary */}
      <div className="flex gap-3 flex-wrap">
        <Badge variant="outline" className="gap-1">
          <span className="h-2 w-2 rounded-full bg-destructive inline-block" />
          {t("alertCritical")}: {filteredAlerts.filter(a => a.severity === 'critical').length}
        </Badge>
        <Badge variant="outline" className="gap-1">
          <span className="h-2 w-2 rounded-full bg-orange-500 inline-block" />
          {t("alertHigh")}: {filteredAlerts.filter(a => a.severity === 'high').length}
        </Badge>
        <Badge variant="outline" className="gap-1">
          <span className="h-2 w-2 rounded-full bg-yellow-500 inline-block" />
          {t("alertMedium")}: {filteredAlerts.filter(a => a.severity === 'medium').length}
        </Badge>
        <Badge variant="outline" className="gap-1">
          <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
          {t("alertLow")}: {filteredAlerts.filter(a => a.severity === 'low').length}
        </Badge>
      </div>

      {/* Table */}
      {filteredAlerts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("alertNoResults")}</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[100px]">{t("alertId")}</TableHead>
                <TableHead>{t("alertSeverity")}</TableHead>
                <TableHead>{t("devices")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("locations")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("alertTriggerCondition")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("alertStartTime")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("alertDuration")}</TableHead>
                <TableHead>{t("alertStatus")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("alertAssignedTo")}</TableHead>
                <TableHead className="w-[80px]">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs">{alert.id}</TableCell>
                  <TableCell>
                    <Badge className={severityColors[alert.severity]}>
                      {t(`alert${alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}` as any)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{alert.deviceName}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{alert.locationName}</TableCell>
                  <TableCell className="hidden lg:table-cell font-mono text-xs">{alert.triggerCondition}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs">
                    {new Date(alert.startTime).toLocaleString()}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{alert.duration}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[alert.status]}>
                      {t(`alertStatus${alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}` as any)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">{alert.assignedTo || '—'}</TableCell>
                  <TableCell>
                    {alert.status === 'active' && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => handleAcknowledge(alert.id)}>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("alertAcknowledge")}</TooltipContent>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
