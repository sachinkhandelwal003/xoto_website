import { useEffect, useRef, useState, useCallback } from "react";
import GlobeAnimation from "./GlobeAnimation";
import { motion, AnimatePresence } from "framer-motion";
import { getChatSessionId } from "../../utils/createSessionID";
import { getAnswer } from "../../answers";

const API = "https://xoto.ae";

const GREET = {
  en: "Hello! I am Xobia, your AI mortgage and property assistant from Xoto. You can ask me about UAE home loans, property prices, eligibility, down payments, and more. How can I help you today?",
  hi: "नमस्ते! मैं ज़ोबिया हूँ — Xoto की AI मॉर्गेज और प्रॉपर्टी सहायक। आप मुझसे यूएई होम लोन, प्रॉपर्टी की कीमत, पात्रता, डाउन पेमेंट — कुछ भी पूछ सकते हैं। बताइए, मैं कैसे मदद करूँ?",
};

const LANG_SPEECH = { en: "en-US", hi: "hi-IN" };

function OpenAIVoiceInterface({ onClose }) {
  const [status, setStatus] = useState("Speaking...");
  const [active, setActive] = useState(false);
  const [lang, setLang] = useState("en");

  const audioRef = useRef(null);
  const recognitionRef = useRef(null);
  const resultReceivedRef = useRef(false);
  const greetedRef = useRef(false);

  const isSpeaking = status === "Speaking...";
  const isDisabled = status === "Thinking..." || status === "Speaking...";

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis?.cancel();
  };

  const browserSpeak = useCallback((text, speechLang, onEnd) => {
    if (!window.speechSynthesis) { onEnd?.(); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = LANG_SPEECH[speechLang] || "en-US";
    utter.rate = 1;
    utter.onend = () => { setStatus("Tap to Speak"); setActive(false); onEnd?.(); };
    utter.onerror = () => { setStatus("Tap to Speak"); setActive(false); onEnd?.(); };
    window.speechSynthesis.speak(utter);
  }, []);

  const speakText = useCallback(async (text, speechLang = "en") => {
    setStatus("Speaking...");
    try {
      const res = await fetch("/api/openai-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      if (blob.size < 100) throw new Error("Empty audio");
      const url = URL.createObjectURL(blob);
      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.src = url;
      audioRef.current.onended = () => {
        setStatus("Tap to Speak");
        setActive(false);
        URL.revokeObjectURL(url);
      };
      audioRef.current.onerror = () => {
        URL.revokeObjectURL(url);
        browserSpeak(text, speechLang);
      };
      await audioRef.current.play();
    } catch {
      browserSpeak(text, speechLang);
    }
  }, [browserSpeak]);

  // Auto-speak greeting on open
  useEffect(() => {
    if (greetedRef.current) return;
    greetedRef.current = true;
    const greeting = GREET[lang] || GREET.en;
    speakText(greeting, lang);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const askBot = async (userText) => {
    setStatus("Thinking...");
    try {
      const formData = new FormData();
      formData.append("message", userText);
      formData.append("session_id", getChatSessionId());
      const res = await fetch(`${API}/api/ai/chat`, { method: "POST", body: formData });
      const data = await res.json();
      const botText = (data.ai?.text || data.text || "").trim();
      const finalText = botText || getAnswer(userText, lang);
      await speakText(finalText, lang);
    } catch {
      await speakText(getAnswer(userText, lang), lang);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setActive(false);
      return;
    }
    stopAudio();
    resultReceivedRef.current = false;
    const rec = new SpeechRecognition();
    rec.lang = LANG_SPEECH[lang] || "en-US";
    rec.interimResults = false;
    recognitionRef.current = rec;

    rec.onstart = () => setStatus("Listening...");

    rec.onresult = (e) => {
      resultReceivedRef.current = true;
      askBot(e.results[0][0].transcript);
    };

    rec.onerror = () => {
      setStatus("Tap to Speak");
      setActive(false);
    };

    rec.onend = () => {
      if (!resultReceivedRef.current) {
        setStatus("Tap to Speak");
        setActive(false);
      }
    };

    try { rec.start(); } catch {
      setStatus("Tap to Speak");
      setActive(false);
    }
  };

  const toggleListening = () => {
    if (active || isDisabled) {
      recognitionRef.current?.abort();
      stopAudio();
      setStatus("Tap to Speak");
      setActive(false);
    } else {
      setActive(true);
      startListening();
    }
  };

  const switchLang = (newLang) => {
    if (newLang === lang) return;
    stopAudio();
    recognitionRef.current?.abort();
    setLang(newLang);
    setActive(false);
    setStatus("Speaking...");
    speakText(GREET[newLang] || GREET.en, newLang);
  };

  const handleClose = () => {
    recognitionRef.current?.abort();
    stopAudio();
    onClose();
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      stopAudio();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={styles.container}
      className="absolute inset-0 z-[50]"
    >
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.glassButton} onClick={handleClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div style={styles.headerTitleContainer}>
          <span style={styles.headerTitle}>Xobia Voice</span>
        </div>
        {/* Language toggle */}
        <div style={styles.langToggle}>
          <button
            onClick={() => switchLang("en")}
            style={{ ...styles.langBtn, ...(lang === "en" ? styles.langBtnActive : {}) }}
          >EN</button>
          <button
            onClick={() => switchLang("hi")}
            style={{ ...styles.langBtn, ...(lang === "hi" ? styles.langBtnActive : {}) }}
          >HI</button>
        </div>
      </div>

      {/* Globe + status */}
      <div style={styles.mainContent}>
        <div style={styles.globeWrapper}>
          <GlobeAnimation isSpeaking={isSpeaking} />
        </div>

      </div>

      {/* Mic button + status icons */}
      <div style={styles.footer}>
        <button
          onClick={toggleListening}
          style={{
            ...styles.micButton,
            ...(active && !isDisabled ? styles.micActiveScale : {}),
            ...(isDisabled ? { background: "linear-gradient(180deg, #c084fc 0%, #a855f7 100%)" } : {}),
          }}
          aria-label={active ? "Stop" : "Tap to speak"}
        >
          {status === "Thinking..." ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" strokeDasharray="31.4" strokeDashoffset="10"
                style={{ animation: "spin 1s linear infinite", transformOrigin: "center" }} />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          )}
        </button>

        {/* Status indicator icons — only shown when speaking or listening */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div key="speaking" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={styles.statusRow}>
              {/* Sound wave bars */}
              {[0, 0.15, 0.3, 0.15, 0].map((delay, i) => (
                <span key={i} style={{ ...styles.bar, animationDelay: `${delay}s` }} />
              ))}
            </motion.div>
          )}
          {status === "Listening..." && (
            <motion.div key="listening" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={styles.statusRow}>
              {/* Pulse dots */}
              {[0, 0.2, 0.4].map((delay, i) => (
                <span key={i} style={{ ...styles.dot, animationDelay: `${delay}s` }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes barPulse { from { height: 6px; opacity: 0.6; } to { height: 22px; opacity: 1; } }
        @keyframes dotBounce { from { transform: translateY(0); opacity: 0.5; } to { transform: translateY(-6px); opacity: 1; } }
      `}</style>
    </motion.div>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
    color: "#333",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: "16px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    zIndex: 10,
  },
  headerTitleContainer: {
    background: "rgba(0,0,0,0.05)",
    padding: "6px 16px",
    borderRadius: "30px",
    border: "1px solid rgba(0,0,0,0.05)",
  },
  headerTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#333",
    letterSpacing: "0.5px",
  },
  glassButton: {
    background: "transparent",
    border: "1px solid rgba(0,0,0,0.1)",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  langToggle: {
    display: "flex",
    gap: "4px",
    background: "rgba(0,0,0,0.05)",
    borderRadius: "20px",
    padding: "3px",
  },
  langBtn: {
    fontSize: "11px",
    fontWeight: "700",
    padding: "4px 10px",
    borderRadius: "16px",
    border: "none",
    background: "transparent",
    color: "#888",
    cursor: "pointer",
    letterSpacing: "0.5px",
    transition: "all 0.2s",
  },
  langBtnActive: {
    background: "#7c3aed",
    color: "#fff",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "8px",
    gap: "4px",
  },
  globeWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transform: "scale(0.82)",
    filter: "drop-shadow(0 0 30px rgba(147,51,234,0.2))",
    marginBottom: "-16px",
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "28px",
    gap: "14px",
    zIndex: 10,
  },
  statusRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "5px",
    height: "24px",
  },
  micButton: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(180deg, #a855f7 0%, #7e22ce 100%)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 25px rgba(126,34,206,0.3)",
    transition: "all 0.3s cubic-bezier(0.175,0.885,0.32,1.275)",
  },
  micActiveScale: {
    transform: "scale(1.12)",
    boxShadow: "0 0 50px rgba(126,34,206,0.55)",
    border: "3px solid #f3e8ff",
  },
  bar: {
    display: "inline-block",
    width: "5px",
    borderRadius: "3px",
    background: "linear-gradient(to top, #a855f7, #7c3aed)",
    animation: "barPulse 0.7s ease-in-out infinite alternate",
    height: "18px",
  },
  dot: {
    display: "inline-block",
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    background: "#a855f7",
    animation: "dotBounce 0.6s ease-in-out infinite alternate",
  },
};

export default OpenAIVoiceInterface;
