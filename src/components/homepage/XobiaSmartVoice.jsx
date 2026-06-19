import { useState, useRef, useEffect, useCallback } from "react";
import { FiMic, FiMicOff } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import GlobeAnimation from "./GlobeAnimation";

// Auto-detects local dev vs production
const SOCKET_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://xoto.ae";

// Convert Float32 PCM samples → PCM16 base64 (what OpenAI expects)
function float32ToPcm16Base64(float32Array) {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view   = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  // ArrayBuffer → base64
  const bytes  = new Uint8Array(buffer);
  let binary   = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

// Play PCM16 base64 audio chunk in the browser
function createPcmPlayer(sampleRate = 24000) {
  const ctx        = new AudioContext({ sampleRate });
  let   nextTime   = 0;
  const queue      = [];
  let   playing    = false;

  function scheduleNext() {
    if (queue.length === 0) { playing = false; return; }
    playing = true;
    const buf    = queue.shift();
    const source = ctx.createBufferSource();
    source.buffer = buf;
    source.connect(ctx.destination);
    const startAt = Math.max(ctx.currentTime, nextTime);
    source.start(startAt);
    nextTime = startAt + buf.duration;
    source.onended = scheduleNext;
  }

  function push(base64Chunk) {
    // Decode base64 → PCM16 → Float32
    const binary  = atob(base64Chunk);
    const bytes   = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const pcm16   = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i++) float32[i] = pcm16[i] / 0x8000;

    const buf    = ctx.createBuffer(1, float32.length, sampleRate);
    buf.copyToChannel(float32, 0);
    queue.push(buf);
    if (!playing) scheduleNext();
  }

  function stop() {
    queue.length = 0;
    playing      = false;
    nextTime     = 0;
    try { ctx.close(); } catch { /* ignore */ }
  }

  return { push, stop };
}

export default function XobiaSmartVoice({ onClose }) {
  const [status,     setStatus]     = useState("Tap to Start");
  const [active,     setActive]     = useState(false);
  const [navLink,    setNavLink]    = useState(null);
  const [transcript, setTranscript] = useState("");

  const socketRef     = useRef(null);
  const audioCtxRef   = useRef(null);
  const processorRef  = useRef(null);
  const streamRef     = useRef(null);
  const playerRef     = useRef(null);
  const sessionAlive  = useRef(false); // true when OpenAI session is ready

  const isSpeaking = status === "XOBIA Speaking...";

  // ── Start session ──────────────────────────────────────────────────────────
  const startCall = useCallback(async () => {
    try {
      setStatus("Connecting...");

      // 1. Connect Socket.io to /xobia-voice namespace
      const socket = io(`${SOCKET_URL}/xobia-voice`, { transports: ["websocket"] });
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("[Xobia] socket connected, starting session");
        socket.emit("start_session");
      });

      socket.on("session_ready", async () => {
        setStatus("Listening...");
        setActive(true);
        sessionAlive.current = true;

        // 2. Create audio player for PCM16 output
        playerRef.current = createPcmPlayer(24000);

        // 3. Capture mic at 24kHz mono
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const ctx = new AudioContext({ sampleRate: 24000 });
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);

        const processor = ctx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
          if (!sessionAlive.current) return;
          const pcmBase64 = float32ToPcm16Base64(e.inputBuffer.getChannelData(0));
          socket.emit("audio_chunk", pcmBase64);
        };

        source.connect(processor);
        processor.connect(ctx.destination);
      });

      socket.on("status", (s) => {
        const map = {
          listening: "Listening...",
          speaking:  "XOBIA Speaking...",
          fetching:  "Fetching data...",
          thinking:  "Thinking..."
        };
        setStatus(map[s] || s);
      });

      socket.on("audio_chunk", (base64) => {
        setStatus("XOBIA Speaking...");
        playerRef.current?.push(base64);
      });

      socket.on("audio_done", () => {
        setStatus("Listening...");
        setTranscript("");
      });

      socket.on("transcript", (delta) => {
        setTranscript(prev => (prev + delta).slice(-150));
      });

      socket.on("nav_link", (link) => {
        setNavLink(link);
      });

      socket.on("session_ended", () => {
        setStatus("Tap to Start");
        setActive(false);
      });

      socket.on("error", (msg) => {
        console.error("[Xobia] error:", msg);
        setStatus("Error — tap to retry");
      });

      socket.on("disconnect", () => {
        setActive(false);
        setStatus("Tap to Start");
      });

    } catch (err) {
      console.error("[Xobia] start error:", err);
      setStatus("Error — tap to retry");
      stopCall();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Stop session ───────────────────────────────────────────────────────────
  const stopCall = useCallback(() => {
    sessionAlive.current = false;
    // Stop mic
    processorRef.current?.disconnect();
    processorRef.current = null;
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    try { audioCtxRef.current?.close(); } catch { /* ignore */ }
    audioCtxRef.current = null;

    // Stop audio player
    playerRef.current?.stop();
    playerRef.current = null;

    // Close socket
    socketRef.current?.emit("end_session");
    socketRef.current?.disconnect();
    socketRef.current = null;

    setActive(false);
    setStatus("Tap to Start");
    setNavLink(null);
    setTranscript("");
  }, []);

  const toggleCall = () => (active ? stopCall() : startCall());
  const handleClose = () => { stopCall(); onClose(); };

  useEffect(() => () => stopCall(), [stopCall]);

  const isDisabled = status === "Connecting..." || status === "Fetching data...";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col bg-white rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <button onClick={handleClose} aria-label="Back"
          className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#444" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="bg-gray-100 px-4 py-1.5 rounded-full">
          <span className="text-sm font-bold text-gray-700 tracking-wide">Xobia Voice</span>
        </div>
        <div className="w-9" />
      </div>

      {/* Globe */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4">
        <div style={{ transform: "scale(0.82)", filter: "drop-shadow(0 0 24px rgba(147,51,234,0.18))" }}>
          <GlobeAnimation isSpeaking={isSpeaking} />
        </div>

        <p className={`text-sm font-medium tracking-wide transition-colors ${
          active ? "text-purple-600 animate-pulse" : "text-gray-400"
        }`}>
          {status}
        </p>

        <AnimatePresence>
          {transcript && (
            <motion.p key="t" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-xs text-gray-400 text-center max-w-[260px] line-clamp-2 leading-relaxed">
              {transcript}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {navLink && (
            <motion.a key="nav" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              href={navLink.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full text-xs text-purple-700 font-semibold hover:bg-purple-100 transition-colors">
              <span>View: {navLink.title}</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </motion.a>
          )}
        </AnimatePresence>
      </div>

      {/* Mic button */}
      <div className="flex justify-center pb-8 shrink-0">
        <button onClick={toggleCall} disabled={isDisabled} aria-label={active ? "Stop" : "Start"}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
            ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            ${active
              ? "bg-red-500 shadow-lg shadow-red-200 scale-105"
              : "bg-gradient-to-b from-purple-500 to-purple-700 shadow-lg shadow-purple-200 hover:scale-105"}`}>
          {active ? <FiMicOff className="w-6 h-6 text-white" /> : <FiMic className="w-6 h-6 text-white" />}
        </button>
      </div>
    </motion.div>
  );
}
