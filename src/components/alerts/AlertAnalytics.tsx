import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { mockAlertAnalytics } from "@/data/mockAlertData";
import { Clock, CheckCircle, TrendingUp, AlertTriangle } from "lucide-react";

const SEVERITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
};

export const AlertAnalytics = () => {
  const { t } = useLanguage();
  const data = mockAlertAnalytics;

  const pieData = data.alertsBySeverity.map(d => ({
    name: t(`alert${d.severity.charAt(0).toUpperCase() + d.severity.slice(1)}` as any),
    value: d.count,
    color: SEVERITY_COLORS[d.severity],
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs">{t("alertTotalAlerts")}</span>
            </div>
            <p className="text-2xl font-bold">{data.alertsBySeverity.reduce((sum, d) => sum + d.count, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs">{t("alertMTTA")}</span>
            </div>
            <p className="text-2xl font-bold">{data.mtta} <span className="text-sm font-normal text-muted-foreground">min</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs">{t("alertMTTR")}</span>
            </div>
            <p className="text-2xl font-bold">{data.mttr} <span className="text-sm font-normal text-muted-foreground">min</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">{t("alertCriticalCount")}</span>
            </div>
            <p className="text-2xl font-bold text-destructive">{data.alertsBySeverity.find(d => d.severity === 'critical')?.count}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Alerts Over Time */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t("alertsOverTime")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.alertsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="critical" stroke={SEVERITY_COLORS.critical} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="high" stroke={SEVERITY_COLORS.high} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="medium" stroke={SEVERITY_COLORS.medium} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="low" stroke={SEVERITY_COLORS.low} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Severity Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t("alertBySeverity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* By Location */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t("alertByLocation")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.alertsByLocation} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="location" tick={{ fontSize: 10 }} width={140} />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="hsl(28, 100%, 50%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Devices & Conditions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t("alertTopDevices")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.topDevices.map((device, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <span className="text-sm">{device.device}</span>
                  <Badge variant="outline">{device.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
