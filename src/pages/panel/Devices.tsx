import { useState, useEffect } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, LayoutGrid, Smartphone, Copy, CheckCheck, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Device {
  id?: string;
  _id?: string;
  name: string;
  deviceId?: string;
  device_id?: string;
  deviceID?: string;
  protocol: string;
  lastActivity?: string;
  last_activity?: string;
  lastSeen?: string;
  createdAt?: string;
  created_at?: string;
  created?: string;
  updatedAt?: string;
  updated_at?: string;
}

interface DeviceCredentials {
  deviceId: string;
  apiKey: string;
  name: string;
  protocol: string;
  useSsl: boolean;
}

const Devices = () => {
  const { t } = useLanguage();
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [credentialsDialogOpen, setCredentialsDialogOpen] = useState(false);
  const [newDeviceCredentials, setNewDeviceCredentials] = useState<DeviceCredentials | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [wizardStep, setWizardStep] = useState<'template' | 'details'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<'blank' | null>(null);
  
  // Form state
  const [deviceName, setDeviceName] = useState("");
  const [protocol, setProtocol] = useState("MQTT");
  const [label, setLabel] = useState("");
  const [useSsl, setUseSsl] = useState(false);

  useEffect(() => {
    if (session) {
      fetchDevices();
    }
  }, [session]);

  const fetchDevices = async () => {
    try {
      const accessToken = session?.getAccessToken().getJwtToken();
      if (!accessToken) return;

      const response = await fetch("https://api.paapeli.com/api/v1/devices/me", {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response for devices/me:", data); // Debug log
        // Sort by creation date, newest first
        const sortedData = data.sort((a: Device, b: Device) => {
          const dateA = new Date(a.created_at || a.createdAt || a.created || 0).getTime();
          const dateB = new Date(b.created_at || b.createdAt || b.created || 0).getTime();
          return dateB - dateA;
        });
        setDevices(sortedData);
      }
    } catch (error) {
      console.error("Failed to fetch devices:", error);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast({
        title: t("error"),
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleAddDevice = async () => {
    if (!deviceName.trim()) {
      toast({
        title: t("error"),
        description: t("deviceNameRequired"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const accessToken = session?.getAccessToken().getJwtToken();
      
      if (!accessToken) {
        toast({
          title: t("error"),
          description: t("notAuthenticated"),
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("https://api.paapeli.com/api/v1/devices/register", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: deviceName,
          protocol: protocol,
          label: label || undefined,
          useSsl: useSsl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || t("failedToAddDevice"));
      }

      const newDevice = await response.json();
      
      console.log("API Response:", newDevice); // Debug log
      
      // Extract device ID and API key from various possible field names
      const deviceId = newDevice.deviceId || newDevice.device_id || newDevice.id || "";
      const apiKey = newDevice.apiKey || newDevice.api_key || newDevice.key || "";
      
      // Add the new device to the list immediately
      const newDeviceForList: Device = {
        id: newDevice.id || deviceId,
        name: deviceName,
        deviceId: deviceId,
        protocol: protocol,
        lastActivity: "-",
        createdAt: new Date().toLocaleDateString(),
      };
      setDevices(prev => [newDeviceForList, ...prev]);
      
      // Show credentials dialog with device ID and API key
      setNewDeviceCredentials({
        deviceId: deviceId,
        apiKey: apiKey,
        name: deviceName,
        protocol: protocol,
        useSsl: useSsl,
      });
      setCredentialsDialogOpen(true);

      // Reset form and close
      setDeviceName("");
      setProtocol("MQTT");
      setLabel("");
      setUseSsl(false);
      setAddPanelOpen(false);
      
      // Refresh devices list in background
      fetchDevices();
    } catch (error) {
      console.error("Device registration error:", error);
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : t("failedToAddDevice"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDevices = devices.filter(device => {
    const deviceId = device.deviceId || device.device_id || device.deviceID || device.id || device._id || '';
    return device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deviceId.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Pagination
  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDevices = filteredDevices.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const resetAddDeviceForm = () => {
    setDeviceName("");
    setProtocol("MQTT");
    setLabel("");
    setUseSsl(false);
    setWizardStep('template');
    setSelectedTemplate(null);
  };

  return (
    <PanelLayout pageTitle={t("devices")} onAddClick={() => { setAddPanelOpen(true); resetAddDeviceForm(); }}>
      <div className="space-y-6">
        {/* Main Card with Stats, Search and Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <CardTitle className="text-2xl font-bold">{devices.length} {t("devices")}</CardTitle>
            <Smartphone className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          
          <CardContent className="pt-6">
            {/* Search and Filter Bar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("search")}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>

            {/* Devices Table */}
            {devices.length === 0 ? (
              <div className="space-y-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <input type="checkbox" className="rounded border-input" />
                      </TableHead>
                      <TableHead>{t("name")}</TableHead>
                      <TableHead>{t("deviceId")}</TableHead>
                      <TableHead>{t("protocol")}</TableHead>
                      <TableHead>{t("lastActivity")}</TableHead>
                      <TableHead>{t("createdAt")} ↓</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={7} className="h-32">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <Smartphone className="h-12 w-12 text-muted-foreground/50" />
                          <Button 
                            onClick={() => { setAddPanelOpen(true); resetAddDeviceForm(); }}
                            className="bg-[#00BCD4] hover:bg-[#00ACC1]"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {t("addYourFirstDevice")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ) : filteredDevices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t("noDevicesFound")}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <input type="checkbox" className="rounded border-input" />
                    </TableHead>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("deviceId")}</TableHead>
                    <TableHead>{t("protocol")}</TableHead>
                    <TableHead>{t("lastActivity")}</TableHead>
                    <TableHead>{t("createdAt")} ↓</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {paginatedDevices.map((device) => {
                    const deviceId = device.deviceId || device.device_id || device.deviceID || device.id || device._id || '';
                    const createdAt = device.created_at || device.createdAt || device.created;
                    const lastActivity = device.last_activity || device.lastActivity || device.lastSeen;
                    const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString() : '-';
                    const formattedActivity = lastActivity ? new Date(lastActivity).toLocaleString() : '-';
                    
                    return (
                      <TableRow 
                        key={device.id || device._id || deviceId}
                        className="cursor-pointer hover:bg-accent/50"
                        onClick={() => navigate(`/panel/devices/${deviceId}`)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" className="rounded border-input" />
                        </TableCell>
                        <TableCell className="font-medium">{device.name}</TableCell>
                        <TableCell className="font-mono text-sm">{deviceId || '-'}</TableCell>
                        <TableCell>{device.protocol}</TableCell>
                        <TableCell>{formattedActivity}</TableCell>
                        <TableCell>{formattedDate}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">⋮</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
            
            {/* Pagination */}
            {filteredDevices.length > 0 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t("devicesPerPage")}</span>
                  <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                    <SelectTrigger className="w-[70px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="min-w-[70px] z-[100]" align="start">
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                  {startIndex + 1} - {Math.min(endIndex, filteredDevices.length)} {t("of")} {filteredDevices.length}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    ‹
                  </Button>
                  <span className="flex items-center px-3 text-sm">
                    {currentPage} / {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    ›
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Device Credentials Dialog */}
      <Dialog open={credentialsDialogOpen} onOpenChange={setCredentialsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-lg">{t("deviceCreatedSuccessfully")}</DialogTitle>
            <DialogDescription className="text-sm pt-1">
              {t("saveCredentialsWarning")}
            </DialogDescription>
          </DialogHeader>
          
          {newDeviceCredentials && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">{t("deviceName")}</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={newDeviceCredentials.name} 
                    readOnly 
                    className="font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">{t("deviceId")}</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={newDeviceCredentials.deviceId} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => copyToClipboard(newDeviceCredentials.deviceId, 'deviceId')}
                  >
                    {copiedField === 'deviceId' ? (
                      <CheckCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">{t("apiKey")}</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={newDeviceCredentials.apiKey} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => copyToClipboard(newDeviceCredentials.apiKey, 'apiKey')}
                  >
                    {copiedField === 'apiKey' ? (
                      <CheckCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* MQTT Connection Code */}
              {newDeviceCredentials.protocol === "MQTT" && (
                <div className="space-y-2 mt-4">
                  <Label className="text-sm font-semibold">{t("mqttConnectionCode")}</Label>
                  <div className="bg-muted rounded-lg p-4 font-mono text-xs space-y-1 overflow-x-auto">
                    <div>mqtt_server = "mqtt.paapeli.com";</div>
                    <div>mqtt_port = {newDeviceCredentials.useSsl ? "8883" : "1883"};</div>
                    <div>mqtt_client_id = "Your Favoriot name";</div>
                    <div>mqtt_user = "";</div>
                    <div>mqtt_pass = "{newDeviceCredentials.apiKey}"</div>
                    <div>device_id = "{newDeviceCredentials.deviceId}";</div>
                    <div className="pt-2 border-t border-border mt-2">
                      Topic Address: api.paapeli.com/api/v1/telemetry/{newDeviceCredentials.deviceId}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 mt-4">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  ⚠️ {t("apiKeyWarning")}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-2">
            <Button 
              onClick={() => {
                setCredentialsDialogOpen(false);
                setNewDeviceCredentials(null);
              }}
              className="bg-[#00BCD4] hover:bg-[#00ACC1]"
            >
              {t("iHaveSavedTheCredentials")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Device Sheet */}
      <Sheet open={addPanelOpen} onOpenChange={(open) => { setAddPanelOpen(open); if (!open) resetAddDeviceForm(); }}>
        <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto">
          <SheetHeader className="bg-[#00BCD4] text-white -mx-6 -mt-6 px-6 py-4 mb-6">
            <SheetTitle className="text-white text-xl">{t("createNewDevice")}</SheetTitle>
          </SheetHeader>
          
          {wizardStep === 'template' ? (
            <div className="space-y-6">
              {/* Template Selection */}
              <div>
                <h3 className="text-sm font-semibold mb-3">{t("selectDeviceTemplate")}</h3>
                
                {/* Blank Device Card */}
                <Card 
                  className={`border-2 cursor-pointer transition-all ${selectedTemplate === 'blank' ? 'border-[#00BCD4] bg-[#00BCD4]/5' : 'border-border hover:border-[#00BCD4]/50'}`}
                  onClick={() => setSelectedTemplate('blank')}
                >
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 bg-[#00BCD4] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Smartphone className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-[#00BCD4] mb-1">{t("blankDevice")}</h4>
                        <p className="text-sm text-muted-foreground">{t("blankDeviceDesc")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Example Devices Section */}
              <div>
                <h3 className="text-sm font-semibold mb-3">{t("exampleDevices")}</h3>
                <div className="space-y-3">
                  <Card className="border-2 border-border opacity-50 cursor-not-allowed">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex gap-3 items-center">
                        <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <Smartphone className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">ESP32 Template</p>
                          <p className="text-xs text-muted-foreground">{t("comingSoon")}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-border opacity-50 cursor-not-allowed">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex gap-3 items-center">
                        <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <Smartphone className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Arduino Template</p>
                          <p className="text-xs text-muted-foreground">{t("comingSoon")}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => { setAddPanelOpen(false); resetAddDeviceForm(); }}
                >
                  {t("cancel")}
                </Button>
                <Button 
                  className="flex-1 bg-[#00BCD4] hover:bg-[#00ACC1]"
                  disabled={!selectedTemplate}
                  onClick={() => setWizardStep('details')}
                >
                  {t("next")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Device Details Form */}
              <div className="space-y-4">
                <div>
                  <Label>{t("name")}:</Label>
                  <Input 
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder={t("enterDeviceName")}
                    autoFocus
                  />
                </div>
                <div>
                  <Label>{t("protocol")}:</Label>
                  <Select value={protocol} onValueChange={setProtocol}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MQTT">MQTT</SelectItem>
                      <SelectItem value="HTTP">HTTP</SelectItem>
                      <SelectItem value="CoAP">CoAP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t("label")}:</Label>
                  <Input 
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder={t("enterLabel")}
                  />
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox 
                    id="ssl"
                    checked={useSsl}
                    onCheckedChange={(checked) => setUseSsl(checked as boolean)}
                  />
                  <Label htmlFor="ssl" className="cursor-pointer">
                    {t("encryptConnectionWithSSL")}
                  </Label>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setWizardStep('template')}
                >
                  {t("back")}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => { setAddPanelOpen(false); resetAddDeviceForm(); }}
                >
                  {t("cancel")}
                </Button>
                <Button 
                  className="flex-1 bg-[#00BCD4] hover:bg-[#00ACC1]" 
                  onClick={handleAddDevice}
                  disabled={isLoading}
                >
                  {isLoading ? t("adding") : t("add")}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </PanelLayout>
  );
};

export default Devices;
