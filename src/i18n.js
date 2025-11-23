import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize i18next
i18n
  .use(LanguageDetector) // Language detector
  .use(initReactI18next) // Init with react-i18next
  .init({
    fallbackLng: 'en', // Default language if no translation is found
    interpolation: { escapeValue: false }, // Avoid XSS in translations
    resources: {}, // Initialize resources as an empty object
  });

// Dynamically load translation files
const loadResources = async () => {
  try {
    // Fetch English, Arabic, and Urdu translation files
    const en = await fetch('/locales/en/translation.json').then(res => res.json());
    const ar = await fetch('/locales/ar/translation.json').then(res => res.json());
    const ur = await fetch('/locales/ur/translation.json').then(res => res.json());

    // Add resources to i18n
    i18n.addResources('en', 'translation', en);
    i18n.addResources('ar', 'translation', ar);
    i18n.addResources('ur', 'translation', ur);

    console.log("Translation resources loaded successfully");
  } catch (error) {
    console.error("Error loading translation resources", error);
  }
};

loadResources(); // Load the translation files

export default i18n;
