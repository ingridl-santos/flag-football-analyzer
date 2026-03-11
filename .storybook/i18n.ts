import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { initOptions } from '../src/i18nOptions';

i18n
  .use(initReactI18next)
  .use(Backend)
  .init(initOptions);

export default i18n;
