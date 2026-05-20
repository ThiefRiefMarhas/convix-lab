import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Locale } from '../i18n/ui';
import { t, type UIStrings } from '../i18n/ui';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  strings: UIStrings;
  indonesiaFocus: boolean;
  setIndonesiaFocus: (focus: boolean) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const STORAGE_KEY = 'convix-locale';
const FOCUS_STORAGE_KEY = 'convix-indonesia-focus';

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored === 'id' || stored === 'en') return stored;
      return 'id';
    }
    return 'id';
  });

  const [indonesiaFocus, setIndonesiaFocusState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(FOCUS_STORAGE_KEY);
      return stored === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale === 'id' ? 'id' : 'en';
  }, [locale]);

  useEffect(() => {
    localStorage.setItem(FOCUS_STORAGE_KEY, String(indonesiaFocus));
  }, [indonesiaFocus]);

  const setLocale = (next: Locale) => setLocaleState(next);
  const setIndonesiaFocus = (next: boolean) => setIndonesiaFocusState(next);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, strings: t(locale), indonesiaFocus, setIndonesiaFocus }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
