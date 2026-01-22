import React, { useState } from "react";
import { Input, Button, Link, Checkbox, Image } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as MotionLib from "framer-motion";
import { useTranslation } from "react-i18next";
import BrandLogo from "../../../components/Authentication/BrandLogo";
import SocialLogin from "../../../components/Authentication/SocialLogin";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useTheme } from "../../../contexts/ThemeContext";
import illustrationImage from "../../../assets/illustrations/archive.avif";
import "./Login.css";

// eslint-disable-next-line no-unused-vars
const { motion } = MotionLib;

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login data:", formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="login-container"
      style={{ backgroundColor: colors.background.light }}
    >
      <div className="login-content">
        <motion.div
          className="login-illustration"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            backgroundColor:
              theme === "dark" ? colors.background.gray : "#F0F9FF",
          }}
        >
          <Image src={illustrationImage} alt="Student illustration" />
        </motion.div>

        <motion.div
          className="login-form-wrapper"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="login-header">
            <BrandLogo />

            <p
              className="text-center mb-8"
              style={{ color: colors.text.secondary }}
            >
              {t("auth.login.subtitle")}
            </p>
          </div>
          <div
            className="login-card"
            style={{ backgroundColor: colors.background.light }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text.primary }}
                >
                  {t("auth.login.email")}
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder={t("auth.login.emailPlaceholder")}
                  value={formData.email}
                  onChange={handleChange}
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
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text.primary }}
                >
                  {t("auth.login.password")}
                </label>
                <Input
                  type={isVisible ? "text" : "password"}
                  name="password"
                  placeholder={t("auth.login.passwordPlaceholder")}
                  value={formData.password}
                  onChange={handleChange}
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
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeOff
                          style={{ color: colors.text.tertiary }}
                          className="w-5 h-5"
                        />
                      ) : (
                        <Eye
                          style={{ color: colors.text.tertiary }}
                          className="w-5 h-5"
                        />
                      )}
                    </button>
                  }
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Checkbox
                  isSelected={rememberMe}
                  onValueChange={setRememberMe}
                  size="sm"
                  classNames={{
                    label: "text-sm",
                  }}
                >
                  <span style={{ color: colors.text.secondary }}>
                    {t("auth.login.rememberMe")}
                  </span>
                </Checkbox>

                <Link
                  onClick={() => navigate("/forgot-password")}
                  size="sm"
                  className="cursor-pointer"
                  style={{ color: colors.primary.main }}
                >
                  {t("auth.login.forgotPassword")}
                </Link>
              </div>

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
                {t("auth.login.loginButton")}
              </Button>

              <SocialLogin text={t("auth.login.socialText")} />
            </form>
          </div>
          <div
            className="text-center text-lg"
            style={{ width: "100%", maxWidth: "480px" }}
          >
            <span style={{ color: colors.text.secondary }}>
              {t("auth.login.noAccount")}{" "}
            </span>
            <Link
              onClick={() => navigate("/register")}
              className="cursor-pointer text-lg font-semibold"
              style={{ color: colors.primary.main }}
            >
              {t("auth.login.signUp")}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
