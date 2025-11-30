import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  const langPrefix = language === 'en' ? '' : `/${language}`;

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
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Products Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="group inline-flex h-10 items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none">
                    {t('products')}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={isRTL ? 'end' : 'start'}
                  className="w-96 bg-popover border border-border/60 shadow-xl"
                >
                  <ul className="grid gap-3 p-2">
                    <li>
                      <button
                        onClick={() => navigate(`${langPrefix}/aiot-platform`)}
                        className="w-full text-left select-none space-y-1 rounded-md px-3 py-2 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          {t('aiotPlatform')}
                        </div>
                        <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                          {t('aiotPlatformNavDesc')}
                        </p>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => navigate(`${langPrefix}/ddos-protection`)}
                        className="w-full text-left select-none space-y-1 rounded-md px-3 py-2 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          {t('ddosProtection')}
                        </div>
                        <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                          {t('ddosProtectionNavDesc')}
                        </p>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => navigate(`${langPrefix}/edge-computing`)}
                        className="w-full text-left select-none space-y-1 rounded-md px-3 py-2 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          {t('edgeComputing')}
                        </div>
                        <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                          {t('edgeComputingNavDesc')}
                        </p>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => navigate(`${langPrefix}/intelligence-insight`)}
                        className="w-full text-left select-none space-y-1 rounded-md px-3 py-2 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          {t('intelligenceInsight')}
                        </div>
                        <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                          {t('intelligenceInsightNavDesc')}
                        </p>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => navigate(`${langPrefix}/ota`)}
                        className="w-full text-left select-none space-y-1 rounded-md px-3 py-2 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          {t('ota')}
                        </div>
                        <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                          {t('otaNavDesc')}
                        </p>
                      </button>
                    </li>
                  </ul>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Use Cases Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="group inline-flex h-10 items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none">
                    {t('useCases')}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={isRTL ? 'end' : 'start'}
                  className="w-80 bg-popover border border-border/60 shadow-xl"
                >
                  <div className="py-2">
                    <button
                      onClick={() => navigate(`${langPrefix}/makers-developers`)}
                      className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                      {t('makersDevelopers')}
                    </button>
                    <button
                      onClick={() => navigate(`${langPrefix}/oil-gas`)}
                      className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                      {t('oilGas')}
                    </button>
                    <button
                      onClick={() => navigate(`${langPrefix}/smart-cities`)}
                      className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                      {t('smartCities')}
                    </button>
                    <button
                      onClick={() => navigate(`${langPrefix}/smart-agriculture`)}
                      className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                      {t('smartAgriculture')}
                    </button>
                    <button
                      onClick={() => navigate(`${langPrefix}/smart-buildings`)}
                      className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                      {t('smartBuildings')}
                    </button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Docs Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="group inline-flex h-10 items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none">
                    {t('docs')}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={isRTL ? 'end' : 'start'}
                  className="w-64 bg-popover border border-border/60 shadow-xl"
                >
                  <div className="py-2">
                    <a
                      href="https://docs.paapeli.com/"
                      className="block px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                      {t('features')}
                    </a>
                    <a
                      href="https://docs.paapeli.com/"
                      className="block px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                      {t('apis')}
                    </a>
                    <a
                      href="https://docs.paapeli.com/"
                      className="block px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                      {t('sdks')}
                    </a>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Pricing & Blog Links */}
              <button
                onClick={() => navigate(`${langPrefix}/pricing`)}
                className="inline-flex h-10 items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none"
              >
                {t('pricing')}
              </button>
              <a
                href={getBlogUrl()}
                className="inline-flex h-10 items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none"
              >
                {t('blog')}
              </a>
            </div>
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
