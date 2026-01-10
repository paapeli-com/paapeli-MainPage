import { useState, useEffect } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { FolderOpen, Plus, Users, Calendar, MoreHorizontal } from "lucide-react";

interface DeviceGroup {
  id: string;
  name: string;
  description?: string;
  project_id: string;
  device_count: number;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
}

const DeviceGroup = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [groups, setGroups] = useState<DeviceGroup[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDeviceDialogOpen, setAddDeviceDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<DeviceGroup | null>(null);
  const [editName, setEditName] = useState("");
  const [availableDevices, setAvailableDevices] = useState<any[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchGroups = async () => {
    try {
      const response = await apiRequest("/api/v1/device-groups");
      const groupsData = response.data || [];
      setGroups(groupsData);
    } catch (error) {
      console.error("Failed to fetch device groups:", error);
      toast({
        title: t("error"),
        description: "Failed to load device groups",
        variant: "destructive",
      });
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await apiRequest("/api/v1/projects");
      const projectsData = response.data || [];
      setProjects(projectsData);
      if (projectsData.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projectsData[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchGroups(), fetchProjects()]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (addDeviceDialogOpen && selectedGroup) {
      const fetchDevices = async () => {
        try {
          const response = await apiRequest("/api/v1/gateways");
          setAvailableDevices(response.data || []);
        } catch (error) {
          console.error("Failed to fetch devices:", error);
          toast({
            title: t("error"),
            description: "Failed to load available devices",
            variant: "destructive",
          });
        }
      };
      fetchDevices();
      setSelectedDevices([]);
      setSearchTerm("");
      setCurrentPage(1);
    }
  }, [addDeviceDialogOpen, selectedGroup]);

  const handleAddGroup = async () => {
    if (!groupName.trim()) {
      toast({
        title: t("error"),
        description: "Group name is required",
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

    setSubmitting(true);
    try {
      const response = await apiRequest("/api/v1/device-groups", {
        method: "POST",
        body: JSON.stringify({
          name: groupName,
          description: description || undefined,
          project_id: selectedProjectId,
        }),
      });

      const newGroup = response.data;
      setGroups(prev => [newGroup, ...prev]);

      toast({
        title: t("success"),
        description: "Device group created successfully",
      });

      // Reset form
      setGroupName("");
      setDescription("");
      setAddPanelOpen(false);
    } catch (error: any) {
      console.error("Failed to create device group:", error);
      toast({
        title: t("error"),
        description: error.message || "Failed to create device group",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setGroupName("");
    setDescription("");
    if (projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
  };

  const handleEditGroup = async () => {
    if (!selectedGroup || !editName.trim()) return;

    setDialogLoading(true);
    try {
      await apiRequest(`/api/v1/device-groups/${selectedGroup.id}`, {
        method: "PUT",
        body: JSON.stringify({ name: editName }),
      });
      setGroups(prev => prev.map(g => g.id === selectedGroup.id ? { ...g, name: editName } : g));
      toast({
        title: t("success"),
        description: "Group updated successfully",
      });
      setEditDialogOpen(false);
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || "Failed to update group",
        variant: "destructive",
      });
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;

    setDialogLoading(true);
    try {
      await apiRequest(`/api/v1/device-groups/${selectedGroup.id}`, {
        method: "DELETE",
      });
      setGroups(prev => prev.filter(g => g.id !== selectedGroup.id));
      toast({
        title: t("success"),
        description: "Group deleted successfully",
      });
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || "Failed to delete group",
        variant: "destructive",
      });
    } finally {
      setDialogLoading(false);
    }
  };

  const handleAddDevices = async () => {
    if (!selectedGroup || selectedDevices.length === 0) return;

    setDialogLoading(true);
    try {
      const promises = selectedDevices.map(deviceId =>
        apiRequest(`/api/v1/device-groups/${selectedGroup.id}/devices`, {
          method: "POST",
          body: JSON.stringify({ device_id: deviceId }),
        })
      );
      await Promise.all(promises);
      setGroups(prev => prev.map(g => g.id === selectedGroup.id ? { ...g, device_count: g.device_count + selectedDevices.length } : g));
      toast({
        title: t("success"),
        description: `${selectedDevices.length} device(s) added successfully`,
      });
      setAddDeviceDialogOpen(false);
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || "Failed to add devices",
        variant: "destructive",
      });
    } finally {
      setDialogLoading(false);
    }
  };

  return (
    <PanelLayout pageTitle={t("group")} onAddClick={() => { setAddPanelOpen(true); resetForm(); }}>
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">{t("noGroupsYet")}</p>
          <Button onClick={() => { setAddPanelOpen(true); resetForm(); }}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Group
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{groups.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {groups.reduce((sum, group) => sum + group.device_count, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Devices/Group</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {groups.length > 0
                    ? Math.round(groups.reduce((sum, group) => sum + group.device_count, 0) / groups.length)
                    : 0
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Groups Table */}
          <Card>
            <CardHeader>
              <CardTitle>Device Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Devices</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group) => {
                    const project = projects.find(p => p.id === group.project_id);
                    return (
                      <TableRow key={group.id}>
                        <TableCell className="font-medium">{group.name}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {group.description || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {group.device_count} devices
                          </Badge>
                        </TableCell>
                        <TableCell>{project?.name || "Unknown"}</TableCell>
                        <TableCell>
                          {new Date(group.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setSelectedGroup(group); setEditName(group.name); setEditDialogOpen(true); }}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedGroup(group); setDeleteDialogOpen(true); }}>
                                Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedGroup(group); setAddDeviceDialogOpen(true); }}>
                                Add Device
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Group Sheet */}
      <Sheet open={addPanelOpen} onOpenChange={(open) => { setAddPanelOpen(open); if (!open) resetForm(); }}>
        <SheetContent side="right" className="w-full sm:max-w-[540px] overflow-y-auto">
          <SheetHeader className="bg-primary text-primary-foreground -mx-6 -mt-6 px-6 py-6 mb-6">
            <SheetTitle className="text-primary-foreground">Create Device Group</SheetTitle>
          </SheetHeader>

          <div className="space-y-6">
            <div>
              <Label>Project</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
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
              <Label>Group Name</Label>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                autoFocus
              />
            </div>

            <div>
              <Label>Description (Optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this device group"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setAddPanelOpen(false); resetForm(); }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleAddGroup}
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create Group"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Group Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Device Group</DialogTitle>
            <DialogDescription>
              Update the name of the device group.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Group Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter group name"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditGroup} disabled={dialogLoading}>
                {dialogLoading ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Group Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Device Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedGroup?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGroup} disabled={dialogLoading}>
              {dialogLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Device Dialog */}
      <Dialog open={addDeviceDialogOpen} onOpenChange={setAddDeviceDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add Devices to {selectedGroup?.name}</DialogTitle>
            <DialogDescription>
              Select devices from the list below to add them to this group. You can search and paginate through available devices.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Search devices by name..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            {availableDevices.length === 0 ? (
              <p>No available devices</p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Select</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      const filteredDevices = availableDevices.filter(device =>
                        device.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        device.id.toLowerCase().includes(searchTerm.toLowerCase())
                      );
                      const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
                      const paginatedDevices = filteredDevices.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      );
                      return paginatedDevices.map((device) => (
                        <TableRow key={device.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedDevices.includes(device.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedDevices(prev => [...prev, device.id]);
                                } else {
                                  setSelectedDevices(prev => prev.filter(id => id !== device.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>{device.name || device.id}</TableCell>
                          <TableCell>{device.location || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={device.status === 'online' ? 'default' : 'secondary'}>
                              {device.status || 'Unknown'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ));
                    })()}
                  </TableBody>
                </Table>
                {(() => {
                  const filteredDevices = availableDevices.filter(device =>
                    device.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    device.id.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
                  return (
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span>Page {currentPage} of {totalPages}</span>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  );
                })()}
              </>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setAddDeviceDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDevices} disabled={dialogLoading || selectedDevices.length === 0}>
                {dialogLoading ? "Adding..." : `Add ${selectedDevices.length} Device(s)`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PanelLayout>
  );
};

export default DeviceGroup;
