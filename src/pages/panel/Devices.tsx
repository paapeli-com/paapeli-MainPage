import { useState } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, LayoutGrid, Smartphone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Device {
  id: string;
  name: string;
  deviceId: string;
  lastActivity: string;
  createdAt: string;
}

const Devices = () => {
  const { t } = useLanguage();
  const { session } = useAuth();
  const { toast } = useToast();
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [deviceName, setDeviceName] = useState("");
  const [protocol, setProtocol] = useState("MQTT");
  const [label, setLabel] = useState("");

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
        }),
      });

      if (!response.ok) {
        throw new Error(t("failedToAddDevice"));
      }

      const newDevice = await response.json();
      
      toast({
        title: t("success"),
        description: t("deviceAddedSuccessfully"),
      });

      // Reset form and close
      setDeviceName("");
      setProtocol("MQTT");
      setLabel("");
      setAddPanelOpen(false);
      
      // Refresh devices list (you would implement this with your actual API)
      // fetchDevices();
    } catch (error) {
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : t("failedToAddDevice"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PanelLayout pageTitle={t("devices")} onAddClick={() => setAddPanelOpen(true)}>
      <div className="space-y-6">
        {/* Stats Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">{devices.length} {t("devices")}</CardTitle>
            <Smartphone className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
        </Card>

        {/* Search and Filter Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
          </CardContent>
        </Card>

        {/* Devices Table */}
        <Card>
          <CardContent className="pt-6">
            {devices.length === 0 ? (
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
                    <TableHead>{t("apiLabel")}</TableHead>
                    <TableHead>{t("lastActivity")}</TableHead>
                    <TableHead>{t("createdAt")} ↓</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>
                        <input type="checkbox" className="rounded border-input" />
                      </TableCell>
                      <TableCell className="font-medium">{device.name}</TableCell>
                      <TableCell>{device.deviceId}</TableCell>
                      <TableCell>{device.lastActivity}</TableCell>
                      <TableCell>{device.createdAt}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">⋮</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t("devicesPerPage")}</span>
                <Select defaultValue="10">
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground">
                1 - 0 {t("of")} 0
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>‹</Button>
                <Button variant="outline" size="sm" disabled>›</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Device Sheet */}
      <Sheet open={addPanelOpen} onOpenChange={setAddPanelOpen}>
        <SheetContent className="w-full sm:max-w-[540px]">
          <SheetHeader className="bg-[#00BCD4] text-white -mx-6 -mt-6 px-6 py-4 mb-6">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-white text-xl">{t("createNewDevice")}</SheetTitle>
              <button onClick={() => setAddPanelOpen(false)} className="text-white">✕</button>
            </div>
          </SheetHeader>
          
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t("search")} className="pl-9" />
              <Button variant="ghost" size="icon" className="absolute right-0 top-0">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Blank Device Card */}
            <Card className="border-2 border-[#00BCD4]">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="h-16 w-16 bg-[#00BCD4] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Smartphone className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#00BCD4] mb-1">{t("blankDevice")}</h3>
                    <p className="text-sm text-muted-foreground">{t("blankDeviceDesc")}</p>
                  </div>
                </div>
                
                <div className="space-y-4 mt-6">
                  <div>
                    <Label>{t("name")}:</Label>
                    <Input 
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                      placeholder={t("enterDeviceName")}
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
                  <Button 
                    className="w-full bg-[#00BCD4] hover:bg-[#00ACC1]" 
                    onClick={handleAddDevice}
                    disabled={isLoading}
                  >
                    {isLoading ? t("adding") : t("add")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
    </PanelLayout>
  );
};

export default Devices;
