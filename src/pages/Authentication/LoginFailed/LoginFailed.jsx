import React from "react";
import { Button, Image } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import * as MotionLib from "framer-motion";
import { useTranslation } from "react-i18next";
import { XCircle } from "lucide-react";
import BrandLogo from "../../../components/Authentication/BrandLogo";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useTheme } from "../../../contexts/ThemeContext";
import illustrationImage from "../../../assets/illustrations/bad-news.avif";
import "./LoginFailed.css";

// eslint-disable-next-line no-unused-vars
const { motion } = MotionLib;

const LoginFailed = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();

  return (
    <div
      className="login-failed-container"
      style={{ backgroundColor: colors.background.light }}
    >
      <div className="login-failed-content">
        <motion.div
          className="login-failed-illustration"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            backgroundColor:
              theme === "dark" ? colors.background.gray : "#FEF2F2",
          }}
        >
          <Image src={illustrationImage} alt="Login failed illustration" />
        </motion.div>

        <motion.div
          className="login-failed-form-wrapper"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <BrandLogo />

          <div className="login-failed-card">
            <XCircle className="w-20 h-20 mb-4" style={{ color: "#ef4444" }} />

            <h2
              className="text-2xl font-bold text-center"
              style={{ color: colors.text.primary }}
            >
              {t("auth.loginFailed.title")}
            </h2>

            <p
              className="text-center mt-3 leading-relaxed"
              style={{ color: colors.text.secondary }}
            >
              {t("auth.loginFailed.description")}
            </p>

            <div className="flex flex-col gap-3 mt-8 w-full">
              <Button
                size="lg"
                radius="full"
                className="w-full font-semibold"
                style={{
                  backgroundColor: colors.primary.main,
                  color: colors.text.white,
                }}
                onPress={() => navigate("/login")}
              >
                {t("auth.loginFailed.tryAgain")}
              </Button>

              <Button
                variant="flat"
                size="lg"
                radius="full"
                className="w-full font-semibold"
                style={{
                  backgroundColor: colors.button.primaryLight.background,
                  color: colors.button.primaryLight.text,
                }}
                onPress={() => navigate("/")}
              >
                {t("auth.loginFailed.goHome")}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginFailed;
