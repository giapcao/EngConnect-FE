import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
} from "@heroui/react";
import { CalendarDots, Clock, Warning } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";
import { rescheduleApi } from "../../api";

export default function StudentRescheduleAcceptModal({
  offer,
  lesson,
  isOpen,
  onClose,
  onSuccess,
  studentId,
}) {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "vi" ? "vi-VN" : "en-US";
  const colors = useThemeColors();

  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setSelectedOptionId(null);
    setError(null);
    onClose();
  };

  const handleConfirm = async () => {
    if (!selectedOptionId) {
      setError(t("studentDashboard.schedule.reschedule.errorSelect"));
      return;
    }
    setConfirming(true);
    setError(null);
    try {
      await rescheduleApi.selectOption(offer.id, {
        request: {
          offerId: offer.id,
          optionId: selectedOptionId,
          studentId,
        },
      });
      onSuccess?.();
      handleClose();
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message || err?.response?.data?.message;
      setError(msg || t("studentDashboard.schedule.reschedule.errorConfirm"));
    } finally {
      setConfirming(false);
    }
  };

  if (!offer || !lesson) return null;

  const isPending = offer.status === "PendingStudentChoice";
  const sortedOptions = [...(offer.options || [])].sort(
    (a, b) => a.optionOrder - b.optionOrder,
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" scrollBehavior="inside">
      <ModalContent style={{ backgroundColor: colors.background.light }}>
        <ModalHeader
          className="flex items-center gap-2"
          style={{ color: colors.text.primary }}
        >
          <CalendarDots
            weight="duotone"
            className="w-5 h-5"
            style={{ color: colors.primary.main }}
          />
          {t("studentDashboard.schedule.reschedule.title")}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Lesson info */}
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: colors.background.gray }}
            >
              <p
                className="font-medium text-sm"
                style={{ color: colors.text.primary }}
              >
                {lesson.courseTitle || lesson.sessionTitle}
              </p>
              <p
                className="text-xs mt-0.5 flex items-center gap-1"
                style={{ color: colors.text.secondary }}
              >
                <Clock weight="duotone" className="w-3 h-3" />
                {new Date(lesson.startTime).toLocaleString(dateLocale, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Tutor note */}
            {offer.tutorNote && (
              <div
                className="p-3 rounded-xl"
                style={{
                  backgroundColor: `${colors.primary.main}10`,
                  border: `1px solid ${colors.primary.main}20`,
                }}
              >
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: colors.primary.main }}
                >
                  {t("studentDashboard.schedule.reschedule.noteFrom")}
                </p>
                <p className="text-sm" style={{ color: colors.text.primary }}>
                  {offer.tutorNote}
                </p>
              </div>
            )}

            {/* Options */}
            <div>
              <p
                className="text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                {isPending
                  ? t("studentDashboard.schedule.reschedule.chooseOption")
                  : t("studentDashboard.schedule.reschedule.chosenOption")}
              </p>
              <div className="space-y-2">
                {sortedOptions.map((option, idx) => {
                  const start = new Date(option.proposedStartTime);
                  const end = new Date(option.proposedEndTime);
                  const isSelected = selectedOptionId === option.id;
                  const isChosen = offer.selectedOptionId === option.id;
                  const highlight = isPending ? isSelected : isChosen;

                  return (
                    <div
                      key={option.id}
                      onClick={() =>
                        isPending && setSelectedOptionId(option.id)
                      }
                      className="p-3 rounded-xl transition-all"
                      style={{
                        backgroundColor: highlight
                          ? `${colors.primary.main}15`
                          : colors.background.gray,
                        border: `2px solid ${highlight ? colors.primary.main : colors.border.medium}`,
                        cursor: isPending ? "pointer" : "default",
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        {/* Radio dot + label */}
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                            style={{
                              borderColor: highlight
                                ? colors.primary.main
                                : colors.border.medium,
                              backgroundColor: highlight
                                ? colors.primary.main
                                : "transparent",
                            }}
                          >
                            {highlight && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <div>
                            <p
                              className="text-[11px] font-medium"
                              style={{ color: colors.text.secondary }}
                            >
                              {t(
                                "studentDashboard.schedule.reschedule.optionN",
                                { n: idx + 1 },
                              )}
                            </p>
                            <p
                              className="text-sm font-semibold"
                              style={{ color: colors.text.primary }}
                            >
                              {start.toLocaleDateString(dateLocale, {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Time + chosen badge */}
                        <div className="text-right">
                          <p
                            className="text-sm font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            {start.toLocaleTimeString(dateLocale, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {" — "}
                            {end.toLocaleTimeString(dateLocale, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {!isPending && isChosen && (
                            <Chip
                              size="sm"
                              className="mt-0.5"
                              style={{
                                backgroundColor: `${colors.state.success}20`,
                                color: colors.state.success,
                                fontSize: "10px",
                              }}
                            >
                              {t(
                                "studentDashboard.schedule.reschedule.chosen",
                              )}
                            </Chip>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {error && (
              <div
                className="flex items-center gap-2 p-3 rounded-lg text-sm"
                style={{
                  backgroundColor: `${colors.state.error}15`,
                  color: colors.state.error,
                  border: `1px solid ${colors.state.error}30`,
                }}
              >
                <Warning weight="fill" className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            {t("studentDashboard.schedule.reschedule.close")}
          </Button>
          {isPending && (
            <Button
              isLoading={confirming}
              onPress={handleConfirm}
              style={{
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
            >
              {t("studentDashboard.schedule.reschedule.confirm")}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
