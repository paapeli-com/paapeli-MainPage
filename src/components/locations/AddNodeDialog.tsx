import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Factory, Cpu } from "lucide-react";

type NodeType = "location" | "area" | "asset";

interface AddNodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentType?: "organization" | "location" | "area" | "asset" | null;
  onAdd: (name: string, type: NodeType) => void;
}

export const AddNodeDialog = ({ open, onOpenChange, parentType, onAdd }: AddNodeDialogProps) => {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [type, setType] = useState<NodeType | "">("");

  // Determine allowed types based on parent
  const allowedTypes: { value: NodeType; label: string; icon: React.ReactNode }[] = [];
  if (!parentType || parentType === "organization") {
    allowedTypes.push({ value: "location", label: t("locationLabel"), icon: <MapPin className="h-4 w-4" /> });
  }
  if (!parentType || parentType === "organization" || parentType === "location") {
    allowedTypes.push({ value: "area", label: t("areaUnit"), icon: <Factory className="h-4 w-4" /> });
  }
  if (!parentType || parentType === "location" || parentType === "area") {
    allowedTypes.push({ value: "asset", label: t("assets"), icon: <Cpu className="h-4 w-4" /> });
  }

  const handleAdd = () => {
    if (name.trim() && type) {
      onAdd(name.trim(), type as NodeType);
      setName("");
      setType("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("addNew")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>{t("selectNodeType")}</Label>
            <Select value={type} onValueChange={(v) => setType(v as NodeType)}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectNodeType")} />
              </SelectTrigger>
              <SelectContent>
                {allowedTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <div className="flex items-center gap-2">
                      {t.icon}
                      {t.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("name")}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("enterNodeName")}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleAdd} disabled={!name.trim() || !type}>
            {t("create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
