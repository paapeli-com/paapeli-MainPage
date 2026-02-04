import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, Plus } from "lucide-react";
import { WidgetType } from "./WidgetPicker";

interface WidgetSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widget: WidgetType | null;
  onBack: () => void;
  onSave: () => void;
}

export const WidgetSettings = ({ open, onOpenChange, widget, onBack, onSave }: WidgetSettingsProps) => {
  const { isRTL } = useLanguage();

  if (!widget) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side={isRTL ? "left" : "right"} 
        className="w-[400px] sm:max-w-[400px] p-0 overflow-hidden"
      >
        <div className="bg-primary text-primary-foreground p-6 text-center">
          <SheetTitle className="text-2xl font-normal text-primary-foreground">
            {widget.name}
          </SheetTitle>
        </div>

        <div className="px-4 py-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="w-full justify-center bg-transparent border-b rounded-none h-auto p-0">
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-8 py-3 text-base font-medium"
            >
              SETTINGS
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-8 py-3 text-base font-medium text-muted-foreground"
            >
              APPEARANCE
            </TabsTrigger>
          </TabsList>

          <div className="p-6 h-[calc(100vh-320px)] overflow-y-auto">
            <TabsContent value="settings" className="mt-0">
              <div className="flex justify-center py-8">
                <Button variant="ghost" className="text-muted-foreground border-2 border-dashed border-gray-300 px-8">
                  <Plus className="h-4 w-4 mr-2" />
                  ADD VARIABLES
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="mt-0">
              <div className="text-center text-muted-foreground py-8">
                Configure appearance settings for {widget.name}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            CANCEL
          </Button>
          <Button onClick={onSave} className="bg-primary hover:bg-primary/90">
            SAVE
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
