import React from "react";
import { useNavigate } from "react-router-dom";
import { useThemeColors } from "../../hooks/useThemeColors";
import logoImage from "../../assets/images/logo.png";

const BrandLogo = () => {
  const colors = useThemeColors();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="focus:outline-none"
        aria-label="Go to home"
      >
        <img
          src={logoImage}
          alt="EngConnect"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
          className="h-16 w-auto cursor-pointer hover:opacity-80 transition-opacity"
        />
      </button>
    </div>
  );
};

export default BrandLogo;
