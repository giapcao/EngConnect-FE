import { useTheme } from "../contexts/ThemeContext";

const useInputStyles = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const inputClassNames = {
    label: isDark ? "!text-gray-300" : "",
    inputWrapper: `!transition-colors !duration-200 ${
      isDark
        ? "!bg-gray-800 !border-gray-700 hover:!bg-gray-700 data-[hover=true]:!bg-gray-700 group-data-[focus=true]:!bg-gray-800"
        : "hover:bg-gray-50"
    }`,
    input: isDark ? "!text-gray-200 placeholder:!text-gray-500" : "",
  };

  const textareaClassNames = {
    label: isDark ? "!text-gray-300" : "",
    inputWrapper: `!transition-colors !duration-200 ${
      isDark
        ? "!bg-gray-800 !border-gray-700 hover:!bg-gray-700 data-[hover=true]:!bg-gray-700 group-data-[focus=true]:!bg-gray-800"
        : "hover:bg-gray-50"
    }`,
    input: isDark ? "!text-gray-200 placeholder:!text-gray-500" : "",
  };

  const selectClassNames = {
    label: isDark ? "!text-gray-300" : "",
    trigger: `!transition-colors !duration-200 ${
      isDark
        ? "!bg-gray-800 !border-gray-700 hover:!bg-gray-700 data-[hover=true]:!bg-gray-700"
        : "!bg-gray-50 hover:!bg-gray-100"
    }`,
    value: isDark ? "!text-gray-200" : "",
    selectorIcon: isDark ? "!text-gray-400" : "",
    popoverContent: isDark ? "!bg-gray-800 !text-gray-200" : "",
    listbox: isDark ? "!text-gray-200" : "",
  };

  return { inputClassNames, textareaClassNames, selectClassNames };
};

export default useInputStyles;
