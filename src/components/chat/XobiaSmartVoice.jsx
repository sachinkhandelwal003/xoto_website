import { useState, useRef, useEffect, useCallback } from "react";
import { FiMic, FiMicOff } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import GlobeAnimation from "./GlobeAnimation";

const BACKEND = "http://localhost:5000/api/ai/v2";

// ─── Tool executor — calls our backend REST APIs ───────────────────────────
async function executeTool(name, args) {
  try {
    if (name === "searchWebsite") {
      const res  = await fetch(`${BACKEND}/search?q=${encodeURIComponent(args.query)}`);
      const data = await res.json();
      return { results: data, topLink: data[0] ? { url: data[0].url, title: data[0].title } : null };
    }

    if (name === "searchProperties") {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(args).filter(([, v]) => v !== undefined && v !== null))
      ).toString();
      const res  = await fetch(`${BACKEND}/properties?${params}`);
      const data = await res.json();
      return data;
    }

    if (name === "saveLead") {
      const res  = await fetch(`${BACKEND}/lead`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(args)
      });
      const data = await res.json();
      return { success: true, ...data };
    }

    return { error: "Unknown tool" };
  } catch (err) {
    return { error: err.message };
  }
}

// ─── Status label helper ───────────────────────────────────────────────────
const STATUS = {
  IDLE:       "Tap to Start",
  CONNECTING: "Connecting...",
  LISTENING:  "Listening...",
  SPEAKING:   "XOBIA Speaking...",
  THINKING:   "Thinking...",
  FETCHING:   "Fetching data...",
  ERROR:      "Error — tap to retry"
};

export default function XobiaSmartVoice({ onClose }) {
  const [status,    setStatus]    = useState(STATUS.IDLE);
  const [active,    setActive]    = useState(false);
  const [navLink,   setNavLink]   = useState(null);   // { url, title }
  const [transcript, setTranscript] = useState("");

  const pcRef      = useRef(null);
  const dcRef      = useRef(null);
  const audioRef   = useRef(null);
  const streamRef  = useRef(null);

  // Keep a stable ref to the latest handler to avoid stale closures
  const handlerRef = useRef(null);

  const isSpeaking = status === STATUS.SPEAKING;

  // ── Data-channel message handler ────────────────────────────────────────
  handlerRef.current = async (event) => {
    let msg;
    try { msg = JSON.parse(event.data); } catch { return; }

    switch (msg.type) {
      case "session.created":
      case "session.updated":
        setStatus(STATUS.LISTENING);
        break;

      case "input_audio_buffer.speech_started":
        setStatus(STATUS.LISTENING);
        setNavLink(null);
        break;

      case "response.created":
        setStatus(STATUS.THINKING);
        break;

      case "response.audio.delta":
        setStatus(STATUS.SPEAKING);
        break;

      case "response.audio.done":
        setStatus(STATUS.LISTENING);
        setTranscript("");
        break;

      case "response.audio_transcript.delta":
        if (msg.delta) setTranscript(prev => (prev + msg.delta).slice(-120));
        break;

      // Tool call completed — execute and return result
      case "response.output_item.done": {
        const item = msg.item;
        if (item?.type !== "function_call") break;

        const { name, arguments: argsStr, call_id } = item;
        setStatus(STATUS.FETCHING);

        let args = {};
        try { args = JSON.parse(argsStr || "{}"); } catch { /* ignore */ }

        const result = await executeTool(name, args);

        // Surface navigation link if searchWebsite returned one
        if (name === "searchWebsite" && result?.topLink) {
          setNavLink(result.topLink);
        }

        // Send result back to OpenAI
        dcRef.current?.send(JSON.stringify({
          type: "conversation.item.create",
          item: {
            type:     "function_call_output",
            call_id,
            output:   JSON.stringify(result)
          }
        }));

        // Ask OpenAI to continue generating a response
        dcRef.current?.send(JSON.stringify({ type: "response.create" }));
        setStatus(STATUS.SPEAKING);
        break;
      }

      case "response.done":
        setStatus(STATUS.LISTENING);
        setTranscript("");
        break;

      case "error":
        console.error("OpenAI Realtime error:", msg.error);
        setStatus(STATUS.ERROR);
        break;

      default:
        break;
    }
  };

  // ── Start WebRTC call ────────────────────────────────────────────────────
  const startCall = useCallback(async () => {
    try {
      setStatus(STATUS.CONNECTING);

      // 1. Get ephemeral token from our backend
      const tokenRes = await fetch(`${BACKEND}/session`, { method: "POST" });
      if (!tokenRes.ok) throw new Error("Session token failed");
      const { client_secret } = await tokenRes.json();

      // 2. Prepare audio element
      if (!audioRef.current) {
        audioRef.current = document.createElement("audio");
        audioRef.current.autoplay = true;
        document.body.appendChild(audioRef.current);
      }

      // 3. Create peer connection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      pc.ontrack = (e) => {
        if (audioRef.current) audioRef.current.srcObject = e.streams[0];
      };

      // 4. Grab microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      // 5. Data channel for events / tool calls
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;
      dc.onmessage = (e) => handlerRef.current?.(e);

      // 6. SDP offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 7. Hand SDP to OpenAI Realtime
      const sdpRes = await fetch(
        "https://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview",
        {
          method:  "POST",
          headers: {
            Authorization: `Bearer ${client_secret.value}`,
            "Content-Type": "application/sdp"
          },
          body: offer.sdp
        }
      );
      if (!sdpRes.ok) throw new Error("OpenAI SDP handshake failed");

      const answer = { type: "answer", sdp: await sdpRes.text() };
      await pc.setRemoteDescription(answer);

      setActive(true);
      setStatus(STATUS.LISTENING);
    } catch (err) {
      console.error("Start call error:", err);
      setStatus(STATUS.ERROR);
      stopCall();
    }
  }, []);

  // ── Stop / cleanup ───────────────────────────────────────────────────────
  const stopCall = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    dcRef.current?.close();
    pcRef.current?.close();
    streamRef.current = null;
    dcRef.current     = null;
    pcRef.current     = null;

    if (audioRef.current) audioRef.current.srcObject = null;

    setActive(false);
    setStatus(STATUS.IDLE);
    setNavLink(null);
    setTranscript("");
  }, []);

  const toggleCall = () => (active ? stopCall() : startCall());

  const handleClose = () => {
    stopCall();
    onClose();
  };

  useEffect(() => () => stopCall(), [stopCall]);

  const isDisabled = status === STATUS.CONNECTING || status === STATUS.FETCHING;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col bg-white rounded-2xl overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <button
          onClick={handleClose}
          className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
          aria-label="Back"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#444" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="bg-gray-100 px-4 py-1.5 rounded-full">
          <span className="text-sm font-bold text-gray-700 tracking-wide">Xobia Voice</span>
        </div>

        {/* spacer */}
        <div className="w-9" />
      </div>

      {/* ── Globe ── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4">
        <div style={{
          transform: "scale(0.82)",
          filter: "drop-shadow(0 0 24px rgba(147,51,234,0.18))"
        }}>
          <GlobeAnimation isSpeaking={isSpeaking} />
        </div>

        {/* Status */}
        <p className={`text-sm font-medium tracking-wide transition-colors ${
          active ? "text-purple-600 animate-pulse" : "text-gray-400"
        }`}>
          {status}
        </p>

        {/* Live transcript */}
        <AnimatePresence>
          {transcript && (
            <motion.p
              key="transcript"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-gray-400 text-center max-w-[260px] line-clamp-2"
            >
              {transcript}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Navigation link chip */}
        <AnimatePresence>
          {navLink && (
            <motion.a
              key="navlink"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              href={navLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full text-xs text-purple-700 font-semibold hover:bg-purple-100 transition-colors"
            >
              <span>View: {navLink.title}</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </motion.a>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mic button ── */}
      <div className="flex justify-center pb-8 shrink-0">
        <button
          onClick={toggleCall}
          disabled={isDisabled}
          aria-label={active ? "Stop voice chat" : "Start voice chat"}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
            ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            ${active
              ? "bg-red-500 shadow-lg shadow-red-200 scale-105"
              : "bg-gradient-to-b from-purple-500 to-purple-700 shadow-lg shadow-purple-200 hover:scale-105"
            }`}
        >
          {active
            ? <FiMicOff className="w-6 h-6 text-white" />
            : <FiMic    className="w-6 h-6 text-white" />
          }
        </button>
      </div>
    </motion.div>
  );
}
