import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeviceDetails {
  id: string;
  name: string;
  deviceId: string;
  protocol: string;
  label?: string;
  useSsl: boolean;
  lastActivity?: string;
  createdAt: string;
}

const DeviceDetails = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const { t } = useLanguage();
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [device, setDevice] = useState<DeviceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session && deviceId) {
      fetchDeviceDetails();
    }
  }, [session, deviceId]);

  const fetchDeviceDetails = async () => {
    try {
      const accessToken = session?.getAccessToken().getJwtToken();
      if (!accessToken) return;

      const response = await fetch(`https://api.paapeli.com/api/v1/devices/${deviceId}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDevice(data);
      } else {
        toast({
          title: t("error"),
          description: "Failed to fetch device details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch device details:", error);
      toast({
        title: t("error"),
        description: "Failed to fetch device details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <PanelLayout pageTitle={t("deviceDetails")}>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{t("loading")}...</p>
        </div>
      </PanelLayout>
    );
  }

  if (!device) {
    return (
      <PanelLayout pageTitle={t("deviceDetails")}>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Smartphone className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">{t("deviceNotFound")}</p>
          <Button onClick={() => navigate("/panel/devices")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToDevices")}
          </Button>
        </div>
      </PanelLayout>
    );
  }

  return (
    <PanelLayout pageTitle={t("deviceDetails")}>
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/panel/devices")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("backToDevices")}
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              {device.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t("deviceId")}</p>
                <p className="font-mono text-sm font-medium">{device.deviceId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("protocol")}</p>
                <p className="font-medium">{device.protocol}</p>
              </div>
              {device.label && (
                <div>
                  <p className="text-sm text-muted-foreground">{t("label")}</p>
                  <p className="font-medium">{device.label}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">SSL</p>
                <p className="font-medium">{device.useSsl ? t("enabled") : t("disabled")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("lastActivity")}</p>
                <p className="font-medium">{device.lastActivity || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("createdAt")}</p>
                <p className="font-medium">{device.createdAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  );
};

export default DeviceDetails;
