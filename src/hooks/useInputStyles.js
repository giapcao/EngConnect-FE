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

  // For filter/search rows (search input + tabs combo in dashboard pages)
  const filterInputClassNames = {
    label: isDark ? "!text-gray-300" : "",
    inputWrapper: `!shadow-none !transition-colors !duration-200 ${
      isDark
        ? "!bg-[#0F172A] !border-[#1E293B] hover:!bg-[#1E293B] data-[hover=true]:!bg-[#1E293B] group-data-[focus=true]:!bg-[#0F172A]"
        : "!bg-[#F3F4F6] !border-transparent hover:!bg-[#E9EAEC]"
    }`,
    input: isDark
      ? "!text-gray-200 placeholder:!text-gray-500"
      : "!text-gray-700 placeholder:!text-gray-400",
  };

  // For filter tabs (variant="solid") paired with filterInputClassNames
  const filterTabsClassNames = {
    tabList: `gap-1 p-1 ${isDark ? "!bg-[#0F172A]" : "!bg-[#F3F4F6]"}`,
    tab: "px-4",
    //cursor: isDark ? "!bg-[#1E293B]" : "!bg-white",
  };

  return {
    inputClassNames,
    textareaClassNames,
    selectClassNames,
    filterInputClassNames,
    filterTabsClassNames,
  };
};

export default useInputStyles;
