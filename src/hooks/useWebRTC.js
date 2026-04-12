import { useState, useEffect, useRef, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { meetingApi } from "../api";

const HUB_URL = "https://engconnect-qa.gdev.id.vn/hubs/video-call";

const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

const CHUNK_INTERVAL = 30000; // 30s

const DEBUG_WEBRTC = true;

function toErrorInfo(err) {
  if (!err) return null;
  return {
    name: err.name,
    message: err.message,
    stack: err.stack,
  };
}

function parseCandidateType(candidateValue) {
  const candidateText =
    typeof candidateValue === "string"
      ? candidateValue
      : candidateValue?.candidate || "";
  const match = candidateText.match(/ typ ([a-zA-Z0-9]+)/);
  return match?.[1] || "unknown";
}

export default function useWebRTC(lessonId, userRole) {
  const [connectionState, setConnectionState] = useState("disconnected");
  const [meetingStatus, setMeetingStatus] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [error, setError] = useState(null);

  const hubRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunkCountRef = useRef(0);
  const chunkIntervalRef = useRef(null);
  const remoteConnectionIdRef = useRef(null);
  const pendingIceCandidatesRef = useRef([]);

  const debugLog = useCallback(
    (label, data) => {
      if (!DEBUG_WEBRTC) return;
      const prefix = `[WebRTC][lesson:${lessonId}][role:${userRole}] ${label}`;
      if (data === undefined) {
        console.log(prefix);
      } else {
        console.log(prefix, data);
      }
    },
    [lessonId, userRole],
  );

  // Build hub connection
  const buildConnection = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      debugLog("buildConnection: missing accessToken");
      setError("Not authenticated");
      return null;
    }
    debugLog("buildConnection: creating hub connection", {
      hubUrl: HUB_URL,
      tokenLength: token.length,
    });
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();
    return connection;
    return connection;
  }, [debugLog]);

  // Create peer connection for a remote user
  const createPeerConnection = useCallback(
    (remoteConnectionId) => {
      debugLog("createPeerConnection: start", {
        remoteConnectionId,
        hadExistingPeer: Boolean(peerRef.current),
      });

      if (peerRef.current) {
        debugLog("createPeerConnection: closing previous peer", {
          previousConnectionState: peerRef.current.connectionState,
          previousIceState: peerRef.current.iceConnectionState,
        });
        peerRef.current.close();
      }

      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      debugLog("createPeerConnection: pc created", {
        iceServers: ICE_SERVERS,
      });
      peerRef.current = pc;
      remoteConnectionIdRef.current = remoteConnectionId;
      pendingIceCandidatesRef.current = [];

      // Add local tracks
      if (localStreamRef.current) {
        debugLog("createPeerConnection: adding local tracks", {
          trackKinds: localStreamRef.current.getTracks().map((t) => t.kind),
          trackStates: localStreamRef.current.getTracks().map((t) => ({
            kind: t.kind,
            enabled: t.enabled,
            muted: t.muted,
            readyState: t.readyState,
          })),
        });
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current);
        });
      } else {
        debugLog("createPeerConnection: no local stream available");
      }

      // Remote stream
      const remote = new MediaStream();
      remoteStreamRef.current = remote;
      setRemoteStream(remote);

      pc.ontrack = (event) => {
        debugLog("pc.ontrack", {
          streamCount: event.streams?.length || 0,
          trackKind: event.track?.kind,
          trackId: event.track?.id,
          trackReadyState: event.track?.readyState,
        });
        event.streams[0]?.getTracks().forEach((track) => {
          remote.addTrack(track);
        });
        setRemoteStream(new MediaStream(remote.getTracks()));
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          debugLog("pc.onicecandidate: local candidate", {
            candidateType: parseCandidateType(event.candidate),
            sdpMid: event.candidate.sdpMid,
            sdpMLineIndex: event.candidate.sdpMLineIndex,
          });
        } else {
          debugLog("pc.onicecandidate: gathering complete");
        }
        if (event.candidate && hubRef.current) {
          hubRef.current
            .invoke(
              "SendIceCandidate",
              lessonId,
              remoteConnectionId,
              event.candidate,
            )
            .catch((err) => {
              debugLog("SendIceCandidate invoke failed", toErrorInfo(err));
            });
        }
      };

      pc.onconnectionstatechange = () => {
        console.log("Peer connection state:", pc.connectionState);
        debugLog("pc.onconnectionstatechange", {
          connectionState: pc.connectionState,
          signalingState: pc.signalingState,
          iceConnectionState: pc.iceConnectionState,
          iceGatheringState: pc.iceGatheringState,
        });
      };

      pc.oniceconnectionstatechange = () => {
        console.log("ICE connection state:", pc.iceConnectionState);
        debugLog("pc.oniceconnectionstatechange", {
          iceConnectionState: pc.iceConnectionState,
          connectionState: pc.connectionState,
        });
      };

      pc.onicegatheringstatechange = () => {
        debugLog("pc.onicegatheringstatechange", {
          iceGatheringState: pc.iceGatheringState,
        });
      };

      pc.onsignalingstatechange = () => {
        debugLog("pc.onsignalingstatechange", {
          signalingState: pc.signalingState,
        });
      };

      pc.onnegotiationneeded = () => {
        debugLog("pc.onnegotiationneeded");
      };

      pc.onicecandidateerror = (event) => {
        debugLog("pc.onicecandidateerror", {
          address: event.address,
          port: event.port,
          url: event.url,
          errorCode: event.errorCode,
          errorText: event.errorText,
        });
      };

      return pc;
    },
    [lessonId, debugLog],
  );

  const flushPendingIceCandidates = useCallback(async () => {
    if (!peerRef.current || pendingIceCandidatesRef.current.length === 0)
      return;
    const candidates = [...pendingIceCandidatesRef.current];
    debugLog("flushPendingIceCandidates", { count: candidates.length });
    pendingIceCandidatesRef.current = [];
    for (const candidate of candidates) {
      try {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        debugLog("buffered ICE added", {
          candidateType: parseCandidateType(candidate),
        });
      } catch (err) {
        console.error("Failed to add buffered ICE candidate:", err);
        debugLog("buffered ICE add failed", toErrorInfo(err));
      }
    }
  }, [debugLog]);

  // Start media
  const startMedia = useCallback(async () => {
    try {
      debugLog("startMedia: request user media", { video: true, audio: true });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
      debugLog("startMedia: success", {
        tracks: stream.getTracks().map((t) => ({
          kind: t.kind,
          enabled: t.enabled,
          muted: t.muted,
          readyState: t.readyState,
        })),
      });
      return stream;
    } catch (err) {
      console.error("Failed to get media:", err);
      debugLog("startMedia: video+audio failed", toErrorInfo(err));
      // Try audio only
      try {
        debugLog("startMedia: fallback audio only", {
          video: false,
          audio: true,
        });
        const stream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
        localStreamRef.current = stream;
        setLocalStream(stream);
        setIsVideoEnabled(false);
        debugLog("startMedia: audio fallback success", {
          tracks: stream.getTracks().map((t) => ({
            kind: t.kind,
            enabled: t.enabled,
            muted: t.muted,
            readyState: t.readyState,
          })),
        });
        return stream;
      } catch (audioErr) {
        debugLog("startMedia: audio fallback failed", toErrorInfo(audioErr));
        setError("Cannot access camera or microphone");
        return null;
      }
    }
  }, [debugLog]);

  // Start recording
  const startRecording = useCallback(
    (stream) => {
      if (!stream || !MediaRecorder.isTypeSupported("video/webm")) return;
      try {
        debugLog("startRecording: init", {
          streamTrackCount: stream.getTracks().length,
        });
        const recorder = new MediaRecorder(stream, {
          mimeType: "video/webm",
        });
        recorderRef.current = recorder;
        chunkCountRef.current = 0;

        recorder.ondataavailable = async (event) => {
          if (event.data.size > 0) {
            const timestamp = Date.now();
            chunkCountRef.current += 1;
            debugLog("recording chunk ready", {
              chunkIndex: chunkCountRef.current,
              timestamp,
              size: event.data.size,
            });
            try {
              await meetingApi.uploadRecordingChunk(
                lessonId,
                timestamp,
                event.data,
              );
            } catch (err) {
              console.error("Chunk upload failed, retrying...", err);
              debugLog("upload chunk failed", toErrorInfo(err));
              // Retry once
              try {
                await meetingApi.uploadRecordingChunk(
                  lessonId,
                  timestamp,
                  event.data,
                );
              } catch (retryErr) {
                console.error("Chunk upload retry failed:", retryErr);
                debugLog("upload chunk retry failed", toErrorInfo(retryErr));
              }
            }
          }
        };

        recorder.start();
        // Trigger dataavailable every CHUNK_INTERVAL
        chunkIntervalRef.current = setInterval(() => {
          if (recorder.state === "recording") {
            recorder.requestData();
          }
        }, CHUNK_INTERVAL);
      } catch (err) {
        console.error("Recording not supported:", err);
        debugLog("startRecording failed", toErrorInfo(err));
      }
    },
    [lessonId, debugLog],
  );

  // Stop recording
  const stopRecording = useCallback(() => {
    if (chunkIntervalRef.current) {
      clearInterval(chunkIntervalRef.current);
      chunkIntervalRef.current = null;
    }
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
  }, []);

  // Connect SignalR and set up all event handlers
  const connect = useCallback(async () => {
    if (hubRef.current) return;
    debugLog("connect: begin");

    const stream = await startMedia();
    if (!stream) return;

    const connection = buildConnection();
    if (!connection) return;

    hubRef.current = connection;
    setConnectionState("connecting");

    // ---- Event handlers ----

    connection.on("RoomCreated", (data) => {
      console.log("RoomCreated:", data);
      debugLog("SignalR RoomCreated", data);
      setMeetingStatus(data.meetingStatus);
    });

    connection.on("RoomJoined", (data) => {
      console.log("RoomJoined:", data);
      debugLog("SignalR RoomJoined", data);
      setMeetingStatus(data.meetingStatus);
    });

    connection.on("UserJoined", async (data) => {
      console.log("UserJoined:", data);
      debugLog("SignalR UserJoined", data);
      setParticipants((prev) => {
        if (prev.find((p) => p.connectionId === data.connectionId)) return prev;
        return [...prev, data];
      });

      // Avoid offer collisions: only tutor initiates offer.
      if (userRole !== "Tutor") return;

      // Create peer and send offer to the new user
      const pc = createPeerConnection(data.connectionId);
      try {
        const offer = await pc.createOffer();
        debugLog("Created offer", {
          type: offer.type,
          sdpLength: offer.sdp?.length,
          targetConnectionId: data.connectionId,
        });
        await pc.setLocalDescription(offer);
        debugLog("Set local description (offer)", {
          signalingState: pc.signalingState,
          iceConnectionState: pc.iceConnectionState,
        });
        await connection.invoke(
          "SendOffer",
          lessonId,
          data.connectionId,
          offer,
        );
        debugLog("SendOffer invoked", {
          targetConnectionId: data.connectionId,
        });
      } catch (err) {
        console.error("Failed to send offer:", err);
        debugLog("Failed to send offer", toErrorInfo(err));
      }
    });

    connection.on("UserLeft", (data) => {
      console.log("UserLeft:", data);
      debugLog("SignalR UserLeft", data);
      setParticipants((prev) =>
        prev.filter((p) => p.connectionId !== data.connectionId),
      );
      if (remoteConnectionIdRef.current === data.connectionId) {
        if (peerRef.current) {
          peerRef.current.close();
          peerRef.current = null;
        }
        setRemoteStream(null);
      }
    });

    connection.on("ReceiveOffer", async (data) => {
      console.log("ReceiveOffer from:", data.callerConnectionId);
      debugLog("ReceiveOffer", {
        callerConnectionId: data.callerConnectionId,
        sdpType: data.sdp?.type,
        sdpLength: data.sdp?.sdp?.length,
      });
      const pc = createPeerConnection(data.callerConnectionId);
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        debugLog("Set remote description (offer)", {
          signalingState: pc.signalingState,
          iceConnectionState: pc.iceConnectionState,
        });
        await flushPendingIceCandidates();
        const answer = await pc.createAnswer();
        debugLog("Created answer", {
          type: answer.type,
          sdpLength: answer.sdp?.length,
          targetConnectionId: data.callerConnectionId,
        });
        await pc.setLocalDescription(answer);
        debugLog("Set local description (answer)", {
          signalingState: pc.signalingState,
          iceConnectionState: pc.iceConnectionState,
        });
        await connection.invoke(
          "SendAnswer",
          lessonId,
          data.callerConnectionId,
          answer,
        );
        debugLog("SendAnswer invoked", {
          targetConnectionId: data.callerConnectionId,
        });
      } catch (err) {
        console.error("Failed to handle offer:", err);
        debugLog("Failed to handle offer", toErrorInfo(err));
      }
    });

    connection.on("ReceiveAnswer", async (data) => {
      console.log("ReceiveAnswer from:", data.calleeConnectionId);
      debugLog("ReceiveAnswer", {
        calleeConnectionId: data.calleeConnectionId,
        sdpType: data.sdp?.type,
        sdpLength: data.sdp?.sdp?.length,
      });
      if (peerRef.current) {
        try {
          await peerRef.current.setRemoteDescription(
            new RTCSessionDescription(data.sdp),
          );
          debugLog("Set remote description (answer)", {
            signalingState: peerRef.current.signalingState,
            iceConnectionState: peerRef.current.iceConnectionState,
          });
          await flushPendingIceCandidates();
        } catch (err) {
          console.error("Failed to set remote description:", err);
          debugLog("Failed to set remote description", toErrorInfo(err));
        }
      } else {
        debugLog("ReceiveAnswer ignored: no peerRef.current");
      }
    });

    connection.on("ReceiveIceCandidate", async (data) => {
      debugLog("ReceiveIceCandidate", {
        hasPeer: Boolean(peerRef.current),
        candidateType: parseCandidateType(data.candidate),
      });
      if (peerRef.current) {
        // Candidate can arrive before remoteDescription is set.
        if (!peerRef.current.remoteDescription) {
          pendingIceCandidatesRef.current.push(data.candidate);
          debugLog("ICE candidate buffered", {
            bufferedCount: pendingIceCandidatesRef.current.length,
            candidateType: parseCandidateType(data.candidate),
          });
          return;
        }
        try {
          await peerRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate),
          );
          debugLog("ICE candidate added", {
            candidateType: parseCandidateType(data.candidate),
          });
        } catch (err) {
          console.error("Failed to add ICE candidate:", err);
          debugLog("Failed to add ICE candidate", toErrorInfo(err));
        }
      } else {
        debugLog("ReceiveIceCandidate ignored: no peerRef.current");
      }
    });

    connection.on("error", (data) => {
      console.error("SignalR error event:", data);
      debugLog("SignalR error event", data);
      if (typeof data === "string") setError(data);
    });

    connection.on("MeetingEnded", (data) => {
      console.log("MeetingEnded:", data);
      setMeetingStatus("Ended");
      stopRecording();
    });

    connection.on("MediaToggled", (data) => {
      console.log("MediaToggled:", data);
      setParticipants((prev) =>
        prev.map((p) =>
          p.connectionId === data.connectionId
            ? {
                ...p,
                isAudioEnabled: data.isAudioEnabled,
                isVideoEnabled: data.isVideoEnabled,
              }
            : p,
        ),
      );
    });

    connection.on("ReceiveChatMessage", (data) => {
      setChatMessages((prev) => [...prev, data]);
    });

    connection.onreconnecting(() => setConnectionState("reconnecting"));
    connection.onreconnecting((err) => {
      debugLog("SignalR reconnecting", toErrorInfo(err));
      setConnectionState("reconnecting");
    });
    connection.onreconnected((connectionId) => {
      debugLog("SignalR reconnected", { connectionId });
      setConnectionState("connected");
    });
    connection.onclose((err) => {
      debugLog("SignalR closed", toErrorInfo(err));
      setConnectionState("disconnected");
    });

    // ---- Start connection ----
    try {
      debugLog("SignalR start: calling connection.start");
      await connection.start();
      setConnectionState("connected");
      debugLog("SignalR start: connected", {
        state: connection.state,
        connectionId: connection.connectionId,
      });

      // Tutor creates room, then joins. Student just joins.
      if (userRole === "Tutor") {
        try {
          debugLog("Invoke CreateRoom", { lessonId });
          await connection.invoke("CreateRoom", lessonId);
        } catch {
          // Room may already exist — that's fine
          debugLog("CreateRoom failed or room exists");
        }
      }
      debugLog("Invoke JoinRoom", { lessonId });
      await connection.invoke("JoinRoom", lessonId);

      // Start recording
      startRecording(stream);
    } catch (err) {
      console.error("SignalR connection failed:", err);
      debugLog("SignalR connect failed", toErrorInfo(err));
      setError("Failed to connect to meeting server");
      setConnectionState("disconnected");
    }
  }, [
    lessonId,
    userRole,
    buildConnection,
    startMedia,
    createPeerConnection,
    flushPendingIceCandidates,
    startRecording,
    stopRecording,
    debugLog,
  ]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        if (hubRef.current) {
          hubRef.current.invoke(
            "ToggleMedia",
            lessonId,
            audioTrack.enabled,
            isVideoEnabled,
          );
        }
      }
    }
  }, [lessonId, isVideoEnabled]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        if (hubRef.current) {
          hubRef.current.invoke(
            "ToggleMedia",
            lessonId,
            isAudioEnabled,
            videoTrack.enabled,
          );
        }
      }
    }
  }, [lessonId, isAudioEnabled]);

  // Send chat
  const sendMessage = useCallback(
    (message) => {
      if (
        !message ||
        message.trim().length === 0 ||
        message.length > 2000 ||
        !hubRef.current
      )
        return;
      hubRef.current.invoke("SendChatMessage", lessonId, message.trim());
    },
    [lessonId],
  );

  // End meeting (tutor only)
  const endMeeting = useCallback(async () => {
    stopRecording();
    if (hubRef.current) {
      try {
        await hubRef.current.invoke(
          "EndMeeting",
          lessonId,
          chunkCountRef.current || null,
        );
      } catch (err) {
        console.error("Failed to end via hub, trying HTTP:", err);
        try {
          await meetingApi.endMeeting(lessonId, chunkCountRef.current || null);
        } catch (httpErr) {
          console.error("HTTP end meeting also failed:", httpErr);
        }
      }
    }
  }, [lessonId, stopRecording]);

  // Leave room
  const leaveRoom = useCallback(async () => {
    stopRecording();
    if (hubRef.current) {
      try {
        await hubRef.current.invoke("LeaveRoom", lessonId);
      } catch {
        // ignore
      }
    }
  }, [lessonId, stopRecording]);

  // Disconnect & cleanup
  const disconnect = useCallback(async () => {
    stopRecording();

    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }

    setRemoteStream(null);
    setParticipants([]);

    if (hubRef.current) {
      try {
        await hubRef.current.stop();
      } catch {
        // ignore
      }
      hubRef.current = null;
    }
    setConnectionState("disconnected");
  }, [stopRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (peerRef.current) {
        peerRef.current.close();
        peerRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      if (hubRef.current) {
        hubRef.current.stop().catch(() => {});
        hubRef.current = null;
      }
    };
  }, [stopRecording]);

  return {
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
  };
}
