import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle, X, Copy, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

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

const DeviceDetails = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const { t, isRTL } = useLanguage();
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [device, setDevice] = useState<DeviceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">{t("loading")}...</p>
        </div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <p className="text-muted-foreground">{t("deviceNotFound")}</p>
          <Button onClick={() => navigate("/panel/devices")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToDevices")}
          </Button>
        </div>
      </div>
    );
  }

  const displayDeviceId = device.deviceId || device.device_id || device.deviceID || device.id || device._id || '';
  const displayProfile = device.deviceProfile || device.device_profile || device.protocol || '';
  const displayApiKey = device.apiKey || device.api_key || '';
  const displayIsGateway = device.isGateway || device.is_gateway || false;

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-[#00897B] text-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/panel/devices")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">{device.name}</h1>
              <p className="text-sm text-white/80">{t("deviceDetails")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/panel/devices")}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-transparent border-b border-white/20 rounded-none h-auto p-0 justify-start gap-0">
            <TabsTrigger 
              value="details" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white text-white/70 px-6 py-3"
            >
              {t("details")}
            </TabsTrigger>
            <TabsTrigger 
              value="attributes" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white text-white/70 px-6 py-3"
            >
              {t("attributes")}
            </TabsTrigger>
            <TabsTrigger 
              value="telemetry" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white text-white/70 px-6 py-3"
            >
              {t("latestTelemetry")}
            </TabsTrigger>
            <TabsTrigger 
              value="calculated" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white text-white/70 px-6 py-3"
            >
              {t("calculatedFields")}
            </TabsTrigger>
            <TabsTrigger 
              value="alarms" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white text-white/70 px-6 py-3"
            >
              {t("alarms")}
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white text-white/70 px-6 py-3"
            >
              {t("events")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="p-6">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="details" className="mt-0">
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button className="bg-[#00897B] hover:bg-[#00695C] text-white">
                  {t("openDetailsPage")}
                </Button>
                <Button className="bg-[#00897B] hover:bg-[#00695C] text-white">
                  {t("manageCredentials")}
                </Button>
                <Button className="bg-[#00897B] hover:bg-[#00695C] text-white">
                  {t("manageOwnerAndGroups")}
                </Button>
                <Button className="bg-[#00897B] hover:bg-[#00695C] text-white">
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
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <Label className="text-muted-foreground">{t("name")}*</Label>
                    <Input value={device.name} readOnly className="mt-2" />
                  </div>

                  <div>
                    <Label className="text-muted-foreground">{t("deviceProfile")}*</Label>
                    <p className="mt-2 text-[#00897B] font-medium">{displayProfile}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">{t("label")}</Label>
                    <Input value={device.label || ''} readOnly className="mt-2" />
                  </div>

                  <div>
                    <Label className="text-muted-foreground">{t("assignedFirmware")}</Label>
                    <Input value={device.assignedFirmware || device.assigned_firmware || ''} readOnly className="mt-2" />
                  </div>

                  <div>
                    <Label className="text-muted-foreground">{t("assignedSoftware")}</Label>
                    <Input value={device.assignedSoftware || device.assigned_software || ''} readOnly className="mt-2" />
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch checked={displayIsGateway} disabled />
                    <Label>{t("isGateway")}</Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attributes" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">{t("noAttributesYet")}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="telemetry" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">{t("noTelemetryYet")}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculated" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">{t("noCalculatedFieldsYet")}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alarms" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">{t("noAlarmsYet")}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">{t("noEventsYet")}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeviceDetails;
