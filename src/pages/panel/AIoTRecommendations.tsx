import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, CheckCircle2, Clock, DollarSign } from "lucide-react";

const AIoTRecommendations = () => {
  const { t } = useLanguage();

  const recommendations = [
    {
      id: 1,
      title: 'Optimize Temperature Sensor Polling Interval',
      description: 'Reduce polling frequency during off-peak hours (00:00-06:00) to save 15% energy consumption without affecting data quality.',
      priority: 'High',
      impact: 'Energy Saving',
      estimatedSavings: '$850/month',
      implementationTime: '2 hours',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Schedule Preventive Maintenance',
      description: 'Device DEV-A45 shows early signs of degradation. Schedule maintenance within 10 days to avoid unexpected failure.',
      priority: 'Critical',
      impact: 'Uptime Improvement',
      estimatedSavings: '$3,200 (avoided downtime)',
      implementationTime: '4 hours',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Upgrade Firmware on Legacy Devices',
      description: '23 devices running firmware v2.1 can benefit from performance improvements in v2.4. Expected 12% efficiency gain.',
      priority: 'Medium',
      impact: 'Performance',
      estimatedSavings: '$1,100/month',
      implementationTime: '6 hours',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Adjust HVAC Schedule',
      description: 'Building occupancy analysis suggests shifting cooling start time by 30 minutes can reduce energy costs.',
      priority: 'Medium',
      impact: 'Energy Saving',
      estimatedSavings: '$420/month',
      implementationTime: '1 hour',
      status: 'pending'
    },
    {
      id: 5,
      title: 'Replace Aging Pressure Sensors',
      description: '5 pressure sensors (installed 2019) are approaching end-of-life. Proactive replacement recommended.',
      priority: 'Low',
      impact: 'Reliability',
      estimatedSavings: '$2,400 (avoided emergency costs)',
      implementationTime: '8 hours',
      status: 'pending'
    },
  ];

  const stats = [
    { label: 'Total Recommendations', value: '18', icon: Lightbulb },
    { label: 'Implemented This Month', value: '12', icon: CheckCircle2 },
    { label: 'Pending Actions', value: '6', icon: Clock },
    { label: 'Estimated Savings', value: '$8.2K', icon: DollarSign },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
      case 'High':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20';
      case 'Medium':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      case 'Low':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <PanelLayout pageTitle="Intelligent Recommendations">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendations List */}
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-6 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{rec.title}</h3>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {rec.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Impact:</span>
                          <span className="font-medium">{rec.impact}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-600">{rec.estimatedSavings}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{rec.implementationTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Implement Now</Button>
                    <Button size="sm" variant="outline">Schedule</Button>
                    <Button size="sm" variant="ghost">Dismiss</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Implementation History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Implementations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Adjusted gateway timeout settings</p>
                  <p className="text-sm text-muted-foreground">Reduced connection errors by 35%</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-muted-foreground">2 days ago</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Updated sensor calibration schedule</p>
                  <p className="text-sm text-muted-foreground">Improved accuracy by 8%</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-muted-foreground">5 days ago</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Optimized data retention policy</p>
                  <p className="text-sm text-muted-foreground">Saved $1.2K in storage costs</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-muted-foreground">1 week ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  );
};

export default AIoTRecommendations;
