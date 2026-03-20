import { useTranslation } from "react-i18next";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Globe, CaretDown } from "@phosphor-icons/react";
import { useThemeColors } from "../../hooks/useThemeColors";
import useDropdownStyles from "../../hooks/useDropdownStyles";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const colors = useThemeColors();
  const { dropdownClassNames } = useDropdownStyles();

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
    <Dropdown showArrow classNames={dropdownClassNames}>
      <DropdownTrigger>
        <Button
          variant="flat"
          size="sm"
          className="font-medium"
          startContent={<Globe className="w-4 h-4" />}
          endContent={<CaretDown className="w-3.5 h-3.5" />}
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
