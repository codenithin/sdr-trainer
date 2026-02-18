"use client";

import { useState, useEffect, useRef, useCallback, CSSProperties } from "react";
import { useParams, useRouter } from "next/navigation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface Session {
  id: number;
  script_id: number;
  persona_id: number;
  started_at: string;
  ended_at: string | null;
  is_active: boolean;
  feedback_summary: string | null;
  script_title: string | null;
  persona_name: string | null;
  persona_emoji: string | null;
  messages: Message[];
}

interface ScriptSection {
  id: number;
  section_type: string;
  content: string;
}

interface Script {
  id: number;
  title: string;
  sections?: ScriptSection[];
}

// ---------------------------------------------------------------------------
// Voice Input Hook (auto-send on silence)
// ---------------------------------------------------------------------------

interface UseVoiceInputOptions {
  onFinalTranscript: (text: string) => void;
}

interface UseVoiceInputReturn {
  listening: boolean;
  transcript: string;
  supported: boolean;
  startListening: () => void;
  stopListening: () => void;
  setTranscript: (t: string) => void;
}

function useVoiceInput({ onFinalTranscript }: UseVoiceInputOptions): UseVoiceInputReturn {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalTextRef = useRef("");
  const onFinalRef = useRef(onFinalTranscript);
  onFinalRef.current = onFinalTranscript;

  useEffect(() => {
    if (typeof window === "undefined") return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    setSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let final = "";
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      const combined = final + interim;
      setTranscript(combined);
      finalTextRef.current = combined;

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (combined.trim()) {
        silenceTimerRef.current = setTimeout(() => {
          const text = finalTextRef.current.trim();
          if (text) {
            recognition.stop();
            setListening(false);
            setTranscript("");
            finalTextRef.current = "";
            onFinalRef.current(text);
          }
        }, 2000);
      }
    };

    recognition.onerror = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setListening(false);
    };

    recognition.onend = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      recognition.abort();
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !listening) {
      setTranscript("");
      finalTextRef.current = "";
      try {
        recognitionRef.current.start();
      } catch {
        /* already started */
      }
      setListening(true);
    }
  }, [listening]);

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  }, [listening]);

  return { listening, transcript, supported, startListening, stopListening, setTranscript };
}

// ---------------------------------------------------------------------------
// Voice Output Hook (with onEnd callback for auto-resume mic)
// ---------------------------------------------------------------------------

interface UseVoiceOutputReturn {
  speaking: boolean;
  speak: (text: string, onEnd?: () => void) => void;
  stop: () => void;
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  supported: boolean;
}

function useVoiceOutput(): UseVoiceOutputReturn {
  const [speaking, setSpeaking] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const onEndCallbackRef = useRef<(() => void) | null>(null);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (!supported || !enabled) {
        if (onEnd) onEnd();
        return;
      }
      window.speechSynthesis.cancel();
      onEndCallbackRef.current = onEnd || null;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => {
        setSpeaking(false);
        if (onEndCallbackRef.current) onEndCallbackRef.current();
      };
      utterance.onerror = () => {
        setSpeaking(false);
        if (onEndCallbackRef.current) onEndCallbackRef.current();
      };

      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find((v) => v.lang.startsWith("en") && v.name.includes("Female")) ||
        voices.find((v) => v.lang.startsWith("en"));
      if (preferred) utterance.voice = preferred;

      window.speechSynthesis.speak(utterance);
    },
    [supported, enabled]
  );

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel();
    setSpeaking(false);
    onEndCallbackRef.current = null;
  }, [supported]);

  return { speaking, speak, stop, enabled, setEnabled, supported };
}

// ---------------------------------------------------------------------------
// Persona Avatar (initials-based)
// ---------------------------------------------------------------------------

function PersonaAvatar({
  name,
  initials,
  size = 36,
}: {
  name: string | null;
  initials?: string | null;
  size?: number;
}) {
  const colors = ["#4f46e5", "#0891b2", "#059669", "#7c3aed", "#db2777", "#ea580c", "#2563eb"];
  const hash = (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const color = colors[hash % colors.length];
  const text =
    initials ||
    (name || "??")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: size * 0.36,
        fontWeight: 700,
        letterSpacing: 1,
        boxShadow: `0 2px 6px ${color}40`,
        flexShrink: 0,
      }}
    >
      {text}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function RoleplaySessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [script, setScript] = useState<Script | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [ending, setEnding] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const [turnIndicator, setTurnIndicator] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use refs for values accessed inside async callbacks to avoid stale closures
  const sendingRef = useRef(false);
  const voiceModeRef = useRef(false);
  const sessionIdRef = useRef(sessionId);

  const tts = useVoiceOutput();
  const ttsRef = useRef(tts);

  // Keep refs in sync with latest values
  useEffect(() => {
    voiceModeRef.current = voiceMode;
  }, [voiceMode]);
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);
  useEffect(() => {
    ttsRef.current = tts;
  }, [tts]);

  // Stable send function that reads from refs (never stale)
  const doSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || sendingRef.current) return;
    sendingRef.current = true;
    setSending(true);
    setInput("");
    setError("");
    setTurnIndicator("persona");

    try {
      const res = await fetch(`/api/roleplay/sessions/${sessionIdRef.current}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setMessages((prev) => [...prev, data.user_message, data.ai_message]);

      // After getting response, handle TTS and voice mode via refs
      const isVoice = voiceModeRef.current;
      const currentTts = ttsRef.current;

      if (isVoice && currentTts.enabled) {
        currentTts.speak(data.ai_message.content, () => {
          setTurnIndicator("you");
          // Re-open mic after persona finishes speaking
          // Small delay to prevent mic picking up tail-end of TTS audio
          setTimeout(() => {
            if (voiceModeRef.current) {
              voiceRef.current.startListening();
            }
          }, 300);
        });
      } else if (currentTts.enabled) {
        // Text mode with TTS: speak but don't touch mic
        currentTts.speak(data.ai_message.content, () => {
          setTurnIndicator("");
        });
      } else if (isVoice) {
        // Voice mode but TTS disabled: just re-open mic
        setTurnIndicator("you");
        setTimeout(() => {
          if (voiceModeRef.current) {
            voiceRef.current.startListening();
          }
        }, 300);
      } else {
        // Text mode, no TTS
        setTurnIndicator("");
      }
    } catch (err: unknown) {
      const detail =
        err instanceof Error ? err.message : "Failed to get response";
      setError(detail);
      // Still show the user's message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "user" as const,
          content: text,
          created_at: new Date().toISOString(),
        },
      ]);
      setTurnIndicator("");
      if (voiceModeRef.current) {
        setTurnIndicator("you");
        setTimeout(() => voiceRef.current.startListening(), 300);
      }
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Voice auto-send on silence
  const handleVoiceAutoSend = useCallback(
    (text: string) => {
      if (sendingRef.current || !text.trim()) return;
      doSendMessage(text);
    },
    [doSendMessage]
  );

  const voice = useVoiceInput({ onFinalTranscript: handleVoiceAutoSend });
  const voiceRef = useRef(voice);
  useEffect(() => {
    voiceRef.current = voice;
  }, [voice]);

  // Load session data (reset on session change)
  useEffect(() => {
    setSession(null);
    setScript(null);
    setMessages([]);
    setInput("");
    setSending(false);
    setEnding(false);
    setShowScript(false);
    setLoading(true);
    setError("");
    setVoiceMode(false);
    setTurnIndicator("");
    sendingRef.current = false;
    voiceModeRef.current = false;
    tts.stop();
    voice.stopListening();

    fetch(`/api/roleplay/sessions/${sessionId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load session");
        return r.json();
      })
      .then((data: Session) => {
        setSession(data);
        setMessages(data.messages || []);
        return fetch(`/api/scripts/${data.script_id}`);
      })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load script");
        return r.json();
      })
      .then((data: Script) => setScript(data))
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sync voice transcript into text input live
  useEffect(() => {
    if (voice.transcript) {
      setInput(voice.transcript);
    }
  }, [voice.transcript]);

  const handleSend = () => {
    if (!input.trim() || sendingRef.current) return;
    voice.stopListening();
    voice.setTranscript("");
    doSendMessage(input.trim());
  };

  const handleEnd = async () => {
    if (ending) return;
    tts.stop();
    voice.stopListening();
    setVoiceMode(false);
    setTurnIndicator("");
    setEnding(true);
    try {
      const res = await fetch(`/api/roleplay/sessions/${sessionId}/end`, {
        method: "PATCH",
      });
      if (res.ok) {
        const data: Session = await res.json();
        setSession(data);
      }
    } catch {
      // ignore
    } finally {
      setEnding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoiceMode = () => {
    if (voiceMode) {
      setVoiceMode(false);
      voice.stopListening();
      tts.stop();
      setTurnIndicator("");
    } else {
      setVoiceMode(true);
      tts.setEnabled(true);
      setTurnIndicator("you");
      voice.startListening();
    }
  };

  const toggleMic = () => {
    if (voice.listening) {
      voice.stopListening();
    } else {
      voice.startListening();
    }
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  if (loading) {
    return <div className="loading-spinner">Loading session...</div>;
  }

  if (!session) {
    return (
      <div className="empty-state">
        <h3>Session not found</h3>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Script Reference Panel */}
      {showScript && script && (
        <div style={styles.scriptPanel}>
          <div style={styles.scriptPanelHeader}>
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>Script Reference</h3>
            <button onClick={() => setShowScript(false)} style={styles.closeBtn}>
              X
            </button>
          </div>
          <div style={styles.scriptPanelContent}>
            {script.sections?.map((sec) => (
              <div key={sec.id} style={styles.scriptSection}>
                <h4 style={styles.scriptSectionType}>
                  {sec.section_type.replace("_", " ")}
                </h4>
                <p style={{ fontSize: 13, lineHeight: 1.6 }}>{sec.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div style={styles.chatArea}>
        {/* Header */}
        <div style={styles.chatHeader}>
          <div style={styles.headerLeft}>
            <PersonaAvatar
              name={session.persona_name}
              initials={session.persona_emoji}
              size={36}
            />
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>
                {session.persona_name}
              </h2>
              <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                {session.script_title}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {voice.supported && session.is_active && (
              <button
                className="btn btn-sm"
                onClick={toggleVoiceMode}
                style={{
                  background: voiceMode ? "#ef4444" : "#22c55e",
                  color: "white",
                  border: "none",
                  fontWeight: 700,
                }}
              >
                {voiceMode ? "End Call Mode" : "Call Mode"}
              </button>
            )}
            {tts.supported && !voiceMode && (
              <button
                className="btn btn-sm"
                style={{
                  background: tts.enabled ? "#dcfce7" : "#f1f5f9",
                  color: tts.enabled ? "#16a34a" : "var(--text-secondary)",
                  border:
                    "1px solid " + (tts.enabled ? "#bbf7d0" : "var(--border)"),
                }}
                onClick={() => {
                  tts.stop();
                  tts.setEnabled(!tts.enabled);
                }}
              >
                {tts.enabled ? "Voice On" : "Voice Off"}
              </button>
            )}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowScript(!showScript)}
            >
              {showScript ? "Hide Script" : "Show Script"}
            </button>
            {session.is_active && (
              <button
                className="btn btn-danger btn-sm"
                onClick={handleEnd}
                disabled={ending}
              >
                {ending ? "Ending..." : "End Session"}
              </button>
            )}
          </div>
        </div>

        {/* Turn Indicator Banner (voice mode) */}
        {voiceMode && turnIndicator && (
          <div
            style={{
              ...styles.turnBanner,
              background: turnIndicator === "you" ? "#eef2ff" : "#fef3c7",
              borderColor: turnIndicator === "you" ? "#c7d2fe" : "#fde68a",
            }}
          >
            <span style={{ fontSize: 18 }}>
              {turnIndicator === "you"
                ? voice.listening
                  ? "\uD83C\uDF99\uFE0F"
                  : "\u23F3"
                : tts.speaking
                  ? "\uD83D\uDD0A"
                  : "\u23F3"}
            </span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>
              {turnIndicator === "you"
                ? voice.listening
                  ? "Your turn \u2014 speak now (auto-sends after pause)"
                  : "Starting mic..."
                : sending
                  ? `${session.persona_name} is thinking...`
                  : `${session.persona_name} is speaking...`}
            </span>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div style={styles.errorBanner}>
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              style={{
                background: "none",
                border: "none",
                color: "#dc2626",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              \u2715
            </button>
          </div>
        )}

        {/* Feedback Banner */}
        {!session.is_active && session.feedback_summary && (
          <div style={styles.feedbackBanner}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
              Coaching Feedback
            </h3>
            <div
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {session.feedback_summary}
            </div>
          </div>
        )}

        {/* Messages */}
        <div style={styles.messages}>
          {messages.length === 0 && session.is_active && (
            <div style={styles.startPrompt}>
              <PersonaAvatar
                name={session.persona_name}
                initials={session.persona_emoji}
                size={56}
              />
              <h3>Start the call!</h3>
              <p>
                {voice.supported
                  ? 'Hit "Call Mode" for a hands-free voice conversation, or type below'
                  : "Type your opening line to begin the roleplay"}{" "}
                with {session.persona_name}
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                ...styles.message,
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.messageBubble,
                  background:
                    msg.role === "user" ? "var(--primary)" : "white",
                  color: msg.role === "user" ? "white" : "var(--text)",
                  border:
                    msg.role === "assistant"
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                {msg.role === "assistant" && (
                  <span style={styles.personaLabel}>
                    {session.persona_name}
                  </span>
                )}
                <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  {msg.content}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={styles.timestamp}>
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {msg.role === "assistant" && tts.supported && (
                  <button
                    onClick={() => tts.speak(msg.content)}
                    style={styles.replayBtn}
                    title="Replay voice"
                  >
                    {"\uD83D\uDD0A"}
                  </button>
                )}
              </div>
            </div>
          ))}
          {sending && (
            <div style={{ ...styles.message, alignSelf: "flex-start" }}>
              <div
                style={{
                  ...styles.messageBubble,
                  background: "white",
                  border: "1px solid var(--border)",
                }}
              >
                <span style={styles.personaLabel}>
                  {session.persona_name}
                </span>
                <p style={{ margin: 0, color: "var(--text-secondary)" }}>
                  Typing...
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {session.is_active ? (
          <div style={styles.inputBar}>
            {voice.supported && !voiceMode && (
              <button
                onClick={toggleMic}
                style={{
                  ...styles.micBtn,
                  background: voice.listening ? "#ef4444" : "var(--primary)",
                  animation: voice.listening ? "pulse 1.5s infinite" : "none",
                }}
                title={voice.listening ? "Stop recording" : "Start recording"}
              >
                {voice.listening ? "\u23F9" : "\uD83C\uDF99\uFE0F"}
              </button>
            )}
            {voiceMode && (
              <div style={styles.voiceModeInput}>
                <span style={{ fontSize: 20 }}>
                  {voice.listening
                    ? "\uD83C\uDF99\uFE0F"
                    : tts.speaking
                      ? "\uD83D\uDD0A"
                      : "\u23F3"}
                </span>
                <span
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: 14,
                  }}
                >
                  {voice.listening
                    ? voice.transcript || "Listening..."
                    : sending
                      ? "Waiting for response..."
                      : tts.speaking
                        ? "Persona speaking..."
                        : "Starting..."}
                </span>
              </div>
            )}
            {!voiceMode && (
              <>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    voice.listening
                      ? "Listening... speak now"
                      : "Type or press mic (Enter to send)"
                  }
                  style={{
                    ...styles.textInput,
                    borderColor: voice.listening
                      ? "#ef4444"
                      : "var(--border)",
                  }}
                  rows={1}
                  disabled={sending}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    voice.stopListening();
                    handleSend();
                  }}
                  disabled={!input.trim() || sending}
                >
                  Send
                </button>
              </>
            )}
          </div>
        ) : (
          <div style={styles.endedBar}>
            <p>Session ended</p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => router.push("/roleplay")}
            >
              Start New Session
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline Styles
// ---------------------------------------------------------------------------

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    gap: 16,
    height: "calc(100vh - 124px)",
  },
  scriptPanel: {
    width: 350,
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  scriptPanelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid var(--border)",
  },
  closeBtn: {
    background: "none",
    fontSize: 14,
    color: "var(--text-secondary)",
    padding: "4px 8px",
  },
  scriptPanelContent: {
    flex: 1,
    overflowY: "auto",
    padding: 16,
  },
  scriptSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottom: "1px solid var(--border)",
  },
  scriptSectionType: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    color: "var(--primary)",
    marginBottom: 4,
  },
  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: 12,
    overflow: "hidden",
  },
  chatHeader: {
    display: "flex",
    flexWrap: "wrap" as const,
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    gap: 8,
    borderBottom: "1px solid var(--border)",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  turnBanner: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 20px",
    borderBottom: "1px solid",
    transition: "all 0.2s",
  },
  errorBanner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#fee2e2",
    color: "#dc2626",
    fontSize: 13,
    borderBottom: "1px solid #fecaca",
  },
  feedbackBanner: {
    background: "#f0fdf4",
    borderBottom: "1px solid #bbf7d0",
    padding: "16px 20px",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  startPrompt: {
    textAlign: "center",
    padding: "60px 20px",
    color: "var(--text-secondary)",
  },
  message: {
    maxWidth: "70%",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  messageBubble: {
    padding: "10px 16px",
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.6,
  },
  personaLabel: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 4,
    display: "block",
    opacity: 0.7,
  },
  timestamp: {
    fontSize: 11,
    color: "var(--text-secondary)",
    paddingLeft: 4,
  },
  replayBtn: {
    background: "none",
    border: "none",
    fontSize: 12,
    cursor: "pointer",
    padding: "2px 4px",
    opacity: 0.5,
  },
  inputBar: {
    display: "flex",
    gap: 8,
    padding: "12px 20px",
    borderTop: "1px solid var(--border)",
    background: "#f8fafc",
    alignItems: "center",
  },
  micBtn: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: "none",
    color: "white",
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
  voiceModeInput: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: 8,
    background: "white",
    border: "1px solid var(--border)",
    minHeight: 42,
  },
  textInput: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    fontSize: 14,
    resize: "none",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.15s",
  },
  endedBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: "16px 20px",
    borderTop: "1px solid var(--border)",
    background: "#f8fafc",
    color: "var(--text-secondary)",
    fontSize: 14,
  },
};
