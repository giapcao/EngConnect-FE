import { useState, useEffect, useRef, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { meetingApi } from "../api";

const HUB_URL = "https://engconnect-qa.gdev.id.vn/hubs/video-call";

const DEFAULT_ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

const CHUNK_INTERVAL = 30000; // 30s

export default function useWebRTC(lessonId, userRole) {
  const [connectionState, setConnectionState] = useState("disconnected");
  const [meetingStatus, setMeetingStatus] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [error, setError] = useState(null);

  const hubRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const screenAudioSenderRef = useRef(null);
  const audioCtxRef = useRef(null);
  const audioDestRef = useRef(null);
  const audioNodesRef = useRef({ mic: null, remote: null, screenAudio: null });
  const canvasRef = useRef(null);
  const canvasVideoElRef = useRef(null);
  const drawTimerRef = useRef(null);
  const recorderRef = useRef(null);
  const recordingStreamRef = useRef(null);
  const chunkCountRef = useRef(0);
  const chunkIntervalRef = useRef(null);
  const chunkTimestampRef = useRef(0);
  const pendingUploadsRef = useRef([]);
  const remoteConnectionIdRef = useRef(null);
  const pendingIceCandidatesRef = useRef([]);
  const iceServersRef = useRef(DEFAULT_ICE_SERVERS);

  const loadIceServers = useCallback(async () => {
    try {
      const data = await meetingApi.getIceServers();
      const servers = Array.isArray(data?.iceServers)
        ? data.iceServers
        : Array.isArray(data?.data?.iceServers)
          ? data.data.iceServers
          : [];

      const normalizedServers = servers
        .filter((server) => {
          if (!server) return false;
          const urls = server.urls;
          return (
            (Array.isArray(urls) && urls.length > 0) ||
            (typeof urls === "string" && urls.trim().length > 0)
          );
        })
        .map((server) => ({
          urls: server.urls,
          ...(server.username ? { username: server.username } : {}),
          ...(server.credential ? { credential: server.credential } : {}),
        }));

      if (normalizedServers.length > 0) {
        iceServersRef.current = normalizedServers;
      } else {
        iceServersRef.current = DEFAULT_ICE_SERVERS;
        console.warn(
          "ICE server API returned empty config. Falling back to default STUN.",
        );
      }
    } catch (err) {
      iceServersRef.current = DEFAULT_ICE_SERVERS;
      console.error("Failed to load ICE servers. Using default STUN.", err);
    }
  }, []);

  const flushPendingIceCandidates = useCallback(async (pc) => {
    if (
      !pc ||
      !pc.remoteDescription ||
      pendingIceCandidatesRef.current.length === 0
    ) {
      return;
    }

    const queued = [...pendingIceCandidatesRef.current];
    pendingIceCandidatesRef.current = [];

    for (const candidate of queued) {
      try {
        await pc.addIceCandidate(candidate);
      } catch (err) {
        console.error("Failed to add buffered ICE candidate:", err);
      }
    }
  }, []);

  // Build hub connection
  const buildConnection = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Not authenticated");
      return null;
    }
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();
    return connection;
  }, []);

  // Renegotiate peer connection (new offer/answer) after addTrack/removeTrack
  const renegotiate = useCallback(async () => {
    const pc = peerRef.current;
    const hub = hubRef.current;
    const remoteId = remoteConnectionIdRef.current;
    if (!pc || !hub || !remoteId) return;
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await hub.invoke("SendOffer", lessonId, remoteId, offer);
    } catch (err) {
      console.error("Renegotiation failed:", err);
    }
  }, [lessonId]);

  // Create peer connection for a remote user
  const createPeerConnection = useCallback(
    (remoteConnectionId) => {
      if (peerRef.current) {
        peerRef.current.close();
      }

      pendingIceCandidatesRef.current = [];

      const pc = new RTCPeerConnection({
        iceServers: iceServersRef.current,
      });
      peerRef.current = pc;
      remoteConnectionIdRef.current = remoteConnectionId;

      // Add local tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current);
        });
      }

      // Remote stream
      const remote = new MediaStream();
      remoteStreamRef.current = remote;
      setRemoteStream(remote);

      pc.ontrack = (event) => {
        event.streams[0]?.getTracks().forEach((track) => {
          remote.addTrack(track);
        });
        setRemoteStream(new MediaStream(remote.getTracks()));
        // Connect remote audio to recording AudioContext mix (no recorder restart)
        if (userRole === "Tutor") {
          const remoteAudioTracks = event.streams[0]?.getAudioTracks();
          if (
            remoteAudioTracks?.length &&
            audioCtxRef.current?.state !== "closed" &&
            audioDestRef.current
          ) {
            try { audioNodesRef.current.remote?.disconnect(); } catch { /* ignore */ }
            try {
              const src = audioCtxRef.current.createMediaStreamSource(
                new MediaStream(remoteAudioTracks),
              );
              src.connect(audioDestRef.current);
              audioNodesRef.current.remote = src;
            } catch { /* ignore */ }
          }
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && hubRef.current) {
          hubRef.current.invoke(
            "SendIceCandidate",
            lessonId,
            remoteConnectionId,
            event.candidate,
          );
        }
      };

      pc.onicecandidateerror = (event) => {
        console.error("ICE candidate error:", {
          url: event.url,
          errorCode: event.errorCode,
          errorText: event.errorText,
        });
      };

      pc.oniceconnectionstatechange = () => {
        console.log("ICE connection state:", pc.iceConnectionState);
      };

      pc.onicegatheringstatechange = () => {
        console.log("ICE gathering state:", pc.iceGatheringState);
      };

      pc.onsignalingstatechange = () => {
        console.log("Signaling state:", pc.signalingState);
      };

      pc.onconnectionstatechange = () => {
        console.log("Peer connection state:", pc.connectionState);
      };

      return pc;
    },
    [lessonId, userRole],
  );

  // Start media
  const startMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error("Failed to get media:", err);
      // Try audio only
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
        localStreamRef.current = stream;
        setLocalStream(stream);
        setIsVideoEnabled(false);
        return stream;
      } catch (audioErr) {
        setError("Cannot access camera or microphone");
        return null;
      }
    }
  }, []);

  // Start recording (tutor only) — canvas for video + AudioContext for audio
  // The MediaRecorder NEVER restarts. We swap what's drawn / mixed instead.
  const startRecording = useCallback(
    (stream) => {
      if (!stream || userRole !== "Tutor") return;
      if (!MediaRecorder.isTypeSupported("video/webm")) return;
      try {
        // --- Canvas for stable video track ---
        const vTrack = stream.getVideoTracks()[0];
        const settings = vTrack?.getSettings?.() || {};
        const canvas = document.createElement("canvas");
        canvas.width = settings.width || 1280;
        canvas.height = settings.height || 720;
        canvasRef.current = canvas;
        const ctx2d = canvas.getContext("2d");

        const videoEl = document.createElement("video");
        videoEl.srcObject = stream;
        videoEl.muted = true;
        videoEl.playsInline = true;
        videoEl.play().catch(() => {});
        canvasVideoElRef.current = videoEl;

        // Draw loop (setInterval keeps running in background tabs, throttled to ~1 fps)
        const draw = () => {
          if (videoEl.readyState >= videoEl.HAVE_CURRENT_DATA) {
            const vw = videoEl.videoWidth;
            const vh = videoEl.videoHeight;
            if (vw && vh && (canvas.width !== vw || canvas.height !== vh)) {
              canvas.width = vw;
              canvas.height = vh;
            }
            ctx2d.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
          }
        };
        drawTimerRef.current = setInterval(draw, 33); // ~30 fps

        // --- AudioContext for stable audio track ---
        const audioCtx = new AudioContext();
        audioCtxRef.current = audioCtx;
        const dest = audioCtx.createMediaStreamDestination();
        audioDestRef.current = dest;

        const micTrack = stream.getAudioTracks()[0];
        if (micTrack) {
          const micSrc = audioCtx.createMediaStreamSource(
            new MediaStream([micTrack]),
          );
          micSrc.connect(dest);
          audioNodesRef.current.mic = micSrc;
        }

        // --- Combine canvas video + AudioContext audio ---
        const canvasStream = canvas.captureStream(30);
        const recVideo = canvasStream.getVideoTracks()[0];
        const recAudio = dest.stream.getAudioTracks()[0];
        const recTracks = [];
        if (recVideo) recTracks.push(recVideo);
        if (recAudio) recTracks.push(recAudio);
        const recordStream = new MediaStream(recTracks);
        recordingStreamRef.current = recordStream;

        const recorder = new MediaRecorder(recordStream, {
          mimeType: "video/webm",
        });
        recorderRef.current = recorder;
        chunkCountRef.current = 0;
        chunkTimestampRef.current = 0;
        pendingUploadsRef.current = [];

        recorder.ondataavailable = async (event) => {
          if (event.data.size > 0) {
            const now = Date.now();
            const ts = Math.max(now, chunkTimestampRef.current + 1);
            chunkTimestampRef.current = ts;
            chunkCountRef.current += 1;

            const uploadPromise = meetingApi
              .uploadRecordingChunk(lessonId, ts, event.data)
              .catch((err) => {
                console.error("Chunk upload failed, retrying once:", err);
                return meetingApi
                  .uploadRecordingChunk(lessonId, ts, event.data)
                  .catch((retryErr) => {
                    console.error("Chunk upload retry failed:", retryErr);
                  });
              });

            pendingUploadsRef.current.push(uploadPromise);
            uploadPromise.finally(() => {
              pendingUploadsRef.current =
                pendingUploadsRef.current.filter((p) => p !== uploadPromise);
            });
          }
        };

        recorder.start();
        chunkIntervalRef.current = setInterval(() => {
          if (recorder.state === "recording") {
            recorder.requestData();
          }
        }, CHUNK_INTERVAL);
      } catch (err) {
        console.error("Recording not supported:", err);
      }
    },
    [lessonId, userRole],
  );

  // Stop recording and clean up canvas / AudioContext resources
  const stopRecording = useCallback(() => {
    if (chunkIntervalRef.current) {
      clearInterval(chunkIntervalRef.current);
      chunkIntervalRef.current = null;
    }
    return new Promise((resolve) => {
      const cleanup = () => {
        recorderRef.current = null;
        recordingStreamRef.current = null;
        // Stop draw loop
        if (drawTimerRef.current) {
          clearInterval(drawTimerRef.current);
          drawTimerRef.current = null;
        }
        if (canvasVideoElRef.current) {
          canvasVideoElRef.current.srcObject = null;
          canvasVideoElRef.current = null;
        }
        canvasRef.current = null;
        // Disconnect audio nodes
        try { audioNodesRef.current.mic?.disconnect(); } catch { /* ignore */ }
        try { audioNodesRef.current.remote?.disconnect(); } catch { /* ignore */ }
        try { audioNodesRef.current.screenAudio?.disconnect(); } catch { /* ignore */ }
        audioNodesRef.current = { mic: null, remote: null, screenAudio: null };
        audioDestRef.current = null;
        if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
          try { audioCtxRef.current.close(); } catch { /* ignore */ }
          audioCtxRef.current = null;
        }
        Promise.allSettled(pendingUploadsRef.current).then(() => resolve());
      };

      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.onstop = cleanup;
        recorderRef.current.requestData();
        recorderRef.current.stop();
      } else {
        cleanup();
      }
    });
  }, []);

  // Connect SignalR and set up all event handlers
  const connect = useCallback(async () => {
    if (hubRef.current) return;

    const stream = await startMedia();
    if (!stream) return;

    await loadIceServers();

    const connection = buildConnection();
    if (!connection) return;

    pendingIceCandidatesRef.current = [];

    hubRef.current = connection;
    setConnectionState("connecting");

    // ---- Event handlers ----

    connection.on("RoomCreated", (data) => {
      console.log("RoomCreated:", data);
      setMeetingStatus(data.meetingStatus);
    });

    connection.on("RoomJoined", (data) => {
      console.log("RoomJoined:", data);
      setMeetingStatus(data.meetingStatus);
    });

    connection.on("UserJoined", async (data) => {
      console.log("UserJoined:", data);
      setParticipants((prev) => {
        if (prev.find((p) => p.connectionId === data.connectionId)) return prev;
        return [...prev, data];
      });

      const shouldCreateOffer =
        userRole === "Tutor" ||
        (connection.connectionId &&
          data.connectionId &&
          connection.connectionId < data.connectionId);

      if (!shouldCreateOffer) {
        console.log("Skip offer creation for", data.connectionId);
        return;
      }

      // Create peer and send offer to the new user
      const pc = createPeerConnection(data.connectionId);
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await connection.invoke(
          "SendOffer",
          lessonId,
          data.connectionId,
          offer,
        );
      } catch (err) {
        console.error("Failed to send offer:", err);
      }
    });

    connection.on("UserLeft", (data) => {
      console.log("UserLeft:", data);
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
      const pc = createPeerConnection(data.callerConnectionId);
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        await flushPendingIceCandidates(pc);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await connection.invoke(
          "SendAnswer",
          lessonId,
          data.callerConnectionId,
          answer,
        );
      } catch (err) {
        console.error("Failed to handle offer:", err);
      }
    });

    connection.on("ReceiveAnswer", async (data) => {
      console.log("ReceiveAnswer from:", data.calleeConnectionId);
      if (peerRef.current) {
        try {
          await peerRef.current.setRemoteDescription(
            new RTCSessionDescription(data.sdp),
          );
          await flushPendingIceCandidates(peerRef.current);
        } catch (err) {
          console.error("Failed to set remote description:", err);
        }
      }
    });

    connection.on("ReceiveIceCandidate", async (data) => {
      if (peerRef.current) {
        try {
          const iceCandidate = new RTCIceCandidate(data.candidate);
          if (!peerRef.current.remoteDescription) {
            pendingIceCandidatesRef.current.push(iceCandidate);
            console.log(
              "Buffered ICE candidate until remote description is set",
            );
            return;
          }
          await peerRef.current.addIceCandidate(iceCandidate);
        } catch (err) {
          console.error("Failed to add ICE candidate:", err);
        }
      }
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
      console.log(`[Chat] userId=${data.userId} | message="${data.message}" | sentAt=${data.sentAt}`);
      setChatMessages((prev) => [...prev, data]);
    });

    connection.onreconnecting(() => {
      setConnectionState("reconnecting");
      // Clear stale peer so fresh negotiation happens after reconnect
      if (peerRef.current) {
        peerRef.current.close();
        peerRef.current = null;
      }
      pendingIceCandidatesRef.current = [];
      remoteConnectionIdRef.current = null;
      setRemoteStream(null);
    });

    connection.onreconnected(async () => {
      setConnectionState("connected");
      // Re-join the room — new connectionId after reconnect, need fresh UserJoined
      if (userRole === "Tutor") {
        try {
          await connection.invoke("CreateRoom", lessonId);
        } catch {
          // Room already exists — fine
        }
      }
      try {
        await connection.invoke("JoinRoom", lessonId);
      } catch (err) {
        console.error("Failed to re-join room after reconnect:", err);
      }
    });

    connection.onclose(() => setConnectionState("disconnected"));

    // ---- Start connection ----
    try {
      await connection.start();
      setConnectionState("connected");

      // Tutor creates room, then joins. Student just joins.
      if (userRole === "Tutor") {
        try {
          await connection.invoke("CreateRoom", lessonId);
        } catch {
          // Room may already exist — that's fine
        }
      }
      await connection.invoke("JoinRoom", lessonId);

      // Start recording
      startRecording(stream);
    } catch (err) {
      console.error("SignalR connection failed:", err);
      setError("Failed to connect to meeting server");
      setConnectionState("disconnected");
    }
  }, [
    lessonId,
    userRole,
    buildConnection,
    startMedia,
    loadIceServers,
    createPeerConnection,
    flushPendingIceCandidates,
    startRecording,
    stopRecording,
  ]);

  // Toggle screen share (tutor only)
  // No recorder restart — just swap the canvas video source + audio nodes
  const toggleScreenShare = useCallback(async () => {
    if (userRole !== "Tutor") return;
    const pc = peerRef.current;
    if (!pc) return;

    if (screenStreamRef.current) {
      // --- Stop screen share — switch back to camera ---
      const oldScreen = screenStreamRef.current;
      screenStreamRef.current = null;
      setScreenStream(null);
      setIsScreenSharing(false);

      // 1. Swap canvas drawing source back to camera
      if (canvasVideoElRef.current) {
        canvasVideoElRef.current.srcObject = localStreamRef.current;
        canvasVideoElRef.current.play().catch(() => {});
      }

      // 2. Disconnect screen audio from recording mix
      try { audioNodesRef.current.screenAudio?.disconnect(); } catch { /* ignore */ }
      audioNodesRef.current.screenAudio = null;

      // 3. Remove screen audio sender from peer connection
      if (screenAudioSenderRef.current && pc) {
        try { pc.removeTrack(screenAudioSenderRef.current); } catch { /* ignore */ }
        screenAudioSenderRef.current = null;
      }

      // 4. Swap peer video back to camera
      const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
      if (cameraTrack) {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender) await sender.replaceTrack(cameraTrack);
      }

      // 5. Renegotiate so remote side drops the screen audio track
      await renegotiate();

      // 6. Stop old screen tracks
      oldScreen.getTracks().forEach((t) => t.stop());
      return;
    }

    // --- Start screen share ---
    try {
      const screenStr = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      screenStreamRef.current = screenStr;
      setScreenStream(screenStr);
      setIsScreenSharing(true);

      // 1. Swap canvas drawing source to screen
      if (canvasVideoElRef.current) {
        canvasVideoElRef.current.srcObject = screenStr;
        canvasVideoElRef.current.play().catch(() => {});
      }

      // 2. Connect screen audio to recording mix
      const screenAudioTrack = screenStr.getAudioTracks()[0];
      if (
        screenAudioTrack &&
        audioCtxRef.current?.state !== "closed" &&
        audioDestRef.current
      ) {
        try {
          const src = audioCtxRef.current.createMediaStreamSource(
            new MediaStream([screenAudioTrack]),
          );
          src.connect(audioDestRef.current);
          audioNodesRef.current.screenAudio = src;
        } catch { /* ignore */ }
      }

      // 3. Replace video track on peer connection
      const screenTrack = screenStr.getVideoTracks()[0];
      const videoSender = pc.getSenders().find((s) => s.track?.kind === "video");
      if (videoSender) await videoSender.replaceTrack(screenTrack);

      // 4. Add screen audio to peer connection (so student hears it)
      if (screenAudioTrack && pc) {
        screenAudioSenderRef.current = pc.addTrack(screenAudioTrack, screenStr);
      }

      // 5. Renegotiate so remote side receives the new screen audio track
      await renegotiate();

      // When user stops sharing via browser UI
      screenTrack.onended = async () => {
        const oldScr = screenStreamRef.current;
        screenStreamRef.current = null;
        setScreenStream(null);
        setIsScreenSharing(false);

        // Swap canvas back to camera
        if (canvasVideoElRef.current) {
          canvasVideoElRef.current.srcObject = localStreamRef.current;
          canvasVideoElRef.current.play().catch(() => {});
        }
        // Disconnect screen audio from recording
        try { audioNodesRef.current.screenAudio?.disconnect(); } catch { /* ignore */ }
        audioNodesRef.current.screenAudio = null;

        // Remove screen audio sender from peer
        if (screenAudioSenderRef.current && peerRef.current) {
          try { peerRef.current.removeTrack(screenAudioSenderRef.current); } catch { /* ignore */ }
          screenAudioSenderRef.current = null;
        }
        // Swap peer video back to camera
        const camTrack = localStreamRef.current?.getVideoTracks()[0];
        if (camTrack) {
          const s = peerRef.current?.getSenders().find((s) => s.track?.kind === "video");
          if (s) await s.replaceTrack(camTrack);
        }
        // Renegotiate so remote side drops screen audio
        await renegotiate();
        if (oldScr) oldScr.getTracks().forEach((t) => t.stop());
      };
    } catch (err) {
      console.error("Screen share failed:", err);
    }
  }, [userRole, renegotiate]);

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

  // End meeting (tutor only) — flush recording before signaling
  const endMeeting = useCallback(async () => {
    await stopRecording();
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

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      setScreenStream(null);
      setIsScreenSharing(false);
      screenAudioSenderRef.current = null;
    }

    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    pendingIceCandidatesRef.current = [];

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
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      screenAudioSenderRef.current = null;
      if (peerRef.current) {
        peerRef.current.close();
        peerRef.current = null;
      }
      pendingIceCandidatesRef.current = [];
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
  };
}
