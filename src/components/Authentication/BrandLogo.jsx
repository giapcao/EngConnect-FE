import React from "react";
import { Asterisk } from "lucide-react";
import { useThemeColors } from "../../hooks/useThemeColors";

const BrandLogo = () => {
  const colors = useThemeColors();

  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <Asterisk
        className="w-8 h-8"
        style={{ color: colors.primary.main }}
        strokeWidth={2}
      />
      <span
        className="text-3xl font-semibold"
        style={{ color: colors.primary.main }}
      >
        EngConnect
      </span>
    </div>
  );
};

export default BrandLogo;
