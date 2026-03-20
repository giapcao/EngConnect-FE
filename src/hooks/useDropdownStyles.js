import { useTheme } from "../contexts/ThemeContext";

const useDropdownStyles = () => {
  const { theme } = useTheme();

  const dropdownClassNames = {
    base: theme === "dark" ? "before:bg-gray-700" : "before:bg-default-200",
    content:
      theme === "dark"
        ? "bg-gray-700 text-gray-100"
        : "bg-white text-gray-900",
  };

  return { dropdownClassNames };
};

export default useDropdownStyles;
