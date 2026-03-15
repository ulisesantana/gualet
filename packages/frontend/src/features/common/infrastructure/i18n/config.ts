import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en } from "./locales/en";
import { es } from "./locales/es";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      es,
    },
    lng: localStorage.getItem("language") || "en", // Default to English
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  })
  .catch((error) => {
    console.error("Error initializing i18n:", error);
  });

export default i18n;
