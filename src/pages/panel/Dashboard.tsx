import { useState, useEffect } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { subDays, format } from "date-fns";

interface Gateway {
  id: string;
  name: string;
  status: string;
  [key: string]: unknown;
}

interface Device {
  id: string;
  name: string;
  device_id?: string;
  [key: string]: unknown;
}

interface MetricData {
  timestamp: string;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  voltage?: number;
  current?: number;
  [key: string]: unknown;
}

interface DashboardStats {
  totalDevices: number;
  activeDevices: number;
  alerts: number;
}

const Dashboard = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalDevices: 0,
    activeDevices: 0,
    alerts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [selectedSensor, setSelectedSensor] = useState<string>("temperature");
  const [timeRange, setTimeRange] = useState<string>("7d");
  const [metricsData, setMetricsData] = useState<MetricData[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(false);

  const sensorOptions = [
    { value: "temperature", label: "Temperature (°C)" },
    { value: "humidity", label: "Humidity (%)" },
    { value: "pressure", label: "Pressure (hPa)" },
    { value: "voltage", label: "Voltage (V)" },
    { value: "current", label: "Current (A)" },
  ];

  const timeRangeOptions = [
    { value: "1h", label: "Last Hour" },
    { value: "24h", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        // Fetch devices
        const devicesResponse = await apiRequest("/api/v1/gateways");
        const devicesData = devicesResponse.data || [];

        // Count total and active devices
        const totalDevices = devicesData.length;
        const activeDevices = devicesData.filter((item: Gateway) =>
          item.status === "active"
        ).length;

        setDevices(devicesData);
        if (devicesData.length > 0 && !selectedDevice) {
          setSelectedDevice(devicesData[0].id);
        }

        // Fetch alerts count
        let alertsCount = 0;
        try {
          const alertsResponse = await apiRequest("/api/v1/alerts/count");
          alertsCount = alertsResponse.total || 0;
        } catch (alertsError) {
          console.warn("Failed to fetch alerts count:", alertsError);
          // Keep alerts as 0 if API fails
        }

        setStats({
          totalDevices,
          activeDevices,
          alerts: alertsCount,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, selectedDevice]);

  useEffect(() => {
    if (!selectedDevice || !isAuthenticated) return;

    const fetchMetrics = async () => {
      setMetricsLoading(true);
      try {
        const endTime = new Date();
        let startTime: Date;

        switch (timeRange) {
          case "1h":
            startTime = subDays(endTime, 0);
            startTime.setHours(endTime.getHours() - 1);
            break;
          case "24h":
            startTime = subDays(endTime, 1);
            break;
          case "7d":
            startTime = subDays(endTime, 7);
            break;
          case "30d":
            startTime = subDays(endTime, 30);
            break;
          default:
            startTime = subDays(endTime, 7);
        }

        const response = await apiRequest(
          `/api/v1/metrics/${selectedDevice}?start_time=${startTime.toISOString()}&end_time=${endTime.toISOString()}`
        );

        const metrics = response.data || [];
        // Transform data for chart
        const chartData = metrics
          .filter((metric: any) => metric[selectedSensor] !== undefined)
          .map((metric: any) => ({
            timestamp: format(new Date(metric.timestamp), "MMM dd HH:mm"),
            value: metric[selectedSensor],
          }))
          .sort((a: MetricData, b: MetricData) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

        setMetricsData(chartData);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
        setMetricsData([]);
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchMetrics();
  }, [selectedDevice, selectedSensor, timeRange, isAuthenticated]);

  return (
    <PanelLayout pageTitle={t("dashboard")} onAddClick={() => setAddPanelOpen(true)}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">{t("totalDevices")}</h3>
          <p className="text-3xl font-bold">{loading ? "..." : stats.totalDevices}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">{t("activeDevices")}</h3>
          <p className="text-3xl font-bold">{loading ? "..." : stats.activeDevices}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">{t("alerts")}</h3>
          <p className="text-3xl font-bold">{loading ? "..." : stats.alerts}</p>
        </Card>
      </div>

      {/* Sensor Dashboard */}
      <Card className="p-6">
        <div className="flex flex-col space-y-4 mb-6">
          <h3 className="text-lg font-semibold">Sensor Dashboard</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="device-select">Select Device</Label>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger id="device-select">
                  <SelectValue placeholder="Choose a device" />
                </SelectTrigger>
                <SelectContent>
                  {devices.map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sensor-select">Select Sensor</Label>
              <Select value={selectedSensor} onValueChange={setSelectedSensor}>
                <SelectTrigger id="sensor-select">
                  <SelectValue placeholder="Choose a sensor" />
                </SelectTrigger>
                <SelectContent>
                  {sensorOptions.map((sensor) => (
                    <SelectItem key={sensor.value} value={sensor.value}>
                      {sensor.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-range-select">Time Range</Label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger id="time-range-select">
                  <SelectValue placeholder="Choose time range" />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="h-80">
          {metricsLoading ? (
            <div className="flex items-center justify-center h-full">
              <p>Loading chart data...</p>
            </div>
          ) : metricsData.length > 0 ? (
            <ChartContainer
              config={{
                value: {
                  label: selectedSensor.charAt(0).toUpperCase() + selectedSensor.slice(1),
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-full"
            >
              <LineChart data={metricsData}>
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No data available for the selected parameters</p>
            </div>
          )}
        </div>
      </Card>

      <Sheet open={addPanelOpen} onOpenChange={setAddPanelOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t("addNew")}</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </PanelLayout>
  );
};

export default Dashboard;
