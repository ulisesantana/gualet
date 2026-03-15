import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Hook to initialize i18n with user's language preference
 * This should be called once at the app level
 */
export function useInitializeI18n(language?: string) {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
      localStorage.setItem("language", language);
    }
  }, [language, i18n]);
}
