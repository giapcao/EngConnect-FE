import { useThemeColors } from "./useThemeColors";

const useTableStyles = () => {
  const colors = useThemeColors();

  const tableCardStyle = {
    backgroundColor: colors.background.light,
    "--admin-th-bg": colors.background.gray,
    "--admin-th-text": colors.text.secondary,
  };

  const tableClassNames = {
    wrapper: "shadow-none bg-transparent",
    th: "text-xs font-semibold bg-[var(--admin-th-bg)] text-[var(--admin-th-text)]",
  };

  return { tableCardStyle, tableClassNames };
};

export default useTableStyles;
