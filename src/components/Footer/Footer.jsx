import React, { useState } from "react";
import { Link, Button, Input } from "@heroui/react";
import {
  GraduationCap,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Send,
  ArrowRight,
  Users,
  BookOpen,
  Star,
  MoveRight,
  Phone,
  MapPin,
} from "lucide-react";
import { colors } from "../../constants/colors";

const Footer = () => {
  const [email, setEmail] = useState("");

  const footerLinks = {
    learn: [
      { name: "Find Tutors", href: "/tutors" },
      { name: "Browse Courses", href: "/courses" },
      { name: "Pricing", href: "/pricing" },
      { name: "How It Works", href: "/how-it-works" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Community", href: "/community" },
      { name: "Become a Tutor", href: "/teach" },
      { name: "FAQs", href: "/faqs" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Subscribed:", email);
      setEmail("");
    }
  };

  // Animated Link Component
  const AnimatedLink = ({ href, children, badge }) => (
    <Link
      href={href}
      className="group text-base inline-flex items-center gap-1.5 transition-all duration-200"
      style={{ color: colors.text.secondary }}
    >
      <MoveRight
        className="w-0 h-4 opacity-0 -ml-1 group-hover:w-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200"
        style={{ color: colors.primary.main }}
      />
      <span className="group-hover:translate-x-0.5 transition-transform duration-200">
        {children}
      </span>
      {badge && (
        <span
          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={{
            backgroundColor: colors.primary.main,
            color: colors.text.white,
          }}
        >
          {badge}
        </span>
      )}
    </Link>
  );

  return (
    <footer>
      {/* CTA Banner */}
      <div style={{ backgroundColor: colors.primary.main }}></div>
      {/* Main Footer */}
      <div style={{ backgroundColor: colors.background.light }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Logo */}
              <Link href="/" className="inline-flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: colors.primary.main }}
                >
                  <GraduationCap
                    className="w-5 h-5"
                    style={{ color: colors.text.white }}
                  />
                </div>
                <span
                  className="font-bold text-xl"
                  style={{ color: colors.text.primary }}
                >
                  EngConnect
                </span>
              </Link>

              <p
                className="text-base leading-relaxed max-w-xs"
                style={{ color: colors.text.secondary }}
              >
                The #1 platform for personalized English learning. Connect with
                native tutors and achieve fluency with AI-powered tools.
              </p>

              {/* Newsletter */}
              <div>
                <p
                  className="text-sm font-medium mb-3"
                  style={{ color: colors.text.primary }}
                >
                  Subscribe to our newsletter
                </p>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="sm"
                    radius="lg"
                    className="flex-1"
                    classNames={{
                      inputWrapper: "h-10",
                    }}
                    startContent={
                      <Mail
                        className="w-4 h-4"
                        style={{ color: colors.text.secondary }}
                      />
                    }
                  />
                  <Button
                    type="submit"
                    size="sm"
                    radius="lg"
                    isIconOnly
                    className="h-10 w-10"
                    style={{
                      backgroundColor: colors.primary.main,
                      color: colors.text.white,
                    }}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-3 gap-6">
                {Object.entries(footerLinks).map(([title, links]) => (
                  <div key={title}>
                    <h4
                      className="text-sm font-bold uppercase tracking-wider mb-4 pb-2 relative inline-block"
                      style={{ color: colors.text.primary }}
                    >
                      {title}
                      <span
                        className="absolute bottom-0 left-0 h-0.5 w-1/2"
                        style={{ backgroundColor: colors.primary.main }}
                      />
                    </h4>
                    <ul className="space-y-2.5">
                      {links.map((link) => (
                        <li key={link.name}>
                          <AnimatedLink href={link.href} badge={link.badge}>
                            {link.name}
                          </AnimatedLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Column */}
            <div className="lg:col-span-3">
              <h4
                className="text-sm font-bold uppercase tracking-wider mb-4 pb-2 relative inline-block"
                style={{ color: colors.text.primary }}
              >
                Follow Us
                <span
                  className="absolute bottom-0 left-0 h-0.5 w-1/2"
                  style={{ backgroundColor: colors.primary.main }}
                />
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: colors.background.input,
                      color: colors.text.secondary,
                    }}
                  >
                    <social.icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>

              {/* Contact Information */}
              <div className="mt-6">
                <p
                  className="text-sm font-bold uppercase tracking-wider mb-3 pb-2 relative inline-block"
                  style={{ color: colors.text.primary }}
                >
                  Contact
                  <span
                    className="absolute bottom-0 left-0 h-0.5 w-1/2"
                    style={{ backgroundColor: colors.primary.main }}
                  />
                </p>
                <div className="flex flex-wrap gap-6">
                  {/* Email */}
                  <a
                    href="mailto:hello@engconnect.com"
                    className="flex items-center gap-2 text-sm hover:underline transition-colors"
                    style={{ color: colors.text.secondary }}
                  >
                    <Mail
                      className="w-4 h-4"
                      style={{ color: colors.primary.main }}
                    />
                    <span>hello@engconnect.com</span>
                  </a>

                  {/* Hotline */}
                  <a
                    href="tel:+84123456789"
                    className="flex items-center gap-2 text-sm hover:underline transition-colors"
                    style={{ color: colors.text.secondary }}
                  >
                    <Phone
                      className="w-4 h-4"
                      style={{ color: colors.primary.main }}
                    />
                    <span>+84 123 456 789</span>
                  </a>

                  {/* Address */}
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    <MapPin
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: colors.primary.main }}
                    />
                    <span>7Đ. D1, Long Thạnh Mỹ, Thủ Đức, TP.HCM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="border-t"
        style={{
          borderColor: colors.border.light,
          backgroundColor: colors.background.gray,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: colors.text.secondary }}>
              © {new Date().getFullYear()} EngConnect. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-xs transition-colors duration-200 hover:underline"
                  style={{ color: colors.text.secondary }}
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span
                className="text-xs"
                style={{ color: colors.text.secondary }}
              >
                🇻🇳
              </span>
              <span
                className="text-xs"
                style={{ color: colors.text.secondary }}
              >
                Made in Vietnam
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
