import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Mock i18n configuration for tests - returns translation keys as-is
i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {},
    returnEmptyString: false,
    saveMissing: false,
  });

// Override the t function to return keys directly
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(i18n.t as any) = (key: string | string[]) => {
  if (typeof key === 'string') {
    return key;
  }
  if (Array.isArray(key)) {
    return key[0];
  }
  return key;
};

export default i18n;
