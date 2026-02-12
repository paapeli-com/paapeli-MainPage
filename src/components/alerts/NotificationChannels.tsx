import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Mail, MessageSquare, Globe, Bell, Radio } from "lucide-react";
import { mockNotificationChannels } from "@/data/mockAlertData";
import type { NotificationChannelType } from "@/types/alerts";

const channelIcons: Record<NotificationChannelType, any> = {
  email: Mail,
  sms: MessageSquare,
  whatsapp: MessageSquare,
  webhook: Globe,
  in_app: Bell,
  mqtt: Radio,
};

export const NotificationChannels = () => {
  const { t } = useLanguage();
  const [channels, setChannels] = useState(mockNotificationChannels);

  const toggleChannel = (id: string) => {
    setChannels(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {channels.length} {t("alertChannelsCount")}
        </p>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" disabled>
              <Plus className="h-4 w-4 me-1" />
              {t("alertAddChannel")}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("settingsComingSoon")}</TooltipContent>
        </Tooltip>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("alertChannelType")}</TableHead>
              <TableHead className="hidden md:table-cell">{t("alertChannelConfig")}</TableHead>
              <TableHead>{t("enabled")}</TableHead>
              <TableHead className="w-[60px]">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {channels.map(channel => {
              const Icon = channelIcons[channel.type];
              return (
                <TableRow key={channel.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {channel.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{channel.type.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground font-mono">
                    {Object.entries(channel.config).map(([k, v]) => `${k}: ${v}`).join(', ') || '—'}
                  </TableCell>
                  <TableCell>
                    <Switch checked={channel.enabled} onCheckedChange={() => toggleChannel(channel.id)} />
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" disabled>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{t("settingsComingSoon")}</TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
