import React, { useState } from "react";
import { Input, Button, Link, Image } from "@heroui/react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as MotionLib from "framer-motion";
import { useTranslation } from "react-i18next";
import BrandLogo from "../../../components/Authentication/BrandLogo";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useTheme } from "../../../contexts/ThemeContext";
import illustrationImage from "../../../assets/images/forgot-pass.png";
import "./ForgotPass.css";

// eslint-disable-next-line no-unused-vars
const { motion } = MotionLib;

const ForgotPass = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle forgot password logic here
    console.log("Reset password for:", email);
    setIsSubmitted(true);
  };

  return (
    <div
      className="forgot-pass-container"
      style={{ backgroundColor: colors.background.light }}
    >
      <div className="forgot-pass-content">
        <motion.div
          className="forgot-pass-illustration"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            backgroundColor:
              theme === "dark" ? colors.background.gray : "#F0F9FF",
          }}
        >
          <Image src={illustrationImage} alt="Forgot password illustration" />
        </motion.div>

        <motion.div
          className="forgot-pass-form-wrapper"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="forgot-pass-header">
            <BrandLogo />

            <p
              className="text-center mb-8"
              style={{ color: colors.text.secondary }}
            >
              {t("auth.forgotPassword.subtitle")}
            </p>
          </div>

          <div
            className="forgot-pass-card"
            style={{ backgroundColor: colors.background.light }}
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    {t("auth.forgotPassword.email")}
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder={t("auth.forgotPassword.emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="flat"
                    size="lg"
                    classNames={{
                      inputWrapper: `!transition-colors !duration-200 ${
                        theme === "dark"
                          ? "!bg-gray-800 !border-gray-700 hover:!bg-gray-700 data-[hover=true]:!bg-gray-700 group-data-[focus=true]:!bg-gray-800"
                          : "hover:bg-gray-50"
                      }`,
                      input:
                        theme === "dark"
                          ? "!text-gray-200 placeholder:!text-gray-500"
                          : "",
                    }}
                    startContent={
                      <Mail
                        className="w-5 h-5"
                        style={{ color: colors.text.tertiary }}
                      />
                    }
                    required
                  />
                </div>

                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  {t("auth.forgotPassword.instruction")}
                </p>

                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="w-full font-medium"
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                >
                  {t("auth.forgotPassword.sendButton")}
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-6"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: colors.background.primaryLight }}
                >
                  <CheckCircle
                    className="w-8 h-8"
                    style={{ color: colors.state.success }}
                  />
                </div>
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: colors.text.primary }}
                >
                  {t("auth.forgotPassword.successTitle")}
                </h3>
                <p className="mb-6" style={{ color: colors.text.secondary }}>
                  {t("auth.forgotPassword.successMessage")}
                </p>
                <Button
                  color="primary"
                  size="lg"
                  className="w-full font-medium"
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                  onPress={() => navigate("/login")}
                >
                  {t("auth.forgotPassword.backToLogin")}
                </Button>
              </motion.div>
            )}
          </div>

          <div
            className="text-center text-lg"
            style={{ width: "100%", maxWidth: "480px" }}
          >
            <Link
              onClick={() => navigate("/login")}
              className="cursor-pointer text-lg font-semibold inline-flex items-center gap-2"
              style={{ color: colors.primary.main }}
            >
              <ArrowLeft className="w-5 h-5" />
              {t("auth.forgotPassword.backToLoginLink")}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPass;
