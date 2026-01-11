import { useState, useEffect, useCallback } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Plus, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";

interface Alarm {
  id: string;
  name: string;
  description?: string;
  project_id: string;
  gateway_id?: string;
  metric_name: string;
  condition: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  threshold: number;
  duration_seconds: number;
  severity: 'info' | 'warning' | 'critical';
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
}

interface Gateway {
  id: string;
  name: string;
  location?: string;
}

const Alarms = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [alarmName, setAlarmName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedGatewayId, setSelectedGatewayId] = useState("all");
  const [metricName, setMetricName] = useState("temperature");
  const [condition, setCondition] = useState<'gt' | 'lt' | 'eq' | 'gte' | 'lte'>('gt');
  const [threshold, setThreshold] = useState("");
  const [duration, setDuration] = useState("60");
  const [severity, setSeverity] = useState<'info' | 'warning' | 'critical'>('warning');

  const fetchAlarms = useCallback(async () => {
    try {
      const response = await apiRequest("/api/v1/alarms");
      const alarmsData = response.alarms || [];
      setAlarms(alarmsData);
    } catch (error) {
      console.error("Failed to fetch alarms:", error);
      toast({
        title: t("error"),
        description: "Failed to load alarms",
        variant: "destructive",
      });
    }
  }, [toast, t]);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await apiRequest("/api/v1/projects");
      const projectsData = response.projects || [];
      setProjects(projectsData);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  }, []);

  const fetchGateways = useCallback(async () => {
    try {
      const response = await apiRequest("/api/v1/gateways");
      const gatewaysData = response.gateways || [];
      setGateways(gatewaysData);
    } catch (error) {
      console.error("Failed to fetch gateways:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAlarms(), fetchProjects(), fetchGateways()]);
      setLoading(false);
    };
    loadData();
  }, [fetchAlarms, fetchProjects, fetchGateways]);

  const handleAddAlarm = async () => {
    if (!alarmName.trim() || !threshold || !selectedProjectId) {
      toast({
        title: t("error"),
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiRequest("/api/v1/alarms", {
        method: "POST",
        body: JSON.stringify({
          name: alarmName,
          description: description || undefined,
          project_id: selectedProjectId,
          gateway_id: selectedGatewayId === "all" ? undefined : selectedGatewayId,
          metric_name: metricName,
          condition,
          threshold: parseFloat(threshold),
          duration_seconds: parseInt(duration),
          severity,
          enabled: true,
        }),
      });

      const newAlarm = response.data;
      setAlarms(prev => [newAlarm, ...prev]);

      toast({
        title: t("success"),
        description: "Alarm created successfully",
      });

      // Reset form
      resetForm();
      setAddPanelOpen(false);
    } catch (error: unknown) {
      console.error("Failed to create alarm:", error);
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : "Failed to create alarm",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setAlarmName("");
    setDescription("");
    setSelectedProjectId(projects.length > 0 ? projects[0].id : "");
    setSelectedGatewayId("all");
    setMetricName("temperature");
    setCondition('gt');
    setThreshold("");
    setDuration("60");
    setSeverity('warning');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'default';
      case 'info': return 'secondary';
      default: return 'secondary';
    }
  };

  const getConditionLabel = (condition: string) => {
    const labels = {
      gt: '>',
      lt: '<',
      eq: '=',
      gte: '≥',
      lte: '≤'
    };
    return labels[condition as keyof typeof labels] || condition;
  };

  return (
    <PanelLayout pageTitle={t("alarms")} onAddClick={() => { setAddPanelOpen(true); resetForm(); }}>
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : alarms.length === 0 ? (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">{t("noAlarmsYet")}</p>
          <Button onClick={() => { setAddPanelOpen(true); resetForm(); }}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Alarm
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Alarms</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alarms.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alarms</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {alarms.filter(alarm => alarm.enabled).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {alarms.filter(alarm => alarm.severity === 'critical').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Warnings</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {alarms.filter(alarm => alarm.severity === 'warning').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alarms Table */}
          <Card>
            <CardHeader>
              <CardTitle>Alarm Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Metric</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alarms.map((alarm) => {
                    const project = projects.find(p => p.id === alarm.project_id);
                    const gateway = gateways.find(g => g.id === alarm.gateway_id);
                    return (
                      <TableRow key={alarm.id}>
                        <TableCell className="font-medium">{alarm.name}</TableCell>
                        <TableCell>{alarm.metric_name}</TableCell>
                        <TableCell>
                          {getConditionLabel(alarm.condition)} {alarm.threshold}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getSeverityColor(alarm.severity)}>
                            {alarm.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={alarm.enabled ? 'default' : 'secondary'}>
                            {alarm.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(alarm.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Alarm Sheet */}
      <Sheet open={addPanelOpen} onOpenChange={(open) => { setAddPanelOpen(open); if (!open) resetForm(); }}>
        <SheetContent side="right" className="w-full sm:max-w-[600px] overflow-y-auto">
          <SheetHeader className="bg-primary text-primary-foreground -mx-6 -mt-6 px-6 py-6 mb-6">
            <SheetTitle className="text-primary-foreground">Create Alarm Rule</SheetTitle>
          </SheetHeader>

          <div className="space-y-6">
            <div>
              <Label>Project *</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Gateway (Optional)</Label>
              <Select value={selectedGatewayId} onValueChange={setSelectedGatewayId}>
                <SelectTrigger>
                  <SelectValue placeholder="All gateways" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all" value="all">All gateways</SelectItem>
                  {gateways.map((gateway) => (
                    <SelectItem key={gateway.id} value={gateway.id}>
                      {gateway.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Alarm Name *</Label>
                <Input
                  value={alarmName}
                  onChange={(e) => setAlarmName(e.target.value)}
                  placeholder="High Temperature Alert"
                  autoFocus
                />
              </div>

              <div>
                <Label>Metric</Label>
                <Select value={metricName} onValueChange={(value: string) => setMetricName(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="temperature">Temperature</SelectItem>
                    <SelectItem value="humidity">Humidity</SelectItem>
                    <SelectItem value="pressure">Pressure</SelectItem>
                    <SelectItem value="voltage">Voltage</SelectItem>
                    <SelectItem value="current">Current</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Condition</Label>
                <Select value={condition} onValueChange={(value: 'gt' | 'lt' | 'eq' | 'gte' | 'lte') => setCondition(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gt">Greater than</SelectItem>
                    <SelectItem value="lt">Less than</SelectItem>
                    <SelectItem value="eq">Equal to</SelectItem>
                    <SelectItem value="gte">Greater or equal</SelectItem>
                    <SelectItem value="lte">Less or equal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Threshold *</Label>
                <Input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  placeholder="85.0"
                />
              </div>

              <div>
                <Label>Severity</Label>
                <Select value={severity} onValueChange={(value: 'info' | 'warning' | 'critical') => setSeverity(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Duration (seconds)</Label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="60"
              />
            </div>

            <div>
              <Label>Description (Optional)</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Alert when temperature exceeds threshold"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setAddPanelOpen(false); resetForm(); }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleAddAlarm}
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create Alarm"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </PanelLayout>
  );
};

export default Alarms;
