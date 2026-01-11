import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { PanelLayout } from "@/layouts/PanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Shield, Key, Eye, EyeOff, CheckCircle, AlertCircle, Bell, Trash2, Clock } from "lucide-react";
import { projectAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const AccountSettings = () => {
  const { t, isRTL } = useLanguage();
  const { user, session, updateCurrentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Email update state
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  // Profile update state
  const [newName, setNewName] = useState(user?.name || '');
  const [newPhone, setNewPhone] = useState(user?.phone || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notifications_enabled ?? true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password update state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // API Key generation state
  const [isGeneratingAPIKey, setIsGeneratingAPIKey] = useState(false);
  const [generatedAPIKey, setGeneratedAPIKey] = useState<string | null>(null);
  const [apiKeyName, setApiKeyName] = useState('Personal API Key');
  const [showAPIKeyDialog, setShowAPIKeyDialog] = useState(false);

  // API Key listing state
  interface APIKey {
    id: string;
    name: string;
    key_prefix: string;
    created_at: string;
  }
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [isLoadingAPIKeys, setIsLoadingAPIKeys] = useState(false);
  const [isRevokingAPIKey, setIsRevokingAPIKey] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleUpdateEmail = async () => {
    if (!newEmail || newEmail === user?.email) {
      toast({
        title: "No changes",
        description: "Please enter a different email address.",
        variant: "default",
      });
      return;
    }

    setIsUpdatingEmail(true);
    try {
      await updateCurrentUser({ email: newEmail });
      toast({
        title: "Email updated",
        description: "Your email address has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update email address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      toast({
        title: "Invalid password",
        description: "Please ensure passwords match and are not empty.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await updateCurrentUser({ password: newPassword });
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!newName.trim()) {
      toast({
        title: "Invalid name",
        description: "Please enter a valid name.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingProfile(true);
    try {
      await updateCurrentUser({
        username: newName,
        phone: newPhone,
        notifications_enabled: notificationsEnabled
      });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleGenerateAPIKey = async () => {
    setIsGeneratingAPIKey(true);
    try {
      console.log('Starting API key generation...');

      // Get user's projects
      console.log('Fetching user projects...');
      const projectsResponse = await projectAPI.getProjects();
      console.log('Projects response:', projectsResponse);
      const projectsData = projectsResponse?.data || [];
      console.log('Projects data:', projectsData);
      let projectId: string;

      if (projectsData && projectsData.length > 0) {
        // Use the first project
        projectId = projectsData[0].id;
        console.log('Using existing project:', projectId);
      } else {
        // Create a personal project
        console.log('Creating new project...');
        const projectResponse = await projectAPI.createProject({
          name: `${user?.email}'s Personal Project`,
          description: 'Personal project for API key generation'
        });
        console.log('Project creation response:', projectResponse);
        projectId = projectResponse.id;
        console.log('Created project:', projectId);
      }

      // Generate API key
      console.log('Creating API key for project:', projectId);
      const apiKeyResponse = await projectAPI.createProjectAPIKey(projectId, {
        name: apiKeyName || 'Personal API Key'
      });
      console.log('API key response:', apiKeyResponse);

      // Check different possible response structures
      let secret = null;
      if (apiKeyResponse?.data?.secret) {
        secret = apiKeyResponse.data.secret;
      } else if (apiKeyResponse?.secret) {
        secret = apiKeyResponse.secret;
      } else if (apiKeyResponse?.api_key_secret) {
        secret = apiKeyResponse.api_key_secret;
      }

      console.log('Extracted secret:', secret);

      if (!secret) {
        throw new Error('No API key secret found in response');
      }

      setGeneratedAPIKey(secret);
      setShowAPIKeyDialog(true);

      toast({
        title: "API Key generated",
        description: "Your API key has been generated successfully.",
      });
    } catch (error) {
      console.error('API key generation error:', error);
      toast({
        title: "Generation failed",
        description: `Failed to generate API key: ${error.message || 'Please try again.'}`,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAPIKey(false);
    }
  };

  const fetchAPIKeys = async () => {
    setIsLoadingAPIKeys(true);
    try {
      // Get user's projects
      const projectsResponse = await projectAPI.getProjects();
      const projectsData = projectsResponse?.data || [];

      if (projectsData && projectsData.length > 0) {
        // Get API keys for the first project
        const projectId = projectsData[0].id;
        const apiKeysResponse = await projectAPI.getProjectAPIKeys(projectId);
        setApiKeys(apiKeysResponse?.data || []);
      } else {
        setApiKeys([]);
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      setApiKeys([]);
    } finally {
      setIsLoadingAPIKeys(false);
    }
  };

  const handleRevokeAPIKey = async (apiKeyId: string) => {
    setIsRevokingAPIKey(apiKeyId);
    try {
      await projectAPI.deleteAPIKey(apiKeyId);
      setApiKeys(prev => prev.filter(key => key.id !== apiKeyId));
      toast({
        title: "API Key revoked",
        description: "The API key has been successfully revoked.",
      });
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      toast({
        title: "Revocation failed",
        description: "Failed to revoke the API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRevokingAPIKey(null);
    }
  };

  // Fetch API keys when component mounts
  useEffect(() => {
    if (user) {
      fetchAPIKeys();
    }
  }, [user]);

  // Refresh API keys after generating a new one
  useEffect(() => {
    if (!showAPIKeyDialog && generatedAPIKey === null) {
      fetchAPIKeys();
    }
  }, [showAPIKeyDialog, generatedAPIKey]);

  return (
    <PanelLayout pageTitle={t("accountSettings")}>
      <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t('accountSettings')}
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                View and manage your profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Update Section */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                  <Button
                    onClick={handleUpdateEmail}
                    disabled={isUpdatingEmail || newEmail === user?.email}
                    size="sm"
                  >
                    {isUpdatingEmail ? "Updating..." : "Update"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your email address is used for authentication
                </p>
              </div>

              {/* Name Update Section */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter your full name"
                />
                <p className="text-xs text-muted-foreground">
                  Your display name across the platform
                </p>
              </div>

              {/* Phone Update Section */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  📱
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Used for account verification and notifications
                </p>
              </div>

              {/* Notification Settings */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                  <Label htmlFor="notifications" className="text-sm">
                    Enable notifications
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Receive email notifications about important updates and alerts
                </p>
              </div>

              <Button
                onClick={handleUpdateProfile}
                disabled={isUpdatingProfile || !newName.trim()}
                className="w-full"
              >
                {isUpdatingProfile ? "Updating Profile..." : "Update Profile"}
              </Button>

              {/* Password Update Section */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Change Password
                </Label>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleUpdatePassword}
                  disabled={isUpdatingPassword || !newPassword || newPassword !== confirmPassword}
                  className="w-full"
                >
                  {isUpdatingPassword ? "Updating Password..." : "Update Password"}
                </Button>

                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Passwords do not match
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Account Status */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Account Status
                </Label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium text-foreground">
                    Active Account
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your account is verified and active
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Key Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>
                Generate API keys for programmatic access to your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key-name">API Key Name</Label>
                <Input
                  id="api-key-name"
                  value={apiKeyName}
                  onChange={(e) => setApiKeyName(e.target.value)}
                  placeholder="Enter API key name"
                />
              </div>

              <Button
                onClick={handleGenerateAPIKey}
                disabled={isGeneratingAPIKey || !apiKeyName.trim()}
                className="w-full"
              >
                {isGeneratingAPIKey ? "Generating..." : "Generate API Key"}
              </Button>

              <p className="text-xs text-muted-foreground">
                API keys are used for machine-to-machine communication and IoT device authentication.
                Store your API key securely as it will only be shown once.
              </p>

              {/* API Key List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Your API Keys</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchAPIKeys}
                    disabled={isLoadingAPIKeys}
                  >
                    {isLoadingAPIKeys ? "Loading..." : "Refresh"}
                  </Button>
                </div>

                {apiKeys.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Key className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No API keys found</p>
                    <p className="text-xs">Generate your first API key above</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Key className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{apiKey.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="font-mono">{apiKey.key_prefix}••••</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(apiKey.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRevokeAPIKey(apiKey.id)}
                          disabled={isRevokingAPIKey === apiKey.id}
                        >
                          {isRevokingAPIKey === apiKey.id ? (
                            "Revoking..."
                          ) : (
                            <>
                              <Trash2 className="h-3 w-3 mr-1" />
                              Revoke
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* API Key Dialog */}
          <Dialog open={showAPIKeyDialog} onOpenChange={setShowAPIKeyDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  API Key Generated
                </DialogTitle>
                <DialogDescription>
                  Your API key has been generated successfully. Copy it now and store it securely.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="p-3 bg-muted rounded-md font-mono text-sm break-all">
                    {generatedAPIKey}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(generatedAPIKey || '');
                        toast({
                          title: "Copied",
                          description: "API key copied to clipboard.",
                        });
                      } else {
                        // Fallback for browsers that don't support Clipboard API
                        const textArea = document.createElement('textarea');
                        textArea.value = generatedAPIKey || '';
                        document.body.appendChild(textArea);
                        textArea.select();
                        try {
                          document.execCommand('copy');
                          toast({
                            title: "Copied",
                            description: "API key copied to clipboard.",
                          });
                        } catch (err) {
                          toast({
                            title: "Copy failed",
                            description: "Please manually copy the API key from the field above.",
                            variant: "destructive",
                          });
                        }
                        document.body.removeChild(textArea);
                      }
                    }}
                    className="flex-1"
                  >
                    Copy Key
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAPIKeyDialog(false);
                      setGeneratedAPIKey(null);
                      setApiKeyName('Personal API Key');
                    }}
                    className="flex-1"
                  >
                    Done
                  </Button>
                </div>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This key will not be shown again. Make sure to copy and store it securely.
                  </AlertDescription>
                </Alert>
              </div>
            </DialogContent>
          </Dialog>

          <Card>
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
              <CardDescription>
                Current session details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <p className="text-sm text-foreground font-mono break-all">
                    {session?.getIdToken().payload.sub || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Token Expires</p>
                  <p className="text-sm text-foreground">
                    {session?.getIdToken().getExpiration() 
                      ? new Date(session.getIdToken().getExpiration() * 1000).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible account actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" disabled>
                Delete Account
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Account deletion is currently disabled. Contact support for assistance.
              </p>
            </CardContent>
          </Card>
        </div>
    </PanelLayout>
  );
};

export default AccountSettings;
