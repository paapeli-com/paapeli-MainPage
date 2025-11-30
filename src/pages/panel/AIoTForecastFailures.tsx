import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingDown, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AIoTForecastFailures = () => {
  const { t } = useLanguage();

  const data = [
    { name: 'Jan', predicted: 5, actual: 4 },
    { name: 'Feb', predicted: 8, actual: 7 },
    { name: 'Mar', predicted: 12, actual: 11 },
    { name: 'Apr', predicted: 15, actual: 14 },
    { name: 'May', predicted: 9, actual: 10 },
    { name: 'Jun', predicted: 6, actual: 5 },
  ];

  const devices = [
    { id: 'DEV-001', name: 'Temperature Sensor A12', risk: 'High', probability: '85%', daysToFailure: 7 },
    { id: 'DEV-002', name: 'Pressure Monitor B5', risk: 'Medium', probability: '62%', daysToFailure: 15 },
    { id: 'DEV-003', name: 'Flow Sensor C8', risk: 'Low', probability: '28%', daysToFailure: 45 },
    { id: 'DEV-004', name: 'Humidity Sensor D3', risk: 'High', probability: '78%', daysToFailure: 10 },
  ];

  return (
    <PanelLayout pageTitle="Forecast Equipment Failures">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk Devices</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+3 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Predicted Failures</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">Next 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Prediction Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">Last 3 months</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45K</div>
              <p className="text-xs text-muted-foreground">This quarter</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Failure Prediction Trend</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add to Dashboard
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="actual" stroke="hsl(var(--secondary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* High Risk Devices Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>High Risk Devices</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add to Dashboard
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Device ID</th>
                    <th className="text-left p-3 font-medium">Name</th>
                    <th className="text-left p-3 font-medium">Risk Level</th>
                    <th className="text-left p-3 font-medium">Failure Probability</th>
                    <th className="text-left p-3 font-medium">Est. Days to Failure</th>
                    <th className="text-right p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => (
                    <tr key={device.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-mono text-sm">{device.id}</td>
                      <td className="p-3">{device.name}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            device.risk === 'High'
                              ? 'bg-destructive/10 text-destructive'
                              : device.risk === 'Medium'
                              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          }`}
                        >
                          {device.risk}
                        </span>
                      </td>
                      <td className="p-3">{device.probability}</td>
                      <td className="p-3">{device.daysToFailure} days</td>
                      <td className="p-3 text-right">
                        <Button variant="outline" size="sm">
                          Schedule Maintenance
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  );
};

export default AIoTForecastFailures;
