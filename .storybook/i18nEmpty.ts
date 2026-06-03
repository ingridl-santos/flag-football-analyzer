import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const i18nEmpty = i18n.createInstance();
i18nEmpty.use(initReactI18next).init({
  lng: 'en-US',
  resources: {},
  parseMissingKeyHandler: (_key: string, defaultValue: string | undefined) => defaultValue,
});

export default i18nEmpty;
