import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "@heroui/react";
import { Sun, Moon } from "lucide-react";
import colors from "../../constants/colors";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      size="sm"
      variant="light"
      isIconOnly
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="hover:bg-opacity-10"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" style={{ color: colors.text.secondary }} />
      ) : (
        <Sun className="w-5 h-5" style={{ color: colors.text.secondary }} />
      )}
    </Button>
  );
};

export default ThemeSwitcher;
