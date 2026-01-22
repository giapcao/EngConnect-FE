import React, { useState } from "react";
import { Input, Button, Link, Checkbox, Image } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import * as MotionLib from "framer-motion";
import { useTranslation } from "react-i18next";
import BrandLogo from "../../../components/Authentication/BrandLogo";
import SocialLogin from "../../../components/Authentication/SocialLogin";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useTheme } from "../../../contexts/ThemeContext";
import illustrationImage from "../../../assets/illustrations/welcome-on-board.avif";
import "./Register.css";

// eslint-disable-next-line no-unused-vars
const { motion } = MotionLib;

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();
  const [userType, setUserType] = useState("Student");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!agreeToTerms) {
      alert("Please agree to the Terms and Conditions");
      return;
    }
    // Handle registration logic here
    console.log("Registration data:", { ...formData, userType });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="register-container"
      style={{ backgroundColor: colors.background.light }}
    >
      <div className="register-content">
        <motion.div
          className="register-illustration"
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
          className="register-form-wrapper"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="register-header">
            <BrandLogo />

            <p
              className="text-center mb-6"
              style={{ color: colors.text.secondary }}
            >
              {t("auth.register.subtitle")}
            </p>
          </div>
          <div
            className="register-card"
            style={{ backgroundColor: colors.background.light }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium mb-3"
                  style={{ color: colors.text.primary }}
                >
                  {t("auth.register.joinAs")}
                </label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    size="lg"
                    className="flex-1 font-medium"
                    style={{
                      backgroundColor:
                        userType === "Student"
                          ? colors.primary.main
                          : colors.background.input,
                      color:
                        userType === "Student"
                          ? colors.text.white
                          : colors.text.secondary,
                    }}
                    onClick={() => setUserType("Student")}
                  >
                    {t("auth.register.student")}
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    className="flex-1 font-medium"
                    style={{
                      backgroundColor:
                        userType === "Tutor"
                          ? colors.primary.main
                          : colors.background.input,
                      color:
                        userType === "Tutor"
                          ? colors.text.white
                          : colors.text.secondary,
                    }}
                    onClick={() => setUserType("Tutor")}
                  >
                    {t("auth.register.tutor")}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    {t("auth.register.fullName")}
                  </label>
                  <Input
                    type="text"
                    name="fullName"
                    placeholder={t("auth.register.fullNamePlaceholder")}
                    value={formData.fullName}
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
                    {t("auth.register.email")}
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder={t("auth.register.emailPlaceholder")}
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    {t("auth.register.password")}
                  </label>
                  <Input
                    type="password"
                    name="password"
                    placeholder={t("auth.register.passwordPlaceholder")}
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
                    minLength={8}
                    required
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    {t("auth.register.confirmPassword")}
                  </label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder={t("auth.register.confirmPasswordPlaceholder")}
                    value={formData.confirmPassword}
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
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <Checkbox
                  isSelected={agreeToTerms}
                  onValueChange={setAgreeToTerms}
                  size="sm"
                  classNames={{
                    label: "text-sm",
                  }}
                >
                  <span style={{ color: colors.text.secondary }}>
                    {t("auth.register.agreeToTerms")}{" "}
                    <Link
                      href="#"
                      size="sm"
                      style={{ color: colors.primary.main }}
                    >
                      {t("auth.register.termsAndConditions")}
                    </Link>{" "}
                    {t("auth.register.and")}{" "}
                    <Link
                      href="#"
                      size="sm"
                      style={{ color: colors.primary.main }}
                    >
                      {t("auth.register.privacyPolicy")}
                    </Link>
                  </span>
                </Checkbox>
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
                {t("auth.register.createAccount")}
              </Button>

              <SocialLogin text={t("auth.register.socialText")} />
            </form>
          </div>
          <div
            className="text-center text-lg"
            style={{ width: "100%", maxWidth: "580px" }}
          >
            <span style={{ color: colors.text.secondary }}>
              {t("auth.register.hasAccount")}{" "}
            </span>
            <Link
              onClick={() => navigate("/login")}
              className="cursor-pointer text-lg font-semibold"
              style={{ color: colors.primary.main }}
            >
              {t("auth.register.signIn")}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
