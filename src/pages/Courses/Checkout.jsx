import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Divider,
  Spinner,
  RadioGroup,
  Radio,
} from "@heroui/react";
import * as MotionLib from "framer-motion";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useThemeColors } from "../../hooks/useThemeColors";
import {
  ArrowLeft,
  Clock,
  CreditCard,
  Warning,
  Check,
  CalendarDots,
} from "@phosphor-icons/react";
import { coursesApi, tutorApi, studentApi } from "../../api";

// eslint-disable-next-line no-unused-vars
const { motion } = MotionLib;

const formatPrice = (price, currency) => {
  if (currency === "VND" || !currency) {
    return price?.toLocaleString("vi-VN") + "₫";
  }
  return "$" + price;
};

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();

  const [course, setCourse] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const requiredSlots = course?.numsSessionInWeek || 0;
  const notEnoughSlots = !loading && schedules.length < requiredSlots;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const courseRes = await coursesApi.getCourseById(id);
      setCourse(courseRes.data);

      if (courseRes.data?.tutorId) {
        const scheduleRes = await tutorApi.getTutorSchedules({
          TutorId: courseRes.data.tutorId,
          Status: "Open",
          "page-size": 200,
        });
        if (scheduleRes.isSuccess) {
          setSchedules(scheduleRes.data.items || []);
        }
      }
    } catch (err) {
      console.error("Failed to fetch checkout data:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleSlot = (slotId) => {
    setSelectedSlots((prev) => {
      if (prev.includes(slotId)) {
        return prev.filter((id) => id !== slotId);
      }
      if (prev.length >= requiredSlots) {
        return prev;
      }
      return [...prev, slotId];
    });
  };

  const canCheckout =
    selectedSlots.length === requiredSlots && paymentMethod !== "";

  const handleCheckout = async () => {
    if (!canCheckout) return;
    setSubmitting(true);
    try {
      const res = await studentApi.checkout({
        courseId: id,
        scheduleSlots: selectedSlots,
        paymentMethod,
      });
      if (res.isSuccess && res.data?.paymentLink) {
        window.location.href = res.data.paymentLink;
      }
    } catch (err) {
      console.error("Checkout failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (timeStr) => timeStr?.slice(0, 5) || "";

  const WEEKDAY_ORDER = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const groupedSchedules = WEEKDAY_ORDER.map((day) => ({
    day,
    slots: schedules
      .filter((s) => s.weekday === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  })).filter((g) => g.slots.length > 0);

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: colors.background.light }}
      >
        <Header />
        <div className="flex justify-center items-center py-32">
          <Spinner size="lg" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: colors.background.light }}
      >
        <Header />
        <div className="flex flex-col items-center justify-center py-32 px-6">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            {t("courses.detail.notFound")}
          </h2>
          <Button
            color="primary"
            variant="flat"
            startContent={<ArrowLeft size={18} />}
            onPress={() => navigate("/courses")}
          >
            {t("courses.detail.backToCourses")}
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background.light }}
    >
      <Header />

      <section className="px-6 md:px-12 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Back button */}
          <Button
            variant="light"
            startContent={<ArrowLeft size={18} />}
            className="mb-6"
            onPress={() => navigate(-1)}
            style={{ color: colors.text.secondary }}
          >
            {t("checkout.backToCourse")}
          </Button>

          <h1
            className="text-2xl font-bold mb-6"
            style={{ color: colors.text.primary }}
          >
            {t("checkout.title")}
          </h1>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Slot Selection + Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Slot Selection */}
              <Card
                shadow="none"
                className="border-none"
                style={{ backgroundColor: colors.background.gray }}
              >
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2
                      className="font-semibold text-lg"
                      style={{ color: colors.text.primary }}
                    >
                      <CalendarDots
                        weight="duotone"
                        className="w-5 h-5 inline-block mr-2"
                        style={{ color: colors.primary.main }}
                      />
                      {t("checkout.selectSlots")}
                    </h2>
                    <Chip size="sm" variant="flat" color="primary">
                      {selectedSlots.length} / {requiredSlots}
                    </Chip>
                  </div>

                  <p
                    className="text-sm mb-4"
                    style={{ color: colors.text.secondary }}
                  >
                    {t("checkout.selectSlotsDesc", {
                      count: requiredSlots,
                    })}
                  </p>

                  {/* Not enough slots alert */}
                  {notEnoughSlots && (
                    <div
                      className="flex items-center gap-2 p-3 rounded-lg mb-4 text-sm"
                      style={{
                        backgroundColor: `${colors.state.error}15`,
                        color: colors.state.error,
                        border: `1px solid ${colors.state.error}30`,
                      }}
                    >
                      <Warning
                        weight="fill"
                        className="w-4 h-4 flex-shrink-0"
                      />
                      {t("checkout.notEnoughSlots", {
                        required: requiredSlots,
                        available: schedules.length,
                      })}
                    </div>
                  )}

                  {/* Schedule slots grouped by day */}
                  {groupedSchedules.length === 0 ? (
                    <div
                      className="text-center py-8"
                      style={{ color: colors.text.tertiary }}
                    >
                      <CalendarDots className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>{t("checkout.noSlots")}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {groupedSchedules.map(({ day, slots }) => (
                        <div key={day}>
                          <h3
                            className="font-medium text-sm mb-2"
                            style={{ color: colors.text.primary }}
                          >
                            {t(
                              `tutorDashboard.schedule.days.${day.toLowerCase()}`,
                            )}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {slots.map((slot) => {
                              const isSelected = selectedSlots.includes(
                                slot.id,
                              );
                              const isDisabled =
                                !isSelected &&
                                selectedSlots.length >= requiredSlots;
                              return (
                                <button
                                  key={slot.id}
                                  type="button"
                                  disabled={isDisabled}
                                  onClick={() => toggleSlot(slot.id)}
                                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                                  style={{
                                    backgroundColor: isSelected
                                      ? colors.primary.main
                                      : colors.background.light,
                                    color: isSelected
                                      ? "#fff"
                                      : colors.text.primary,
                                    border: isSelected
                                      ? `2px solid ${colors.primary.main}`
                                      : `1px solid ${colors.border.light}`,
                                    opacity: isDisabled ? 0.5 : 1,
                                    cursor: isDisabled
                                      ? "not-allowed"
                                      : "pointer",
                                  }}
                                >
                                  {isSelected ? (
                                    <Check weight="bold" className="w-4 h-4" />
                                  ) : (
                                    <Clock
                                      weight="duotone"
                                      className="w-4 h-4"
                                    />
                                  )}
                                  {formatTime(slot.startTime)} —{" "}
                                  {formatTime(slot.endTime)}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Payment Method */}
              <Card
                shadow="none"
                className="border-none"
                style={{ backgroundColor: colors.background.gray }}
              >
                <CardBody className="p-6">
                  <h2
                    className="font-semibold text-lg mb-4"
                    style={{ color: colors.text.primary }}
                  >
                    <CreditCard
                      weight="duotone"
                      className="w-5 h-5 inline-block mr-2"
                      style={{ color: colors.primary.main }}
                    />
                    {t("checkout.paymentMethod")}
                  </h2>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <Radio value="Vnpay">
                      <span style={{ color: colors.text.primary }}>VNPay</span>
                    </Radio>
                    <Radio value="Payos">
                      <span style={{ color: colors.text.primary }}>PayOS</span>
                    </Radio>
                  </RadioGroup>
                </CardBody>
              </Card>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <Card
                  shadow="none"
                  className="border-none"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <CardBody className="p-6 space-y-4">
                    <h2
                      className="font-semibold text-lg"
                      style={{ color: colors.text.primary }}
                    >
                      {t("checkout.orderSummary")}
                    </h2>

                    {/* Course thumbnail */}
                    <div className="rounded-xl overflow-hidden">
                      <img
                        src={
                          course.thumbnailUrl ||
                          "https://placehold.co/400x200?text=No+Image"
                        }
                        alt={course.title}
                        className="w-full h-36 object-cover"
                      />
                    </div>

                    <div>
                      <h3
                        className="font-semibold text-sm"
                        style={{ color: colors.text.primary }}
                      >
                        {course.title}
                      </h3>
                      {course.courseCategories?.[0]?.categoryName && (
                        <p
                          className="text-xs mt-1"
                          style={{ color: colors.text.tertiary }}
                        >
                          {course.courseCategories[0].categoryName} ·{" "}
                          {course.level}
                        </p>
                      )}
                    </div>

                    <Divider />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: colors.text.secondary }}>
                          {t("checkout.slotsSelected")}
                        </span>
                        <span
                          className="font-medium"
                          style={{ color: colors.text.primary }}
                        >
                          {selectedSlots.length} / {requiredSlots}
                        </span>
                      </div>
                      {paymentMethod && (
                        <div className="flex justify-between text-sm">
                          <span style={{ color: colors.text.secondary }}>
                            {t("checkout.payment")}
                          </span>
                          <span
                            className="font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            {paymentMethod === "Vnpay" ? "VNPay" : "PayOS"}
                          </span>
                        </div>
                      )}
                    </div>

                    <Divider />

                    <div className="flex justify-between items-center">
                      <span
                        className="font-semibold"
                        style={{ color: colors.text.primary }}
                      >
                        {t("checkout.total")}
                      </span>
                      <span
                        className="text-2xl font-bold"
                        style={{ color: colors.primary.main }}
                      >
                        {formatPrice(course.price, course.currency)}
                      </span>
                    </div>

                    <Button
                      color="primary"
                      size="lg"
                      className="w-full font-semibold"
                      isDisabled={!canCheckout}
                      isLoading={submitting}
                      onPress={handleCheckout}
                    >
                      {t("checkout.pay")}
                    </Button>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Checkout;
