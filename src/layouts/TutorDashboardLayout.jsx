import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  Button,
  Avatar,
  Badge,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeColors } from "../hooks/useThemeColors";
import LogoutModal from "../components/LogoutModal/LogoutModal";
import { useTheme } from "../contexts/ThemeContext";
import ThemeSwitcher from "../components/ThemeSwitcher/ThemeSwitcher";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher";
import logoImage from "../assets/images/logo.png";
import {
  House,
  MagnifyingGlass,
  BookOpen,
  CalendarDots,
  PencilSimple,
  UserCircle,
  SignOut,
  List,
  X,
  Bell,
  CaretDown,
  CurrencyDollar,
  Student,
  ChalkboardTeacher,
} from "@phosphor-icons/react";

const TutorDashboardLayout = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const navItems = [
    {
      path: "/tutor/dashboard",
      label: t("tutorDashboard.nav.dashboard"),
      icon: House,
    },
    {
      path: "/tutor/my-courses",
      label: t("tutorDashboard.nav.myCourses"),
      icon: BookOpen,
    },
    {
      path: "/tutor/schedule",
      label: t("tutorDashboard.nav.schedule"),
      icon: CalendarDots,
    },
    {
      path: "/tutor/students",
      label: t("tutorDashboard.nav.students"),
      icon: Student,
    },
    {
      path: "/tutor/homework",
      label: t("tutorDashboard.nav.homework"),
      icon: PencilSimple,
    },
    {
      path: "/tutor/earnings",
      label: t("tutorDashboard.nav.earnings"),
      icon: CurrencyDollar,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background.gray }}
    >
      {/* Top Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-sm"
        style={{
          backgroundColor:
            theme === "dark"
              ? "rgba(30, 41, 59, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
        }}
      >
        {/* Main Header Row */}
        <div className="px-4 lg:px-8 py-3 flex items-center justify-between relative">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 no-underline flex-shrink-0"
          >
            <img src={logoImage} alt="EngConnect" className="h-11 w-auto" />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
            <Input
              type="text"
              placeholder={t("tutorDashboard.search.placeholder")}
              startContent={
                <MagnifyingGlass
                  className="w-5 h-5"
                  style={{ color: colors.text.secondary }}
                />
              }
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
              radius="lg"
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeSwitcher />
            <LanguageSwitcher />

            {/* Notifications */}
            <Badge content="3" color="danger" shape="circle" size="sm">
              <Button
                isIconOnly
                variant="light"
                radius="full"
                onPress={() => navigate("/tutor/notifications")}
              >
                <Bell
                  className="w-5 h-5"
                  style={{ color: colors.text.secondary }}
                />
              </Button>
            </Badge>

            {/* User Menu */}
            <Dropdown
              placement="bottom-end"
              showArrow
              classNames={{
                base:
                  theme === "dark"
                    ? "before:bg-gray-700"
                    : "before:bg-default-200",
                content:
                  theme === "dark"
                    ? "bg-gray-800 text-gray-200"
                    : "bg-white text-gray-900",
              }}
            >
              <DropdownTrigger>
                <Button variant="light" className="gap-2 pl-2 pr-3">
                  <Avatar
                    src="https://i.pravatar.cc/150?u=tutor"
                    size="sm"
                    className="w-8 h-8"
                  />
                  <span
                    className="hidden md:block font-medium"
                    style={{ color: colors.text.primary }}
                  >
                    Sarah Johnson
                  </span>
                  <CaretDown
                    className="w-4 h-4 hidden sm:block"
                    style={{ color: colors.text.secondary }}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu">
                <DropdownItem
                  key="profile"
                  startContent={
                    <UserCircle weight="duotone" className="w-5 h-5" />
                  }
                  onPress={() => navigate("/tutor/profile")}
                >
                  {t("tutorDashboard.nav.profile")}
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-danger"
                  color="danger"
                  startContent={
                    <SignOut weight="duotone" className="w-5 h-5" />
                  }
                  onPress={() => setLogoutModalOpen(true)}
                >
                  {t("tutorDashboard.nav.logout")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            {/* Mobile Menu Button */}
            <Button
              isIconOnly
              variant="light"
              className="lg:hidden"
              onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" style={{ color: colors.text.primary }} />
              ) : (
                <List
                  className="w-6 h-6"
                  style={{ color: colors.text.primary }}
                />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation Row - Desktop */}
        <nav className="hidden lg:flex justify-center px-4 lg:px-8 py-3">
          <ul
            className="flex items-center gap-1 px-2 py-1.5 rounded-full"
            style={{ backgroundColor: colors.background.gray }}
          >
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 no-underline font-medium text-sm"
                  style={{
                    color: isActive(item.path)
                      ? colors.text.white
                      : colors.text.secondary,
                    backgroundColor: isActive(item.path)
                      ? colors.primary.main
                      : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.backgroundColor =
                        colors.primary.lightest;
                      e.currentTarget.style.color = colors.primary.main;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = colors.text.secondary;
                    }
                  }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm"
            style={{ top: "64px" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            {/* Menu Content */}
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative"
              style={{
                backgroundColor: colors.background.light,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="p-4 max-h-[calc(100vh-64px)] overflow-y-auto">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all no-underline ${
                        isActive(item.path) ? "font-semibold" : ""
                      }`}
                      style={{
                        backgroundColor: isActive(item.path)
                          ? colors.primary.main
                          : "transparent",
                        color: isActive(item.path)
                          ? colors.text.white
                          : colors.text.secondary,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive(item.path)) {
                          e.currentTarget.style.backgroundColor =
                            colors.primary.lightest;
                          e.currentTarget.style.color = colors.primary.main;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive(item.path)) {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = colors.text.secondary;
                        }
                      }}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navItems.length * 0.05, duration: 0.3 }}
                >
                  <Link
                    to="/tutor/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all no-underline ${
                      isActive("/tutor/profile") ? "font-semibold" : ""
                    }`}
                    style={{
                      backgroundColor: isActive("/tutor/profile")
                        ? colors.primary.main
                        : "transparent",
                      color: isActive("/tutor/profile")
                        ? colors.text.white
                        : colors.text.secondary,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive("/tutor/profile")) {
                        e.currentTarget.style.backgroundColor =
                          colors.primary.lightest;
                        e.currentTarget.style.color = colors.primary.main;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive("/tutor/profile")) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = colors.text.secondary;
                      }
                    }}
                  >
                    <UserCircle weight="duotone" className="w-5 h-5" />
                    <span>{t("tutorDashboard.nav.profile")}</span>
                  </Link>
                </motion.li>
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <main className="p-4 lg:p-8 max-w-7xl mx-auto">
        <Outlet />
      </main>

      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
      />
    </div>
  );
};

export default TutorDashboardLayout;
