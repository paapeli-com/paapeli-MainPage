import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/i18n/translations";
import { useLocation } from "react-router-dom";

const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'ar' as Language, name: 'Arabic', nativeName: 'العربية' },
  { code: 'fa' as Language, name: 'Persian', nativeName: 'فارسی' },
];

export const LanguageSwitcher = () => {
  const { language, isRTL } = useLanguage();
  const location = useLocation();
  
  // Get path without language prefix for constructing new URLs
  const getPathForLanguage = (lang: Language) => {
    const pathWithoutLang = location.pathname.replace(/^\/(en|ar|fa)/, '');
    return lang === 'en' ? (pathWithoutLang || '/') : `/${lang}${pathWithoutLang || ''}`;
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={(e) => {
        const menu = e.currentTarget.querySelector('[data-lang-menu]') as HTMLElement;
        if (menu) {
          clearTimeout((menu as any).hideTimeout);
          menu.classList.remove('hidden');
        }
      }}
      onMouseLeave={(e) => {
        const menu = e.currentTarget.querySelector('[data-lang-menu]') as HTMLElement;
        if (menu) {
          (menu as any).hideTimeout = setTimeout(() => {
            menu.classList.add('hidden');
          }, 200);
        }
      }}
    >
      <Button variant="outline" size="sm" className="gap-2 border-white/20 bg-white/10 backdrop-blur-sm text-black hover:bg-white/20 hover:text-[#FF7A00]">
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">
          {languages.find(l => l.code === language)?.nativeName}
        </span>
      </Button>
      <div 
        data-lang-menu
        className={`hidden absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 w-40 bg-card border border-border rounded-md shadow-lg z-50`}
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
          {languages.map((lang) => (
            <a
              key={lang.code}
              href={getPathForLanguage(lang.code)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-accent cursor-pointer ${
                language === lang.code ? 'bg-primary/10 text-primary font-medium' : ''
              }`}
              hrefLang={lang.code}
            >
              {lang.nativeName}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
