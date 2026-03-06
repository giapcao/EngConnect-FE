import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import useInputStyles from "../../../hooks/useInputStyles";
import { motion } from "framer-motion";
import {
  CurrencyDollar,
  TrendUp,
  Clock,
  ArrowRight,
  Bank,
  Wallet,
  CalendarCheck,
  ChartLine,
  ArrowUp,
  ArrowDown,
} from "@phosphor-icons/react";

const Earnings = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { inputClassNames, selectClassNames } = useInputStyles();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const stats = [
    {
      icon: CurrencyDollar,
      label: t("tutorDashboard.earnings.totalEarnings"),
      value: "$12,450",
      change: "+18%",
      trend: "up",
      color: colors.state.success,
      bg: `${colors.state.success}20`,
    },
    {
      icon: Wallet,
      label: t("tutorDashboard.earnings.availableBalance"),
      value: "$2,850",
      change: null,
      trend: null,
      color: colors.primary.main,
      bg: colors.background.primaryLight,
    },
    {
      icon: Clock,
      label: t("tutorDashboard.earnings.pendingPayment"),
      value: "$650",
      change: null,
      trend: null,
      color: colors.state.warning,
      bg: `${colors.state.warning}20`,
    },
    {
      icon: CalendarCheck,
      label: t("tutorDashboard.earnings.thisMonth"),
      value: "$2,450",
      change: "+12%",
      trend: "up",
      color: colors.state.info,
      bg: `${colors.state.info}20`,
    },
  ];

  const transactions = [
    {
      id: 1,
      type: "earning",
      description: "Business English - Lesson with Nguyen Van A",
      amount: 45,
      date: "Jan 23, 2026",
      status: "completed",
    },
    {
      id: 2,
      type: "earning",
      description: "IELTS Preparation - Lesson with Tran Thi B",
      amount: 55,
      date: "Jan 23, 2026",
      status: "completed",
    },
    {
      id: 3,
      type: "withdrawal",
      description: "Withdrawal to Bank Account",
      amount: -500,
      date: "Jan 22, 2026",
      status: "completed",
    },
    {
      id: 4,
      type: "earning",
      description: "Conversational English - Lesson with Le Van C",
      amount: 35,
      date: "Jan 22, 2026",
      status: "pending",
    },
    {
      id: 5,
      type: "earning",
      description: "Business English - Lesson with Pham Thi D",
      amount: 45,
      date: "Jan 21, 2026",
      status: "completed",
    },
    {
      id: 6,
      type: "withdrawal",
      description: "Withdrawal to MoMo Wallet",
      amount: -300,
      date: "Jan 20, 2026",
      status: "completed",
    },
  ];

  const monthlyData = [
    { month: "Aug", amount: 1800 },
    { month: "Sep", amount: 2100 },
    { month: "Oct", amount: 1950 },
    { month: "Nov", amount: 2400 },
    { month: "Dec", amount: 2200 },
    { month: "Jan", amount: 2450 },
  ];

  const maxAmount = Math.max(...monthlyData.map((d) => d.amount));

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return colors.state.success;
      case "pending":
        return colors.state.warning;
      default:
        return colors.text.secondary;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: colors.text.primary }}
          >
            {t("tutorDashboard.earnings.title")}
          </h1>
          <p style={{ color: colors.text.secondary }}>
            {t("tutorDashboard.earnings.subtitle")}
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Bank weight="duotone" className="w-5 h-5" />}
          style={{
            backgroundColor: colors.primary.main,
            color: colors.text.white,
          }}
          onPress={onOpen}
        >
          {t("tutorDashboard.earnings.withdraw")}
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <Card
            key={index}
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: stat.bg }}
                >
                  <stat.icon
                    weight="duotone"
                    className="w-6 h-6"
                    style={{ color: stat.color }}
                  />
                </div>
                <div className="flex-1">
                  <p
                    className="text-2xl font-bold"
                    style={{ color: colors.text.primary }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: colors.text.secondary }}
                  >
                    {stat.label}
                  </p>
                </div>
                {stat.change && (
                  <span
                    className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
                    style={{
                      backgroundColor:
                        stat.trend === "up"
                          ? `${colors.state.success}20`
                          : `${colors.state.error}20`,
                      color:
                        stat.trend === "up"
                          ? colors.state.success
                          : colors.state.error,
                    }}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUp weight="bold" className="w-3 h-3" />
                    ) : (
                      <ArrowDown weight="bold" className="w-3 h-3" />
                    )}
                    {stat.change}
                  </span>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="lg:col-span-2"
        >
          <Card
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-lg font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  <ChartLine
                    weight="duotone"
                    className="w-5 h-5 inline-block mr-2"
                    style={{ color: colors.primary.main }}
                  />
                  {t("tutorDashboard.earnings.earningsOverview")}
                </h2>
              </div>

              {/* Simple Bar Chart */}
              <div className="flex items-end justify-between h-48 gap-4">
                {monthlyData.map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: colors.text.secondary }}
                    >
                      ${data.amount}
                    </span>
                    <div
                      className="w-full rounded-t-lg transition-all"
                      style={{
                        height: `${(data.amount / maxAmount) * 100}%`,
                        backgroundColor:
                          index === monthlyData.length - 1
                            ? colors.primary.main
                            : colors.background.primaryLight,
                      }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: colors.text.tertiary }}
                    >
                      {data.month}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Quick Actions */}
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
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: colors.text.primary }}
              >
                {t("tutorDashboard.earnings.quickActions")}
              </h2>

              <div className="space-y-3">
                <Button
                  fullWidth
                  variant="flat"
                  className="justify-start"
                  startContent={
                    <Bank
                      weight="duotone"
                      className="w-5 h-5"
                      style={{ color: colors.primary.main }}
                    />
                  }
                  endContent={<ArrowRight className="w-4 h-4" />}
                  style={{
                    backgroundColor: colors.background.gray,
                    color: colors.text.primary,
                  }}
                >
                  {t("tutorDashboard.earnings.addBankAccount")}
                </Button>
                <Button
                  fullWidth
                  variant="flat"
                  className="justify-start"
                  startContent={
                    <Wallet
                      weight="duotone"
                      className="w-5 h-5"
                      style={{ color: colors.state.success }}
                    />
                  }
                  endContent={<ArrowRight className="w-4 h-4" />}
                  style={{
                    backgroundColor: colors.background.gray,
                    color: colors.text.primary,
                  }}
                >
                  {t("tutorDashboard.earnings.linkMoMo")}
                </Button>
                <Button
                  fullWidth
                  variant="flat"
                  className="justify-start"
                  startContent={
                    <TrendUp
                      weight="duotone"
                      className="w-5 h-5"
                      style={{ color: colors.state.info }}
                    />
                  }
                  endContent={<ArrowRight className="w-4 h-4" />}
                  style={{
                    backgroundColor: colors.background.gray,
                    color: colors.text.primary,
                  }}
                >
                  {t("tutorDashboard.earnings.viewReports")}
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Transactions */}
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
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-lg font-semibold"
                style={{ color: colors.text.primary }}
              >
                {t("tutorDashboard.earnings.recentTransactions")}
              </h2>
              <Button
                variant="light"
                size="sm"
                endContent={<ArrowRight className="w-4 h-4" />}
                style={{ color: colors.primary.main }}
              >
                {t("tutorDashboard.earnings.viewAll")}
              </Button>
            </div>

            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          transaction.type === "earning"
                            ? `${colors.state.success}20`
                            : `${colors.state.error}20`,
                      }}
                    >
                      {transaction.type === "earning" ? (
                        <ArrowDown
                          weight="bold"
                          className="w-5 h-5"
                          style={{ color: colors.state.success }}
                        />
                      ) : (
                        <ArrowUp
                          weight="bold"
                          className="w-5 h-5"
                          style={{ color: colors.state.error }}
                        />
                      )}
                    </div>
                    <div>
                      <p
                        className="font-medium text-sm"
                        style={{ color: colors.text.primary }}
                      >
                        {transaction.description}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: colors.text.tertiary }}
                      >
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Chip
                      size="sm"
                      style={{
                        backgroundColor: `${getStatusColor(transaction.status)}20`,
                        color: getStatusColor(transaction.status),
                      }}
                    >
                      {transaction.status}
                    </Chip>
                    <span
                      className="font-semibold"
                      style={{
                        color:
                          transaction.amount > 0
                            ? colors.state.success
                            : colors.state.error,
                      }}
                    >
                      {transaction.amount > 0 ? "+" : ""}$
                      {Math.abs(transaction.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Withdraw Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          <ModalHeader style={{ color: colors.text.primary }}>
            {t("tutorDashboard.earnings.withdrawFunds")}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div
                className="p-4 rounded-xl text-center"
                style={{ backgroundColor: colors.background.gray }}
              >
                <p
                  className="text-sm mb-1"
                  style={{ color: colors.text.secondary }}
                >
                  {t("tutorDashboard.earnings.availableBalance")}
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: colors.primary.main }}
                >
                  $2,850
                </p>
              </div>

              <Input
                label={t("tutorDashboard.earnings.amount")}
                placeholder="0.00"
                type="number"
                labelPlacement="outside"
                classNames={inputClassNames}
                startContent={
                  <span style={{ color: colors.text.tertiary }}>$</span>
                }
              />

              <Select
                label={t("tutorDashboard.earnings.withdrawTo")}
                labelPlacement="outside"
                placeholder={t("tutorDashboard.earnings.selectMethod")}
                classNames={selectClassNames}
              >
                <SelectItem key="bank" value="bank">
                  Bank Account - **** 1234
                </SelectItem>
                <SelectItem key="momo" value="momo">
                  MoMo Wallet - **** 5678
                </SelectItem>
              </Select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              {t("tutorDashboard.earnings.cancel")}
            </Button>
            <Button
              style={{
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
              onPress={onClose}
            >
              {t("tutorDashboard.earnings.confirmWithdraw")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Earnings;
