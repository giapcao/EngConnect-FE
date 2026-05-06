import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { addToast } from "@heroui/toast";
import { Button } from "@heroui/react";
import { useSelector } from "react-redux";
import { selectUser, selectIsAuthenticated } from "../store/slices/authSlice";
import { router } from "../routes/router";
import { useTranslation } from "react-i18next";

// Same hub as video-call — backend sends TutorReady, RecordAvailable, AiSummaryAvailable from here
const NOTIFICATION_HUB_URL =
  "https://engconnect-prod.gdev.id.vn/hubs/video-call";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { t } = useTranslation();
  const tRef = useRef(t);
  tRef.current = t;

  const [lastTutorReady, setLastTutorReady] = useState(null);
  const [lastRecordAvailable, setLastRecordAvailable] = useState(null);
  const [lastAiSummaryAvailable, setLastAiSummaryAvailable] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.userId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(NOTIFICATION_HUB_URL, {
        accessTokenFactory: () => localStorage.getItem("accessToken") || "",
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.onreconnecting((err) =>
      console.warn("[NotificationHub] Reconnecting...", err),
    );
    connection.onreconnected((id) =>
      console.log("[NotificationHub] Reconnected, connectionId:", id),
    );
    connection.onclose((err) =>
      console.error("[NotificationHub] Connection closed", err),
    );

    connection.on("TutorReady", (data) => {
      console.log("[NotificationHub] TutorReady received:", data);
      setLastTutorReady({ ...data, _ts: Date.now() });
      addToast({
        title: tRef.current("notifications.tutorReady.title"),
        description: tRef.current("notifications.tutorReady.description"),
        color: "success",
        timeout: 12000,
        endContent: (
          <Button
            size="sm"
            color="success"
            variant="flat"
            onPress={() => router.navigate(`/meeting/${data.LessonId}`)}
          >
            {tRef.current("notifications.tutorReady.join")}
          </Button>
        ),
      });
    });

    connection.on("RecordAvailable", (data) => {
      console.log("[NotificationHub] RecordAvailable received:", data);
      setLastRecordAvailable({ ...data, _ts: Date.now() });
      addToast({
        title: tRef.current("notifications.recordAvailable.title"),
        description: tRef.current("notifications.recordAvailable.description"),
        color: "primary",
        timeout: 8000,
      });
    });

    connection.on("AiSummaryAvailable", (data) => {
      console.log("[NotificationHub] AiSummaryAvailable received:", data);
      setLastAiSummaryAvailable({ ...data, _ts: Date.now() });
      addToast({
        title: tRef.current("notifications.aiSummary.title"),
        description: tRef.current("notifications.aiSummary.description"),
        color: "primary",
        timeout: 8000,
      });
    });

    connection
      .start()
      .then(() =>
        console.log(
          "[NotificationHub] Connected, state:",
          connection.state,
          "| userId:",
          user.userId,
        ),
      )
      .catch((err) =>
        console.error("[NotificationHub] Connection failed:", err),
      );

    return () => {
      connection.stop();
    };
  }, [isAuthenticated, user?.userId]);

  return (
    <NotificationContext.Provider
      value={{ lastTutorReady, lastRecordAvailable, lastAiSummaryAvailable }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
