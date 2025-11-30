import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";

const AIoTDetectAnomalies = () => {
  const { t } = useLanguage();

  const chartData = [
    { time: '00:00', normal: 45, actual: 46, threshold: 55 },
    { time: '02:00', normal: 43, actual: 44, threshold: 55 },
    { time: '04:00', normal: 42, actual: 41, threshold: 55 },
    { time: '06:00', normal: 48, actual: 49, threshold: 55 },
    { time: '08:00', normal: 52, actual: 58, threshold: 55 },
    { time: '10:00', normal: 50, actual: 67, threshold: 55 },
    { time: '12:00', normal: 49, actual: 72, threshold: 55 },
    { time: '14:00', normal: 51, actual: 65, threshold: 55 },
    { time: '16:00', normal: 48, actual: 51, threshold: 55 },
    { time: '18:00', normal: 46, actual: 47, threshold: 55 },
  ];

  const anomalies = [
    {
      id: 1,
      deviceId: 'TEMP-442',
      deviceName: 'Temperature Sensor Zone 3',
      type: 'Temperature Spike',
      severity: 'Critical',
      detectedAt: '2025-01-15 10:23:45',
      value: '72°C',
      normalRange: '45-55°C',
      description: 'Temperature exceeded normal range by 31%. Possible equipment malfunction.',
      status: 'Active'
    },
    {
      id: 2,
      deviceId: 'FLOW-089',
      deviceName: 'Flow Meter Line A',
      type: 'Flow Irregularity',
      severity: 'High',
      detectedAt: '2025-01-15 09:12:33',
      value: '12 L/min',
      normalRange: '18-22 L/min',
      description: 'Flow rate 33% below expected. Check for blockages or leaks.',
      status: 'Under Investigation'
    },
    {
      id: 3,
      deviceId: 'PRESS-221',
      deviceName: 'Pressure Monitor B5',
      type: 'Pressure Fluctuation',
      severity: 'Medium',
      detectedAt: '2025-01-15 08:45:12',
      value: '4.2 bar',
      normalRange: '5.0-6.0 bar',
      description: 'Pressure readings show unusual variation pattern.',
      status: 'Resolved'
    },
    {
      id: 4,
      deviceId: 'HUM-334',
      deviceName: 'Humidity Sensor Storage',
      type: 'Humidity Anomaly',
      severity: 'Low',
      detectedAt: '2025-01-15 07:30:21',
      value: '68%',
      normalRange: '40-60%',
      description: 'Humidity level slightly elevated. Monitor for environmental changes.',
      status: 'Monitoring'
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
      case 'High':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20';
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
      case 'Low':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      case 'Under Investigation':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
      case 'Monitoring':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'Resolved':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <PanelLayout pageTitle="Detect Anomalies">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Anomalies</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">2 critical, 6 others</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Detected Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">+3 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Detection Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96.8%</div>
              <p className="text-xs text-muted-foreground">False positive rate: 3.2%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2m</div>
              <p className="text-xs text-muted-foreground">-1.8m improvement</p>
            </CardContent>
          </Card>
        </div>

        {/* Anomaly Detection Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Real-Time Anomaly Detection</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add to Dashboard
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceLine y={55} stroke="red" strokeDasharray="3 3" label="Threshold" />
                <Line type="monotone" dataKey="normal" stroke="hsl(var(--muted-foreground))" strokeWidth={1} name="Normal Pattern" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={2} name="Actual Values" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detected Anomalies List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Anomalies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {anomalies.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{anomaly.deviceName}</h3>
                        <Badge className={getSeverityColor(anomaly.severity)}>
                          {anomaly.severity}
                        </Badge>
                        <Badge className={getStatusColor(anomaly.status)}>
                          {anomaly.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        <span className="font-medium">Device ID:</span> {anomaly.deviceId} | 
                        <span className="font-medium ml-2">Type:</span> {anomaly.type}
                      </p>
                      <p className="text-sm mb-2">{anomaly.description}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Current Value:</span>
                          <p className="font-medium text-red-600">{anomaly.value}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Normal Range:</span>
                          <p className="font-medium">{anomaly.normalRange}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Detected At:</span>
                          <p className="font-medium">{anomaly.detectedAt}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Investigate</Button>
                    <Button size="sm" variant="outline">Create Alert</Button>
                    <Button size="sm" variant="ghost">Mark as False Positive</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  );
};

export default AIoTDetectAnomalies;
