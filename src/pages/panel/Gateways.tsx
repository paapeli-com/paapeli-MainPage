import { useState, useEffect, useCallback } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Radio,
  Smartphone,
  MapPin,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Wifi,
  WifiOff,
  AlertTriangle,
  Plus,
  RefreshCw
} from "lucide-react";
import { gatewayAPI, projectAPI, Gateway, GatewayData, GatewayDevice } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

interface Project {
  id: string;
  name: string;
  description?: string;
}

const Gateways = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { currentProject } = useProject();

  // State for gateways
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for projects (needed for gateway creation/editing)
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // State for forms
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form data
  const [formData, setFormData] = useState<GatewayData>({
    name: "",
    description: "",
    project_id: "",
    location: "",
    config: {}
  });

  // State for current gateway being edited/deleted/viewed
  const [currentGateway, setCurrentGateway] = useState<Gateway | null>(null);
  const [gatewayDevices, setGatewayDevices] = useState<GatewayDevice[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(false);

  const loadGateways = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (currentProject?.id) {
        params.append('project_id', currentProject.id);
      }
      
      const url = `/api/v1/gateways${params.toString() ? '?' + params.toString() : ''}`;
      const response = await apiRequest(url);
      setGateways(response.data || []);
    } catch (err) {
      console.error("Failed to load gateways:", err);
      setError("Failed to load gateways");
      toast({
        title: "Error",
        description: "Failed to load gateways. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, currentProject]);

  const loadProjects = useCallback(async () => {
    try {
      setProjectsLoading(true);
      const response = await projectAPI.getProjects();
      setProjects(response.projects || []);
    } catch (err) {
      console.error("Failed to load projects:", err);
      toast({
        title: "Error",
        description: "Failed to load projects. You may not be able to create gateways.",
        variant: "destructive",
      });
    } finally {
      setProjectsLoading(false);
    }
  }, [toast]);

  // Load gateways and projects on component mount
  useEffect(() => {
    loadGateways();
    loadProjects();
  }, [loadGateways, loadProjects, currentProject]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      project_id: "",
      location: "",
      config: {}
    });
  };

  const handleAddGateway = async () => {
    try {
      await gatewayAPI.createGateway(formData);
      toast({
        title: "Success",
        description: "Gateway created successfully",
      });
      setAddPanelOpen(false);
      resetForm();
      loadGateways();
    } catch (err) {
      console.error("Failed to create gateway:", err);
      toast({
        title: "Error",
        description: "Failed to create gateway. Please check your input and try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditGateway = async () => {
    if (!currentGateway) return;

    try {
      await gatewayAPI.updateGateway(currentGateway.id, formData);
      toast({
        title: "Success",
        description: "Gateway updated successfully",
      });
      setEditPanelOpen(false);
      resetForm();
      loadGateways();
    } catch (err) {
      console.error("Failed to update gateway:", err);
      toast({
        title: "Error",
        description: "Failed to update gateway. Please check your input and try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGateway = async () => {
    if (!currentGateway) return;

    try {
      await gatewayAPI.deleteGateway(currentGateway.id);
      toast({
        title: "Success",
        description: "Gateway deleted successfully",
      });
      setDeleteDialogOpen(false);
      setCurrentGateway(null);
      loadGateways();
    } catch (err) {
      console.error("Failed to delete gateway:", err);
      toast({
        title: "Error",
        description: "Failed to delete gateway. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditPanel = (gateway: Gateway) => {
    setCurrentGateway(gateway);
    setFormData({
      name: gateway.name,
      description: gateway.description || "",
      project_id: gateway.project_id,
      location: gateway.location || "",
      config: gateway.config || {}
    });
    setEditPanelOpen(true);
  };

  const openDetailsPanel = async (gateway: Gateway) => {
    setCurrentGateway(gateway);
    setDetailsPanelOpen(true);

    // Load devices for this gateway
    try {
      setDevicesLoading(true);
      const response = await gatewayAPI.getGatewayDevices(gateway.id);
      setGatewayDevices(response.data || []);
    } catch (err) {
      console.error("Failed to load gateway devices:", err);
      setGatewayDevices([]);
      toast({
        title: "Error",
        description: "Failed to load gateway devices.",
        variant: "destructive",
      });
    } finally {
      setDevicesLoading(false);
    }
  };

  const openDeleteDialog = (gateway: Gateway) => {
    setCurrentGateway(gateway);
    setDeleteDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case 'maintenance':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Radio className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      online: "default",
      offline: "destructive",
      maintenance: "secondary"
    };

    return (
      <Badge variant={variants[status] || "outline"} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatLastSeen = (lastSeen?: string) => {
    if (!lastSeen) return "Never";
    try {
      return formatDistanceToNow(new Date(lastSeen), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const GatewayForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Gateway name"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Gateway description"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="project">Project *</Label>
        <Select
          value={formData.project_id}
          onValueChange={(value) => setFormData(prev => ({ ...prev, project_id: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a project" />
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
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          placeholder="Gateway location"
        />
      </div>

      <Button onClick={onSubmit} className="w-full" disabled={!formData.name || !formData.project_id}>
        {submitLabel}
      </Button>
    </div>
  );

  if (loading) {
    return (
      <PanelLayout pageTitle={t("gateways")} onAddClick={() => setAddPanelOpen(true)}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PanelLayout>
    );
  }

  if (error) {
    return (
      <PanelLayout pageTitle={t("gateways")} onAddClick={() => setAddPanelOpen(true)}>
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadGateways} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </PanelLayout>
    );
  }

  return (
    <PanelLayout pageTitle={t("gateways")} onAddClick={() => setAddPanelOpen(true)}>
      {gateways.length === 0 ? (
        <div className="text-center py-12">
          <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">{t("noGatewaysYet")}</p>
          <Button onClick={() => setAddPanelOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Gateway
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gateways.map((gateway) => (
            <Card key={gateway.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base">{gateway.name}</CardTitle>
                  {gateway.description && (
                    <CardDescription className="text-sm">{gateway.description}</CardDescription>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openDetailsPanel(gateway)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEditPanel(gateway)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openDeleteDialog(gateway)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  {getStatusBadge(gateway.status)}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Smartphone className="h-4 w-4" />
                    <span>{gatewayDevices.filter(d => d.gateway_id === gateway.id).length} devices</span>
                  </div>
                </div>

                {gateway.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{gateway.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Last seen: {formatLastSeen(gateway.last_seen)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Gateway Sheet */}
      <Sheet open={addPanelOpen} onOpenChange={setAddPanelOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Gateway</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <GatewayForm onSubmit={handleAddGateway} submitLabel="Create Gateway" />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Gateway Sheet */}
      <Sheet open={editPanelOpen} onOpenChange={setEditPanelOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Gateway</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <GatewayForm onSubmit={handleEditGateway} submitLabel="Update Gateway" />
          </div>
        </SheetContent>
      </Sheet>

      {/* Gateway Details Sheet */}
      <Sheet open={detailsPanelOpen} onOpenChange={setDetailsPanelOpen}>
        <SheetContent className="w-[600px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{currentGateway?.name} Details</SheetTitle>
          </SheetHeader>
          {currentGateway && (
            <div className="mt-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-muted-foreground">{currentGateway.name}</p>
                </div>

                {currentGateway.description && (
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-muted-foreground">{currentGateway.description}</p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(currentGateway.status)}
                  </div>
                </div>

                {currentGateway.location && (
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm text-muted-foreground">{currentGateway.location}</p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Last Seen</Label>
                  <p className="text-sm text-muted-foreground">{formatLastSeen(currentGateway.last_seen)}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(currentGateway.created_at).toLocaleString()}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Updated</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(currentGateway.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Connected Devices</Label>
                {devicesLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : gatewayDevices.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No devices connected</p>
                ) : (
                  <div className="space-y-2">
                    {gatewayDevices.map((device) => (
                      <div key={device.device_id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{device.name || `Device ${device.device_id.slice(-8)}`}</p>
                          <p className="text-xs text-muted-foreground">
                            Connected {formatDistanceToNow(new Date(device.connected_at), { addSuffix: true })}
                          </p>
                        </div>
                        <Badge variant={device.status === 'online' ? 'default' : 'secondary'}>
                          {device.status || 'unknown'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Gateway</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{currentGateway?.name}"? This action cannot be undone.
              All connected devices will be disconnected from this gateway.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGateway} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PanelLayout>
  );
};

export default Gateways;
