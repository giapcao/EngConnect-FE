import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Tabs,
  Tab,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import useTableStyles from "../../../hooks/useTableStyles";
import { motion } from "framer-motion";
import {
  CurrencyDollar,
  TrendUp,
  TrendDown,
  CalendarBlank,
  CaretDown,
  Export,
  Wallet,
  ArrowsLeftRight,
  Receipt,
  Bank,
} from "@phosphor-icons/react";

const FinancialManagement = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { tableCardStyle, tableClassNames } = useTableStyles();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");
  const [page, setPage] = useState(1);

  const stats = [
    {
      icon: CurrencyDollar,
      label: t("adminDashboard.finance.stats.totalRevenue"),
      value: "$128,450",
      change: "+22.4%",
      trend: "up",
      color: colors.state.success,
      bg: `${colors.state.success}20`,
    },
    {
      icon: Wallet,
      label: t("adminDashboard.finance.stats.pendingPayouts"),
      value: "$24,680",
      change: "+5.2%",
      trend: "up",
      color: colors.state.warning,
      bg: `${colors.state.warning}20`,
    },
    {
      icon: ArrowsLeftRight,
      label: t("adminDashboard.finance.stats.totalTransactions"),
      value: "3,456",
      change: "+18.3%",
      trend: "up",
      color: colors.primary.main,
      bg: colors.background.primaryLight,
    },
    {
      icon: Bank,
      label: t("adminDashboard.finance.stats.platformFees"),
      value: "$15,230",
      change: "+12.1%",
      trend: "up",
      color: colors.state.error,
      bg: `${colors.state.error}20`,
    },
  ];

  const transactions = [
    {
      id: "TXN001",
      type: "course_purchase",
      description: "Business English Masterclass",
      user: "John Doe",
      amount: "$49.99",
      fee: "$5.00",
      status: "completed",
      date: "Jan 26, 2024",
    },
    {
      id: "TXN002",
      type: "tutor_payout",
      description: "Monthly earnings payout",
      user: "Sarah Johnson",
      amount: "$1,245.00",
      fee: "$0.00",
      status: "completed",
      date: "Jan 25, 2024",
    },
    {
      id: "TXN003",
      type: "course_purchase",
      description: "IELTS Preparation Guide",
      user: "Emily Chen",
      amount: "$79.99",
      fee: "$8.00",
      status: "completed",
      date: "Jan 25, 2024",
    },
    {
      id: "TXN004",
      type: "refund",
      description: "Course refund request",
      user: "Michael Brown",
      amount: "-$29.99",
      fee: "$0.00",
      status: "pending",
      date: "Jan 24, 2024",
    },
    {
      id: "TXN005",
      type: "subscription",
      description: "Premium subscription",
      user: "Lisa Wang",
      amount: "$19.99",
      fee: "$2.00",
      status: "completed",
      date: "Jan 24, 2024",
    },
  ];

  const pendingPayouts = [
    {
      id: "PAY001",
      tutor: "Sarah Johnson",
      amount: "$2,450.00",
      period: "Jan 1-15, 2024",
      status: "pending",
    },
    {
      id: "PAY002",
      tutor: "Michael Chen",
      amount: "$1,830.00",
      period: "Jan 1-15, 2024",
      status: "pending",
    },
    {
      id: "PAY003",
      tutor: "Emma Wilson",
      amount: "$3,200.00",
      period: "Jan 1-15, 2024",
      status: "processing",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "processing":
        return "primary";
      case "failed":
        return "danger";
      default:
        return "default";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "course_purchase":
        return t("adminDashboard.finance.types.coursePurchase");
      case "tutor_payout":
        return t("adminDashboard.finance.types.tutorPayout");
      case "refund":
        return t("adminDashboard.finance.types.refund");
      case "subscription":
        return t("adminDashboard.finance.types.subscription");
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1
            className="text-2xl lg:text-3xl font-bold mb-1"
            style={{ color: colors.text.primary }}
          >
            {t("adminDashboard.finance.title")}
          </h1>
          <p style={{ color: colors.text.secondary }}>
            {t("adminDashboard.finance.subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                startContent={<CalendarBlank className="w-4 h-4" />}
                endContent={<CaretDown className="w-4 h-4" />}
              >
                {selectedPeriod === "week"
                  ? t("adminDashboard.finance.thisWeek")
                  : selectedPeriod === "month"
                    ? t("adminDashboard.finance.thisMonth")
                    : t("adminDashboard.finance.thisYear")}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Period selection"
              onAction={(key) => setSelectedPeriod(key)}
              selectedKeys={[selectedPeriod]}
              selectionMode="single"
            >
              <DropdownItem key="week">
                {t("adminDashboard.finance.thisWeek")}
              </DropdownItem>
              <DropdownItem key="month">
                {t("adminDashboard.finance.thisMonth")}
              </DropdownItem>
              <DropdownItem key="year">
                {t("adminDashboard.finance.thisYear")}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button
            variant="flat"
            startContent={<Export className="w-4 h-4" />}
            style={{ color: colors.text.primary }}
          >
            {t("adminDashboard.finance.export")}
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Card
              shadow="none"
              className="border-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="p-5">
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: stat.bg }}
                  >
                    <stat.icon
                      className="w-6 h-6"
                      weight="duotone"
                      style={{ color: stat.color }}
                    />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendUp className="w-4 h-4" />
                    ) : (
                      <TrendDown className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p
                    className="text-2xl font-bold"
                    style={{ color: colors.text.primary }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{ color: colors.text.secondary }}
                  >
                    {stat.label}
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

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
            key="overview"
            title={t("adminDashboard.finance.tabs.overview")}
          />
          <Tab
            key="transactions"
            title={t("adminDashboard.finance.tabs.transactions")}
          />
          <Tab key="payouts" title={t("adminDashboard.finance.tabs.payouts")} />
        </Tabs>
      </motion.div>

      {/* Transactions Table */}
      {activeTab === "transactions" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <Card shadow="none" className="border-none" style={tableCardStyle}>
            <CardBody className="p-0">
              <Table
                aria-label="Transactions table"
                classNames={tableClassNames}
                bottomContent={
                  <div className="flex w-full justify-center py-4">
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color="primary"
                      page={page}
                      total={10}
                      onChange={(page) => setPage(page)}
                    />
                  </div>
                }
              >
                <TableHeader>
                  <TableColumn>
                    {t("adminDashboard.finance.table.id")}
                  </TableColumn>
                  <TableColumn>
                    {t("adminDashboard.finance.table.type")}
                  </TableColumn>
                  <TableColumn>
                    {t("adminDashboard.finance.table.description")}
                  </TableColumn>
                  <TableColumn>
                    {t("adminDashboard.finance.table.user")}
                  </TableColumn>
                  <TableColumn>
                    {t("adminDashboard.finance.table.amount")}
                  </TableColumn>
                  <TableColumn>
                    {t("adminDashboard.finance.table.fee")}
                  </TableColumn>
                  <TableColumn>
                    {t("adminDashboard.finance.table.status")}
                  </TableColumn>
                  <TableColumn>
                    {t("adminDashboard.finance.table.date")}
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <span
                          className="font-mono text-sm"
                          style={{ color: colors.text.primary }}
                        >
                          {transaction.id}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat">
                          {getTypeLabel(transaction.type)}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: colors.text.primary }}>
                          {transaction.description}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: colors.text.secondary }}>
                          {transaction.user}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className="font-medium"
                          style={{
                            color: transaction.amount.startsWith("-")
                              ? colors.state.error
                              : colors.state.success,
                          }}
                        >
                          {transaction.amount}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: colors.text.tertiary }}>
                          {transaction.fee}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          color={getStatusColor(transaction.status)}
                          variant="flat"
                        >
                          {transaction.status}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: colors.text.secondary }}>
                          {transaction.date}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Payouts */}
      {activeTab === "payouts" && (
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
            <CardBody className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  {t("adminDashboard.finance.pendingPayouts")}
                </h3>
                <Button
                  size="sm"
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                >
                  {t("adminDashboard.finance.processAll")}
                </Button>
              </div>
              <div className="space-y-3">
                {pendingPayouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        {payout.tutor}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {payout.period}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p
                        className="text-lg font-bold"
                        style={{ color: colors.state.success }}
                      >
                        {payout.amount}
                      </p>
                      <Chip
                        size="sm"
                        color={getStatusColor(payout.status)}
                        variant="flat"
                      >
                        {payout.status}
                      </Chip>
                      <Button
                        size="sm"
                        variant="flat"
                        style={{
                          backgroundColor: colors.state.success + "20",
                          color: colors.state.success,
                        }}
                      >
                        {t("adminDashboard.finance.process")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
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
              <CardBody className="p-5">
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: colors.text.primary }}
                >
                  {t("adminDashboard.finance.recentTransactions")}
                </h3>
                <div className="space-y-3">
                  {transactions.slice(0, 4).map((transaction) => (
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
                              transaction.type === "refund"
                                ? colors.state.error + "20"
                                : colors.state.success + "20",
                          }}
                        >
                          <Receipt
                            className="w-5 h-5"
                            style={{
                              color:
                                transaction.type === "refund"
                                  ? colors.state.error
                                  : colors.state.success,
                            }}
                          />
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            {transaction.description}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: colors.text.tertiary }}
                          >
                            {transaction.user}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className="font-medium"
                          style={{
                            color: transaction.amount.startsWith("-")
                              ? colors.state.error
                              : colors.state.success,
                          }}
                        >
                          {transaction.amount}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: colors.text.tertiary }}
                        >
                          {transaction.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Pending Payouts Preview */}
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
              <CardBody className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    {t("adminDashboard.finance.pendingPayouts")}
                  </h3>
                  <span
                    className="px-2 py-1 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: colors.state.warning + "20",
                      color: colors.state.warning,
                    }}
                  >
                    {pendingPayouts.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {pendingPayouts.map((payout) => (
                    <div
                      key={payout.id}
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{ backgroundColor: colors.background.gray }}
                    >
                      <div>
                        <p
                          className="font-medium"
                          style={{ color: colors.text.primary }}
                        >
                          {payout.tutor}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: colors.text.tertiary }}
                        >
                          {payout.period}
                        </p>
                      </div>
                      <p
                        className="font-bold"
                        style={{ color: colors.state.success }}
                      >
                        {payout.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FinancialManagement;
