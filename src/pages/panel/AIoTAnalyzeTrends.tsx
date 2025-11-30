import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Plus } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AIoTAnalyzeTrends = () => {
  const { t } = useLanguage();

  const performanceData = [
    { month: 'Jan', efficiency: 85, uptime: 92 },
    { month: 'Feb', efficiency: 87, uptime: 94 },
    { month: 'Mar', efficiency: 89, uptime: 91 },
    { month: 'Apr', efficiency: 91, uptime: 95 },
    { month: 'May', efficiency: 88, uptime: 93 },
    { month: 'Jun', efficiency: 92, uptime: 96 },
  ];

  const usageData = [
    { hour: '00:00', usage: 45 },
    { hour: '04:00', usage: 32 },
    { hour: '08:00', usage: 78 },
    { hour: '12:00', usage: 95 },
    { hour: '16:00', usage: 88 },
    { hour: '20:00', usage: 65 },
  ];

  const insights = [
    {
      title: 'Efficiency Improvement',
      description: 'Device efficiency increased by 8.2% over the last 6 months',
      trend: 'up',
      value: '+8.2%'
    },
    {
      title: 'Peak Usage Pattern',
      description: 'Highest activity observed between 10:00-14:00',
      trend: 'neutral',
      value: '12:00 PM'
    },
    {
      title: 'Energy Consumption',
      description: 'Energy usage decreased by 5.1% compared to last quarter',
      trend: 'down',
      value: '-5.1%'
    },
    {
      title: 'Uptime Optimization',
      description: 'System uptime improved to 94.5% average',
      trend: 'up',
      value: '+2.3%'
    },
  ];

  return (
    <PanelLayout pageTitle="Analyze Trends">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.5%</div>
              <p className="text-xs text-muted-foreground">+2.3% improvement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energy Usage</CardTitle>
              <TrendingDown className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-5.1%</div>
              <p className="text-xs text-muted-foreground">vs last quarter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Points Analyzed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4M</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Trends */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Performance Trends</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add to Dashboard
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="efficiency" stroke="hsl(var(--primary))" strokeWidth={2} name="Efficiency %" />
                <Line type="monotone" dataKey="uptime" stroke="hsl(var(--secondary))" strokeWidth={2} name="Uptime %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Usage Patterns */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Daily Usage Pattern</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add to Dashboard
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="usage" fill="hsl(var(--primary))" name="Usage %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle>AI-Generated Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {insights.map((insight, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{insight.title}</h4>
                    <span
                      className={`text-sm font-bold ${
                        insight.trend === 'up'
                          ? 'text-green-600'
                          : insight.trend === 'down'
                          ? 'text-green-600'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {insight.value}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  );
};

export default AIoTAnalyzeTrends;
