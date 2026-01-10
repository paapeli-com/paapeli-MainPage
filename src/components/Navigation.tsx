import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Settings, LogOut } from "lucide-react";
import paapeliLogo from "@/assets/paapeli-logo.png";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const { t, isRTL, language } = useLanguage();
  const { isAuthenticated, signOut, user } = useAuth();
  const navigate = useNavigate();
  const hostname = window.location.hostname;
  const isPanelDomain = hostname === 'panel.paapeli.com' || hostname.includes('panel-');
  const isMainDomain = hostname === 'paapeli.com' || hostname === 'www.paapeli.com' || hostname === 'localhost';
  const langPrefix = language === 'en' ? '' : `/${language}`;

  const getBlogUrl = () => {
    return language === 'en' 
      ? 'https://docs.paapeli.com/blog/'
      : `https://docs.paapeli.com/${language}/blog/`;
  };

  const handleLogin = () => {
    if (isMainDomain && !isPanelDomain) {
      window.location.href = 'https://panel.paapeli.com/login';
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    signOut(true);
  };

  const handleAccountSettings = () => {
    navigate('/account-settings');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-[68px]">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img src={paapeliLogo} alt="Paapeli Logo" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-primary">Paapeli</span>
          </button>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <NavigationMenu>
              <NavigationMenuList className={`${isRTL ? 'flex-row-reverse' : ''}`}>
                {/* Products Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-base">
                    {t('products')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px]">
                      <li>
                        <NavigationMenuLink asChild>
                          <button
                            onClick={() => navigate(`${langPrefix}/aiot-platform`)}
                            className={cn(
                              "block w-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">
                              {t('aiotPlatform')}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                              {t('aiotPlatformNavDesc')}
                            </p>
                          </button>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <button
                            onClick={() => navigate(`${langPrefix}/ddos-protection`)}
                            className={cn(
                              "block w-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">
                              {t('ddosProtection')}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                              {t('ddosProtectionNavDesc')}
                            </p>
                          </button>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <button
                            onClick={() => navigate(`${langPrefix}/edge-computing`)}
                            className={cn(
                              "block w-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">
                              {t('edgeComputing')}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                              {t('edgeComputingNavDesc')}
                            </p>
                          </button>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <button
                            onClick={() => navigate(`${langPrefix}/intelligence-insight`)}
                            className={cn(
                              "block w-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">
                              {t('intelligenceInsight')}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                              {t('intelligenceInsightNavDesc')}
                            </p>
                          </button>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <button
                            onClick={() => navigate(`${langPrefix}/ota`)}
                            className={cn(
                              "block w-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">
                              {t('ota')}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                              {t('otaNavDesc')}
                            </p>
                          </button>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Use Cases Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-base">
                    {t('useCases')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-2 p-4 w-[280px]">
                      <li>
                        <NavigationMenuLink asChild>
                          <button
                            onClick={() => navigate(`${langPrefix}/makers-developers`)}
                            className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            {t('makersDevelopers')}
                          </button>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <button
                            onClick={() => navigate(`${langPrefix}/oil-gas`)}
                            className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            {t('oilGas')}
                          </button>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <button
                            onClick={() => navigate(`${langPrefix}/smart-cities`)}
                            className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            {t('smartCities')}
                          </button>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <button
                            onClick={() => navigate(`${langPrefix}/smart-agriculture`)}
                            className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            {t('smartAgriculture')}
                          </button>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <button
                            onClick={() => navigate(`${langPrefix}/smart-buildings`)}
                            className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            {t('smartBuildings')}
                          </button>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Docs Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-base">
                    {t('docs')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-2 p-4 w-[220px]">
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            href="https://docs.paapeli.com/"
                            className="block px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            {t('features')}
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            href="https://docs.paapeli.com/"
                            className="block px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            {t('apis')}
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            href="https://docs.paapeli.com/"
                            className="block px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            {t('sdks')}
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Pricing Link */}
                <NavigationMenuItem>
                  <button
                    onClick={() => navigate(`${langPrefix}/pricing`)}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none"
                  >
                    {t('pricing')}
                  </button>
                </NavigationMenuItem>

                {/* Blog Link */}
                <NavigationMenuItem>
                  <a
                    href={getBlogUrl()}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none"
                  >
                    {t('blog')}
                  </a>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side - Language Switcher and Auth */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {/* On main domain, always show Dashboard button */}
            {isMainDomain && !isPanelDomain ? (
              <Button onClick={handleLogin} variant="default" size="sm">
                {t('dashboard')}
              </Button>
            ) : (
              /* On panel domain, show Dashboard button or account menu */
              !isAuthenticated ? (
                <Button onClick={handleLogin} variant="default" size="sm">
                  {t('login')}
                </Button>
              ) : (
                <div 
                  className="relative group"
                  onMouseEnter={(e) => {
                    const menu = e.currentTarget.querySelector('[data-menu]') as HTMLElement;
                    if (menu) {
                      clearTimeout((menu as HTMLElement & { hideTimeout?: NodeJS.Timeout }).hideTimeout);
                      menu.classList.remove('hidden');
                    }
                  }}
                  onMouseLeave={(e) => {
                    const menu = e.currentTarget.querySelector('[data-menu]') as HTMLElement;
                    if (menu) {
                      (menu as HTMLElement & { hideTimeout?: NodeJS.Timeout }).hideTimeout = setTimeout(() => {
                        menu.classList.add('hidden');
                      }, 200);
                    }
                  }}
                >
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('account')}</span>
                  </Button>
                  <div 
                    data-menu
                    className="absolute right-0 top-full mt-2 w-48 rounded-md border border-border bg-popover py-1 shadow-lg hidden z-50"
                  >
                    {user?.email && (
                      <div className="px-3 py-2 border-b border-border">
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    )}
                    <button
                      onClick={handleAccountSettings}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      <Settings className="h-4 w-4" />
                      {t('accountSettings')}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('logout')}
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
