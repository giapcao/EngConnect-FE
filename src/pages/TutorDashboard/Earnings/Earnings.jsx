import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Skeleton,
} from "@heroui/react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import useInputStyles from "../../../hooks/useInputStyles";
import useTableStyles from "../../../hooks/useTableStyles";
import { motion } from "framer-motion";
import {
  CurrencyDollar,
  TrendUp,
  Wallet,
  ChartLine,
  Bank,
  Receipt,
  ArrowSquareOut,
  CheckCircle,
  XCircle,
  Hourglass,
  Lightning,
} from "@phosphor-icons/react";
import { selectUser } from "../../../store";
import { paymentApi, tutorApi } from "../../../api";
import TutorWithdrawTicketModal from "../../../components/TutorWithdrawTicketModal/TutorWithdrawTicketModal";

const formatVND = (amount) => {
  if (amount == null) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

const Earnings = () => {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();
  const { selectClassNames } = useInputStyles();
  const { tableCardStyle, tableClassNames } = useTableStyles();
  const user = useSelector(selectUser);
  const dateLocale = i18n.language === "vi" ? "vi-VN" : "en-US";

  const [activeTab, setActiveTab] = useState("earnings");
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  // Tutor profile (for bank info)
  const [tutorProfile, setTutorProfile] = useState(null);

  // Total earning summary
  const [totalSummary, setTotalSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  // Monthly chart
  const currentYear = new Date().getFullYear();
  const [chartYear, setChartYear] = useState(String(currentYear));
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyLoading, setMonthlyLoading] = useState(true);

  // Earnings table
  const [earnings, setEarnings] = useState([]);
  const [earningsLoading, setEarningsLoading] = useState(true);
  const [earningsPage, setEarningsPage] = useState(1);
  const [earningsTotalPages, setEarningsTotalPages] = useState(1);
  const [earningsStatusFilter, setEarningsStatusFilter] = useState("");

  // Payouts table
  const [payouts, setPayouts] = useState([]);
  const [payoutsLoading, setPayoutsLoading] = useState(false);
  const [payoutsPage, setPayoutsPage] = useState(1);
  const [payoutsTotalPages, setPayoutsTotalPages] = useState(1);
  const [payoutTypeFilter, setPayoutTypeFilter] = useState("");
  const [payoutStatusFilter, setPayoutStatusFilter] = useState("");

  // Payout detail modal
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [payoutItems, setPayoutItems] = useState([]);
  const [payoutItemsLoading, setPayoutItemsLoading] = useState(false);
  const [payoutDetailOpen, setPayoutDetailOpen] = useState(false);

  // ── Fetchers ────────────────────────────────────────
  useEffect(() => {
    tutorApi
      .getTutorProfile()
      .then((res) => {
        if (res?.isSuccess) setTutorProfile(res.data);
      })
      .catch(() => {});
  }, []);

  const fetchSummary = useCallback(async () => {
    if (!user?.tutorId) return;
    setSummaryLoading(true);
    try {
      const res = await paymentApi.getTotalEarning({ TutorId: user.tutorId });
      setTotalSummary(res?.data?.singleTutor || null);
    } catch {
      setTotalSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }, [user?.tutorId]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const fetchMonthly = useCallback(async () => {
    if (!user?.tutorId) return;
    setMonthlyLoading(true);
    try {
      const res = await paymentApi.getMonthlyTotal({
        TutorId: user.tutorId,
        Year: chartYear,
      });
      setMonthlyData(res?.data?.monthlyEarnings || []);
    } catch {
      setMonthlyData([]);
    } finally {
      setMonthlyLoading(false);
    }
  }, [user?.tutorId, chartYear]);

  useEffect(() => {
    fetchMonthly();
  }, [fetchMonthly]);

  const fetchEarnings = useCallback(async () => {
    if (!user?.tutorId) return;
    setEarningsLoading(true);
    try {
      const params = {
        TutorId: user.tutorId,
        page: earningsPage,
        "page-size": 10,
      };
      if (earningsStatusFilter) params.Status = earningsStatusFilter;
      const res = await paymentApi.getEarnings(params);
      setEarnings(res?.data?.items || []);
      setEarningsTotalPages(res?.data?.totalPages || 1);
    } catch {
      setEarnings([]);
    } finally {
      setEarningsLoading(false);
    }
  }, [user?.tutorId, earningsPage, earningsStatusFilter]);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  const fetchPayouts = useCallback(async () => {
    if (!user?.tutorId) return;
    setPayoutsLoading(true);
    try {
      const params = {
        TutorId: user.tutorId,
        page: payoutsPage,
        "page-size": 10,
      };
      if (payoutTypeFilter) params.PayoutType = payoutTypeFilter;
      if (payoutStatusFilter) params.Status = payoutStatusFilter;
      const res = await paymentApi.getPayouts(params);
      setPayouts(res?.data?.items || []);
      setPayoutsTotalPages(res?.data?.totalPages || 1);
    } catch {
      setPayouts([]);
    } finally {
      setPayoutsLoading(false);
    }
  }, [user?.tutorId, payoutsPage, payoutTypeFilter, payoutStatusFilter]);

  useEffect(() => {
    if (activeTab === "payouts") fetchPayouts();
  }, [activeTab, fetchPayouts]);

  const openPayoutDetail = async (payout) => {
    setSelectedPayout(payout);
    setPayoutDetailOpen(true);
    setPayoutItemsLoading(true);
    setPayoutItems([]);
    try {
      const res = await paymentApi.getPayoutItems({
        TutorPayoutId: payout.id,
        "page-size": 100,
      });
      setPayoutItems(res?.data?.items || []);
    } catch {
      setPayoutItems([]);
    } finally {
      setPayoutItemsLoading(false);
    }
  };

  // ── Helpers ─────────────────────────────────────────
  const getEarningStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return colors.state.success;
      case "Unpaid":
        return colors.state.warning;
      default:
        return colors.text.tertiary;
    }
  };

  const getPayoutStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return colors.state.success;
      case "Processing":
        return colors.primary.main;
      case "Pending":
        return colors.state.warning;
      case "Failed":
      case "Cancelled":
        return colors.state.error;
      default:
        return colors.text.tertiary;
    }
  };

  const getPayoutStatusIcon = (status) => {
    switch (status) {
      case "Paid":
        return CheckCircle;
      case "Processing":
        return Lightning;
      case "Pending":
        return Hourglass;
      case "Failed":
      case "Cancelled":
        return XCircle;
      default:
        return Hourglass;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString(dateLocale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString(dateLocale, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const maxMonthly = useMemo(
    () => Math.max(1, ...monthlyData.map((d) => d.totalNetAmount || 0)),
    [monthlyData],
  );

  const yearOptions = useMemo(() => {
    const years = [];
    for (let y = currentYear; y >= currentYear - 5; y--) years.push(String(y));
    return years;
  }, [currentYear]);

  // ── Stats ───────────────────────────────────────────
  const stats = [
    {
      icon: Wallet,
      label: t("tutorDashboard.earnings.availableBalance"),
      value: formatVND(totalSummary?.availableBalance),
      color: colors.primary.main,
      bg: colors.background.primaryLight,
    },
    {
      icon: CurrencyDollar,
      label: t("tutorDashboard.earnings.totalNet"),
      value: formatVND(totalSummary?.totalNetAmount),
      color: colors.state.success,
      bg: `${colors.state.success}20`,
    },
    {
      icon: TrendUp,
      label: t("tutorDashboard.earnings.totalGross"),
      value: formatVND(totalSummary?.totalGrossAmount),
      color: colors.state.info,
      bg: `${colors.state.info}20`,
    },
    {
      icon: Receipt,
      label: t("tutorDashboard.earnings.platformFee"),
      value: formatVND(totalSummary?.totalPlatformFee),
      color: colors.state.warning,
      bg: `${colors.state.warning}20`,
    },
  ];

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
          <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
            {t("tutorDashboard.earnings.title")}
          </h1>
          <p style={{ color: colors.text.secondary }}>
            {t("tutorDashboard.earnings.subtitle")}
          </p>
        </div>
        <Button
          startContent={<Bank weight="duotone" className="w-5 h-5" />}
          isDisabled={!totalSummary?.availableBalance}
          style={{
            backgroundColor: totalSummary?.availableBalance
              ? colors.primary.main
              : colors.background.gray,
            color: totalSummary?.availableBalance
              ? colors.text.white
              : colors.text.tertiary,
          }}
          onPress={() => setWithdrawOpen(true)}
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
                <div className="flex-1 min-w-0">
                  {summaryLoading ? (
                    <Skeleton className="h-7 w-24 rounded-md" />
                  ) : (
                    <p
                      className="text-lg font-bold truncate"
                      style={{ color: colors.text.primary }}
                    >
                      {stat.value}
                    </p>
                  )}
                  <p
                    className="text-xs"
                    style={{ color: colors.text.secondary }}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </motion.div>

      {/* Tabs */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={setActiveTab}
        color="primary"
        classNames={{ tabList: "gap-2", tab: "px-4" }}
      >
        <Tab
          key="earnings"
          title={
            <div className="flex items-center gap-2">
              <ChartLine weight="duotone" className="w-5 h-5" />
              <span>{t("tutorDashboard.earnings.earningsTab")}</span>
            </div>
          }
        />
        <Tab
          key="payouts"
          title={
            <div className="flex items-center gap-2">
              <Receipt weight="duotone" className="w-5 h-5" />
              <span>{t("tutorDashboard.earnings.payoutsTab")}</span>
            </div>
          }
        />
      </Tabs>

      {activeTab === "earnings" && (
        <>
          {/* Chart */}
          <Card
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h2
                  className="text-lg font-semibold flex items-center gap-2"
                  style={{ color: colors.text.primary }}
                >
                  <ChartLine
                    weight="duotone"
                    className="w-5 h-5"
                    style={{ color: colors.primary.main }}
                  />
                  {t("tutorDashboard.earnings.monthlyChart")}
                </h2>
                <Select
                  size="sm"
                  className="w-32"
                  selectedKeys={[chartYear]}
                  classNames={selectClassNames}
                  onSelectionChange={(keys) => {
                    const v = [...keys][0];
                    if (v) setChartYear(v);
                  }}
                >
                  {yearOptions.map((y) => (
                    <SelectItem key={y}>{y}</SelectItem>
                  ))}
                </Select>
              </div>

              {monthlyLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Spinner size="sm" />
                </div>
              ) : (
                <div className="flex items-end justify-between h-56 gap-2">
                  {monthlyData.map((d) => {
                    const pct = (d.totalNetAmount / maxMonthly) * 100;
                    const hasValue = d.totalNetAmount > 0;
                    return (
                      <div
                        key={d.month}
                        className="flex-1 flex flex-col items-center gap-2 group"
                      >
                        <span
                          className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                          style={{ color: colors.text.secondary }}
                        >
                          {formatVND(d.totalNetAmount)}
                        </span>
                        <div className="w-full flex items-end" style={{ height: "180px" }}>
                          <div
                            className="w-full rounded-t-lg transition-all"
                            style={{
                              height: `${pct}%`,
                              minHeight: hasValue ? "4px" : "0",
                              backgroundColor: hasValue
                                ? colors.primary.main
                                : colors.background.primaryLight,
                            }}
                          />
                        </div>
                        <span
                          className="text-[11px] font-medium"
                          style={{ color: colors.text.tertiary }}
                        >
                          {d.monthLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Earnings Table */}
          <Card shadow="none" className="border-none" style={tableCardStyle}>
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2
                  className="text-lg font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  {t("tutorDashboard.earnings.earningsList")}
                </h2>
                <Select
                  size="sm"
                  className="w-40"
                  placeholder={t("tutorDashboard.earnings.allStatuses")}
                  selectedKeys={earningsStatusFilter ? [earningsStatusFilter] : []}
                  classNames={selectClassNames}
                  onSelectionChange={(keys) => {
                    const v = [...keys][0] || "";
                    setEarningsStatusFilter(v);
                    setEarningsPage(1);
                  }}
                >
                  <SelectItem key="Unpaid">{t("tutorDashboard.earnings.statuses.Unpaid")}</SelectItem>
                  <SelectItem key="Paid">{t("tutorDashboard.earnings.statuses.Paid")}</SelectItem>
                </Select>
              </div>

              <Table aria-label="Earnings" classNames={tableClassNames} removeWrapper>
                <TableHeader>
                  <TableColumn>{t("tutorDashboard.earnings.workDate")}</TableColumn>
                  <TableColumn>{t("tutorDashboard.earnings.source")}</TableColumn>
                  <TableColumn>{t("tutorDashboard.earnings.gross")}</TableColumn>
                  <TableColumn>{t("tutorDashboard.earnings.fee")}</TableColumn>
                  <TableColumn>{t("tutorDashboard.earnings.net")}</TableColumn>
                  <TableColumn>{t("tutorDashboard.earnings.status")}</TableColumn>
                </TableHeader>
                <TableBody
                  isLoading={earningsLoading}
                  loadingContent={<Spinner />}
                  emptyContent={
                    <p className="py-8 text-center" style={{ color: colors.text.tertiary }}>
                      {t("tutorDashboard.earnings.noEarnings")}
                    </p>
                  }
                >
                  {earnings.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>
                        <span style={{ color: colors.text.primary }}>
                          {formatDate(e.workDate)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          style={{
                            backgroundColor: `${colors.primary.main}15`,
                            color: colors.primary.main,
                          }}
                        >
                          {e.sourceType}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: colors.text.secondary }}>
                          {formatVND(e.grossAmount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: colors.text.tertiary }}>
                          -{formatVND(e.platformFee)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className="font-semibold"
                          style={{ color: colors.text.primary }}
                        >
                          {formatVND(e.netAmount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          style={{
                            backgroundColor: `${getEarningStatusColor(e.status)}15`,
                            color: getEarningStatusColor(e.status),
                          }}
                        >
                          {t(`tutorDashboard.earnings.statuses.${e.status}`) || e.status}
                        </Chip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {earningsTotalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination
                    total={earningsTotalPages}
                    page={earningsPage}
                    onChange={setEarningsPage}
                    showControls
                    color="primary"
                  />
                </div>
              )}
            </CardBody>
          </Card>
        </>
      )}

      {activeTab === "payouts" && (
        <Card shadow="none" className="border-none" style={tableCardStyle}>
          <CardBody className="p-4">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2
                className="text-lg font-semibold"
                style={{ color: colors.text.primary }}
              >
                {t("tutorDashboard.earnings.payoutsList")}
              </h2>
              <div className="flex items-center gap-2">
                <Select
                  size="sm"
                  className="w-36"
                  placeholder={t("tutorDashboard.earnings.allTypes")}
                  selectedKeys={payoutTypeFilter ? [payoutTypeFilter] : []}
                  classNames={selectClassNames}
                  onSelectionChange={(keys) => {
                    const v = [...keys][0] || "";
                    setPayoutTypeFilter(v);
                    setPayoutsPage(1);
                  }}
                >
                  <SelectItem key="Payroll">{t("tutorDashboard.earnings.payoutTypes.Payroll")}</SelectItem>
                  <SelectItem key="Manual">{t("tutorDashboard.earnings.payoutTypes.Manual")}</SelectItem>
                </Select>
                <Select
                  size="sm"
                  className="w-40"
                  placeholder={t("tutorDashboard.earnings.allStatuses")}
                  selectedKeys={payoutStatusFilter ? [payoutStatusFilter] : []}
                  classNames={selectClassNames}
                  onSelectionChange={(keys) => {
                    const v = [...keys][0] || "";
                    setPayoutStatusFilter(v);
                    setPayoutsPage(1);
                  }}
                >
                  {["Pending", "Processing", "Paid", "Failed", "Cancelled"].map((s) => (
                    <SelectItem key={s}>
                      {t(`tutorDashboard.earnings.payoutStatuses.${s}`)}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            <Table aria-label="Payouts" classNames={tableClassNames} removeWrapper>
              <TableHeader>
                <TableColumn>{t("tutorDashboard.earnings.requestedAt")}</TableColumn>
                <TableColumn>{t("tutorDashboard.earnings.type")}</TableColumn>
                <TableColumn>{t("tutorDashboard.earnings.amount")}</TableColumn>
                <TableColumn>{t("tutorDashboard.earnings.bank")}</TableColumn>
                <TableColumn>{t("tutorDashboard.earnings.status")}</TableColumn>
                <TableColumn>{t("tutorDashboard.earnings.paidAt")}</TableColumn>
                <TableColumn>{t("tutorDashboard.earnings.actions")}</TableColumn>
              </TableHeader>
              <TableBody
                isLoading={payoutsLoading}
                loadingContent={<Spinner />}
                emptyContent={
                  <p className="py-8 text-center" style={{ color: colors.text.tertiary }}>
                    {t("tutorDashboard.earnings.noPayouts")}
                  </p>
                }
              >
                {payouts.map((p) => {
                  const StatusIcon = getPayoutStatusIcon(p.status);
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <span style={{ color: colors.text.primary }}>
                          {formatDate(p.requestedAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          style={{
                            backgroundColor:
                              p.payoutType === "Manual"
                                ? `${colors.state.warning}15`
                                : `${colors.primary.main}15`,
                            color:
                              p.payoutType === "Manual"
                                ? colors.state.warning
                                : colors.primary.main,
                          }}
                        >
                          {t(`tutorDashboard.earnings.payoutTypes.${p.payoutType}`)}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <span
                          className="font-semibold"
                          style={{ color: colors.text.primary }}
                        >
                          {formatVND(p.totalAmount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <p style={{ color: colors.text.primary }}>{p.bankCode}</p>
                          <p style={{ color: colors.text.tertiary }}>
                            {p.bankAccountNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          startContent={<StatusIcon weight="duotone" className="w-3.5 h-3.5" />}
                          style={{
                            backgroundColor: `${getPayoutStatusColor(p.status)}15`,
                            color: getPayoutStatusColor(p.status),
                          }}
                        >
                          {t(`tutorDashboard.earnings.payoutStatuses.${p.status}`)}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: colors.text.secondary }}>
                          {formatDate(p.paidAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="flat"
                          startContent={<ArrowSquareOut className="w-4 h-4" />}
                          onPress={() => openPayoutDetail(p)}
                          style={{
                            backgroundColor: `${colors.primary.main}15`,
                            color: colors.primary.main,
                          }}
                        >
                          {t("tutorDashboard.earnings.viewItems")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {payoutsTotalPages > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination
                  total={payoutsTotalPages}
                  page={payoutsPage}
                  onChange={setPayoutsPage}
                  showControls
                  color="primary"
                />
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Withdraw Ticket Modal */}
      <TutorWithdrawTicketModal
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        userId={user?.userId}
        tutorId={user?.tutorId}
        availableBalance={totalSummary?.availableBalance || 0}
        bankCode={tutorProfile?.bankCode}
        bankAccountNumber={tutorProfile?.bankAccountNumber}
        bankAccountName={tutorProfile?.bankAccountName}
        onSuccess={() => {
          fetchSummary();
          if (activeTab === "payouts") fetchPayouts();
        }}
      />

      {/* Payout Items Modal */}
      <Modal
        isOpen={payoutDetailOpen}
        onOpenChange={setPayoutDetailOpen}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          <ModalHeader
            className="flex items-center gap-2"
            style={{ color: colors.text.primary }}
          >
            <Receipt
              weight="duotone"
              className="w-5 h-5"
              style={{ color: colors.primary.main }}
            />
            {t("tutorDashboard.earnings.payoutDetail")}
          </ModalHeader>
          <ModalBody className="pb-6">
            {selectedPayout && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <p className="text-xs" style={{ color: colors.text.secondary }}>
                      {t("tutorDashboard.earnings.amount")}
                    </p>
                    <p
                      className="text-base font-semibold mt-0.5"
                      style={{ color: colors.text.primary }}
                    >
                      {formatVND(selectedPayout.totalAmount)}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <p className="text-xs" style={{ color: colors.text.secondary }}>
                      {t("tutorDashboard.earnings.status")}
                    </p>
                    <Chip
                      size="sm"
                      variant="flat"
                      className="mt-1"
                      style={{
                        backgroundColor: `${getPayoutStatusColor(selectedPayout.status)}15`,
                        color: getPayoutStatusColor(selectedPayout.status),
                      }}
                    >
                      {t(`tutorDashboard.earnings.payoutStatuses.${selectedPayout.status}`)}
                    </Chip>
                  </div>
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <p className="text-xs" style={{ color: colors.text.secondary }}>
                      {t("tutorDashboard.earnings.requestedAt")}
                    </p>
                    <p className="text-sm mt-0.5" style={{ color: colors.text.primary }}>
                      {formatDateTime(selectedPayout.requestedAt)}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <p className="text-xs" style={{ color: colors.text.secondary }}>
                      {t("tutorDashboard.earnings.paidAt")}
                    </p>
                    <p className="text-sm mt-0.5" style={{ color: colors.text.primary }}>
                      {formatDateTime(selectedPayout.paidAt)}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p
                    className="text-sm font-semibold mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    {t("tutorDashboard.earnings.items")} ({payoutItems.length})
                  </p>
                  {payoutItemsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Spinner size="sm" />
                    </div>
                  ) : payoutItems.length === 0 ? (
                    <p
                      className="text-sm text-center py-4"
                      style={{ color: colors.text.tertiary }}
                    >
                      {t("tutorDashboard.earnings.noItems")}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {payoutItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl flex items-center justify-between"
                          style={{ backgroundColor: colors.background.gray }}
                        >
                          <div className="min-w-0 flex-1">
                            <p
                              className="text-sm font-medium"
                              style={{ color: colors.text.primary }}
                            >
                              {formatVND(item.amount)}
                            </p>
                            {item.note && (
                              <p
                                className="text-xs mt-0.5 truncate"
                                style={{ color: colors.text.secondary }}
                              >
                                {item.note}
                              </p>
                            )}
                          </div>
                          <Chip
                            size="sm"
                            variant="flat"
                            style={{
                              backgroundColor: `${getPayoutStatusColor(item.status)}15`,
                              color: getPayoutStatusColor(item.status),
                            }}
                          >
                            {t(`tutorDashboard.earnings.payoutStatuses.${item.status}`)}
                          </Chip>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Earnings;
