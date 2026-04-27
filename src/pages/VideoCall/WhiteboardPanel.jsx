import { useEffect, useRef, useState, useCallback } from "react";
import { Tldraw, useEditor } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";

// ── Permission presets ──────────────────────────────────────────────────────
const PERMS_VIEW = { canDraw: false, canSelect: false };
const PERMS_DRAW = {
  canDraw: true,
  canSelect: true,
  canEditOwnShapes: true,
  canEditAllShapes: false,
  canDelete: false,
  canUseEraser: true,
};

// ── Blob URL → base64 resolution ────────────────────────────────────────────
// tldraw stores uploaded images as object URLs (blob:...) which are local to
// the browser tab and cannot be transferred over the data channel.  We convert
// them to base64 data URLs before serialising store changes for transmission.
async function blobUrlToDataUrl(src) {
  try {
    const resp = await fetch(src);
    const blob = await resp.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(src);
      reader.readAsDataURL(blob);
    });
  } catch {
    return src;
  }
}

async function resolveAssetBlobs(changes) {
  const resolveRecord = async (record) => {
    if (record?.typeName === "asset" && record.props?.src?.startsWith("blob:")) {
      return { ...record, props: { ...record.props, src: await blobUrlToDataUrl(record.props.src) } };
    }
    return record;
  };

  const { added = {}, updated = {}, removed = {} } = changes;

  const hasBlob =
    Object.values(added).some((r) => r?.typeName === "asset" && r.props?.src?.startsWith("blob:")) ||
    Object.values(updated).some(([, next]) => next?.typeName === "asset" && next.props?.src?.startsWith("blob:"));

  if (!hasBlob) return changes;

  const [addedEntries, updatedEntries] = await Promise.all([
    Promise.all(Object.entries(added).map(async ([k, v]) => [k, await resolveRecord(v)])),
    Promise.all(Object.entries(updated).map(async ([k, [prev, next]]) => [k, [prev, await resolveRecord(next)]])),
  ]);

  return { added: Object.fromEntries(addedEntries), updated: Object.fromEntries(updatedEntries), removed };
}

async function resolveSnapshotBlobs(snapshot) {
  const store = { ...snapshot.store };
  const entries = Object.entries(store).filter(
    ([, r]) => r?.typeName === "asset" && r.props?.src?.startsWith("blob:"),
  );
  if (entries.length === 0) return snapshot;
  await Promise.all(
    entries.map(async ([id, record]) => {
      store[id] = { ...record, props: { ...record.props, src: await blobUrlToDataUrl(record.props.src) } };
    }),
  );
  return { ...snapshot, store };
}

// ── Chunked transport ────────────────────────────────────────────────────────
// RTCDataChannel SCTP message limits: Chrome ~256 KB, Firefox ~64 KB.
// tldraw asset records for uploaded images can be several MB of base64, so we
// split large payloads into 14 KB pieces and reassemble on the other side.
const MAX_CHUNK = 14_000; // characters
let _chunkSeq = 0;

function sendChunked(sendData, payload) {
  if (payload.length <= MAX_CHUNK) {
    sendData(payload);
    return;
  }
  const id = ++_chunkSeq;
  const n = Math.ceil(payload.length / MAX_CHUNK);
  for (let i = 0; i < n; i++) {
    const d = payload.slice(i * MAX_CHUNK, (i + 1) * MAX_CHUNK);
    sendData(JSON.stringify({ type: "wb:chunk", id, i, n, d }));
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function applyRemoteChanges(store, changes) {
  try {
    const { added, updated, removed } = changes;
    store.mergeRemoteChanges(() => {
      if (added && Object.keys(added).length > 0) {
        store.put(Object.values(added));
      }
      if (updated && Object.keys(updated).length > 0) {
        store.put(Object.values(updated).map(([, next]) => next));
      }
      if (removed && Object.keys(removed).length > 0) {
        store.remove(Object.keys(removed));
      }
    });
  } catch (err) {
    console.error("[Whiteboard] applyRemoteChanges:", err);
  }
}

// ── Capture whiteboard content to an off-DOM canvas ─────────────────────────
function WhiteboardCapture({ captureCanvas }) {
  const editor = useEditor();
  const busyRef = useRef(false);

  useEffect(() => {
    if (!editor || !captureCanvas) return;

    const ctx = captureCanvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, captureCanvas.width, captureCanvas.height);

    let active = true;

    const capture = async () => {
      if (!active || busyRef.current) return;

      const ids = Array.from(editor.getCurrentPageShapeIds());
      if (ids.length === 0) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, captureCanvas.width, captureCanvas.height);
        return;
      }

      busyRef.current = true;
      try {
        const result = await editor.toImage(ids, { format: "png", pixelRatio: 1 });
        if (!active || !result?.blob) return;

        const url = URL.createObjectURL(result.blob);
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            if (!active) { URL.revokeObjectURL(url); resolve(); return; }
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, captureCanvas.width, captureCanvas.height);
            const scale = Math.min(
              (captureCanvas.width - 40) / result.width,
              (captureCanvas.height - 40) / result.height,
              1,
            );
            const w = result.width * scale;
            const h = result.height * scale;
            ctx.drawImage(img, (captureCanvas.width - w) / 2, (captureCanvas.height - h) / 2, w, h);
            URL.revokeObjectURL(url);
            resolve();
          };
          img.onerror = () => { URL.revokeObjectURL(url); resolve(); };
          img.src = url;
        });
      } catch {
        // ignore
      } finally {
        busyRef.current = false;
      }
    };

    // ~2 fps
    const timer = setInterval(capture, 500);
    capture();

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [editor, captureCanvas]);

  return null;
}

// ── Data-channel sync + permissions ─────────────────────────────────────────
function WhiteboardSync({ sendData, onWbMessage, isHost, isDataChannelOpen, guestPerms }) {
  const editor = useEditor();
  const [myPerms, setMyPerms] = useState(isHost ? PERMS_DRAW : PERMS_VIEW);
  const syncedRef = useRef(isHost);
  const pendingRef = useRef([]);
  const pendingChunksRef = useRef({});
  const guestPermsRef = useRef(guestPerms);
  useEffect(() => { guestPermsRef.current = guestPerms; }, [guestPerms]);

  // Apply permissions to the editor (student only)
  useEffect(() => {
    if (!editor || isHost) return;
    try {
      editor.updateInstanceState({ isReadonly: !myPerms.canDraw });
      if (!myPerms.canDraw) editor.setCurrentTool("hand");
    } catch {
      // editor not ready
    }
  }, [editor, isHost, myPerms]);

  // Handle incoming data-channel messages
  useEffect(() => {
    if (!editor) return;

    // Process a fully-assembled (possibly re-joined from chunks) message object
    const sendSnapshot = async () => {
      const snapshot = await resolveSnapshotBlobs(editor.store.getStoreSnapshot("document"));
      sendChunked(sendData, JSON.stringify({ type: "wb:full", snapshot }));
      sendData(JSON.stringify({ type: "wb:perms", perms: guestPermsRef.current }));
    };

    const processMsg = (msg) => {
      if (msg.type === "wb:req_sync" && isHost) {
        sendSnapshot();

      } else if (msg.type === "wb:full" && !isHost) {
        editor.store.loadStoreSnapshot(msg.snapshot);
        syncedRef.current = true;
        pendingRef.current.forEach((c) => applyRemoteChanges(editor.store, c));
        pendingRef.current = [];

      } else if (msg.type === "wb") {
        if (!syncedRef.current) {
          pendingRef.current.push(msg.changes);
        } else {
          applyRemoteChanges(editor.store, msg.changes);
        }

      } else if (msg.type === "wb:perms" && !isHost) {
        setMyPerms(msg.perms);
      }
    };

    const unsub = onWbMessage((rawData) => {
      try {
        const msg = JSON.parse(rawData);

        // Reassemble chunked messages before processing
        if (msg.type === "wb:chunk") {
          const { id, i, n, d } = msg;
          if (!pendingChunksRef.current[id]) {
            pendingChunksRef.current[id] = { parts: new Array(n).fill(null), got: 0, n };
          }
          const entry = pendingChunksRef.current[id];
          if (entry.parts[i] === null) {
            entry.parts[i] = d;
            entry.got++;
          }
          if (entry.got === entry.n) {
            const full = entry.parts.join("");
            delete pendingChunksRef.current[id];
            processMsg(JSON.parse(full));
          }
          return;
        }

        processMsg(msg);
      } catch (err) {
        console.error("[Whiteboard] message error:", err);
      }
    });

    // Broadcast local changes — resolve blob URLs (uploaded images) before sending
    const unlisten = editor.store.listen(
      ({ changes, source }) => {
        if (source !== "user") return;
        resolveAssetBlobs(changes).then((resolved) => {
          sendChunked(sendData, JSON.stringify({ type: "wb", changes: resolved }));
        });
      },
      { source: "user", scope: "document" },
    );

    return () => { unsub(); unlisten(); };
  }, [editor, sendData, onWbMessage, isHost]);

  // When data channel first opens (or whiteboard mounts while channel is already open),
  // push full state to the guest or request it from the host
  useEffect(() => {
    if (!editor || !isDataChannelOpen) return;

    if (isHost) {
      const id = setTimeout(() => {
        resolveSnapshotBlobs(editor.store.getStoreSnapshot("document")).then((snapshot) => {
          sendChunked(sendData, JSON.stringify({ type: "wb:full", snapshot }));
          sendData(JSON.stringify({ type: "wb:perms", perms: guestPermsRef.current }));
        });
      }, 150);
      return () => clearTimeout(id);
    } else {
      syncedRef.current = false;
      pendingRef.current = [];
      pendingChunksRef.current = {};
      sendData(JSON.stringify({ type: "wb:req_sync" }));
    }
  }, [editor, isHost, isDataChannelOpen, sendData]);

  return null;
}

const TLDRAW_LICENSE_KEY = import.meta.env.VITE_TLDRAW_LICENSE_KEY;

// ── Public component ─────────────────────────────────────────────────────────
export default function WhiteboardPanel({
  sendData,
  onWbMessage,
  isHost,
  isDataChannelOpen,
  captureCanvas,
}) {
  const [guestPerms, setGuestPerms] = useState(PERMS_VIEW);

  const handleToggleDraw = useCallback(() => {
    const newPerms = guestPerms.canDraw ? PERMS_VIEW : PERMS_DRAW;
    setGuestPerms(newPerms);
    sendData(JSON.stringify({ type: "wb:perms", perms: newPerms }));
  }, [guestPerms, sendData]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Tldraw licenseKey={TLDRAW_LICENSE_KEY}>
        {captureCanvas && <WhiteboardCapture captureCanvas={captureCanvas} />}
        <WhiteboardSync
          sendData={sendData}
          onWbMessage={onWbMessage}
          isHost={isHost}
          isDataChannelOpen={isDataChannelOpen}
          guestPerms={guestPerms}
        />
      </Tldraw>

      {isHost && (
        <div
          style={{
            position: "absolute",
            bottom: 72,
            right: 12,
            zIndex: 500,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 6,
            pointerEvents: "auto",
          }}
        >
          {guestPerms.canDraw && (
            <div
              style={{
                background: "rgba(139,92,246,0.15)",
                border: "1px solid rgba(139,92,246,0.4)",
                color: "#a78bfa",
                borderRadius: 8,
                padding: "3px 10px",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              Student can draw
            </div>
          )}
          <button
            onClick={handleToggleDraw}
            style={{
              background: guestPerms.canDraw ? "#ef4444" : "#7c3aed",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 2px 12px rgba(0,0,0,0.35)",
              whiteSpace: "nowrap",
            }}
          >
            {guestPerms.canDraw ? "🔒 Revoke Drawing" : "✏️ Invite to Board"}
          </button>
        </div>
      )}
    </div>
  );
}
