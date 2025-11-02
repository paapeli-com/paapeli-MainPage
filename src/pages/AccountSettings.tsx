import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Shield } from "lucide-react";

const AccountSettings = () => {
  const { t, isRTL } = useLanguage();
  const { user, session } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
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
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.getUsername() || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Your email address is used for authentication
                </p>
              </div>

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
      </main>
    </div>
  );
};

export default AccountSettings;
