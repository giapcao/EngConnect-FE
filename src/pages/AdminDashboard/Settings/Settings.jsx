import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Switch,
  Tabs,
  Tab,
  Avatar,
  Divider,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import useInputStyles from "../../../hooks/useInputStyles";
import { motion } from "framer-motion";
import {
  Gear,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CurrencyDollar,
  EnvelopeSimple,
  Camera,
} from "@phosphor-icons/react";

const Settings = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { inputClassNames } = useInputStyles();
  const [activeTab, setActiveTab] = useState("profile");

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newUserAlerts: true,
    financialAlerts: true,
    systemAlerts: true,
    twoFactorAuth: false,
    platformFee: "10",
    tutorCommission: "80",
    minWithdrawal: "50",
  });

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <h1
          className="text-2xl lg:text-3xl font-bold mb-1"
          style={{ color: colors.text.primary }}
        >
          {t("adminDashboard.settings.title")}
        </h1>
        <p style={{ color: colors.text.secondary }}>
          {t("adminDashboard.settings.subtitle")}
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          variant="underlined"
          classNames={{
            tabList: "gap-6",
            cursor: "w-full",
          }}
          style={{ color: colors.text.primary }}
        >
          <Tab
            key="profile"
            title={
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{t("adminDashboard.settings.tabs.profile")}</span>
              </div>
            }
          />
          <Tab
            key="notifications"
            title={
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span>{t("adminDashboard.settings.tabs.notifications")}</span>
              </div>
            }
          />
          <Tab
            key="security"
            title={
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>{t("adminDashboard.settings.tabs.security")}</span>
              </div>
            }
          />
          <Tab
            key="platform"
            title={
              <div className="flex items-center gap-2">
                <Gear className="w-4 h-4" />
                <span>{t("adminDashboard.settings.tabs.platform")}</span>
              </div>
            }
          />
        </Tabs>
      </motion.div>

      {/* Profile Settings */}
      {activeTab === "profile" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <Card
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-6">
              <h3
                className="text-lg font-semibold mb-6"
                style={{ color: colors.text.primary }}
              >
                {t("adminDashboard.settings.profileInfo")}
              </h3>

              {/* Avatar Section */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <Avatar
                    src="https://i.pravatar.cc/150?u=admin"
                    className="w-24 h-24"
                  />
                  <Button
                    isIconOnly
                    size="sm"
                    className="absolute bottom-0 right-0"
                    style={{
                      backgroundColor: colors.primary.main,
                      color: colors.text.white,
                    }}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <h4
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    Admin User
                  </h4>
                  <p style={{ color: colors.text.secondary }}>
                    admin@engconnect.com
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{ color: colors.text.tertiary }}
                  >
                    {t("adminDashboard.role")}
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={t("adminDashboard.settings.firstName")}
                  defaultValue="Admin"
                  variant="bordered"
                  classNames={inputClassNames}
                />
                <Input
                  label={t("adminDashboard.settings.lastName")}
                  defaultValue="User"
                  variant="bordered"
                  classNames={inputClassNames}
                />
                <Input
                  label={t("adminDashboard.settings.email")}
                  defaultValue="admin@engconnect.com"
                  type="email"
                  variant="bordered"
                  classNames={inputClassNames}
                  startContent={
                    <EnvelopeSimple className="w-4 h-4 text-gray-400" />
                  }
                />
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                >
                  {t("adminDashboard.settings.saveChanges")}
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Notification Settings */}
      {activeTab === "notifications" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <Card
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-6">
              <h3
                className="text-lg font-semibold mb-6"
                style={{ color: colors.text.primary }}
              >
                {t("adminDashboard.settings.notificationPreferences")}
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {t("adminDashboard.settings.emailNotifications")}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {t("adminDashboard.settings.emailNotificationsDesc")}
                    </p>
                  </div>
                  <Switch
                    isSelected={settings.emailNotifications}
                    onValueChange={(value) =>
                      handleSettingChange("emailNotifications", value)
                    }
                    color="primary"
                  />
                </div>

                <Divider />

                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {t("adminDashboard.settings.pushNotifications")}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {t("adminDashboard.settings.pushNotificationsDesc")}
                    </p>
                  </div>
                  <Switch
                    isSelected={settings.pushNotifications}
                    onValueChange={(value) =>
                      handleSettingChange("pushNotifications", value)
                    }
                    color="primary"
                  />
                </div>

                <Divider />

                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {t("adminDashboard.settings.newUserAlerts")}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {t("adminDashboard.settings.newUserAlertsDesc")}
                    </p>
                  </div>
                  <Switch
                    isSelected={settings.newUserAlerts}
                    onValueChange={(value) =>
                      handleSettingChange("newUserAlerts", value)
                    }
                    color="primary"
                  />
                </div>

                <Divider />

                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {t("adminDashboard.settings.financialAlerts")}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {t("adminDashboard.settings.financialAlertsDesc")}
                    </p>
                  </div>
                  <Switch
                    isSelected={settings.financialAlerts}
                    onValueChange={(value) =>
                      handleSettingChange("financialAlerts", value)
                    }
                    color="primary"
                  />
                </div>

                <Divider />

                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {t("adminDashboard.settings.systemAlerts")}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {t("adminDashboard.settings.systemAlertsDesc")}
                    </p>
                  </div>
                  <Switch
                    isSelected={settings.systemAlerts}
                    onValueChange={(value) =>
                      handleSettingChange("systemAlerts", value)
                    }
                    color="primary"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                >
                  {t("adminDashboard.settings.saveChanges")}
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Security Settings */}
      {activeTab === "security" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          <Card
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-6">
              <h3
                className="text-lg font-semibold mb-6"
                style={{ color: colors.text.primary }}
              >
                {t("adminDashboard.settings.changePassword")}
              </h3>

              <div className="space-y-4 max-w-md">
                <Input
                  label={t("adminDashboard.settings.currentPassword")}
                  type="password"
                  variant="bordered"
                  classNames={inputClassNames}
                />
                <Input
                  label={t("adminDashboard.settings.newPassword")}
                  type="password"
                  variant="bordered"
                  classNames={inputClassNames}
                />
                <Input
                  label={t("adminDashboard.settings.confirmPassword")}
                  type="password"
                  variant="bordered"
                  classNames={inputClassNames}
                />
                <Button
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                >
                  {t("adminDashboard.settings.updatePassword")}
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-6">
              <h3
                className="text-lg font-semibold mb-6"
                style={{ color: colors.text.primary }}
              >
                {t("adminDashboard.settings.twoFactorAuth")}
              </h3>

              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="font-medium"
                    style={{ color: colors.text.primary }}
                  >
                    {t("adminDashboard.settings.enable2FA")}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    {t("adminDashboard.settings.enable2FADesc")}
                  </p>
                </div>
                <Switch
                  isSelected={settings.twoFactorAuth}
                  onValueChange={(value) =>
                    handleSettingChange("twoFactorAuth", value)
                  }
                  color="primary"
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Platform Settings */}
      {activeTab === "platform" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          <Card
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-6">
              <h3
                className="text-lg font-semibold mb-6"
                style={{ color: colors.text.primary }}
              >
                {t("adminDashboard.settings.financialSettings")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label={t("adminDashboard.settings.platformFee")}
                  type="number"
                  value={settings.platformFee}
                  onChange={(e) =>
                    handleSettingChange("platformFee", e.target.value)
                  }
                  variant="bordered"
                  classNames={inputClassNames}
                  endContent={<span className="text-gray-400">%</span>}
                />
                <Input
                  label={t("adminDashboard.settings.tutorCommission")}
                  type="number"
                  value={settings.tutorCommission}
                  onChange={(e) =>
                    handleSettingChange("tutorCommission", e.target.value)
                  }
                  variant="bordered"
                  classNames={inputClassNames}
                  endContent={<span className="text-gray-400">%</span>}
                />
                <Input
                  label={t("adminDashboard.settings.minWithdrawal")}
                  type="number"
                  value={settings.minWithdrawal}
                  onChange={(e) =>
                    handleSettingChange("minWithdrawal", e.target.value)
                  }
                  variant="bordered"
                  classNames={inputClassNames}
                  startContent={<span className="text-gray-400">$</span>}
                />
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                >
                  {t("adminDashboard.settings.saveChanges")}
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-6">
              <h3
                className="text-lg font-semibold mb-6"
                style={{ color: colors.text.primary }}
              >
                {t("adminDashboard.settings.generalSettings")}
              </h3>

              <div className="space-y-4">
                <div
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <div className="flex items-center gap-3">
                    <Globe
                      className="w-5 h-5"
                      style={{ color: colors.primary.main }}
                    />
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        {t("adminDashboard.settings.maintenanceMode")}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {t("adminDashboard.settings.maintenanceModeDesc")}
                      </p>
                    </div>
                  </div>
                  <Switch color="warning" />
                </div>

                <div
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <div className="flex items-center gap-3">
                    <User
                      className="w-5 h-5"
                      style={{ color: colors.primary.main }}
                    />
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        {t("adminDashboard.settings.newRegistrations")}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {t("adminDashboard.settings.newRegistrationsDesc")}
                      </p>
                    </div>
                  </div>
                  <Switch isSelected color="primary" />
                </div>

                <div
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <div className="flex items-center gap-3">
                    <Shield
                      className="w-5 h-5"
                      style={{ color: colors.primary.main }}
                    />
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        {t("adminDashboard.settings.emailVerification")}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {t("adminDashboard.settings.emailVerificationDesc")}
                      </p>
                    </div>
                  </div>
                  <Switch isSelected color="primary" />
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Settings;
