import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle2, Circle, AlertCircle, Clock } from "lucide-react";

const Status = () => {
  const { t, isRTL } = useLanguage();

  const services = [
    { name: "API Gateway", status: "operational", uptime: "99.99%" },
    { name: "MQTT Broker", status: "operational", uptime: "99.98%" },
    { name: "Database", status: "operational", uptime: "100%" },
    { name: "Web Dashboard", status: "operational", uptime: "99.97%" },
    { name: "Authentication", status: "operational", uptime: "99.99%" },
    { name: "OTA Service", status: "operational", uptime: "99.95%" },
    { name: "Edge Functions", status: "operational", uptime: "99.96%" },
    { name: "Analytics Engine", status: "operational", uptime: "99.94%" },
  ];

  const incidents = [
    {
      date: "2025-01-15",
      title: "Database Performance Degradation",
      status: "resolved",
      duration: "45 minutes",
      description: "Database queries experienced higher than normal latency. Issue was resolved by optimizing query performance.",
    },
    {
      date: "2025-01-10",
      title: "API Gateway Maintenance",
      status: "scheduled",
      duration: "2 hours",
      description: "Scheduled maintenance to upgrade API gateway infrastructure for improved performance.",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "outage":
        return <Circle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-500">{t('operational')}</Badge>;
      case "degraded":
        return <Badge variant="secondary">{t('degraded')}</Badge>;
      case "outage":
        return <Badge variant="destructive">{t('outage')}</Badge>;
      case "resolved":
        return <Badge variant="outline">{t('resolved')}</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-500">{t('scheduled')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                {t('systemStatus')}
              </h1>
              <div className="flex items-center justify-center gap-2 text-xl">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span className="text-green-500 font-semibold">{t('allSystemsOperational')}</span>
              </div>
            </div>

            <Card className="p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-foreground">{t('services')}</h2>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <span className="font-medium text-foreground">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {t('uptime')}: {service.uptime}
                      </span>
                      {getStatusBadge(service.status)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-foreground">{t('incidentHistory')}</h2>
              <div className="space-y-6">
                {incidents.map((incident, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-foreground">{incident.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Clock className="h-4 w-4" />
                          <span>{incident.date}</span>
                          <span>•</span>
                          <span>{incident.duration}</span>
                        </div>
                      </div>
                      {getStatusBadge(incident.status)}
                    </div>
                    <p className="text-muted-foreground">{incident.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            <div className="mt-8 text-center text-muted-foreground">
              <p>{t('statusPageUpdated')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
