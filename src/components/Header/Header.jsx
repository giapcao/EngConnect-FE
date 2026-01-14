import React, { useState, useEffect } from "react";
import { Button, Link } from "@heroui/react";
import { GraduationCap, Menu, X, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as MotionLib from "framer-motion";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useTheme } from "../../contexts/ThemeContext";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

// eslint-disable-next-line no-unused-vars
const { motion, AnimatePresence } = MotionLib;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.findTutors"), href: "/tutors" },
    { name: t("nav.courses"), href: "/courses" },
    { name: t("nav.pricing"), href: "/pricing" },
    { name: t("nav.about"), href: "/about" },
  ];

  const isActiveRoute = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl ${
          isScrolled ? "border-b" : "border-b border-transparent"
        }`}
        style={{
          backgroundColor:
            theme === "dark"
              ? "rgba(30, 41, 59, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
          borderColor: isScrolled ? colors.border.light : "transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex justify-between items-center h-18 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                style={{ backgroundColor: colors.primary.main }}
              >
                <GraduationCap
                  className="w-6 h-6"
                  style={{ color: colors.text.white }}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="font-bold text-xl leading-tight tracking-tight"
                  style={{ color: colors.text.primary }}
                >
                  EngConnect
                </span>
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest leading-tight"
                  style={{ color: colors.primary.main }}
                >
                  Learn English
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-full"
              style={{ backgroundColor: colors.background.gray }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative px-5 py-2 rounded-full font-medium text-sm transition-all duration-300"
                  style={{
                    color: isActiveRoute(item.href)
                      ? colors.text.white
                      : colors.text.secondary,
                    backgroundColor: isActiveRoute(item.href)
                      ? colors.primary.main
                      : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActiveRoute(item.href)) {
                      e.currentTarget.style.backgroundColor =
                        colors.primary.lightest;
                      e.currentTarget.style.color = colors.primary.main;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActiveRoute(item.href)) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = colors.text.secondary;
                    }
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Theme & Language Switchers */}
              <div className="hidden sm:flex items-center gap-1">
                <ThemeSwitcher />
                <LanguageSwitcher />
              </div>

              {/* Auth Buttons - Desktop */}
              <div className="hidden md:flex items-center gap-3 ml-3">
                <Button
                  variant="flat"
                  size="sm"
                  radius="full"
                  className="font-semibold px-5 transition-all duration-300 text-sm"
                  style={{
                    backgroundColor: colors.button.primaryLight.background,
                    color: colors.button.primaryLight.text,
                  }}
                  onPress={() => navigate("/login")}
                >
                  {t("nav.signIn")}
                </Button>
                <Button
                  size="sm"
                  radius="full"
                  className="font-semibold px-6 transition-all duration-300 hover:opacity-90 hover:scale-105 text-sm"
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                  onPress={() => navigate("/register")}
                  endContent={<ChevronRight className="w-4 h-4" />}
                >
                  {t("nav.getStarted")}
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <Button
                isIconOnly
                variant="light"
                size="sm"
                radius="full"
                className="lg:hidden transition-all duration-300"
                onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X
                    className="w-5 h-5"
                    style={{ color: colors.text.primary }}
                  />
                ) : (
                  <Menu
                    className="w-5 h-5"
                    style={{ color: colors.text.primary }}
                  />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute top-full left-0 right-0 lg:hidden border-t shadow-lg z-50 backdrop-blur-xl"
              style={{
                backgroundColor:
                  theme === "dark"
                    ? "rgba(30, 41, 59, 0.95)"
                    : "rgba(255, 255, 255, 0.95)",
                borderColor: colors.border.light,
              }}
            >
              <div className="px-6 py-6 space-y-2">
                {/* Navigation Links */}
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center justify-between px-5 py-3.5 rounded-xl font-medium transition-all duration-200"
                      style={{
                        color: isActiveRoute(item.href)
                          ? colors.text.white
                          : colors.text.muted,
                        backgroundColor: isActiveRoute(item.href)
                          ? colors.primary.main
                          : colors.background.gray,
                      }}
                      onPress={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-base">{item.name}</span>
                      <ChevronRight
                        className="w-5 h-5 transition-transform duration-200"
                        style={{
                          color: isActiveRoute(item.href)
                            ? colors.text.white
                            : colors.text.secondary,
                        }}
                      />
                    </Link>
                  </motion.div>
                ))}

                {/* Theme & Language Switchers */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                  className="flex items-center justify-center gap-3 py-4 mt-2"
                >
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <ThemeSwitcher />
                    <div
                      className="w-px h-5"
                      style={{ backgroundColor: colors.border.light }}
                    />
                    <LanguageSwitcher />
                  </div>
                </motion.div>

                {/* Auth Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="flex flex-col gap-3 pt-4 mt-2 border-t"
                  style={{ borderColor: colors.border.light }}
                >
                  <Button
                    variant="bordered"
                    radius="full"
                    size="lg"
                    className="font-semibold w-full transition-all duration-200"
                    style={{
                      borderColor: colors.border.medium,
                      color: colors.text.primary,
                    }}
                    onPress={() => {
                      navigate("/login");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {t("nav.signIn")}
                  </Button>
                  <Button
                    radius="full"
                    size="lg"
                    className="font-semibold w-full transition-all duration-200"
                    style={{
                      backgroundColor: colors.primary.main,
                      color: colors.text.white,
                    }}
                    onPress={() => {
                      navigate("/register");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {t("nav.getStarted")}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden backdrop-blur-sm"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
