import { useState, useEffect, useCallback } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Plus, Play, Pause, XCircle, CheckCircle, Trash2, Edit, Download } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { otaAPI } from "@/lib/api";

interface FirmwareVersion {
  id: string;
  version: string;
  file_url: string;
  sha256: string;
  description?: string;
  released_at?: string;
  created_at: string;
}

interface UpdateCampaign {
  id: string;
  name: string;
  firmware_id: string;
  project_id: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  stages: Array<{
    percentage: number;
    duration_hours: number;
  }>;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

interface DeviceFirmwareStatus {
  id: string;
  device_id: string;
  current_version?: string;
  target_version?: string;
  update_status: 'up_to_date' | 'pending' | 'in_progress' | 'failed';
  last_updated: string;
}

const OTA = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("versions");
  const [firmwareVersions, setFirmwareVersions] = useState<FirmwareVersion[]>([]);
  const [campaigns, setCampaigns] = useState<UpdateCampaign[]>([]);
  const [deviceStatuses, setDeviceStatuses] = useState<DeviceFirmwareStatus[]>([]);
  const [loading, setLoading] = useState(false);

  // Dialog states
  const [addVersionOpen, setAddVersionOpen] = useState(false);
  const [addCampaignOpen, setAddCampaignOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<UpdateCampaign | null>(null);

  // Form states
  const [versionForm, setVersionForm] = useState({
    version: '',
    file_url: '',
    sha256: '',
    description: '',
    released_at: ''
  });

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    firmware_id: '',
    project_id: '',
    stages: [{ percentage: 25, duration_hours: 24 }]
  });

  const loadFirmwareVersions = useCallback(async () => {
    try {
      const response = await otaAPI.getFirmwareVersions();
      setFirmwareVersions(response.data || []);
    } catch (error) {
      console.error('Failed to load firmware versions:', error);
      toast({
        title: "Error",
        description: "Failed to load firmware versions. OTA service may not be available.",
        variant: "destructive",
      });
      setFirmwareVersions([]);
    }
  }, [toast]);

  const loadCampaigns = useCallback(async () => {
    try {
      const response = await otaAPI.getUpdateCampaigns();
      setCampaigns(response.data || []);
    } catch (error) {
      console.error('Failed to load update campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to load update campaigns. OTA service may not be available.",
        variant: "destructive",
      });
      setCampaigns([]);
    }
  }, [toast]);

  const loadDeviceStatuses = useCallback(async () => {
    try {
      const response = await otaAPI.getAllDeviceFirmwareStatuses();
      setDeviceStatuses(response.data || []);
    } catch (error) {
      console.error('Failed to load device statuses:', error);
      toast({
        title: "Error",
        description: "Failed to load device firmware statuses",
        variant: "destructive",
      });
      setDeviceStatuses([]);
    }
  }, [toast]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "versions") {
        await loadFirmwareVersions();
      } else if (activeTab === "campaigns") {
        await loadCampaigns();
      } else if (activeTab === "devices") {
        await loadDeviceStatuses();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab, toast, loadFirmwareVersions, loadCampaigns, loadDeviceStatuses]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateVersion = async () => {
    try {
      await otaAPI.createFirmwareVersion(versionForm);
      toast({
        title: "Success",
        description: "Firmware version created successfully",
      });
      setAddVersionOpen(false);
      setVersionForm({ version: '', file_url: '', sha256: '', description: '', released_at: '' });
      loadFirmwareVersions();
    } catch (error) {
      console.error('Failed to create firmware version:', error);
      toast({
        title: "Error",
        description: "Failed to create firmware version. OTA service may not be available.",
        variant: "destructive",
      });
    }
  };

  const handleCreateCampaign = async () => {
    if (!validateStages()) {
      toast({
        title: "Validation Error",
        description: "Stages must total 100% and all values must be valid",
        variant: "destructive",
      });
      return;
    }

    try {
      await otaAPI.createUpdateCampaign(campaignForm);
      toast({
        title: "Success",
        description: "Update campaign created successfully",
      });
      setAddCampaignOpen(false);
      setCampaignForm({ name: '', firmware_id: '', project_id: '', stages: [{ percentage: 25, duration_hours: 24 }] });
      loadCampaigns();
    } catch (error) {
      console.error('Failed to create update campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create update campaign. OTA service may not be available.",
        variant: "destructive",
      });
    }
  };
  const addStage = () => {
    setCampaignForm({
      ...campaignForm,
      stages: [...campaignForm.stages, { percentage: 25, duration_hours: 24 }]
    });
  };

  const removeStage = (index: number) => {
    if (campaignForm.stages.length > 1) {
      setCampaignForm({
        ...campaignForm,
        stages: campaignForm.stages.filter((_, i) => i !== index)
      });
    }
  };

  const updateStage = (index: number, field: 'percentage' | 'duration_hours', value: number) => {
    const updatedStages = campaignForm.stages.map((stage, i) =>
      i === index ? { ...stage, [field]: value } : stage
    );
    setCampaignForm({
      ...campaignForm,
      stages: updatedStages
    });
  };

  const validateStages = () => {
    const totalPercentage = campaignForm.stages.reduce((sum, stage) => sum + stage.percentage, 0);
    return totalPercentage === 100 && campaignForm.stages.every(stage =>
      stage.percentage > 0 && stage.percentage <= 100 && stage.duration_hours > 0
    );
  };
  const handleCampaignAction = async (campaignId: string, action: 'start' | 'pause' | 'cancel' | 'complete') => {
    try {
      const actionMap = {
        start: otaAPI.startCampaign,
        pause: otaAPI.pauseCampaign,
        cancel: otaAPI.cancelCampaign,
        complete: otaAPI.completeCampaign
      };

      await actionMap[action](campaignId);
      toast({
        title: "Success",
        description: `Campaign ${action}ed successfully`,
      });
      loadCampaigns();
    } catch (error) {
      console.error(`Failed to ${action} campaign:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} campaign. OTA service may not be available.`,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "secondary",
      active: "default",
      paused: "outline",
      completed: "secondary",
      cancelled: "destructive",
      up_to_date: "secondary",
      pending: "outline",
      in_progress: "default",
      failed: "destructive"
    };
    return <Badge variant={variants[status] || "secondary"}>{status.replace('_', ' ')}</Badge>;
  };

  return (
    <PanelLayout pageTitle="OTA Updates">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="versions">Firmware Versions</TabsTrigger>
          <TabsTrigger value="campaigns">Update Campaigns</TabsTrigger>
          <TabsTrigger value="devices">Device Status</TabsTrigger>
        </TabsList>

        <TabsContent value="versions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Firmware Versions</h2>
            <Dialog open={addVersionOpen} onOpenChange={setAddVersionOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Version
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Firmware Version</DialogTitle>
                  <DialogDescription>
                    Add a new firmware version with version number, file URL, SHA256 hash, and description.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="version">Version</Label>
                    <Input
                      id="version"
                      value={versionForm.version}
                      onChange={(e) => setVersionForm({...versionForm, version: e.target.value})}
                      placeholder="1.2.3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="file_url">File URL</Label>
                    <Input
                      id="file_url"
                      value={versionForm.file_url}
                      onChange={(e) => setVersionForm({...versionForm, file_url: e.target.value})}
                      placeholder="https://example.com/firmware.bin"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sha256">SHA256</Label>
                    <Input
                      id="sha256"
                      value={versionForm.sha256}
                      onChange={(e) => setVersionForm({...versionForm, sha256: e.target.value})}
                      placeholder="SHA256 hash"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={versionForm.description}
                      onChange={(e) => setVersionForm({...versionForm, description: e.target.value})}
                      placeholder="Release notes"
                    />
                  </div>
                  <Button onClick={handleCreateVersion} className="w-full">
                    Create Version
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {firmwareVersions.map((version) => (
                    <TableRow key={version.id}>
                      <TableCell className="font-mono">{version.version}</TableCell>
                      <TableCell>{version.description || '-'}</TableCell>
                      <TableCell>{new Date(version.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Update Campaigns</h2>
            <Dialog open={addCampaignOpen} onOpenChange={setAddCampaignOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Update Campaign</DialogTitle>
                  <DialogDescription>
                    Create a new firmware update campaign by selecting a firmware version and defining rollout stages.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="campaign_name">Campaign Name</Label>
                    <Input
                      id="campaign_name"
                      value={campaignForm.name}
                      onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})}
                      placeholder="Warehouse Sensors Update"
                    />
                  </div>
                  <div>
                    <Label htmlFor="firmware_id">Firmware Version</Label>
                    <Select value={campaignForm.firmware_id} onValueChange={(value) => setCampaignForm({...campaignForm, firmware_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select firmware version" />
                      </SelectTrigger>
                      <SelectContent>
                        {firmwareVersions.map((version) => (
                          <SelectItem key={version.id} value={version.id}>
                            {version.version}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Update Stages</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addStage}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Stage
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {campaignForm.stages.map((stage, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                          <div className="flex-1">
                            <Label htmlFor={`stage-percentage-${index}`} className="text-sm">Percentage (%)</Label>
                            <Input
                              id={`stage-percentage-${index}`}
                              type="number"
                              min="1"
                              max="100"
                              value={stage.percentage}
                              onChange={(e) => updateStage(index, 'percentage', parseInt(e.target.value) || 0)}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor={`stage-duration-${index}`} className="text-sm">Duration (hours)</Label>
                            <Input
                              id={`stage-duration-${index}`}
                              type="number"
                              min="1"
                              value={stage.duration_hours}
                              onChange={(e) => updateStage(index, 'duration_hours', parseInt(e.target.value) || 0)}
                              className="mt-1"
                            />
                          </div>
                          {campaignForm.stages.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeStage(index)}
                              className="mt-6"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Total: {campaignForm.stages.reduce((sum, stage) => sum + stage.percentage, 0)}% of devices
                    </div>
                  </div>

                  <Button onClick={handleCreateCampaign} className="w-full">
                    Create Campaign
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{campaign.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Firmware: {firmwareVersions.find(v => v.id === campaign.firmware_id)?.version || campaign.firmware_id}
                      </p>
                    </div>
                    {getStatusBadge(campaign.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Created: {new Date(campaign.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      {campaign.status === 'draft' && (
                        <Button size="sm" onClick={() => handleCampaignAction(campaign.id, 'start')}>
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      )}
                      {campaign.status === 'active' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleCampaignAction(campaign.id, 'pause')}>
                            <Pause className="w-4 h-4 mr-1" />
                            Pause
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleCampaignAction(campaign.id, 'complete')}>
                            <Stop className="w-4 h-4 mr-1" />
                            Complete
                          </Button>
                        </>
                      )}
                      {(campaign.status === 'active' || campaign.status === 'paused') && (
                        <Button size="sm" variant="destructive" onClick={() => handleCampaignAction(campaign.id, 'cancel')}>
                          Cancel
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <h2 className="text-2xl font-bold">Device Firmware Status</h2>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device ID</TableHead>
                    <TableHead>Current Version</TableHead>
                    <TableHead>Target Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deviceStatuses.map((status) => (
                    <TableRow key={status.id}>
                      <TableCell className="font-mono">{status.device_id}</TableCell>
                      <TableCell>{status.current_version || '-'}</TableCell>
                      <TableCell>{status.target_version || '-'}</TableCell>
                      <TableCell>{getStatusBadge(status.update_status)}</TableCell>
                      <TableCell>{new Date(status.last_updated).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PanelLayout>
  );
};

export default OTA;
