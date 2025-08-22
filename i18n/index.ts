import { en } from './en.js';
import { fa } from './fa.js';
import { Language } from '../types.js';
import get from 'lodash.get';


export const translations = {
  en,
  fa,
};

const getLang = (): Language => {
    try {
        const storedLang = localStorage.getItem('levelUpLanguage');
        if (storedLang === 'en' || storedLang === 'fa') {
            return storedLang;
        }
    } catch (e) {
        // Ignore localStorage errors
    }
    // Default to 'fa' as per the initial state
    return 'fa';
};

export const t_standalone = (key: string, params?: Record<string, string | number>): any => {
      const lang = getLang();
      const langTranslations = translations[lang];
      const value = get(langTranslations, key, key);

      if (typeof value === 'string') {
          let text = value;
          if (params) {
              Object.entries(params).forEach(([paramKey, paramValue]) => {
                  text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
              });
          }
          return text;
      }
      
      return value;
};
