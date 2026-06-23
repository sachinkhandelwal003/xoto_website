import { useState, useRef, useEffect, useCallback } from "react";
import { FiMic, FiMicOff } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import GlobeAnimation from "./GlobeAnimation";

const SOCKET_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://xoto.ae";

const INACTIVITY_MS = 5 * 60 * 1000; // 5 minutes

// Float32 PCM samples → PCM16 base64
function float32ToPcm16Base64(float32Array) {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view   = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  const bytes  = new Uint8Array(buffer);
  let binary   = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

// Queued PCM16 player
function createPcmPlayer(sampleRate = 24000) {
  const ctx      = new AudioContext({ sampleRate });
  let nextTime   = 0;
  const queue    = [];
  let playing    = false;

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
    const binary  = atob(base64Chunk);
    const bytes   = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const pcm16   = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i++) float32[i] = pcm16[i] / 0x8000;
    const buf = ctx.createBuffer(1, float32.length, sampleRate);
    buf.copyToChannel(float32, 0);
    queue.push(buf);
    if (!playing) scheduleNext();
  }

  function clear() {
    queue.length = 0;
    playing = false;
    nextTime = 0;
  }

  function stop() {
    queue.length = 0;
    playing = false;
    nextTime = 0;
    try { ctx.close(); } catch { /* ignore */ }
  }

  return { push, stop, clear };
}

export default function XobiaSmartVoice({ onClose }) {
  const [phase,        setPhase]        = useState("idle");      // idle | connecting | ready | user_speaking | xobia_speaking | fetching | error
  const [aiTranscript, setAiTranscript] = useState("");
  const [userTranscript, setUserTranscript] = useState("");
  const [navLink,      setNavLink]      = useState(null);
  const [leadToast,    setLeadToast]    = useState(null);       // { type, message }

  const socketRef    = useRef(null);
  const audioCtxRef  = useRef(null);
  const processorRef = useRef(null);
  const analyserRef  = useRef(null);
  const streamRef    = useRef(null);
  const playerRef    = useRef(null);
  const sessionAlive = useRef(false);
  const inactiveTimer = useRef(null);
  const vadFrameRef  = useRef(null);
  const userSpeakRef = useRef(false);

  const active    = phase !== "idle" && phase !== "connecting" && phase !== "error";
  const isSpeaking = phase === "xobia_speaking";

  function resetInactivityTimer() {
    if (inactiveTimer.current) clearTimeout(inactiveTimer.current);
    inactiveTimer.current = setTimeout(() => {
      if (sessionAlive.current) stopCall();
    }, INACTIVITY_MS);
  }

  // Continuously check mic audio level to detect user speaking
  function startVAD(analyser) {
    const data = new Uint8Array(analyser.frequencyBinCount);
    const THRESHOLD = 20; // 0–255 scale
    let speakingFrames = 0;

    function frame() {
      if (!sessionAlive.current) return;
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;

      if (avg > THRESHOLD) {
        speakingFrames++;
        if (speakingFrames > 3 && !userSpeakRef.current) {
          userSpeakRef.current = true;
          setPhase("user_speaking");
          resetInactivityTimer();
        }
      } else {
        speakingFrames = 0;
        if (userSpeakRef.current) {
          userSpeakRef.current = false;
          setPhase(p => p === "user_speaking" ? "ready" : p);
        }
      }
      vadFrameRef.current = requestAnimationFrame(frame);
    }
    vadFrameRef.current = requestAnimationFrame(frame);
  }

  const startCall = useCallback(async () => {
    try {
      setPhase("connecting");
      setNavLink(null);
      setLeadToast(null);

      const socket = io(`${SOCKET_URL}/xobia-voice`, {
        transports: ["websocket"],
        reconnection: false
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("[Xobia] socket connected");
        socket.emit("start_session");
      });

      socket.on("session_ready", async () => {
        sessionAlive.current = true;
        playerRef.current = createPcmPlayer(24000);

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 24000, channelCount: 1 } });
          streamRef.current = stream;

          const ctx = new AudioContext({ sampleRate: 24000 });
          audioCtxRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);

          // Analyser for VAD display
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 512;
          analyserRef.current = analyser;
          source.connect(analyser);
          startVAD(analyser);

          // ScriptProcessor for PCM streaming
          const processor = ctx.createScriptProcessor(4096, 1, 1);
          processorRef.current = processor;
          processor.onaudioprocess = (e) => {
            if (!sessionAlive.current) return;
            const pcm = float32ToPcm16Base64(e.inputBuffer.getChannelData(0));
            socket.emit("audio_chunk", pcm);
          };

          analyser.connect(processor);
          processor.connect(ctx.destination);
        } catch (micErr) {
          console.error("[Xobia] mic error:", micErr);
          setPhase("error");
          return;
        }

        setPhase("ready");
        resetInactivityTimer();
      });

      socket.on("status", (s) => {
        const map = {
          listening: "ready",
          speaking:  "xobia_speaking",
          fetching:  "fetching",
          thinking:  "fetching"
        };
        if (map[s]) setPhase(map[s]);
        if (s === "listening") {
          resetInactivityTimer();
          setUserTranscript("");
        }
      });

      socket.on("audio_chunk", (base64) => {
        setPhase("xobia_speaking");
        playerRef.current?.push(base64);
        resetInactivityTimer();
      });

      socket.on("audio_done", () => {
        setPhase("ready");
        setAiTranscript("");
      });

      socket.on("transcript", (delta) => {
        setAiTranscript(prev => (prev + delta).slice(-200));
      });

      socket.on("user_transcript", (text) => {
        if (text) setUserTranscript(text.slice(-120));
      });

      socket.on("nav_link", (link) => {
        setNavLink(link);
      });

      socket.on("lead_saved", ({ type, message }) => {
        const label = type === "vault" ? "Mortgage lead saved!" : "Property enquiry saved!";
        setLeadToast({ type, message: label });
        setTimeout(() => setLeadToast(null), 5000);
        resetInactivityTimer();
      });

      socket.on("session_ended", () => stopCall());
      socket.on("disconnect",    () => stopCall());

      socket.on("error", (msg) => {
        console.error("[Xobia] error:", msg);
        setPhase("error");
      });

    } catch (err) {
      console.error("[Xobia] start error:", err);
      setPhase("error");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopCall = useCallback(() => {
    sessionAlive.current = false;
    userSpeakRef.current = false;

    if (inactiveTimer.current) clearTimeout(inactiveTimer.current);
    if (vadFrameRef.current)   cancelAnimationFrame(vadFrameRef.current);

    processorRef.current?.disconnect();
    processorRef.current = null;
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    try { audioCtxRef.current?.close(); } catch { /* ignore */ }
    audioCtxRef.current = null;

    playerRef.current?.stop();
    playerRef.current = null;

    socketRef.current?.emit("end_session");
    socketRef.current?.disconnect();
    socketRef.current = null;

    setPhase("idle");
    setNavLink(null);
    setAiTranscript("");
    setUserTranscript("");
  }, []);

  const toggleCall = () => (active ? stopCall() : startCall());
  const handleClose = () => { stopCall(); onClose(); };

  useEffect(() => () => stopCall(), [stopCall]);

  const STATUS_LABEL = {
    idle:           "Tap to Start",
    connecting:     "Connecting...",
    ready:          "Listening...",
    user_speaking:  "You are speaking...",
    xobia_speaking: "XOBIA Speaking...",
    fetching:       "Fetching data...",
    error:          "Error — tap to retry"
  };

  const STATUS_COLOR = {
    idle:           "text-gray-400",
    connecting:     "text-gray-400 animate-pulse",
    ready:          "text-purple-500 animate-pulse",
    user_speaking:  "text-green-500 animate-pulse",
    xobia_speaking: "text-purple-700 animate-pulse",
    fetching:       "text-yellow-500 animate-pulse",
    error:          "text-red-400"
  };

  const isDisabled = phase === "connecting" || phase === "fetching";

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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="bg-gray-100 px-4 py-1.5 rounded-full">
          <span className="text-sm font-bold text-gray-700 tracking-wide">Xobia Voice</span>
        </div>
        <div className="w-9" />
      </div>

      {/* Globe + indicators */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4">
        <div style={{ transform: "scale(0.82)", filter: "drop-shadow(0 0 24px rgba(147,51,234,0.18))" }}>
          <GlobeAnimation isSpeaking={isSpeaking} />
        </div>

        {/* Status */}
        <p className={`text-sm font-medium tracking-wide transition-colors ${STATUS_COLOR[phase] || "text-gray-400"}`}>
          {STATUS_LABEL[phase] || phase}
        </p>

        {/* User transcript */}
        <AnimatePresence>
          {userTranscript && phase !== "xobia_speaking" && (
            <motion.p key="ut" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-xs text-green-600 text-center max-w-[260px] line-clamp-2 leading-relaxed italic">
              "{userTranscript}"
            </motion.p>
          )}
        </AnimatePresence>

        {/* AI transcript */}
        <AnimatePresence>
          {aiTranscript && phase === "xobia_speaking" && (
            <motion.p key="at" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-xs text-gray-500 text-center max-w-[260px] line-clamp-2 leading-relaxed">
              {aiTranscript}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Navigation chip */}
        <AnimatePresence>
          {navLink && (
            <motion.a key="nav" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              href={navLink.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full text-xs text-purple-700 font-semibold hover:bg-purple-100 transition-colors">
              <span>View: {navLink.title}</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </motion.a>
          )}
        </AnimatePresence>

        {/* Lead saved toast */}
        <AnimatePresence>
          {leadToast && (
            <motion.div key="toast" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 font-medium">
              <span>✓</span>
              <span>{leadToast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mic button */}
      <div className="flex justify-center pb-8 shrink-0">
        <button onClick={toggleCall} disabled={isDisabled} aria-label={active ? "Stop" : "Start"}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
            ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            ${phase === "user_speaking"
              ? "bg-green-500 shadow-lg shadow-green-200 scale-110"
              : active
                ? "bg-red-500 shadow-lg shadow-red-200 scale-105"
                : "bg-gradient-to-b from-purple-500 to-purple-700 shadow-lg shadow-purple-200 hover:scale-105"
            }`}>
          {active ? <FiMicOff className="w-6 h-6 text-white" /> : <FiMic className="w-6 h-6 text-white" />}
        </button>
      </div>
    </motion.div>
  );
}
