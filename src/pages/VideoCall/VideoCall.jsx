import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store";
import { useTranslation } from "react-i18next";
import { meetingApi, authApi } from "../../api";
import useWebRTC from "../../hooks/useWebRTC";
import {
  Microphone,
  MicrophoneSlash,
  VideoCamera,
  VideoCameraSlash,
  PhoneDisconnect,
  ChatCircle,
  PaperPlaneTilt,
  WifiHigh,
  WifiSlash,
  CircleNotch,
  ArrowLeft,
  X,
  UserCircle,
  MonitorArrowUp,
  Warning,
  Timer,
} from "@phosphor-icons/react";
import conversationIllustration from "../../assets/illustrations/conversation.avif";

const VideoCall = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const user = useSelector(selectUser);
  const dateLocale = i18n.language === "vi" ? "vi-VN" : "en-US";

  const userRole = user?.tutorId ? "Tutor" : "Student";

  const {
    connectionState,
    meetingStatus,
    participants,
    localStream,
    remoteStream,
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    screenStream,
    chatMessages,
    error,
    connect,
    disconnect,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    sendMessage,
    endMeeting,
    leaveRoom,
  } = useWebRTC(lessonId, userRole);

  const [meetingInfo, setMeetingInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [joined, setJoined] = useState(false);
  const [userNames, setUserNames] = useState({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState(null); // null | "leave" | "end"

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const chatEndRef = useRef(null);
  const fetchingNamesRef = useRef(new Set());
  const elapsedTimerRef = useRef(null);

  // Fetch display name for a userId and cache it
  const fetchUserName = useCallback(
    async (userId) => {
      if (!userId || userNames[userId] || fetchingNamesRef.current.has(userId))
        return;
      fetchingNamesRef.current.add(userId);
      try {
        const res = await authApi.getUserById(userId);
        const u = res.data;
        const name =
          `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.userName;
        setUserNames((prev) => ({ ...prev, [userId]: name }));
      } catch {
        setUserNames((prev) => ({ ...prev, [userId]: "User" }));
      } finally {
        fetchingNamesRef.current.delete(userId);
      }
    },
    [userNames],
  );

  // Resolve names for incoming chat messages
  useEffect(() => {
    chatMessages.forEach((msg) => {
      const isMe = msg.userId === user?.userId || msg.userId === user?.sub;
      if (!isMe) fetchUserName(msg.userId);
    });
  }, [chatMessages, user, fetchUserName]);

  // Fetch meeting info
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await meetingApi.getMeeting(lessonId);
        setMeetingInfo(res.data || res);
      } catch {
        // Meeting may not exist yet
      } finally {
        setLoadingInfo(false);
      }
    };
    fetchInfo();
  }, [lessonId]);

  // Elapsed timer: starts when connected + joined
  useEffect(() => {
    if (joined && connectionState === "connected") {
      setElapsedSeconds(0);
      elapsedTimerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
        elapsedTimerRef.current = null;
      }
    }
    return () => {
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
      }
    };
  }, [joined, connectionState]);

  // Attach streams to video elements
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleJoin = useCallback(async () => {
    setJoined(true);
    await connect();
  }, [connect]);

  const handleLeave = useCallback(async () => {
    setConfirmDialog(null);
    await leaveRoom();
    await disconnect();
    navigate(-1);
  }, [leaveRoom, disconnect, navigate]);

  const handleEndMeeting = useCallback(async () => {
    setConfirmDialog(null);
    await endMeeting();
    await disconnect();
    navigate(-1);
  }, [endMeeting, disconnect, navigate]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      sendMessage(chatInput);
      setChatInput("");
    }
  };

  // Format elapsed seconds as MM:SS or H:MM:SS
  const formatElapsed = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0)
      return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Derive remote participant's display name from meetingInfo
  const getRemoteName = () => {
    if (!meetingInfo) return null;
    if (userRole === "Tutor") {
      return (
        meetingInfo.studentName ||
        meetingInfo.studentFullName ||
        (meetingInfo.studentFirstName
          ? `${meetingInfo.studentFirstName} ${meetingInfo.studentLastName || ""}`.trim()
          : null) ||
        (meetingInfo.student
          ? `${meetingInfo.student.firstName || ""} ${meetingInfo.student.lastName || ""}`.trim() ||
            meetingInfo.student.userName
          : null)
      );
    } else {
      return (
        meetingInfo.tutorName ||
        meetingInfo.tutorFullName ||
        (meetingInfo.tutorFirstName
          ? `${meetingInfo.tutorFirstName} ${meetingInfo.tutorLastName || ""}`.trim()
          : null) ||
        (meetingInfo.tutor
          ? `${meetingInfo.tutor.firstName || ""} ${meetingInfo.tutor.lastName || ""}`.trim() ||
            meetingInfo.tutor.userName
          : null)
      );
    }
  };

  // Session title from meetingInfo
  const sessionTitle =
    meetingInfo?.sessionTitle ||
    meetingInfo?.lessonTitle ||
    meetingInfo?.courseTitle ||
    meetingInfo?.title ||
    t("videoCall.title");

  const remoteName = getRemoteName();
  const remoteParticipant = participants[0];
  const remoteAudioEnabled = remoteParticipant?.isAudioEnabled !== false;
  const remoteVideoEnabled = remoteParticipant?.isVideoEnabled !== false;

  // Connection indicator
  const ConnectionBadge = () => {
    const badgeColors = {
      connected: "#22C55E",
      connecting: "#F59E0B",
      reconnecting: "#F59E0B",
      disconnected: "#EF4444",
    };
    const bg = badgeColors[connectionState] || badgeColors.disconnected;
    return (
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: bg, color: "white" }}
      >
        {connectionState === "connected" ? (
          <WifiHigh weight="bold" className="w-3.5 h-3.5" />
        ) : (
          <WifiSlash weight="bold" className="w-3.5 h-3.5" />
        )}
        {t(`videoCall.connection.${connectionState}`)}
      </div>
    );
  };

  // Meeting ended screen
  if (meetingStatus === "Ended") {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="text-center">
          <PhoneDisconnect
            weight="fill"
            className="w-16 h-16 text-red-400 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-white mb-2">
            {t("videoCall.meetingEnded")}
          </h2>
          <p className="text-gray-400 mb-6">{t("videoCall.meetingEndedDesc")}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl bg-white text-gray-900 font-medium hover:bg-gray-100 transition-colors"
          >
            {t("videoCall.backToSchedule")}
          </button>
        </div>
      </div>
    );
  }

  // Pre-join lobby
  if (!joined) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="max-w-lg w-full mx-4">
          <div className="text-center mb-8">
            <VideoCamera
              weight="duotone"
              className="w-12 h-12 text-emerald-400 mx-auto mb-3"
            />
            <h1 className="text-2xl font-bold text-white mb-1">
              {sessionTitle}
            </h1>
            <p className="text-gray-400 text-sm">{t("videoCall.readyToJoin")}</p>
          </div>

          <div className="rounded-2xl bg-gray-800/60 p-6 mb-6 backdrop-blur">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <UserCircle
                  weight="fill"
                  className="w-6 h-6 text-emerald-400"
                />
              </div>
              <div>
                <p className="text-white font-medium text-sm">
                  {user?.fullName ||
                    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                    user?.email ||
                    t("videoCall.you")}
                </p>
                <p className="text-gray-400 text-xs">
                  {userRole === "Tutor"
                    ? t("videoCall.roleTutor")
                    : t("videoCall.roleStudent")}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleJoin}
              disabled={loadingInfo}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loadingInfo ? (
                <CircleNotch className="w-5 h-5 animate-spin" />
              ) : (
                <VideoCamera weight="bold" className="w-5 h-5" />
              )}
              {t("videoCall.joinMeeting")}
            </button>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mx-auto text-gray-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("videoCall.backToSchedule")}
          </button>
        </div>
      </div>
    );
  }

  // Main call UI
  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col z-50">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800/90 backdrop-blur border-b border-gray-700/50">
        {/* Left: connection + title */}
        <div className="flex items-center gap-3 min-w-0">
          <ConnectionBadge />
          <span className="text-white text-sm font-semibold truncate max-w-[220px]">
            {sessionTitle}
          </span>
          {participants.length > 0 && (
            <span className="text-gray-500 text-xs hidden sm:block">
              {participants.length + 1} {t("videoCall.participants")}
            </span>
          )}
        </div>

        {/* Center: elapsed timer */}
        {connectionState === "connected" && (
          <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-mono font-medium absolute left-1/2 -translate-x-1/2">
            <Timer weight="fill" className="w-4 h-4" />
            {formatElapsed(elapsedSeconds)}
          </div>
        )}

        {/* Right: chat toggle */}
        <button
          onClick={() => setShowChat(!showChat)}
          className={`relative p-2 rounded-xl transition-colors ${showChat ? "bg-emerald-500/20 text-emerald-400" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
        >
          <ChatCircle
            weight={showChat ? "fill" : "regular"}
            className="w-5 h-5"
          />
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Videos */}
        <div className="flex-1 flex items-center justify-center p-4 gap-4">
          {/* Remote video (main) */}
          <div className="relative flex-1 h-full max-h-full rounded-2xl overflow-hidden bg-gray-800">
            {remoteStream ? (
              <>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {/* Remote status badges (top-right) */}
                {(!remoteAudioEnabled || !remoteVideoEnabled) && (
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    {!remoteAudioEnabled && (
                      <div className="flex items-center gap-1 bg-gray-900/80 backdrop-blur px-2 py-1 rounded-full">
                        <MicrophoneSlash
                          weight="bold"
                          className="w-3.5 h-3.5 text-red-400"
                        />
                        <span className="text-[11px] text-red-400 font-medium">
                          {t("videoCall.remoteMuted")}
                        </span>
                      </div>
                    )}
                    {!remoteVideoEnabled && (
                      <div className="flex items-center gap-1 bg-gray-900/80 backdrop-blur px-2 py-1 rounded-full">
                        <VideoCameraSlash
                          weight="bold"
                          className="w-3.5 h-3.5 text-amber-400"
                        />
                        <span className="text-[11px] text-amber-400 font-medium">
                          {t("videoCall.remoteCameraOff")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {/* Remote name (bottom-left) */}
                {remoteName && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-gray-900/70 backdrop-blur px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-white text-xs font-medium">
                      {remoteName}
                    </span>
                  </div>
                )}
              </>
            ) : (
              /* Waiting / connecting state */
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {connectionState === "connecting" ? (
                  <>
                    <CircleNotch
                      weight="bold"
                      className="w-12 h-12 text-emerald-400 animate-spin mb-4"
                    />
                    <p className="text-gray-400 text-sm">
                      {t("videoCall.connecting")}
                    </p>
                  </>
                ) : (
                  <>
                    {/* Pulsing avatar rings */}
                    <div className="relative flex items-center justify-center mb-6">
                      <div className="absolute w-32 h-32 rounded-full border-2 border-emerald-500/20 animate-ping" />
                      <div className="absolute w-24 h-24 rounded-full border-2 border-emerald-500/30 animate-ping [animation-delay:0.3s]" />
                      <div className="relative w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                        <UserCircle
                          weight="fill"
                          className="w-14 h-14 text-gray-500"
                        />
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm font-medium">
                      {remoteName
                        ? t("videoCall.waitingFor", { name: remoteName })
                        : t("videoCall.waitingForOther")}
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Screen share preview (shown when sharing) */}
            {isScreenSharing && screenStream && (
              <div className="absolute bottom-4 left-4 w-64 h-40 rounded-xl overflow-hidden bg-black shadow-2xl border-2 border-emerald-500/50">
                <video
                  ref={screenVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 left-2 bg-emerald-500 rounded-full px-2 py-0.5">
                  <span className="text-[10px] text-white font-medium">
                    {t("videoCall.sharing")}
                  </span>
                </div>
              </div>
            )}

            {/* Local camera PIP */}
            <div className="absolute bottom-4 right-4 w-48 h-36 rounded-xl overflow-hidden bg-gray-900 shadow-2xl border-2 border-gray-600/60 group">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{
                  transform: "scaleX(-1)",
                  display: localStream && isVideoEnabled ? "block" : "none",
                }}
              />
              {!(localStream && isVideoEnabled) && (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <UserCircle
                    weight="fill"
                    className="w-12 h-12 text-gray-600"
                  />
                </div>
              )}
              {/* Mic mute indicator */}
              {!isAudioEnabled && (
                <div className="absolute top-2 left-2 bg-red-500 rounded-full p-1">
                  <MicrophoneSlash
                    weight="bold"
                    className="w-3 h-3 text-white"
                  />
                </div>
              )}
              {/* "You" label */}
              <div className="absolute bottom-0 inset-x-0 flex justify-center pb-1.5">
                <span className="text-[11px] text-white/80 font-medium bg-gray-900/60 px-2 py-0.5 rounded-full">
                  {t("videoCall.you")}
                </span>
              </div>
            </div>
          </div>

          {/* Chat panel */}
          {showChat && (
            <div className="w-80 h-full flex flex-col bg-gray-800 rounded-2xl ml-4 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                <h3 className="text-white font-semibold text-sm">
                  {t("videoCall.chat")}
                </h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-60">
                    <img
                      src={conversationIllustration}
                      alt="No messages"
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      onContextMenu={(e) => e.preventDefault()}
                      className="w-48 h-48 object-contain mb-3"
                    />
                    <p className="text-gray-400 text-xs text-center">
                      {t("videoCall.noMessages")}
                    </p>
                  </div>
                ) : (
                  chatMessages.map((msg, idx) => {
                    const isMe =
                      msg.userId === user?.userId || msg.userId === user?.sub;
                    const prevMsg = chatMessages[idx - 1];
                    const sameSenderAsPrev =
                      prevMsg && prevMsg.userId === msg.userId;
                    const isFirst = idx === 0 || !sameSenderAsPrev;
                    const senderName = isMe
                      ? t("videoCall.you")
                      : userNames[msg.userId] || "...";
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"} ${!isFirst ? "!mt-0.5" : ""}`}
                      >
                        {isFirst && (
                          <p
                            className={`text-[11px] font-medium mb-1 px-1 ${isMe ? "text-emerald-300" : "text-gray-400"}`}
                          >
                            {senderName}
                          </p>
                        )}
                        <div
                          className={`max-w-[80%] px-3 py-1.5 text-sm ${
                            isMe
                              ? "bg-emerald-500 text-white rounded-2xl rounded-br-md"
                              : "bg-gray-700 text-gray-200 rounded-2xl rounded-bl-md"
                          }`}
                        >
                          <p className="break-words">{msg.message}</p>
                          <p
                            className={`text-[10px] mt-0.5 ${isMe ? "text-emerald-200 text-right" : "text-gray-500"}`}
                          >
                            {new Date(msg.sentAt).toLocaleTimeString(
                              dateLocale,
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              <form
                onSubmit={handleSendChat}
                className="p-3 border-t border-gray-700"
              >
                <div className="flex gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={t("videoCall.typeMessage")}
                    maxLength={2000}
                    className="flex-1 bg-gray-700 text-white text-sm rounded-xl px-3 py-2 outline-none placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/50"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="p-2 rounded-xl bg-emerald-500 text-white disabled:opacity-40 hover:bg-emerald-600 transition-colors"
                  >
                    <PaperPlaneTilt weight="fill" className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-center gap-2 px-4 py-4 bg-gray-800/90 backdrop-blur border-t border-gray-700/50">
        {/* Mic */}
        <button
          onClick={toggleAudio}
          className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl transition-colors ${
            isAudioEnabled
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
          }`}
        >
          {isAudioEnabled ? (
            <Microphone weight="bold" className="w-5 h-5" />
          ) : (
            <MicrophoneSlash weight="bold" className="w-5 h-5" />
          )}
          <span className="text-[11px] font-medium leading-none">
            {t("videoCall.mic")}
          </span>
        </button>

        {/* Camera */}
        <button
          onClick={toggleVideo}
          className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl transition-colors ${
            isVideoEnabled
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
          }`}
        >
          {isVideoEnabled ? (
            <VideoCamera weight="bold" className="w-5 h-5" />
          ) : (
            <VideoCameraSlash weight="bold" className="w-5 h-5" />
          )}
          <span className="text-[11px] font-medium leading-none">
            {t("videoCall.camera")}
          </span>
        </button>

        {/* Screen share (tutor only) */}
        {userRole === "Tutor" && (
          <button
            onClick={toggleScreenShare}
            className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl transition-colors ${
              isScreenSharing
                ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            <MonitorArrowUp weight="bold" className="w-5 h-5" />
            <span className="text-[11px] font-medium leading-none">
              {t("videoCall.screen")}
            </span>
          </button>
        )}

        {/* Separator */}
        <div className="w-px h-10 bg-gray-700 mx-1" />

        {/* Leave / End */}
        {userRole === "Tutor" ? (
          <button
            onClick={() => setConfirmDialog("end")}
            className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <PhoneDisconnect weight="bold" className="w-5 h-5" />
            <span className="text-[11px] font-medium leading-none">
              {t("videoCall.endMeeting")}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setConfirmDialog("leave")}
            className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <PhoneDisconnect weight="bold" className="w-5 h-5" />
            <span className="text-[11px] font-medium leading-none">
              {t("videoCall.leave")}
            </span>
          </button>
        )}
      </div>

      {/* Confirmation dialog overlay */}
      {confirmDialog && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="bg-gray-800 rounded-2xl p-6 w-80 shadow-2xl border border-gray-700">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
                <Warning weight="fill" className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <h3 className="text-white font-bold text-lg text-center mb-2">
              {confirmDialog === "end"
                ? t("videoCall.endConfirmTitle")
                : t("videoCall.leaveConfirmTitle")}
            </h3>
            <p className="text-gray-400 text-sm text-center mb-6">
              {confirmDialog === "end"
                ? t("videoCall.endConfirmDesc")
                : t("videoCall.leaveConfirmDesc")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDialog(null)}
                className="flex-1 py-2.5 rounded-xl bg-gray-700 text-white text-sm font-medium hover:bg-gray-600 transition-colors"
              >
                {t("videoCall.cancel")}
              </button>
              <button
                onClick={
                  confirmDialog === "end" ? handleEndMeeting : handleLeave
                }
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                {confirmDialog === "end"
                  ? t("videoCall.endConfirmBtn")
                  : t("videoCall.leaveConfirmBtn")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
