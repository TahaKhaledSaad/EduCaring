import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Step 1: import LanguageDetector
import LanguageDetector from "i18next-browser-languagedetector";

// Step 2: import translations
import TranslationEn from "./locale/en.json";
import TranslationAr from "./locale/ar.json";

i18n
  .use(LanguageDetector) // Step 1
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        // Step 2
        translation: TranslationEn,
      },
      ar: {
        translation: TranslationAr,
      },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    react: {
      // Step 3
      useSuspense: false,
    },
  });

// Step 4: use the hook
export default i18n;
