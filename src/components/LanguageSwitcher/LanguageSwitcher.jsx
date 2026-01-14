import { useTranslation } from "react-i18next";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Globe, ChevronDown } from "lucide-react";
import { useThemeColors } from "../../hooks/useThemeColors";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const colors = useThemeColors();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  const currentLanguage = i18n.language;

  const languages = [
    { key: "en", label: "English", short: "EN" },
    { key: "vi", label: "Tiếng Việt", short: "VI" },
  ];

  const currentLang =
    languages.find((lang) => lang.key === currentLanguage) || languages[0];

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="flat"
          size="sm"
          className="font-medium"
          startContent={<Globe className="w-4 h-4" />}
          endContent={<ChevronDown className="w-3.5 h-3.5" />}
          style={{
            color: colors.text.secondary,
            backgroundColor: colors.background.gray,
          }}
        >
          {currentLang.short}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language selection"
        selectedKeys={[currentLanguage]}
        selectionMode="single"
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0];
          changeLanguage(selectedKey);
        }}
        style={{
          backgroundColor: colors.background.card,
        }}
      >
        {languages.map((lang) => (
          <DropdownItem
            key={lang.key}
            style={{
              color:
                currentLanguage === lang.key
                  ? colors.primary.main
                  : colors.text.primary,
            }}
          >
            {lang.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
