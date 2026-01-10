import { useState, useEffect } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus, UserPlus, Crown, Shield, User } from "lucide-react";

interface Member {
  user_id: string;
  email: string;
  username?: string;
  role: 'owner' | 'editor' | 'viewer';
  added_at: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
}

const Members = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // Form state
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState<'editor' | 'viewer'>('viewer');

  const fetchProjects = async () => {
    try {
      const response = await apiRequest("/api/v1/projects");
      const projectsData = response.projects || [];
      setProjects(projectsData);
      if (projectsData.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projectsData[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const fetchMembers = async (projectId: string) => {
    if (!projectId) return;

    try {
      const response = await apiRequest(`/api/v1/projects/${projectId}/members`);
      const membersData = response.members || [];
      setMembers(membersData);
    } catch (error) {
      console.error("Failed to fetch members:", error);
      setMembers([]);
      toast({
        title: t("error"),
        description: "Failed to load members",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchMembers(selectedProjectId);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    if (projects.length > 0) {
      setLoading(false);
    }
  }, [projects]);

  const handleAddMember = async () => {
    if (!memberEmail.trim() || !selectedProjectId) {
      toast({
        title: t("error"),
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // First, we need to invite the member (this would typically send an email)
      // For now, we'll assume the user exists and add them directly
      await apiRequest(`/api/v1/projects/${selectedProjectId}/members`, {
        method: "POST",
        body: JSON.stringify({
          email: memberEmail,
          role: memberRole,
        }),
      });

      toast({
        title: t("success"),
        description: "Member invitation sent successfully",
      });

      // Reset form
      setMemberEmail("");
      setMemberRole('viewer');
      setAddPanelOpen(false);

      // Refresh members list
      fetchMembers(selectedProjectId);
    } catch (error: any) {
      console.error("Failed to add member:", error);
      toast({
        title: t("error"),
        description: error.message || "Failed to add member",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'editor' | 'viewer') => {
    if (!selectedProjectId) return;

    try {
      await apiRequest(`/api/v1/projects/${selectedProjectId}/members/${userId}`, {
        method: "PUT",
        body: JSON.stringify({
          role: newRole,
        }),
      });

      toast({
        title: t("success"),
        description: "Member role updated successfully",
      });

      // Refresh members list
      fetchMembers(selectedProjectId);
    } catch (error: any) {
      console.error("Failed to update member role:", error);
      toast({
        title: t("error"),
        description: error.message || "Failed to update member role",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedProjectId) return;

    try {
      await apiRequest(`/api/v1/projects/${selectedProjectId}/members/${userId}`, {
        method: "DELETE",
      });

      toast({
        title: t("success"),
        description: "Member removed successfully",
      });

      // Refresh members list
      fetchMembers(selectedProjectId);
    } catch (error: any) {
      console.error("Failed to remove member:", error);
      toast({
        title: t("error"),
        description: error.message || "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setMemberEmail("");
    setMemberRole('viewer');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'editor': return <Shield className="h-4 w-4 text-blue-500" />;
      case 'viewer': return <User className="h-4 w-4 text-gray-500" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner': return 'default';
      case 'editor': return 'secondary';
      case 'viewer': return 'outline';
      default: return 'outline';
    }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <PanelLayout pageTitle={t("members")} onAddClick={() => { setAddPanelOpen(true); resetForm(); }}>
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Project Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Project Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Label>Select Project:</Label>
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                  <SelectTrigger className="w-[300px]">
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
            </CardContent>
          </Card>

          {selectedProjectId && (
            <>
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{members.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Owners</CardTitle>
                    <Crown className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {members.filter(m => m.role === 'owner').length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Editors</CardTitle>
                    <Shield className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {members.filter(m => m.role === 'editor').length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Viewers</CardTitle>
                    <User className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {members.filter(m => m.role === 'viewer').length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Members Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Members of {selectedProject?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {members.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No members in this project yet</p>
                      <Button onClick={() => { setAddPanelOpen(true); resetForm(); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Member
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Added</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {members.map((member) => (
                          <TableRow key={member.user_id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{member.email}</div>
                                {member.username && (
                                  <div className="text-sm text-muted-foreground">@{member.username}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getRoleBadgeVariant(member.role)} className="flex items-center gap-1 w-fit">
                                {getRoleIcon(member.role)}
                                {member.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(member.added_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {member.role !== 'owner' && (
                                <div className="flex items-center gap-2">
                                  <Select
                                    value={member.role}
                                    onValueChange={(value: 'editor' | 'viewer') => handleRoleChange(member.user_id, value)}
                                  >
                                    <SelectTrigger className="w-[100px] h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="editor">Editor</SelectItem>
                                      <SelectItem value="viewer">Viewer</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveMember(member.user_id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Add Member Sheet */}
      <Sheet open={addPanelOpen} onOpenChange={(open) => { setAddPanelOpen(open); if (!open) resetForm(); }}>
        <SheetContent side="right" className="w-full sm:max-w-[500px] overflow-y-auto">
          <SheetHeader className="bg-primary text-primary-foreground -mx-6 -mt-6 px-6 py-6 mb-6">
            <SheetTitle className="text-primary-foreground">Invite Team Member</SheetTitle>
          </SheetHeader>

          <div className="space-y-6">
            <div>
              <Label>Email Address *</Label>
              <Input
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="member@example.com"
                autoFocus
              />
            </div>

            <div>
              <Label>Role</Label>
              <Select value={memberRole} onValueChange={(value: any) => setMemberRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                  <SelectItem value="editor">Editor - Can modify project</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                An invitation will be sent to this email address. They will be able to access the project: <strong>{selectedProject?.name}</strong>
              </p>
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
                onClick={handleAddMember}
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </PanelLayout>
  );
};

export default Members;
