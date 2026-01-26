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
  Tooltip,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import LogoutModal from "../components/LogoutModal/LogoutModal";
import { useThemeColors } from "../hooks/useThemeColors";
import { useTheme } from "../contexts/ThemeContext";
import ThemeSwitcher from "../components/ThemeSwitcher/ThemeSwitcher";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher";
import {
  House,
  MagnifyingGlass,
  BookOpen,
  UserCircle,
  SignOut,
  List,
  X,
  Bell,
  CaretDown,
  ChartLine,
  CurrencyDollar,
  GraduationCap,
  ChalkboardTeacher,
  Gear,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";

const AdminDashboardLayout = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const navItems = [
    {
      path: "/admin/dashboard",
      label: t("adminDashboard.nav.dashboard"),
      icon: House,
    },
    {
      path: "/admin/students",
      label: t("adminDashboard.nav.students"),
      icon: GraduationCap,
    },
    {
      path: "/admin/tutors",
      label: t("adminDashboard.nav.tutors"),
      icon: ChalkboardTeacher,
    },
    {
      path: "/admin/courses",
      label: t("adminDashboard.nav.courses"),
      icon: BookOpen,
    },
    {
      path: "/admin/analytics",
      label: t("adminDashboard.nav.analytics"),
      icon: ChartLine,
    },
    {
      path: "/admin/finance",
      label: t("adminDashboard.nav.finance"),
      icon: CurrencyDollar,
    },
    {
      path: "/admin/settings",
      label: t("adminDashboard.nav.settings"),
      icon: Gear,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: colors.background.gray }}
    >
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-full z-40 transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
        style={{
          backgroundColor: colors.background.light,
          borderRight: `1px solid ${colors.border.light}`,
        }}
      >
        {/* Logo */}
        <div
          className="h-16 flex items-center justify-between px-4"
          style={{ borderBottom: `1px solid ${colors.border.light}` }}
        >
          <Link
            to="/"
            className="flex items-center gap-2 no-underline flex-shrink-0"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg"
              style={{
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
            >
              E
            </div>
            {!sidebarCollapsed && (
              <span
                className="text-xl font-bold"
                style={{ color: colors.text.primary }}
              >
                EngConnect
              </span>
            )}
          </Link>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex"
          >
            {sidebarCollapsed ? (
              <CaretRight
                className="w-4 h-4"
                style={{ color: colors.text.secondary }}
              />
            ) : (
              <CaretLeft
                className="w-4 h-4"
                style={{ color: colors.text.secondary }}
              />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Tooltip
                  key={item.path}
                  content={item.label}
                  placement="right"
                  isDisabled={!sidebarCollapsed}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline transition-all duration-200 ${
                      sidebarCollapsed ? "justify-center" : ""
                    }`}
                    style={{
                      backgroundColor: active
                        ? colors.background.primaryLight
                        : "transparent",
                      color: active
                        ? colors.primary.main
                        : colors.text.secondary,
                    }}
                  >
                    <Icon
                      className="w-5 h-5 flex-shrink-0"
                      weight={active ? "fill" : "regular"}
                    />
                    {!sidebarCollapsed && (
                      <span
                        className={`text-sm ${active ? "font-semibold" : "font-medium"}`}
                      >
                        {item.label}
                      </span>
                    )}
                  </Link>
                </Tooltip>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div
          className="p-3"
          style={{ borderTop: `1px solid ${colors.border.light}` }}
        >
          <Tooltip
            content={t("adminDashboard.nav.logout")}
            placement="right"
            isDisabled={!sidebarCollapsed}
          >
            <Button
              variant="light"
              className={`w-full ${sidebarCollapsed ? "justify-center" : "justify-start"}`}
              startContent={
                <SignOut
                  className="w-5 h-5"
                  style={{ color: colors.state.error }}
                />
              }
              style={{ color: colors.state.error }}
              onPress={() => setLogoutModalOpen(true)}
            >
              {!sidebarCollapsed && t("adminDashboard.nav.logout")}
            </Button>
          </Tooltip>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 z-50 flex flex-col"
              style={{
                backgroundColor: colors.background.light,
              }}
            >
              {/* Mobile Logo */}
              <div
                className="h-16 flex items-center justify-between px-4"
                style={{ borderBottom: `1px solid ${colors.border.light}` }}
              >
                <Link to="/" className="flex items-center gap-2 no-underline">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg"
                    style={{
                      backgroundColor: colors.primary.main,
                      color: colors.text.white,
                    }}
                  >
                    E
                  </div>
                  <span
                    className="text-xl font-bold"
                    style={{ color: colors.text.primary }}
                  >
                    EngConnect
                  </span>
                </Link>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => setMobileMenuOpen(false)}
                >
                  <X
                    className="w-5 h-5"
                    style={{ color: colors.text.secondary }}
                  />
                </Button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 py-4 px-3 overflow-y-auto">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline transition-all duration-200"
                        style={{
                          backgroundColor: active
                            ? colors.background.primaryLight
                            : "transparent",
                          color: active
                            ? colors.primary.main
                            : colors.text.secondary,
                        }}
                      >
                        <Icon
                          className="w-5 h-5 flex-shrink-0"
                          weight={active ? "fill" : "regular"}
                        />
                        <span
                          className={`text-sm ${active ? "font-semibold" : "font-medium"}`}
                        >
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Mobile Sidebar Footer */}
              <div
                className="p-3"
                style={{ borderTop: `1px solid ${colors.border.light}` }}
              >
                <Button
                  variant="light"
                  className="w-full justify-start"
                  startContent={
                    <SignOut
                      className="w-5 h-5"
                      style={{ color: colors.state.error }}
                    />
                  }
                  style={{ color: colors.state.error }}
                  onPress={() => setLogoutModalOpen(true)}
                >
                  {t("adminDashboard.nav.logout")}
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Top Header */}
        <header
          className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 lg:px-8 backdrop-blur-md"
          style={{
            backgroundColor:
              theme === "dark"
                ? "rgba(30, 41, 59, 0.8)"
                : "rgba(255, 255, 255, 0.8)",
            borderBottom: `1px solid ${colors.border.light}`,
          }}
        >
          {/* Mobile Menu Button */}
          <Button
            isIconOnly
            variant="light"
            className="lg:hidden"
            onPress={() => setMobileMenuOpen(true)}
          >
            <List className="w-6 h-6" style={{ color: colors.text.primary }} />
          </Button>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <Input
              type="text"
              placeholder={t("adminDashboard.search.placeholder")}
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
            <Badge content="5" color="danger" shape="circle" size="sm">
              <Button
                isIconOnly
                variant="light"
                radius="full"
                onPress={() => navigate("/admin/notifications")}
              >
                <Bell
                  className="w-5 h-5"
                  style={{ color: colors.text.secondary }}
                />
              </Button>
            </Badge>

            {/* User Menu */}
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button variant="light" className="gap-2 px-2">
                  <Avatar
                    src="https://i.pravatar.cc/150?u=admin"
                    size="sm"
                    className="w-8 h-8"
                  />
                  <div className="hidden sm:flex flex-col items-start">
                    <span
                      className="text-sm font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      Admin User
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: colors.text.secondary }}
                    >
                      {t("adminDashboard.role")}
                    </span>
                  </div>
                  <CaretDown
                    className="w-4 h-4 hidden sm:block"
                    style={{ color: colors.text.secondary }}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Admin actions">
                <DropdownItem
                  key="profile"
                  startContent={<UserCircle className="w-4 h-4" />}
                  onPress={() => navigate("/admin/settings")}
                >
                  {t("adminDashboard.nav.settings")}
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  startContent={<SignOut className="w-4 h-4" />}
                  onPress={() => setLogoutModalOpen(true)}
                >
                  {t("adminDashboard.nav.logout")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
      />
    </div>
  );
};

export default AdminDashboardLayout;
