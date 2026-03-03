import { useTheme } from "../contexts/ThemeContext";

const useInputStyles = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const inputClassNames = {
    label: isDark ? "!text-gray-300" : "",
    inputWrapper: `!transition-colors !duration-200 ${
      isDark
        ? "!bg-slate-900 !border-slate-700 hover:!bg-slate-800 data-[hover=true]:!bg-slate-800 group-data-[focus=true]:!bg-slate-900"
        : "hover:bg-gray-50"
    }`,
    input: isDark ? "!text-gray-200 placeholder:!text-gray-500" : "",
  };

  const textareaClassNames = {
    label: isDark ? "!text-gray-300" : "",
    inputWrapper: `!transition-colors !duration-200 ${
      isDark
        ? "!bg-slate-900 !border-slate-700 hover:!bg-slate-800 data-[hover=true]:!bg-slate-800 group-data-[focus=true]:!bg-slate-900"
        : "hover:bg-gray-50"
    }`,
    input: isDark ? "!text-gray-200 placeholder:!text-gray-500" : "",
  };

  const selectClassNames = {
    label: isDark ? "!text-gray-300" : "",
    trigger: `!transition-colors !duration-200 ${
      isDark
        ? "!bg-slate-900 !border-slate-700 hover:!bg-slate-800 data-[hover=true]:!bg-slate-800"
        : "!bg-gray-50 hover:!bg-gray-100"
    }`,
    value: isDark ? "!text-gray-200" : "",
    selectorIcon: isDark ? "!text-gray-400" : "",
    popoverContent: isDark ? "!bg-slate-900 !text-gray-200" : "",
    listbox: isDark ? "!text-gray-200" : "",
  };

  return { inputClassNames, textareaClassNames, selectClassNames };
};

export default useInputStyles;
