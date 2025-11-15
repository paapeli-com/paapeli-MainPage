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
  
  const getInitialLanguage = (): Language => {
    if (params.lang && ['en', 'ar', 'fa'].includes(params.lang)) {
      return params.lang as Language;
    }
    return (localStorage.getItem('lang') as Language) || 'en';
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
