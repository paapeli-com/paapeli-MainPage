import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, CheckCheck, ArrowLeft, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getApiUrl, createAuthHeaders } from "@/lib/api";

interface DeviceDetails {
  id?: string;
  _id?: string;
  name: string;
  deviceId?: string;
  device_id?: string;
  deviceID?: string;
  protocol: string;
  label?: string;
  deviceProfile?: string;
  device_profile?: string;
  useSsl?: boolean;
  use_ssl?: boolean;
  lastActivity?: string;
  last_activity?: string;
  createdAt?: string;
  created_at?: string;
  apiKey?: string;
  api_key?: string;
  assignedFirmware?: string;
  assigned_firmware?: string;
  assignedSoftware?: string;
  assigned_software?: string;
  isGateway?: boolean;
  is_gateway?: boolean;
}

interface DeviceDetailsContentProps {
  deviceId: string;
  onBack: () => void;
}

export const DeviceDetailsContent = ({ deviceId, onBack }: DeviceDetailsContentProps) => {
  const { t } = useLanguage();
  const { session } = useAuth();
  const { toast } = useToast();
  const [device, setDevice] = useState<DeviceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeviceDetails = async () => {
      try {
        const response = await fetch(getApiUrl(`/api/v1/devices/${deviceId}`), createAuthHeaders());

        if (response.ok) {
          const data = await response.json();
          console.log("Device details API response:", data);
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

    if (session && deviceId) {
      fetchDeviceDetails();
    }
  }, [session, deviceId, t, toast]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: t("success"),
        description: t("copiedToClipboard"),
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : !device ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <p className="text-muted-foreground">{t("deviceNotFound")}</p>
            <Button onClick={onBack}>
              {t("backToDevices")}
            </Button>
          </div>
        ) : (() => {
          const displayDeviceId = device.deviceId || device.device_id || device.deviceID || device.id || device._id || '';
          const displayProfile = device.deviceProfile || device.device_profile || device.protocol || '';
          const displayApiKey = device.apiKey || device.api_key || '';
          const displayIsGateway = device.isGateway || device.is_gateway || false;

          return (
            <div className="space-y-6">
            {/* Header with Back Button and Title */}
            <div className="flex items-center justify-between pb-4 border-b">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="h-10 w-10"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Smartphone className="h-6 w-6 text-muted-foreground" />
                    {t("deviceDetails")}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">{device.name}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
              <div className="flex gap-0">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
                    activeTab === "details"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t("details")}
                </button>
                <button
                  onClick={() => setActiveTab("attributes")}
                  className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
                    activeTab === "attributes"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t("attributes")}
                </button>
                <button
                  onClick={() => setActiveTab("telemetry")}
                  className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
                    activeTab === "telemetry"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t("latestTelemetry")}
                </button>
                <button
                  onClick={() => setActiveTab("calculated")}
                  className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
                    activeTab === "calculated"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t("calculatedFields")}
                </button>
                <button
                  onClick={() => setActiveTab("alarms")}
                  className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
                    activeTab === "alarms"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t("alarms")}
                </button>
                <button
                  onClick={() => setActiveTab("events")}
                  className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
                    activeTab === "events"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t("events")}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "details" && (
                <div className="space-y-6">
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button>
                      {t("openDetailsPage")}
                    </Button>
                    <Button>
                      {t("manageCredentials")}
                    </Button>
                    <Button>
                      {t("manageOwnerAndGroups")}
                    </Button>
                    <Button>
                      {t("checkConnectivity")}
                    </Button>
                  </div>
                  
                  <div>
                    <Button variant="destructive">
                      {t("deleteDevice")}
                    </Button>
                  </div>

                  {/* Copy Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(displayDeviceId, 'deviceId')}
                      className="gap-2"
                    >
                      {copiedField === 'deviceId' ? (
                        <CheckCheck className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {t("copyDeviceId")}
                    </Button>
                    {displayApiKey && (
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(displayApiKey, 'apiKey')}
                        className="gap-2"
                      >
                        {copiedField === 'apiKey' ? (
                          <CheckCheck className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {t("copyAccessToken")}
                      </Button>
                    )}
                  </div>

                  {/* Device Information */}
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6 space-y-6">
                      <div>
                        <Label className="text-muted-foreground text-sm">{t("name")}*</Label>
                        <Input value={device.name} readOnly className="mt-2" />
                      </div>

                      <div>
                        <Label className="text-muted-foreground text-sm">{t("deviceProfile")}*</Label>
                        <p className="mt-2 text-primary font-medium">{displayProfile}</p>
                      </div>

                      <div>
                        <Label className="text-muted-foreground text-sm">{t("label")}</Label>
                        <Input value={device.label || ''} readOnly className="mt-2" />
                      </div>

                      <div>
                        <Label className="text-muted-foreground text-sm">{t("assignedFirmware")}</Label>
                        <Input value={device.assignedFirmware || device.assigned_firmware || ''} readOnly className="mt-2" />
                      </div>

                      <div>
                        <Label className="text-muted-foreground text-sm">{t("assignedSoftware")}</Label>
                        <Input value={device.assignedSoftware || device.assigned_software || ''} readOnly className="mt-2" />
                      </div>

                      <div className="flex items-center gap-3">
                        <Switch checked={displayIsGateway} disabled />
                        <Label className="text-sm">{t("isGateway")}</Label>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "attributes" && (
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">{t("noAttributesYet")}</p>
                  </CardContent>
                </Card>
              )}

              {activeTab === "telemetry" && (
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">{t("noTelemetryYet")}</p>
                  </CardContent>
                </Card>
              )}

              {activeTab === "calculated" && (
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">{t("noCalculatedFieldsYet")}</p>
                  </CardContent>
                </Card>
              )}

              {activeTab === "alarms" && (
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">{t("noAlarmsYet")}</p>
                  </CardContent>
                </Card>
              )}

              {activeTab === "events" && (
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">{t("noEventsYet")}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          );
        })()}
      </CardContent>
    </Card>
  );
};
