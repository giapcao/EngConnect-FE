import React, { useState, useEffect } from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import {
  Menu,
  X,
  ChevronRight,
  LogOut,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import logoImage from "../../assets/images/logo.png";
import defaultAvatar from "../../assets/images/null-avatar.jpg";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import * as MotionLib from "framer-motion";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useTheme } from "../../contexts/ThemeContext";
import { selectIsAuthenticated, selectUser } from "../../store";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import LogoutModal from "../LogoutModal/LogoutModal";

// eslint-disable-next-line no-unused-vars
const { motion, AnimatePresence } = MotionLib;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const hasRole = (role) => user?.roles?.includes(role);

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
    { name: t("nav.courses"), href: "/courses" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.becomeTutor"), href: "/become-tutor" },
  ];

  const isActiveRoute = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-xs ${
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
            <Link to="/" className="flex items-center gap-3 group no-underline">
              <img
                src={logoImage}
                alt="EngConnect"
                className="h-10 w-auto transition-all duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-full"
              style={{ backgroundColor: colors.background.gray }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 no-underline"
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

              {/* Auth Section - Desktop */}
              <div className="hidden md:flex items-center gap-3 ml-3">
                {isAuthenticated && user ? (
                  <>
                    {hasRole("Student") && (
                      <Button
                        variant="flat"
                        size="sm"
                        radius="full"
                        className="font-semibold px-4 transition-all duration-300 text-sm"
                        startContent={<BookOpen className="w-4 h-4" />}
                        style={{
                          backgroundColor:
                            colors.button.primaryLight.background,
                          color: colors.button.primaryLight.text,
                        }}
                        onPress={() => navigate("/student/dashboard")}
                      >
                        {t("nav.learningDashboard")}
                      </Button>
                    )}
                    {hasRole("Tutor") && (
                      <Button
                        variant="flat"
                        size="sm"
                        radius="full"
                        className="font-semibold px-4 transition-all duration-300 text-sm"
                        startContent={<GraduationCap className="w-4 h-4" />}
                        style={{
                          backgroundColor:
                            colors.button.primaryLight.background,
                          color: colors.button.primaryLight.text,
                        }}
                        onPress={() => navigate("/tutor/dashboard")}
                      >
                        {t("nav.tutorDashboard")}
                      </Button>
                    )}
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <button className="flex items-center gap-2 cursor-pointer focus:outline-none rounded-full px-2 py-1.5 transition-all duration-200 hover:opacity-80">
                          <Avatar
                            src={user.avatarUrl || defaultAvatar}
                            name={user.username}
                            size="sm"
                            className="flex-shrink-0"
                            imgProps={{ referrerPolicy: "no-referrer" }}
                          />
                          <span
                            className="font-medium text-sm max-w-[120px] truncate"
                            style={{ color: colors.text.primary }}
                          >
                            {user.username}
                          </span>
                        </button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="User menu"
                        onAction={(key) => {
                          if (key === "logout") setIsLogoutModalOpen(true);
                        }}
                      >
                        <DropdownItem
                          key="logout"
                          className="text-danger"
                          color="danger"
                          startContent={<LogOut className="w-4 h-4" />}
                        >
                          {t("nav.logout")}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
              className="absolute top-full left-0 right-0 lg:hidden border-t shadow-lg z-50 backdrop-blur-sm"
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
                      to={item.href}
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

                {/* Auth Section - Mobile */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="flex flex-col gap-3 pt-4 mt-2 border-t"
                  style={{ borderColor: colors.border.light }}
                >
                  {isAuthenticated && user ? (
                    <>
                      <div
                        className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <Avatar
                          src={user.avatarUrl || defaultAvatar}
                          name={user.username}
                          size="sm"
                          imgProps={{ referrerPolicy: "no-referrer" }}
                        />
                        <span
                          className="font-medium"
                          style={{ color: colors.text.primary }}
                        >
                          {user.username}
                        </span>
                      </div>
                      {hasRole("Student") && (
                        <Button
                          radius="full"
                          size="lg"
                          variant="flat"
                          className="font-semibold w-full"
                          startContent={<BookOpen className="w-5 h-5" />}
                          style={{ color: colors.primary.main }}
                          onPress={() => {
                            navigate("/student/dashboard");
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          {t("nav.learningDashboard")}
                        </Button>
                      )}
                      {hasRole("Tutor") && (
                        <Button
                          radius="full"
                          size="lg"
                          variant="flat"
                          className="font-semibold w-full"
                          startContent={<GraduationCap className="w-5 h-5" />}
                          style={{ color: colors.primary.main }}
                          onPress={() => {
                            navigate("/tutor/dashboard");
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          {t("nav.tutorDashboard")}
                        </Button>
                      )}
                      <Button
                        radius="full"
                        size="lg"
                        color="danger"
                        variant="flat"
                        className="font-semibold w-full"
                        startContent={<LogOut className="w-5 h-5" />}
                        onPress={() => {
                          setIsMobileMenuOpen(false);
                          setIsLogoutModalOpen(true);
                        }}
                      >
                        {t("nav.logout")}
                      </Button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
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

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};

export default Header;
