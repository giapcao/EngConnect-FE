import React from "react";
import { Asterisk } from "lucide-react";
import colors from "../../constants/colors";

const BrandLogo = () => {
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
