import React, { useState } from "react";
import { Button, Link } from "@heroui/react";
import { GraduationCap, Menu, X, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { colors } from "../../constants/colors";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Find Tutors", href: "/tutors" },
    { name: "Courses", href: "/courses" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
  ];

  const isActiveRoute = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 backdrop-blur-md border-b"
        style={{
          backgroundColor: `${colors.background.light}f5`,
          borderColor: colors.border.light,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ backgroundColor: colors.primary.main }}
              >
                <GraduationCap
                  className="w-6 h-6"
                  style={{ color: colors.text.white }}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="font-bold text-xl leading-tight"
                  style={{ color: colors.text.primary }}
                >
                  EngConnect
                </span>
                <span
                  className="text-[10px] font-medium uppercase tracking-wider leading-tight"
                  style={{ color: colors.primary.main }}
                >
                  Learn English
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative px-4 py-2 rounded-lg font-medium text-sm transition-all"
                  style={{
                    color: isActiveRoute(item.href)
                      ? colors.primary.main
                      : colors.text.secondary,
                    backgroundColor: isActiveRoute(item.href)
                      ? colors.background.primaryLight
                      : "transparent",
                  }}
                >
                  {item.name}
                  {isActiveRoute(item.href) && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ backgroundColor: colors.primary.main }}
                    />
                  )}
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
              <div className="hidden md:flex items-center gap-2 ml-2">
                <Button
                  variant="light"
                  size="sm"
                  className="font-medium"
                  style={{ color: colors.text.primary }}
                  onPress={() => navigate("/login")}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  radius="lg"
                  className="font-semibold px-5"
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                  onPress={() => navigate("/register")}
                  endContent={<ChevronRight className="w-4 h-4" />}
                >
                  Get Started
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="lg:hidden"
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
        {isMobileMenuOpen && (
          <div
            className="lg:hidden border-t"
            style={{
              backgroundColor: colors.background.light,
              borderColor: colors.border.light,
            }}
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors"
                  style={{
                    color: isActiveRoute(item.href)
                      ? colors.primary.main
                      : colors.text.primary,
                    backgroundColor: isActiveRoute(item.href)
                      ? colors.background.primaryLight
                      : "transparent",
                  }}
                  onPress={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                  <ChevronRight
                    className="w-4 h-4"
                    style={{ color: colors.text.secondary }}
                  />
                </Link>
              ))}

              {/* Mobile Theme & Language */}
              <div
                className="flex items-center gap-2 px-4 py-3 mt-2 border-t"
                style={{ borderColor: colors.border.light }}
              >
                <ThemeSwitcher />
                <LanguageSwitcher />
              </div>

              {/* Mobile Auth Buttons */}
              <div
                className="flex flex-col gap-2 px-4 pt-4 mt-2 border-t"
                style={{ borderColor: colors.border.light }}
              >
                <Button
                  variant="bordered"
                  radius="lg"
                  className="font-medium w-full"
                  style={{
                    borderColor: colors.border.medium,
                    color: colors.text.primary,
                  }}
                  onPress={() => {
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  radius="lg"
                  className="font-semibold w-full"
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                  onPress={() => {
                    navigate("/register");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Get Started Free
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
