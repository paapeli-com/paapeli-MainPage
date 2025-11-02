import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/i18n/translations";

const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'ar' as Language, name: 'Arabic', nativeName: 'العربية' },
  { code: 'fa' as Language, name: 'Persian', nativeName: 'فارسی' },
];

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-white/20 bg-white/10 backdrop-blur-sm text-black hover:bg-white/20 hover:text-[#FF7A00]">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {languages.find(l => l.code === language)?.nativeName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer ${language === lang.code ? 'bg-primary/10 text-primary font-medium' : ''}`}
          >
            {lang.nativeName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};