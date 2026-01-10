import { useTranslation } from "react-i18next";
import { Button } from "@heroui/react";
import { Globe } from "lucide-react";
import colors from "../../constants/colors";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  const currentLanguage = i18n.language;

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4" style={{ color: colors.text.secondary }} />
      <Button
        size="sm"
        variant={currentLanguage === "en" ? "solid" : "light"}
        onClick={() => changeLanguage("en")}
        className="min-w-unit-12"
        style={{
          backgroundColor:
            currentLanguage === "en" ? colors.primary.main : "transparent",
          color:
            currentLanguage === "en"
              ? colors.text.white
              : colors.text.secondary,
        }}
      >
        EN
      </Button>
      <Button
        size="sm"
        variant={currentLanguage === "vi" ? "solid" : "light"}
        onClick={() => changeLanguage("vi")}
        className="min-w-unit-12"
        style={{
          backgroundColor:
            currentLanguage === "vi" ? colors.primary.main : "transparent",
          color:
            currentLanguage === "vi"
              ? colors.text.white
              : colors.text.secondary,
        }}
      >
        VI
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
