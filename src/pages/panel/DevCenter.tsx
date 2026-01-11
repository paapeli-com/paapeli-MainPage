import { useState, useEffect } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest, getApiUrl } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Code, Book, Activity, Zap, Database, Shield, Globe } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ApiHealth {
  status: string;
  timestamp: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
}

interface DeviceGroup {
  id: string;
  name: string;
  device_count: number;
}

interface Gateway {
  id: string;
  name: string;
  status: string;
}

const DevCenter = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [deviceGroups, setDeviceGroups] = useState<DeviceGroup[]>([]);
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiErrors, setApiErrors] = useState({
    projects: false,
    deviceGroups: false,
    gateways: false,
  });

  useEffect(() => {
    const fetchDevData = async () => {
      try {
        // Fetch API health
        try {
          const healthResponse = await fetch(getApiUrl("/health"));
          if (healthResponse.ok) {
            const contentType = healthResponse.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const healthData = await healthResponse.json();
              setHealth(healthData);
            }
          }
        } catch (healthError) {
          console.error("Failed to fetch API health:", healthError);
        }

        // Fetch user's projects
        try {
          const projectsResponse = await apiRequest("/api/v1/projects");
          const projectsData = projectsResponse?.data || [];
          setProjects(projectsData);
          setApiErrors(prev => ({ ...prev, projects: false }));
        } catch (error) {
          console.error("Failed to fetch projects:", error);
          setProjects([]);
          setApiErrors(prev => ({ ...prev, projects: true }));
          // Only show toast if it's not a JSON parsing error (which happens when services are down)
          if (!error.message.includes('JSON.parse') && !error.message.includes('unexpected character')) {
            toast({
              title: "Service Unavailable",
              description: "Unable to load projects data. Projects service may not be running.",
              variant: "destructive",
            });
          }
        }

        // Fetch device groups
        try {
          const groupsResponse = await apiRequest("/api/v1/device-groups");
          const groupsData = groupsResponse?.data || [];
          setDeviceGroups(groupsData);
          setApiErrors(prev => ({ ...prev, deviceGroups: false }));
        } catch (error) {
          console.error("Failed to fetch device groups:", error);
          setDeviceGroups([]);
          setApiErrors(prev => ({ ...prev, deviceGroups: true }));
          // Only show toast if it's not a JSON parsing error (which happens when services are down)
          if (!error.message.includes('JSON.parse') && !error.message.includes('unexpected character')) {
            toast({
              title: "Service Unavailable",
              description: "Unable to load device groups data. Device Groups service may not be running.",
              variant: "destructive",
            });
          }
        }

        // Fetch gateways
        try {
          const gatewaysResponse = await apiRequest("/api/v1/gateways");
          const gatewaysData = gatewaysResponse?.data || [];
          setGateways(gatewaysData);
          setApiErrors(prev => ({ ...prev, gateways: false }));
        } catch (error) {
          console.error("Failed to fetch gateways:", error);
          setGateways([]);
          setApiErrors(prev => ({ ...prev, gateways: true }));
          // Only show toast if it's not a JSON parsing error (which happens when services are down)
          if (!error.message.includes('JSON.parse') && !error.message.includes('unexpected character')) {
            toast({
              title: "Service Unavailable",
              description: "Unable to load gateways data. Gateways service may not be running.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch dev center data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevData();
  }, [toast]);

  const apiEndpoints = [
    { name: "Health Check", path: "/health", method: "GET", description: "Check API availability" },
    { name: "User Profile", path: "/api/v1/users/me", method: "GET", description: "Get current user info" },
    { name: "List Projects", path: "/api/v1/projects", method: "GET", description: "Get user's projects" },
    { name: "List Gateways", path: "/api/v1/gateways", method: "GET", description: "Get IoT gateways" },
    { name: "Device Groups", path: "/api/v1/device-groups", method: "GET", description: "List device groups" },
    { name: "Create Device Group", path: "/api/v1/device-groups", method: "POST", description: "Create new device group" },
    { name: "Group Devices", path: "/api/v1/device-groups/{id}/devices", method: "GET", description: "List devices in group" },
    { name: "Add to Group", path: "/api/v1/device-groups/{id}/devices", method: "POST", description: "Add device to group" },
    { name: "Remove from Group", path: "/api/v1/device-groups/{id}/devices/{deviceId}", method: "DELETE", description: "Remove device from group" },
    { name: "Device Telemetry", path: "/api/v1/devices/{id}/telemetry", method: "GET", description: "Get device sensor data" },
    { name: "Submit Telemetry", path: "/api/v1/telemetry/{deviceId}", method: "POST", description: "Send sensor readings" },
    { name: "List Alerts", path: "/api/v1/alerts", method: "GET", description: "Get system alerts" },
    { name: "Alert Details", path: "/api/v1/alerts/{id}", method: "GET", description: "Get specific alert details" },
    { name: "Acknowledge Alert", path: "/api/v1/alerts/{id}/acknowledge", method: "POST", description: "Acknowledge an alert" },
  ];

  const documentationLinks = [
    { title: "API Documentation", url: "http://docs.paapeli.local/redoc", icon: Book },
    { title: "Interactive API", url: "http://docs.paapeli.local/swagger/index.html", icon: Code },
    { title: "Architecture Guide", url: "http://docs.paapeli.local/architecture.html", icon: Database },
    { title: "Security Guide", url: "http://docs.paapeli.local/security.html", icon: Shield },
  ];

  const sdkExamples = [
    {
      title: "Python Gateway",
      code: `import requests

# Send telemetry data
response = requests.post(
    'http://api.paapeli.local/api/v1/telemetry/device-001',
    headers={'X-API-Key': 'your-api-key'},
    json={
        'timestamp': '2026-01-10T12:00:00Z',
        'sensor_type': 'temperature',
        'value': 23.5,
        'unit': 'celsius'
    }
)`
    },
    {
      title: "cURL Command",
      code: `curl -X POST http://api.paapeli.local/api/v1/telemetry/device-001 \\
  -H "X-API-Key: your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{"sensor_type":"temperature","value":23.5,"unit":"celsius"}'`
    },
    {
      title: "Device Group Management",
      code: `import requests

# Add device to group
response = requests.post(
    'http://api.paapeli.local/api/v1/device-groups/group-001/devices',
    headers={'Authorization': 'Bearer your-jwt-token'},
    json={'device_id': 'gateway-uuid'}
)

# List devices in group
devices = requests.get(
    'http://api.paapeli.local/api/v1/device-groups/group-001/devices',
    headers={'Authorization': 'Bearer your-jwt-token'}
)`
    }
  ];

  const hasAnyErrors = apiErrors.projects || apiErrors.deviceGroups || apiErrors.gateways;

  return (
    <PanelLayout pageTitle={t("devCenter")}>
      <div className="space-y-6">
        {hasAnyErrors && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 text-amber-600 dark:text-amber-400">
                ⚠️
              </div>
              <div>
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Some Services Unavailable
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Projects, Device Groups, and/or Gateways services may not be running. The data shown below may not be current.
                </p>
              </div>
            </div>
          </div>
        )}
        {/* API Health Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5" />
              API Health Status
            </CardTitle>
            {health && (
              <Badge variant={health.status === 'ok' ? 'default' : 'destructive'}>
                {health.status.toUpperCase()}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : health ? (
              <div className="text-sm text-muted-foreground">
                Last checked: {new Date(health.timestamp).toLocaleString()}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Unable to check API health</div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className={apiErrors.projects ? "border-destructive/50 bg-destructive/5" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                Projects
                {apiErrors.projects && <span className="text-xs text-destructive">⚠️</span>}
              </CardTitle>
              <Database className={`h-4 w-4 ${apiErrors.projects ? "text-destructive" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${apiErrors.projects ? "text-destructive" : ""}`}>
                {apiErrors.projects ? "!" : projects.length}
              </div>
              {apiErrors.projects && (
                <p className="text-xs text-destructive mt-1">Service unavailable</p>
              )}
            </CardContent>
          </Card>

          <Card className={apiErrors.deviceGroups ? "border-destructive/50 bg-destructive/5" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                Device Groups
                {apiErrors.deviceGroups && <span className="text-xs text-destructive">⚠️</span>}
              </CardTitle>
              <Shield className={`h-4 w-4 ${apiErrors.deviceGroups ? "text-destructive" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${apiErrors.deviceGroups ? "text-destructive" : ""}`}>
                {apiErrors.deviceGroups ? "!" : deviceGroups.length}
              </div>
              {apiErrors.deviceGroups && (
                <p className="text-xs text-destructive mt-1">Service unavailable</p>
              )}
            </CardContent>
          </Card>

          <Card className={apiErrors.gateways ? "border-destructive/50 bg-destructive/5" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                Gateways
                {apiErrors.gateways && <span className="text-xs text-destructive">⚠️</span>}
              </CardTitle>
              <Zap className={`h-4 w-4 ${apiErrors.gateways ? "text-destructive" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${apiErrors.gateways ? "text-destructive" : ""}`}>
                {apiErrors.gateways ? "!" : gateways.length}
              </div>
              {apiErrors.gateways && (
                <p className="text-xs text-destructive mt-1">Service unavailable</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SDK Examples</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sdkExamples.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* API Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Available API Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {apiEndpoints.map((endpoint, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono">{endpoint.path}</code>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`http://docs.paapeli.local/swagger/index.html#/`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documentation Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Documentation & Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {documentationLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto p-4"
                  onClick={() => window.open(link.url, '_blank')}
                >
                  <link.icon className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{link.title}</div>
                    <div className="text-sm text-muted-foreground">View documentation</div>
                  </div>
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SDK Examples */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              SDK Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sdkExamples.map((example, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{example.title}</h4>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {example.code}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  );
};

export default DevCenter;
