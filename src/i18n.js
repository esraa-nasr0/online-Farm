import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    resources: {},
    });

// Load translation files dynamically from 'public'
const loadResources = async () => {
    const en = await fetch('/locales/en/translation.json').then(res => res.json());
    const ar = await fetch('/locales/ar/translation.json').then(res => res.json());

    i18n.addResources('en', 'translation', en);
    i18n.addResources('ar', 'translation', ar);
};

loadResources();

export default i18n;
