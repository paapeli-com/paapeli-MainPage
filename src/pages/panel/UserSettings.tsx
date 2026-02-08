import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { User, Mail, Shield, Globe, Clock, Key, Info } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const UserSettings = () => {
  const { t, isRTL } = useLanguage();
  const { user, session } = useAuth();

  return (
    <PanelLayout pageTitle={t("userSettings")}>
      <div className="max-w-3xl space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              {t("profile")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                {t("email")}
              </Label>
              <Input
                id="email"
                type="email"
                value={user?.getUsername() || ''}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Language & Timezone */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4" />
              {t("languageAndRegion")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t("language")}</Label>
              <LanguageSwitcher />
            </div>
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                {t("timezone")}
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" disabled>
                    UTC+0
                    <Info className="h-3 w-3 ms-1" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("settingsComingSoon")}</TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              {t("securitySettings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("twoFactorAuth")}</p>
                <p className="text-xs text-muted-foreground">{t("twoFactorAuthDesc")}</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" disabled>
                    {t("enable")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("settingsComingSoon")}</TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* API Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Key className="h-4 w-4" />
              {t("apiAccess")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("apiKey")}</p>
                <p className="text-xs text-muted-foreground">{t("apiAccessDesc")}</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" disabled>
                    {t("generate")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("settingsComingSoon")}</TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  );
};

export default UserSettings;
