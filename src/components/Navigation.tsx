import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Settings, LogOut } from "lucide-react";
import paapeliLogo from "@/assets/paapeli-logo.svg";

export const Navigation = () => {
  const { t, isRTL, language } = useLanguage();
  const { isAuthenticated, signOut, user } = useAuth();
  const navigate = useNavigate();
  const hostname = window.location.hostname;
  const isPanelDomain = hostname === 'panel.paapeli.com' || hostname.includes('panel-');
  const isMainDomain = hostname === 'paapeli.com' || hostname === 'www.paapeli.com' || hostname === 'localhost';

  const getBlogUrl = () => {
    return language === 'en' 
      ? 'https://docs.paapeli.com/blog/'
      : `https://docs.paapeli.com/${language}/blog/`;
  };

  const handleLogin = () => {
    // On main domain, redirect to panel login page
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
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
              <NavigationMenuList className={isRTL ? 'flex-row-reverse' : ''}>
                {/* Products Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-accent !text-base">
                    {t('products')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 bg-popover">
                      <li>
                        <a
                          href="/aiot-platform"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="!text-sm font-medium leading-none">
                            {t('aiotPlatform')}
                          </div>
                          <p className="line-clamp-2 !text-[11px] leading-snug text-muted-foreground">
                            {t('aiotPlatformNavDesc')}
                          </p>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/ddos-protection"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="!text-sm font-medium leading-none">
                            {t('ddosProtection')}
                          </div>
                          <p className="line-clamp-2 !text-[11px] leading-snug text-muted-foreground">
                            {t('ddosProtectionNavDesc')}
                          </p>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/edge-computing"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="!text-sm font-medium leading-none">
                            {t('edgeComputing')}
                          </div>
                          <p className="line-clamp-2 !text-[11px] leading-snug text-muted-foreground">
                            {t('edgeComputingNavDesc')}
                          </p>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/intelligence-insight"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="!text-sm font-medium leading-none">
                            {t('intelligenceInsight')}
                          </div>
                          <p className="line-clamp-2 !text-[11px] leading-snug text-muted-foreground">
                            {t('intelligenceInsightNavDesc')}
                          </p>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/ota"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="!text-sm font-medium leading-none">
                            {t('ota')}
                          </div>
                          <p className="line-clamp-2 !text-[11px] leading-snug text-muted-foreground">
                            {t('otaNavDesc')}
                          </p>
                        </a>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Use Cases Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-accent !text-base">
                    {t('useCases')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 bg-popover">
                      <li>
                        <a
                          href="/makers-developers"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="!text-sm font-medium leading-none">
                            {t('makersDevelopers')}
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/oil-gas"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="!text-sm font-medium leading-none">
                            {t('oilGas')}
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/smart-cities"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="!text-sm font-medium leading-none">
                            {t('smartCities')}
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/smart-agriculture"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="!text-sm font-medium leading-none">
                            {t('smartAgriculture')}
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/smart-buildings"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="!text-sm font-medium leading-none">
                            {t('smartBuildings')}
                          </div>
                        </a>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Docs Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-accent !text-base">
                    {t('docs')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-3 p-4 bg-popover">
                      <li>
                        <a
                          href="https://docs.paapeli.com/"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="!text-sm font-medium leading-none">
                            {t('features')}
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://docs.paapeli.com/"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="!text-sm font-medium leading-none">
                            {t('apis')}
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://docs.paapeli.com/"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="!text-sm font-medium leading-none">
                            {t('sdks')}
                          </div>
                        </a>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Pricing */}
                <NavigationMenuItem>
                  <a
                    href="/pricing"
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 !text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    {t('pricing')}
                  </a>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <a
                    href={getBlogUrl()}
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 !text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
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
                {t('login')}
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
                      clearTimeout((menu as any).hideTimeout);
                      menu.classList.remove('hidden');
                    }
                  }}
                  onMouseLeave={(e) => {
                    const menu = e.currentTarget.querySelector('[data-menu]') as HTMLElement;
                    if (menu) {
                      (menu as any).hideTimeout = setTimeout(() => {
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
                    className="hidden absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-50"
                    onMouseEnter={(e) => {
                      const menu = e.currentTarget as HTMLElement;
                      clearTimeout((menu as any).hideTimeout);
                    }}
                    onMouseLeave={(e) => {
                      const menu = e.currentTarget as HTMLElement;
                      (menu as any).hideTimeout = setTimeout(() => {
                        menu.classList.add('hidden');
                      }, 200);
                    }}
                  >
                    <div className="py-1">
                      <button
                        onClick={handleAccountSettings}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center cursor-pointer"
                      >
                        <Settings className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t('accountSettings')}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center cursor-pointer text-destructive"
                      >
                        <LogOut className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t('logout')}
                      </button>
                    </div>
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
