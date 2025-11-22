import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";

const PanelNotFound = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-6">
        <div className="relative">
          <AlertCircle className="w-24 h-24 mx-auto text-primary/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold text-primary">404</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {t("pageNotFound")}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t("pageNotFoundDesc")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => navigate("/home")}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            {t("backToHome")}
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
          >
            {t("goBack")}
          </Button>
        </div>

        <div className="pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {t("needHelp")}{" "}
            <a 
              href="mailto:support@paapeli.com" 
              className="text-primary hover:underline"
            >
              {t("contactSupport")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PanelNotFound;
