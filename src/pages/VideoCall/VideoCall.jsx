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
    chatMessages,
    error,
    connect,
    disconnect,
    toggleAudio,
    toggleVideo,
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

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatEndRef = useRef(null);
  const fetchingNamesRef = useRef(new Set());

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
        // fallback
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
        // Meeting may not exist yet — that's ok for testing
      } finally {
        setLoadingInfo(false);
      }
    };
    fetchInfo();
  }, [lessonId]);

  // Attach local stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Attach remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Handle join
  const handleJoin = useCallback(async () => {
    setJoined(true);
    await connect();
  }, [connect]);

  // Handle leave
  const handleLeave = useCallback(async () => {
    await leaveRoom();
    await disconnect();
    navigate(-1);
  }, [leaveRoom, disconnect, navigate]);

  // Handle end meeting (tutor only)
  const handleEndMeeting = useCallback(async () => {
    await endMeeting();
    await disconnect();
    navigate(-1);
  }, [endMeeting, disconnect, navigate]);

  // Handle send chat
  const handleSendChat = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      sendMessage(chatInput);
      setChatInput("");
    }
  };

  // Connection indicator
  const ConnectionBadge = () => {
    const colors = {
      connected: { bg: "#22C55E", text: "white" },
      connecting: { bg: "#F59E0B", text: "white" },
      reconnecting: { bg: "#F59E0B", text: "white" },
      disconnected: { bg: "#EF4444", text: "white" },
    };
    const c = colors[connectionState] || colors.disconnected;
    return (
      <div
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: c.bg, color: c.text }}
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
          <p className="text-gray-400 mb-6">
            {t("videoCall.meetingEndedDesc")}
          </p>
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
              {t("videoCall.title")}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("videoCall.readyToJoin")}
            </p>
          </div>

          {/* Info card */}
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
                  {user?.fullName || user?.email || t("videoCall.you")}
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
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <ConnectionBadge />
          <span className="text-white text-sm font-medium">
            {t("videoCall.title")}
          </span>
          {participants.length > 0 && (
            <span className="text-gray-400 text-xs">
              {participants.length + 1} {t("videoCall.participants")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowChat(!showChat)}
            className={`relative p-2 rounded-lg transition-colors ${showChat ? "bg-emerald-500/20 text-emerald-400" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
          >
            <ChatCircle
              weight={showChat ? "fill" : "regular"}
              className="w-5 h-5"
            />
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Videos */}
        <div
          className={`flex-1 flex items-center justify-center p-4 gap-4 ${showChat ? "pr-0" : ""}`}
        >
          {/* Remote video (main) */}
          <div className="relative flex-1 h-full max-h-full rounded-2xl overflow-hidden bg-gray-800">
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <UserCircle
                  weight="thin"
                  className="w-24 h-24 text-gray-600 mb-3"
                />
                <p className="text-gray-500 text-sm">
                  {connectionState === "connecting"
                    ? t("videoCall.connecting")
                    : t("videoCall.waitingForOther")}
                </p>
              </div>
            )}

            {/* Local video (PIP) */}
            <div className="absolute bottom-4 right-4 w-48 h-36 rounded-xl overflow-hidden bg-gray-900 shadow-2xl border-2 border-gray-700">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
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
              {!isAudioEnabled && (
                <div className="absolute top-2 left-2 bg-red-500 rounded-full p-1">
                  <MicrophoneSlash
                    weight="bold"
                    className="w-3 h-3 text-white"
                  />
                </div>
              )}
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
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
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
      <div className="flex items-center justify-center gap-3 px-4 py-4 bg-gray-800/80 backdrop-blur">
        {/* Mic toggle */}
        <button
          onClick={toggleAudio}
          className={`p-3.5 rounded-full transition-colors ${
            isAudioEnabled
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
          title={
            isAudioEnabled ? t("videoCall.muteMic") : t("videoCall.unmuteMic")
          }
        >
          {isAudioEnabled ? (
            <Microphone weight="bold" className="w-5 h-5" />
          ) : (
            <MicrophoneSlash weight="bold" className="w-5 h-5" />
          )}
        </button>

        {/* Video toggle */}
        <button
          onClick={toggleVideo}
          className={`p-3.5 rounded-full transition-colors ${
            isVideoEnabled
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
          title={
            isVideoEnabled ? t("videoCall.hideVideo") : t("videoCall.showVideo")
          }
        >
          {isVideoEnabled ? (
            <VideoCamera weight="bold" className="w-5 h-5" />
          ) : (
            <VideoCameraSlash weight="bold" className="w-5 h-5" />
          )}
        </button>

        {/* Leave / End */}
        {userRole === "Tutor" ? (
          <button
            onClick={handleEndMeeting}
            className="px-6 py-3.5 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <PhoneDisconnect weight="bold" className="w-5 h-5" />
            {t("videoCall.endMeeting")}
          </button>
        ) : (
          <button
            onClick={handleLeave}
            className="px-6 py-3.5 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <PhoneDisconnect weight="bold" className="w-5 h-5" />
            {t("videoCall.leave")}
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
