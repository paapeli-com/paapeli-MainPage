import { useState, useEffect, useCallback } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
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
import { Users, Plus, UserPlus, Crown, Shield, User, CheckCircle, Copy } from "lucide-react";
import { copyTextToClipboard } from "@/utils/clipboard";

interface Member {
  project_id: string;
  user_id: string;
  email: string;
  username?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  created_at: string;
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
  const [invitationLink, setInvitationLink] = useState("");
  const [invitationEmail, setInvitationEmail] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy");

  // Form state
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState<'admin' | 'member' | 'viewer'>('viewer');

  const resetForm = () => {
    setMemberEmail("");
    setMemberRole('viewer');
  };

  const fetchProjects = useCallback(async () => {
    try {
      const response = await apiRequest("/api/v1/projects");
      const projectsData = response.data || [];
      setProjects(projectsData);
      if (projectsData.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projectsData[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
      toast({
        title: t("error"),
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId, toast, t]);

  const fetchMembers = useCallback(async (projectId: string) => {
    if (!projectId) return;

    try {
      const response = await apiRequest(`/api/v1/projects/${projectId}/members`);
      const membersData = response.data || [];
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
  }, [toast, t]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchMembers(selectedProjectId);
    }
  }, [selectedProjectId, fetchMembers]);

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
      // Create invitation
      const response = await apiRequest(`/api/v1/members/invitations`, {
        method: "POST",
        body: JSON.stringify({
          project_id: selectedProjectId,
          email: memberEmail,
          role: memberRole,
        }),
      });

      const invitation = response.data;
      const invitationURL = invitation.invitation_url;

      toast({
        title: t("success"),
        description: "Invitation created successfully",
      });

      // Show the invitation link
      setInvitationLink(invitationURL);
      setInvitationEmail(memberEmail);
      setCopyButtonText("Copy");

      // Reset form
      setMemberEmail("");
      setMemberRole('viewer');

      // Refresh members list
      fetchMembers(selectedProjectId);
    } catch (error: unknown) {
      console.error("Failed to add member:", error);
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : "Failed to add member",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'member' | 'viewer') => {
    try {
      await apiRequest(`/api/v1/members/${userId}`, {
        method: "PUT",
        body: JSON.stringify({
          project_id: selectedProjectId,
          role: newRole,
        }),
      });

      toast({
        title: t("success"),
        description: "Member role updated successfully",
      });

      // Refresh members list
      fetchMembers(selectedProjectId);
    } catch (error: unknown) {
      console.error("Failed to update member role:", error);
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : "Failed to update member role",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await apiRequest(`/api/v1/members/${userId}`, {
        method: "DELETE",
        body: JSON.stringify({
          project_id: selectedProjectId,
        }),
      });

      toast({
        title: t("success"),
        description: "Member removed successfully",
      });

      // Refresh members list
      fetchMembers(selectedProjectId);
    } catch (error: unknown) {
      console.error("Failed to remove member:", error);
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'admin': return <Shield className="h-4 w-4 text-blue-500" />;
      case 'member': return <User className="h-4 w-4 text-green-500" />;
      case 'viewer': return <User className="h-4 w-4 text-gray-500" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner': return 'default';
      case 'admin': return 'secondary';
      case 'member': return 'outline';
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
              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No projects available. Create a project first to manage members.</p>
                </div>
              ) : (
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
              )}
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
                    <CardTitle className="text-sm font-medium">Admins</CardTitle>
                    <Shield className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {members.filter(m => m.role === 'admin').length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Members</CardTitle>
                    <User className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {members.filter(m => m.role === 'member').length}
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
                              {new Date(member.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {member.role !== 'owner' && (
                                <div className="flex items-center gap-2">
                                  <Select
                                    value={member.role}
                                    onValueChange={(value: 'admin' | 'member' | 'viewer') => handleRoleChange(member.user_id, value)}
                                  >
                                    <SelectTrigger className="w-[100px] h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="admin">Admin</SelectItem>
                                      <SelectItem value="member">Member</SelectItem>
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
            <SheetDescription className="text-primary-foreground/80">
              Add a new team member to your project by sending them an invitation link.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            {invitationLink ? (
              // Show invitation link
              <>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Invitation Created!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    An invitation has been created for <strong>{invitationEmail}</strong>
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <Label className="text-sm font-medium">Invitation Link</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value={invitationLink}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      disabled={!invitationLink}
                      onClick={async () => {
                        if (!invitationLink) {
                          toast({
                            title: "No link to copy",
                            description: "Please create an invitation first",
                            variant: "destructive",
                          });
                          return;
                        }

                        try {
                          await copyTextToClipboard(invitationLink);
                          setCopyButtonText("Copied!");
                          toast({
                            title: "Copied!",
                            description: "Invitation link copied to clipboard",
                          });
                          
                          // Reset button text after 2 seconds
                          setTimeout(() => setCopyButtonText("Copy"), 2000);
                        } catch (error) {
                          if (import.meta.env.DEV) {
                            console.warn("Copy to clipboard failed", error);
                          }
                          toast({
                            title: "Copy failed",
                            description: "Please select and copy the link manually",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      {copyButtonText === "Copied!" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span className="ml-1">{copyButtonText}</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Share this link with the user. It will expire in 7 days.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setInvitationLink("");
                      setInvitationEmail("");
                      resetForm();
                    }}
                  >
                    Invite Another
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setAddPanelOpen(false);
                      setInvitationLink("");
                      setInvitationEmail("");
                      resetForm();
                    }}
                  >
                    Done
                  </Button>
                </div>
              </>
            ) : (
              // Show invitation form
              <>
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
                  <Select value={memberRole} onValueChange={(value: 'admin' | 'member' | 'viewer') => setMemberRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                      <SelectItem value="member">Member - Can view and edit</SelectItem>
                      <SelectItem value="admin">Admin - Full access except owner rights</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    An invitation link will be generated for this email address. They will be able to access the project: <strong>{selectedProject?.name}</strong>
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
                    {submitting ? "Creating..." : "Create Invitation"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </PanelLayout>
  );
};

export default Members;
