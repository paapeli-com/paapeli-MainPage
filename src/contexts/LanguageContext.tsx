import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { translations, Language, TranslationKey } from '@/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const params = useParams<{ lang?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine initial language from URL or localStorage
  const getInitialLanguage = (): Language => {
    // Check URL path for language prefix: /en, /ar, /fa
    const match = location.pathname.match(/^\/(en|ar|fa)(\/|$)/);
    if (match && ['en', 'ar', 'fa'].includes(match[1])) {
      return match[1] as Language;
    }

    // Fallback to saved language in localStorage
    const savedLang = localStorage.getItem('lang') as Language;
    if (savedLang && ['en', 'ar', 'fa'].includes(savedLang)) {
      return savedLang;
    }

    // Default to English
    return 'en';
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage());
  const isRTL = language === 'ar' || language === 'fa';

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lang', lang);
    
    // Update URL with language prefix
    const currentPath = location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(en|ar|fa)/, '');
    const newPath = lang === 'en' ? (pathWithoutLang || '/') : `/${lang}${pathWithoutLang || ''}`;
    navigate(newPath, { replace: true });
  };

  // Sync language from URL path when navigating directly
  useEffect(() => {
    const match = location.pathname.match(/^\/(en|ar|fa)(\/|$)/);
    const urlLang = (match?.[1] as Language) || undefined;

    if (urlLang && ['en', 'ar', 'fa'].includes(urlLang)) {
      // URL has a valid language prefix - keep context in sync
      setLanguageState(urlLang);
      localStorage.setItem('lang', urlLang);
    }
    // If there is no language prefix in the URL, we keep current language
    // so that selecting a language via the switcher is not immediately overwritten.
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.body.classList.toggle('rtl', isRTL);
    localStorage.setItem('lang', language);
  }, [language, isRTL]);

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};  
