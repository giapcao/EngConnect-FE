import React from "react";
import { useThemeColors } from "../../hooks/useThemeColors";
import logoImage from "../../assets/images/logo.png";

const BrandLogo = () => {
  const colors = useThemeColors();

  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <img src={logoImage} alt="EngConnect" className="h-16 w-auto" />
    </div>
  );
};

export default BrandLogo;
