import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  LayoutDashboard,
  Smartphone,
  Users,
  Radio,
  Bell,
  FileCode,
  Download,
  UserCog,
  Code,
  Plus,
  Menu,
  X,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import paapeliLogo from "@/assets/paapeli-logo.svg";

interface MenuItem {
  title: string;
  subtitle?: string;
  icon: any;
  path?: string;
  children?: { title: string; path: string }[];
}

interface PanelLayoutProps {
  children: ReactNode;
  pageTitle?: string;
  onAddClick?: () => void;
}

export const PanelLayout = ({ children, pageTitle, onAddClick }: PanelLayoutProps) => {
  const { t, isRTL } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [devicesOpen, setDevicesOpen] = useState(true);

  const menuItems = [
    { title: t("home"), icon: Home, path: "/panel/home" },
    { title: t("dashboard"), icon: LayoutDashboard, path: "/panel/dashboard" },
    {
      title: t("devices"),
      icon: Smartphone,
      children: [
        { title: t("devices"), path: "/panel/devices" },
        { title: t("group"), path: "/panel/devices/group" },
        { title: t("gateways"), path: "/panel/devices/gateways" },
      ],
    },
    { title: t("alarms"), icon: Bell, path: "/panel/alarms" },
    { title: t("solutionTemplates"), icon: FileCode, path: "/panel/solution-templates" },
    { title: "OTA", subtitle: t("otaUpdate"), icon: Download, path: "/panel/ota" },
    { title: t("members"), icon: UserCog, path: "/panel/members" },
    { title: t("devCenter"), icon: Code, path: "/panel/dev-center" },
  ];

  const handleLogout = async () => {
    await signOut(false);
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <img src={paapeliLogo} alt="Paapeli" className="h-8 w-auto" />
          <span className="text-xl font-bold text-primary">Paapeli</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.children ? (
                <Collapsible open={devicesOpen} onOpenChange={setDevicesOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${devicesOpen ? "rotate-180" : ""}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className={`mt-1 space-y-1 ${isRTL ? "mr-6" : "ml-6"}`}>
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex}>
                          <button
                            onClick={() => {
                              navigate(child.path);
                              setSidebarOpen(false);
                            }}
                            className={`w-full text-left p-2 rounded-lg transition-colors ${
                              isActive(child.path)
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent"
                            }`}
                          >
                            {child.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <button
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <div className="flex flex-col items-start">
                    <span>{item.title}</span>
                    {item.subtitle && <span className="text-xs opacity-70">({item.subtitle})</span>}
                  </div>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
              U
            </div>
            <span className="text-sm truncate">User</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => navigate("/account-settings")}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="flex-1" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 border-r border-border bg-card z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <h1 className="flex-1 text-xl font-semibold">{pageTitle || t("panel")}</h1>

          <LanguageSwitcher />

          {onAddClick && (
            <Button onClick={onAddClick} size="sm">
              <Plus className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
              {t("add")}
            </Button>
          )}
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};
