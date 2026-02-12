import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Globe, Bell, Radio } from "lucide-react";
import type { NotificationChannelType } from "@/types/alerts";

interface CreateChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const channelIcons: Record<NotificationChannelType, any> = {
  email: Mail,
  sms: MessageSquare,
  whatsapp: MessageSquare,
  webhook: Globe,
  in_app: Bell,
  mqtt: Radio,
};

export const CreateChannelDialog = ({ open, onOpenChange }: CreateChannelDialogProps) => {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [channelType, setChannelType] = useState<NotificationChannelType>("email");
  const [config, setConfig] = useState<Record<string, string>>({});

  const channels: NotificationChannelType[] = ["email", "sms", "whatsapp", "webhook", "in_app", "mqtt"];
  const channelLabels: Record<NotificationChannelType, string> = {
    email: "Email",
    sms: "SMS",
    whatsapp: "WhatsApp",
    webhook: "Webhook",
    in_app: "In-App",
    mqtt: "MQTT",
  };

  const configFields: Record<NotificationChannelType, { field: string; placeholder: string; type: string }[]> = {
    email: [{ field: "to", placeholder: "ops@company.com", type: "email" }],
    sms: [{ field: "to", placeholder: "+989123456789", type: "tel" }],
    whatsapp: [{ field: "to", placeholder: "+989123456789", type: "tel" }],
    webhook: [{ field: "url", placeholder: "https://example.com/webhook", type: "url" }],
    in_app: [],
    mqtt: [{ field: "topic", placeholder: "alerts/channel", type: "text" }],
  };

  const handleConfigChange = (field: string, value: string) => {
    setConfig({ ...config, [field]: value });
  };

  const handleCreate = () => {
    console.log("Creating channel:", { name, channelType, config });
    onOpenChange(false);
    setName("");
    setChannelType("email");
    setConfig({});
  };

  const Icon = channelIcons[channelType];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("alertAddChannel")}</DialogTitle>
          <DialogDescription>
            Create a new notification channel for alert delivery
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Channel Name */}
          <div className="space-y-2">
            <Label>{t("name")}</Label>
            <Input
              placeholder={t("alertChannelType")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Channel Type */}
          <div className="space-y-2">
            <Label>{t("alertChannelType")}</Label>
            <Select value={channelType} onValueChange={(v) => { setChannelType(v as NotificationChannelType); setConfig({}); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {channels.map(ch => (
                  <SelectItem key={ch} value={ch}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {channelLabels[ch]}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Configuration Fields */}
          {configFields[channelType].length > 0 && (
            <div className="space-y-3 border-t pt-3">
              <p className="text-sm font-medium">{t("alertChannelConfig")}</p>
              {configFields[channelType].map(({ field, placeholder, type }) => (
                <div key={field} className="space-y-1">
                  <Label className="text-sm">{field.toUpperCase()}</Label>
                  <Input
                    type={type}
                    placeholder={placeholder}
                    value={config[field] || ""}
                    onChange={(e) => handleConfigChange(field, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Channel Info */}
          <div className="bg-muted/50 p-3 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <Badge variant="outline">{channelLabels[channelType]}</Badge>
            </div>
            {Object.entries(config).length > 0 && (
              <div className="text-xs space-y-1">
                {Object.entries(config).map(([k, v]) => (
                  <p key={k} className="text-muted-foreground">
                    <span className="font-mono">{k}:</span> {v}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleCreate} disabled={!name || (configFields[channelType].length > 0 && Object.values(config).some(v => !v))}>
            {t("create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
