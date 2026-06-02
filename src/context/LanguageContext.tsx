import * as React from 'react';
import { createContext, useState, useContext, useEffect } from 'react';

type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('site_lang');
    return (saved === 'vi' || saved === 'en') ? saved : 'vi';
  });

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === 'vi' ? 'en' : 'vi';
      localStorage.setItem('site_lang', next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage phải được đặt trong LanguageProvider');
  return context;
};