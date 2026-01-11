import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest, getApiUrl, createAuthHeaders } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, LayoutGrid, Smartphone, Copy, CheckCheck, Plus, RefreshCw, Trash2, ArrowUpDown, X, MoreHorizontal, Edit } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { copyTextToClipboard } from "@/utils/clipboard";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  location?: string;
  status?: string;
}

interface DeviceCredentials {
  deviceId: string;
  apiKey: string;
  name: string;
  protocol: string;
  useSsl: boolean;
}

interface Project {
  id: string;
  name: string;
  description?: string;
}

interface GatewayApiItem {
  gateway: {
    id: string;
    name: string;
    config?: {
      protocol?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface ProjectApiItem {
  id: string;
  name: string;
  description?: string;
}

const Devices = () => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [credentialsDialogOpen, setCredentialsDialogOpen] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [newDeviceCredentials, setNewDeviceCredentials] = useState<DeviceCredentials | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [wizardStep, setWizardStep] = useState<'template' | 'details'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<'blank' | null>('blank');
  const [protocolFilter, setProtocolFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sortPopoverOpen, setSortPopoverOpen] = useState(false);
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc'); // desc = newest first
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [editName, setEditName] = useState("");
  const [editProtocol, setEditProtocol] = useState("");
  const [editProjectId, setEditProjectId] = useState("");

  // Device groups management in edit modal
  const [availableGroups, setAvailableGroups] = useState<any[]>([]);
  const [deviceGroups, setDeviceGroups] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");

  // Form state
  const [deviceName, setDeviceName] = useState("");
  const [protocol, setProtocol] = useState("MQTT");
  const [label, setLabel] = useState("");
  const [useSsl, setUseSsl] = useState(false);

  const fetchDevices = useCallback(async (showRefreshToast = false) => {
    if (showRefreshToast) {
      setIsRefreshing(true);
    } else {
      setIsLoadingDevices(true);
    }
    
    try {
      // Since auth is handled by APISIX, no need for tokens
      const response = await fetch(getApiUrl("/api/v1/gateways"), createAuthHeaders());

      if (response.ok) {
        const data = await response.json();
        console.log("API Response for gateways:", data); // Debug log
        // Transform gateways to device format for display
        const deviceData = (data.data || []).map((gateway: any) => {
          return {
            id: gateway.id,
            name: gateway.name,
            deviceId: gateway.id,
            protocol: gateway.config?.protocol || 'MQTT',
            lastActivity: gateway.last_heartbeat ? new Date(gateway.last_heartbeat).toLocaleString() : '-',
            createdAt: gateway.created_at,
            location: gateway.location,
            status: gateway.status,
          };
        });
        setDevices(deviceData);
        
        if (showRefreshToast) {
          toast({
            title: t("success"),
            description: t("devicesRefreshed"),
          });
        }
      } else if (response.status === 401) {
        // Redirect to auth if not authenticated
        window.location.href = getApiUrl("/api/v1/users/me");
      }
    } catch (error) {
      console.error("Failed to fetch devices:", error);
    } finally {
      setIsLoadingDevices(false);
      setIsRefreshing(false);
    }
  }, [t, toast]);

  const fetchAvailableGroups = useCallback(async () => {
    try {
      const response = await fetch(getApiUrl("/api/v1/device-groups"), createAuthHeaders());
      if (response.ok) {
        const data = await response.json();
        const groupsData = data.data || [];
        setAvailableGroups(groupsData);
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  }, []);

  const fetchDeviceGroups = useCallback(async (deviceId: string) => {
    try {
      // Get all groups and check which ones contain this device
      const response = await fetch(getApiUrl("/api/v1/device-groups"), createAuthHeaders());
      if (response.ok) {
        const data = await response.json();
        const allGroups = data.data || [];

        // For each group, check if device is a member
        const deviceGroupsPromises = allGroups.map(async (group: any) => {
          try {
            const membersResponse = await fetch(getApiUrl(`/api/v1/device-groups/${group.id}/devices`), createAuthHeaders());
            if (membersResponse.ok) {
              const membersData = await membersResponse.json();
              const members = membersData.data || [];
              const isMember = members.some((member: any) => member.device_id === deviceId);
              if (isMember) {
                return { ...group, membership: members.find((m: any) => m.device_id === deviceId) };
              }
            }
          } catch (error) {
            console.error(`Failed to check membership for group ${group.id}:`, error);
          }
          return null;
        });

        const deviceGroupsResults = await Promise.all(deviceGroupsPromises);
        const deviceGroupsFiltered = deviceGroupsResults.filter(group => group !== null);
        setDeviceGroups(deviceGroupsFiltered);
      }
    } catch (error) {
      console.error("Failed to fetch device groups:", error);
    }
  }, []);

  const handleAddDeviceToGroup = async (groupId: string) => {
    if (!editingDevice) return;

    try {
      await apiRequest(`/api/v1/device-groups/${groupId}/devices`, {
        method: "POST",
        body: JSON.stringify({ device_id: editingDevice.id }),
      });

      toast({
        title: t("success"),
        description: "Device added to group successfully",
      });

      // Refresh device groups
      fetchDeviceGroups(editingDevice.id);
    } catch (error) {
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : "Failed to add device to group",
        variant: "destructive",
      });
    }
  };

  const handleRemoveDeviceFromGroup = async (groupId: string) => {
    if (!editingDevice) return;

    try {
      await apiRequest(`/api/v1/device-groups/${groupId}/devices/${editingDevice.id}`, {
        method: "DELETE",
      });

      toast({
        title: t("success"),
        description: "Device removed from group successfully",
      });

      // Refresh device groups
      fetchDeviceGroups(editingDevice.id);
    } catch (error) {
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : "Failed to remove device from group",
        variant: "destructive",
      });
    }
  };

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch(getApiUrl("/api/v1/projects"), createAuthHeaders());
      console.log("Projects API Response Status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("Projects API Response Data:", data);
        const projectsData = (data.data || []).map((item: ProjectApiItem) => ({
          id: item.id,
          name: item.name,
          description: item.description,
        }));
        console.log("Transformed Projects Data:", projectsData);
        setProjects(projectsData);
        // Auto-select first project if available
        if (projectsData.length > 0 && !selectedProjectId) {
          setSelectedProjectId(projectsData[0].id);
        }
      } else {
        console.error("Projects API Error:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchDevices();
    fetchProjects();
  }, [fetchDevices, fetchProjects]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await copyTextToClipboard(text);
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

    if (!selectedProjectId) {
      toast({
        title: t("error"),
        description: "Please select a project",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl("/api/v1/gateways"), createAuthHeaders({
        method: "POST",
        body: JSON.stringify({
          name: deviceName,
          location: label || "Default Location",
          project_id: selectedProjectId,
          config: {
            protocol: protocol,
            use_ssl: useSsl,
          },
        }),
      }));

      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to auth
          window.location.href = getApiUrl("/api/v1/users/me");
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || t("failedToAddDevice"));
      }

      const responseData = await response.json();
      const newDevice = responseData.data; // API returns { data: {...} }

      console.log("API Response:", responseData); // Debug log

      // Extract device ID and API key from gateway response
      const deviceId = newDevice.id;
      const apiKey = newDevice.api_key_secret;

      // Add the new device to the list immediately
      const newDeviceForList: Device = {
        id: newDevice.id,
        name: deviceName,
        deviceId: deviceId,
        protocol: protocol,
        lastActivity: "-",
        createdAt: newDevice.created_at,
        location: newDevice.location,
        status: "active",
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

  const handleUpdateDevice = async () => {
    if (!editingDevice) return;

    if (!editName.trim()) {
      toast({
        title: t("error"),
        description: t("deviceNameRequired"),
        variant: "destructive",
      });
      return;
    }

    if (!editProjectId) {
      toast({
        title: t("error"),
        description: "Please select a project",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl(`/api/v1/gateways/${editingDevice.id}`), createAuthHeaders({
        method: "PUT",
        body: JSON.stringify({
          name: editName,
          location: editingDevice.location || "Default Location",
          project_id: editProjectId,
          config: {
            protocol: editProtocol,
          },
        }),
      }));

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = getApiUrl("/api/v1/users/me");
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to update device");
      }

      toast({
        title: t("success"),
        description: "Device updated successfully",
      });
      fetchDevices();
      setEditModalOpen(false);
      setEditingDevice(null);
    } catch (error) {
      console.error("Device update error:", error);
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : "Failed to update device",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDevice = () => {
    if (!editingDevice) return;
    const deviceId = editingDevice.deviceId || editingDevice.device_id || editingDevice.deviceID || editingDevice.id || editingDevice._id || '';
    setSelectedDevices([deviceId]);
    setDeleteDialogOpen(true);
    setEditModalOpen(false);
  };

  const handleDeleteDevice = async (device: any) => {
    const deviceId = device.deviceId || device.device_id || device.deviceID || device.id || device._id || '';
    setSelectedDevices([deviceId]);
    setDeleteDialogOpen(true);
  };

  const filteredDevices = devices.filter(device => {
    const deviceId = device.deviceId || device.device_id || device.deviceID || device.id || device._id || '';
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deviceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProtocol = protocolFilter === 'all' || device.protocol === protocolFilter;
    return matchesSearch && matchesProtocol;
  }).sort((a, b) => {
    // Sort by creation date based on sortDirection
    const dateA = new Date(a.created_at || a.createdAt || a.created || 0).getTime();
    const dateB = new Date(b.created_at || b.createdAt || b.created || 0).getTime();
    return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
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
    setSelectedTemplate('blank');
  };

  const handleDeviceClick = (device: Device) => {
    setEditingDevice(device);
    setEditName(device.name);
    setEditProtocol(device.protocol);
    setEditProjectId(selectedProjectId || (projects.length > 0 ? projects[0].id : ""));
    setSelectedGroupId("");

    // Fetch available groups and device groups
    fetchAvailableGroups();
    fetchDeviceGroups(device.id);

    setEditModalOpen(true);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDevices(paginatedDevices.map(d => d.deviceId || d.device_id || d.deviceID || d.id || d._id || ''));
    } else {
      setSelectedDevices([]);
    }
  };

  const handleSelectDevice = (deviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedDevices(prev => [...prev, deviceId]);
    } else {
      setSelectedDevices(prev => prev.filter(id => id !== deviceId));
    }
  };

  const handleDeleteSelected = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      const deletePromises = selectedDevices.map(deviceId =>
        fetch(getApiUrl(`/api/v1/gateways/${deviceId}`), createAuthHeaders({
          method: "DELETE",
        }))
      );

      const results = await Promise.allSettled(deletePromises);
      const successfulDeletes = results.filter(result => result.status === 'fulfilled').length;
      const failedDeletes = results.length - successfulDeletes;

      if (successfulDeletes > 0) {
        toast({
          title: t("success"),
          description: `${successfulDeletes} ${t("devices") || "devices"} ${t("deleted") || "deleted"}`,
        });
        // Refresh devices list
        fetchDevices();
      }

      if (failedDeletes > 0) {
        toast({
          title: t("error"),
          description: `Failed to delete ${failedDeletes} device(s)`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: t("error"),
        description: "Failed to delete devices",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSelectedDevices([]);
      setDeleteDialogOpen(false);
    }
  };

  // Available protocols for sorting
  const availableProtocols = ["MQTT", "HTTP", "CoAP", "WebSocket", "LoRaWAN", "BLE", "ZigBee", "OPC-UA", "LTE", "5G"];
  
  const handleResetSort = () => {
    setProtocolFilter('all');
    setCurrentPage(1);
    setSortPopoverOpen(false);
  };

  return (
    <PanelLayout
      pageTitle={t("devices")}
    >
      {isLoadingDevices ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Card with Stats, Search and Table */}
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg font-bold">{devices.length} {t("devices")}</CardTitle>
            </div>
            <Button 
              onClick={() => { setAddPanelOpen(true); resetAddDeviceForm(); }}
              className="bg-[#00BCD4] hover:bg-[#00ACC1] gap-0 px-10 h-10 text-base font-medium"
            >
              + {t("add")}
            </Button>
          </CardHeader>
          
          <CardContent className="pt-6">
            {/* Search and Filter Bar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                  <Input
                    placeholder={t("search")}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className={`${isRTL ? 'pr-9' : 'pl-9'}`}
                  />
                </div>
                <Popover open={sortPopoverOpen} onOpenChange={setSortPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className={protocolFilter !== 'all' ? 'bg-primary text-primary-foreground' : ''}
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-4" side="bottom" sideOffset={5}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <Label className="text-sm font-medium">{t("protocol")}</Label>
                        <Select 
                          value={protocolFilter} 
                          onValueChange={(value) => { 
                            setProtocolFilter(value); 
                            setCurrentPage(1);
                            setSortPopoverOpen(false);
                          }}
                        >
                          <SelectTrigger className="w-[160px] h-9">
                            <SelectValue />
                          </SelectTrigger>
                    <SelectContent position="popper" side="bottom" sideOffset={4}>
                      <SelectItem value="all">{t("allProtocols") || "All Protocols"}</SelectItem>
                      {availableProtocols.map((protocol) => (
                        <SelectItem key={protocol} value={protocol}>
                          {protocol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                        </Select>
                      </div>
                      {protocolFilter !== 'all' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={handleResetSort}
                        >
                          <X className="h-4 w-4 mr-2" />
                          {t("reset") || "Reset"}
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => fetchDevices(true)}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" disabled={selectedDevices.length === 0}>
                    {t("actions") || "Actions"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background z-[100]">
                  <DropdownMenuItem 
                    onClick={handleDeleteSelected} 
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("delete") || "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                      <TableHead className={isRTL ? 'text-center' : ''}>{t("name")}</TableHead>
                      <TableHead className={isRTL ? 'text-center' : ''}>{t("deviceId")}</TableHead>
                      <TableHead className={isRTL ? 'text-center' : ''}>{t("protocol")}</TableHead>
                      <TableHead className={isRTL ? 'text-center' : ''}>{t("lastActivity")}</TableHead>
                      <TableHead className={isRTL ? 'text-center' : ''}>{t("createdAt")} ↓</TableHead>
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
                    <TableHead className={`w-[50px] ${isRTL ? 'text-right' : 'text-left'}`}>
                      <Checkbox 
                        checked={selectedDevices.length === paginatedDevices.length && paginatedDevices.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className={isRTL ? 'text-center' : ''}>{t("name")}</TableHead>
                    <TableHead className={isRTL ? 'text-center' : ''}>{t("deviceId")}</TableHead>
                    <TableHead className={isRTL ? 'text-center' : ''}>{t("protocol")}</TableHead>
                    <TableHead className={isRTL ? 'text-center' : ''}>{t("lastActivity")}</TableHead>
                    <TableHead className={isRTL ? 'text-center' : ''}>
                      {t("createdAt")}{' '}
                      <button 
                        onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
                        className="inline-flex hover:text-primary transition-colors cursor-pointer"
                      >
                        {sortDirection === 'desc' ? '↓' : '↑'}
                      </button>
                    </TableHead>
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
                        onClick={() => handleDeviceClick(device)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox 
                            checked={selectedDevices.includes(deviceId)}
                            onCheckedChange={(checked) => handleSelectDevice(deviceId, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{device.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{deviceId || '-'}</span>
                            {deviceId && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(deviceId, `device-${deviceId}`);
                                }}
                              >
                                {copiedField === `device-${deviceId}` ? (
                                  <CheckCheck className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{device.protocol}</TableCell>
                        <TableCell>{formattedActivity}</TableCell>
                        <TableCell>{formattedDate}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="z-[100]">
                              <DropdownMenuItem onClick={() => handleDeviceClick(device)}>
                                <Edit className="h-4 w-4 mr-2" />
                                {t("edit") || "Edit"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteDevice(device)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t("delete") || "Delete"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                    <SelectContent position="popper" className="min-w-[70px]" sideOffset={4}>
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
      )}

      {/* Device Credentials Dialog */}
      <Dialog open={credentialsDialogOpen} onOpenChange={setCredentialsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-base">{t("deviceCreatedSuccessfully")}</DialogTitle>
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
        <SheetContent side={isRTL ? 'left' : 'right'} className="w-full sm:max-w-[540px] overflow-y-auto">
          <SheetHeader className={`bg-[#00BCD4] text-white -mx-6 -mt-6 px-6 py-6 mb-6 ${isRTL ? 'text-right' : ''}`}>
            <SheetTitle className={`text-white text-base ${isRTL ? 'text-right' : ''}`}>{t("createNewDevice")}</SheetTitle>
          </SheetHeader>
          
          {wizardStep === 'template' ? (
            <div className="space-y-6">
              {/* Template Selection */}
              <div>
                <h3 className="text-sm font-semibold mb-3">{t("selectDeviceTemplate")}</h3>
                
                {/* Blank Device Card */}
                <Card 
                  className={`border-2 cursor-pointer transition-all ${selectedTemplate === 'blank' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
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
                  <Label className={isRTL ? 'text-right block' : ''}>Project:</Label>
                  <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className={isRTL ? 'text-right block' : ''}>{t("name")}:</Label>
                  <Input
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder={t("enterDeviceName")}
                    autoFocus
                  />
                </div>
                <div>
                  <Label className={isRTL ? 'text-right block' : ''}>{t("protocol")}:</Label>
                  <Select value={protocol} onValueChange={setProtocol}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MQTT">MQTT</SelectItem>
                      <SelectItem value="HTTP">HTTP</SelectItem>
                      <SelectItem value="CoAP">CoAP</SelectItem>
                      <SelectItem value="WebSocket">WebSocket</SelectItem>
                      <SelectItem value="LoRaWAN">LoRaWAN</SelectItem>
                      <SelectItem value="BLE">BLE</SelectItem>
                      <SelectItem value="ZigBee">ZigBee</SelectItem>
                      <SelectItem value="OPC-UA">OPC-UA</SelectItem>
                      <SelectItem value="LTE">LTE</SelectItem>
                      <SelectItem value="5G">5G</SelectItem>
                    </SelectContent>
                  </Select>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className={isRTL ? 'text-right' : ''}>
            <DialogTitle className={isRTL ? 'text-right' : ''}>{t("confirmDelete") || "Confirm Delete"}</DialogTitle>
            <DialogDescription className={isRTL ? 'text-right' : ''}>
              {t("confirmDeleteMessage") || `Are you sure you want to delete ${selectedDevices.length} device(s)? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              {t("delete")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Device Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
            <DialogDescription>
              Update device properties.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t("name")}</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder={t("enterDeviceName")}
              />
            </div>
            <div>
              <Label>{t("protocol")}</Label>
              <Select value={editProtocol} onValueChange={setEditProtocol}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MQTT">MQTT</SelectItem>
                  <SelectItem value="HTTP">HTTP</SelectItem>
                  <SelectItem value="CoAP">CoAP</SelectItem>
                  <SelectItem value="WebSocket">WebSocket</SelectItem>
                  <SelectItem value="LoRaWAN">LoRaWAN</SelectItem>
                  <SelectItem value="BLE">BLE</SelectItem>
                  <SelectItem value="ZigBee">ZigBee</SelectItem>
                  <SelectItem value="OPC-UA">OPC-UA</SelectItem>
                  <SelectItem value="LTE">LTE</SelectItem>
                  <SelectItem value="5G">5G</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Project</Label>
              <Select value={editProjectId} onValueChange={setEditProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Device Groups Management */}
            <div className="border-t pt-4">
              <Label className="text-base font-medium mb-3 block">Device Groups</Label>

              {/* Current Groups */}
              {deviceGroups.length > 0 && (
                <div className="mb-4">
                  <Label className="text-sm text-muted-foreground mb-2 block">Current Groups</Label>
                  <div className="flex flex-wrap gap-2">
                    {deviceGroups.map((group) => (
                      <div key={group.id} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm">
                        <span>{group.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-blue-100"
                          onClick={() => handleRemoveDeviceFromGroup(group.id)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Group */}
              <div className="flex gap-2">
                <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select group to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGroups
                      .filter(group => !deviceGroups.some(dg => dg.id === group.id))
                      .map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => {
                    if (selectedGroupId) {
                      handleAddDeviceToGroup(selectedGroupId);
                      setSelectedGroupId("");
                    }
                  }}
                  disabled={!selectedGroupId}
                  size="sm"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-3">
            <Button variant="destructive" onClick={handleRemoveDevice}>
              Remove
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                {t("cancel")}
              </Button>
              <Button onClick={handleUpdateDevice} disabled={isLoading} className="bg-[#00BCD4] hover:bg-[#00ACC1]">
                {isLoading ? "Updating" : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PanelLayout>
  );
};

export default Devices;
