import { useState, useEffect } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest, getApiUrl } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
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

const DevCenter = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevData = async () => {
      try {
        // Fetch API health
        const healthResponse = await fetch(getApiUrl("/health"));
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          setHealth(healthData);
        }

        // Fetch user's projects
        const projectsResponse = await apiRequest("/api/v1/projects");
        const projectsData = projectsResponse.projects || [];
        setProjects(projectsData);
      } catch (error) {
        console.error("Failed to fetch dev center data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevData();
  }, []);

  const apiEndpoints = [
    { name: "Health Check", path: "/health", method: "GET", description: "Check API availability" },
    { name: "User Profile", path: "/api/v1/users/me", method: "GET", description: "Get current user info" },
    { name: "List Projects", path: "/api/v1/projects", method: "GET", description: "Get user's projects" },
    { name: "List Gateways", path: "/api/v1/gateways", method: "GET", description: "Get IoT gateways" },
    { name: "Device Telemetry", path: "/api/v1/devices/{id}/telemetry", method: "GET", description: "Get device sensor data" },
    { name: "Submit Telemetry", path: "/api/v1/telemetry/{deviceId}", method: "POST", description: "Send sensor readings" },
    { name: "List Alerts", path: "/api/v1/alerts", method: "GET", description: "Get system alerts" },
  ];

  const documentationLinks = [
    { title: "API Documentation", url: "http://docs.paapeli.local/redoc", icon: Book },
    { title: "Interactive API", url: "http://docs.paapeli.local/swagger/index.html", icon: Code },
    { title: "Architecture Guide", url: "http://docs.paapeli.local/architecture.html", icon: Database },
    { title: "Security Guide", url: "http://docs.paapeli.local/security.html", icon: Shield },
  ];

  return (
    <PanelLayout pageTitle={t("devCenter")}>
      <div className="space-y-6">
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Endpoints</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apiEndpoints.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documentation</CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documentationLinks.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SDK Examples</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
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
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Python Gateway</h4>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
{`import requests

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
)`}
                </pre>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">cURL Command</h4>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
{`curl -X POST http://api.paapeli.local/api/v1/telemetry/device-001 \\
  -H "X-API-Key: your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{"sensor_type":"temperature","value":23.5,"unit":"celsius"}'`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  );
};

export default DevCenter;
