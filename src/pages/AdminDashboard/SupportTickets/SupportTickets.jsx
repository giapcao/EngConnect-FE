import { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Chip,
  Select,
  SelectItem,
  Spinner,
  Skeleton,
  Pagination,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  addToast,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useThemeColors } from "../../../hooks/useThemeColors";
import useInputStyles from "../../../hooks/useInputStyles";
import useTableStyles from "../../../hooks/useTableStyles";
import useDropdownStyles from "../../../hooks/useDropdownStyles";
import { selectUser } from "../../../store";
import { supportApi } from "../../../api/supportApi";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  ArrowLeft,
  PaperPlaneTilt,
  MagnifyingGlass,
  ChatCircleDots,
  DotsThreeVertical,
  Eye,
  Trash,
} from "@phosphor-icons/react";

const TICKET_TYPES = [
  "Error",
  "TechnicalIssue",
  "Question",
  "FeatureRequest",
  "Billing",
  "Other",
];

const STATUS_COLORS = {
  Open: "primary",
  Resolved: "success",
  Closed: "default",
};

const TYPE_COLORS = {
  Error: "danger",
  TechnicalIssue: "warning",
  Question: "primary",
  FeatureRequest: "secondary",
  Billing: "success",
  Other: "default",
};

const STATUSES = ["Open", "Resolved", "Closed"];

const SupportTickets = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { inputClassNames } = useInputStyles();
  const { tableCardStyle, tableClassNames } = useTableStyles();
  const { dropdownClassNames } = useDropdownStyles();
  const user = useSelector(selectUser);
  const messagesEndRef = useRef(null);

  const [view, setView] = useState("list");
  const [selectedTicket, setSelectedTicket] = useState(null);

  // List
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Detail
  const [detailLoading, setDetailLoading] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  // Delete modal
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, "page-size": 10 };
      if (searchTerm) params["search-term"] = searchTerm;
      if (statusFilter) params.Status = statusFilter;
      if (typeFilter) params.Type = typeFilter;

      const res = await supportApi.getTickets(params);
      if (res.isSuccess) {
        setTickets(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, statusFilter, typeFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSearch = () => {
    setPage(1);
    fetchTickets();
  };

  const openDetail = async (ticket) => {
    setView("detail");
    setDetailLoading(true);
    try {
      const res = await supportApi.getTicketById(ticket.id);
      if (res.isSuccess) {
        setSelectedTicket(res.data);
      }
    } catch {
      addToast({ title: "Failed to load ticket", color: "danger" });
      setView("list");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await supportApi.deleteTicket(deleteId);
      addToast({
        title: t("adminDashboard.supportTickets.deleteSuccess"),
        color: "success",
      });
      setDeleteOpen(false);
      setDeleteId(null);
      fetchTickets();
    } catch {
      addToast({
        title: t("adminDashboard.supportTickets.deleteFailed"),
        color: "danger",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (ticketId, status) => {
    try {
      await supportApi.updateTicketStatus(ticketId, status);
      addToast({
        title: t("adminDashboard.supportTickets.updateStatusSuccess"),
        color: "success",
      });
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket((prev) => ({ ...prev, status }));
      }
      fetchTickets();
    } catch {
      addToast({
        title: t("adminDashboard.supportTickets.updateStatusFailed"),
        color: "danger",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedTicket) return;
    setSending(true);
    try {
      const res = await supportApi.createMessage({
        ticketId: selectedTicket.id,
        senderId: user?.userId,
        message: messageText.trim(),
      });
      if (res.isSuccess) {
        setSelectedTicket((prev) => ({
          ...prev,
          supportTicketMessages: [
            ...(prev.supportTicketMessages || []),
            res.data,
          ],
        }));
        setMessageText("");
        setTimeout(
          () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
          100,
        );
      }
    } catch {
      addToast({
        title: t("adminDashboard.supportTickets.detail.sendFailed"),
        color: "danger",
      });
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // DETAIL VIEW
  if (view === "detail") {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <Button
            variant="light"
            startContent={<ArrowLeft className="w-5 h-5" />}
            onPress={() => {
              setView("list");
              setSelectedTicket(null);
            }}
            style={{ color: colors.text.secondary }}
          >
            {t("adminDashboard.supportTickets.detail.backToList")}
          </Button>
        </motion.div>

        {detailLoading ? (
          <Card
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-6 space-y-4">
              <Skeleton className="h-8 w-2/3 rounded-lg" />
              <Skeleton className="h-4 w-1/3 rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </CardBody>
          </Card>
        ) : selectedTicket ? (
          <>
            {/* Ticket Info */}
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
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h2
                        className="text-xl font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        {selectedTicket.subject}
                      </h2>
                      <p
                        className="text-sm mt-1"
                        style={{ color: colors.text.tertiary }}
                      >
                        {formatDate(selectedTicket.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip
                        size="sm"
                        color={TYPE_COLORS[selectedTicket.type] || "default"}
                        variant="flat"
                      >
                        {t(
                          `adminDashboard.supportTickets.types.${selectedTicket.type}`,
                        )}
                      </Chip>
                      <Select
                        selectedKeys={[selectedTicket.status]}
                        onSelectionChange={(keys) => {
                          const val = [...keys][0];
                          if (val && val !== selectedTicket.status) {
                            handleStatusChange(selectedTicket.id, val);
                          }
                        }}
                        className="w-40"
                        size="sm"
                        classNames={inputClassNames}
                        aria-label={t(
                          "adminDashboard.supportTickets.detail.changeStatus",
                        )}
                      >
                        {STATUSES.map((s) => (
                          <SelectItem key={s}>
                            {t(`adminDashboard.supportTickets.statuses.${s}`)}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <p
                      className="text-sm font-medium mb-2"
                      style={{ color: colors.text.secondary }}
                    >
                      {t("adminDashboard.supportTickets.detail.description")}
                    </p>
                    <p style={{ color: colors.text.primary }}>
                      {selectedTicket.description}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Conversation */}
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
                    className="text-lg font-semibold mb-4"
                    style={{ color: colors.text.primary }}
                  >
                    <ChatCircleDots
                      weight="duotone"
                      className="w-5 h-5 inline-block mr-2"
                    />
                    {t("adminDashboard.supportTickets.detail.conversation")}
                  </h3>

                  <div
                    className="space-y-4 max-h-96 overflow-y-auto p-4 rounded-xl mb-4"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    {(!selectedTicket.supportTicketMessages ||
                      selectedTicket.supportTicketMessages.length === 0) && (
                      <p
                        className="text-center py-8"
                        style={{ color: colors.text.tertiary }}
                      >
                        {t("adminDashboard.supportTickets.detail.noMessages")}
                      </p>
                    )}
                    {selectedTicket.supportTicketMessages
                      ?.sort(
                        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
                      )
                      .map((msg) => {
                        const isMe = msg.senderId === user?.userId;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[75%] p-3 rounded-2xl ${isMe ? "rounded-br-sm" : "rounded-bl-sm"}`}
                              style={{
                                backgroundColor: isMe
                                  ? colors.primary.main
                                  : colors.background.light,
                                color: isMe
                                  ? colors.text.white
                                  : colors.text.primary,
                              }}
                            >
                              <p className="text-xs font-medium mb-1 opacity-70">
                                {isMe
                                  ? t(
                                      "adminDashboard.supportTickets.detail.you",
                                    )
                                  : t(
                                      "adminDashboard.supportTickets.detail.user",
                                    )}
                              </p>
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs mt-1 opacity-50">
                                {formatDate(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={messageText}
                      onValueChange={setMessageText}
                      placeholder={t(
                        "adminDashboard.supportTickets.detail.replyPlaceholder",
                      )}
                      classNames={inputClassNames}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      isIconOnly
                      isLoading={sending}
                      onPress={handleSendMessage}
                      isDisabled={!messageText.trim()}
                      style={{
                        backgroundColor: colors.primary.main,
                        color: colors.text.white,
                      }}
                    >
                      <PaperPlaneTilt weight="fill" className="w-5 h-5" />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </>
        ) : null}
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <h1
          className="text-2xl lg:text-3xl font-bold mb-2"
          style={{ color: colors.text.primary }}
        >
          {t("adminDashboard.supportTickets.title")}
        </h1>
        <p style={{ color: colors.text.secondary }}>
          {t("adminDashboard.supportTickets.subtitle")}
        </p>
      </motion.div>

      {/* Filters */}
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
          <CardBody className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                value={searchTerm}
                onValueChange={setSearchTerm}
                placeholder={t(
                  "adminDashboard.supportTickets.searchPlaceholder",
                )}
                startContent={
                  <MagnifyingGlass className="w-4 h-4 text-gray-400" />
                }
                classNames={inputClassNames}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <Select
                selectedKeys={statusFilter ? [statusFilter] : []}
                onSelectionChange={(keys) => {
                  const val = [...keys][0] || "";
                  setStatusFilter(val);
                  setPage(1);
                }}
                placeholder={t("adminDashboard.supportTickets.allStatuses")}
                className="w-full md:w-44"
                classNames={inputClassNames}
              >
                {STATUSES.map((s) => (
                  <SelectItem key={s}>
                    {t(`adminDashboard.supportTickets.statuses.${s}`)}
                  </SelectItem>
                ))}
              </Select>
              <Select
                selectedKeys={typeFilter ? [typeFilter] : []}
                onSelectionChange={(keys) => {
                  const val = [...keys][0] || "";
                  setTypeFilter(val);
                  setPage(1);
                }}
                placeholder={t("adminDashboard.supportTickets.allTypes")}
                className="w-full md:w-44"
                classNames={inputClassNames}
              >
                {TICKET_TYPES.map((tp) => (
                  <SelectItem key={tp}>
                    {t(`adminDashboard.supportTickets.types.${tp}`)}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <Card shadow="none" className="border-none" style={tableCardStyle}>
          <CardBody className="p-0 overflow-x-auto">
            <Table
              aria-label="Support tickets"
              classNames={tableClassNames}
              removeWrapper
            >
              <TableHeader>
                <TableColumn>
                  {t("adminDashboard.supportTickets.subject")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.supportTickets.type")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.supportTickets.status")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.supportTickets.createdAt")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.supportTickets.actions")}
                </TableColumn>
              </TableHeader>
              <TableBody
                isLoading={loading}
                loadingContent={<Spinner />}
                emptyContent={
                  <div className="py-8 text-center">
                    <p style={{ color: colors.text.tertiary }}>
                      {t("adminDashboard.supportTickets.noTickets")}
                    </p>
                  </div>
                }
              >
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div>
                        <p
                          className="font-medium truncate max-w-xs"
                          style={{ color: colors.text.primary }}
                        >
                          {ticket.subject}
                        </p>
                        <p
                          className="text-xs truncate max-w-xs"
                          style={{ color: colors.text.tertiary }}
                        >
                          {ticket.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        color={TYPE_COLORS[ticket.type] || "default"}
                        variant="flat"
                      >
                        {t(
                          `adminDashboard.supportTickets.types.${ticket.type}`,
                        )}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        color={STATUS_COLORS[ticket.status] || "default"}
                        variant="flat"
                      >
                        {t(
                          `adminDashboard.supportTickets.statuses.${ticket.status}`,
                        )}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {formatDate(ticket.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Dropdown classNames={dropdownClassNames}>
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light">
                            <DotsThreeVertical
                              className="w-5 h-5"
                              style={{ color: colors.text.secondary }}
                            />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Ticket actions">
                          <DropdownItem
                            key="view"
                            startContent={<Eye className="w-4 h-4" />}
                            onPress={() => openDetail(ticket)}
                          >
                            {t("adminDashboard.supportTickets.viewDetail")}
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            color="danger"
                            className="text-danger"
                            startContent={<Trash className="w-4 h-4" />}
                            onPress={() => {
                              setDeleteId(ticket.id);
                              setDeleteOpen(true);
                            }}
                          >
                            {t("adminDashboard.supportTickets.deleteTicket")}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination
              total={totalPages}
              page={page}
              onChange={setPage}
              showControls
              color="primary"
            />
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteOpen}
        onOpenChange={setDeleteOpen}
        size="sm"
        style={{ backgroundColor: colors.background.light }}
      >
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          {(onClose) => (
            <>
              <ModalHeader style={{ color: colors.text.primary }}>
                {t("adminDashboard.supportTickets.deleteTicket")}
              </ModalHeader>
              <ModalBody>
                <p style={{ color: colors.text.secondary }}>
                  {t("adminDashboard.supportTickets.deleteConfirm")}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {t("logoutModal.cancel")}
                </Button>
                <Button
                  color="danger"
                  isLoading={deleting}
                  onPress={handleDelete}
                >
                  {t("adminDashboard.supportTickets.deleteTicket")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SupportTickets;
