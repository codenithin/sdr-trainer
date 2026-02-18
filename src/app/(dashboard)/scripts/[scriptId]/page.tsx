"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Section {
  id: number;
  script_id: number;
  section_type: string;
  title: string;
  content: string;
  talking_points: string | string[] | null;
  tips: string | null;
  order_index: number;
}

interface Script {
  id: number;
  title: string;
  description: string;
  industry: string;
  company_size: string;
  target_location: string;
  product_name: string;
  target_role: string;
  difficulty_level: string;
  created_at: string;
  sections: Section[];
}

interface Bubble {
  type: "script" | "objection" | "response" | "branch-yes" | "branch-no" | "question";
  label: string;
  text: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SECTION_ICONS: Record<string, string> = {
  intro: "\u{1F44B}",
  discovery: "\u{1F50D}",
  pitch: "\u{1F3AF}",
  objection_handling: "\u{1F6E1}\uFE0F",
  close: "\u{1F91D}",
};

const SECTION_COLORS: Record<string, string> = {
  intro: "#3b82f6",
  discovery: "#8b5cf6",
  pitch: "#22c55e",
  objection_handling: "#f59e0b",
  close: "#ef4444",
};

/* ------------------------------------------------------------------ */
/*  parseBubbles – turns section content into chat bubbles             */
/* ------------------------------------------------------------------ */

function parseBubbles(content: string): Bubble[] {
  const bubbles: Bubble[] = [];
  if (!content) return bubbles;

  const lines = content.split("\n");
  let currentType: Bubble["type"] = "script";
  let currentLabel = "Script";
  let buffer: string[] = [];

  const flush = () => {
    const text = buffer.join("\n").trim();
    if (text) {
      bubbles.push({ type: currentType, label: currentLabel, text });
    }
    buffer = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const lower = line.toLowerCase();

    if (lower.startsWith("[objection]") || lower.startsWith("objection:")) {
      flush();
      currentType = "objection";
      currentLabel = "Objection";
      const rest = line.replace(/^\[objection\]/i, "").replace(/^objection:/i, "").trim();
      if (rest) buffer.push(rest);
    } else if (lower.startsWith("[response]") || lower.startsWith("response:")) {
      flush();
      currentType = "response";
      currentLabel = "Response";
      const rest = line.replace(/^\[response\]/i, "").replace(/^response:/i, "").trim();
      if (rest) buffer.push(rest);
    } else if (lower.startsWith("[if yes]") || lower.startsWith("if yes:")) {
      flush();
      currentType = "branch-yes";
      currentLabel = "If Yes";
      const rest = line.replace(/^\[if yes\]/i, "").replace(/^if yes:/i, "").trim();
      if (rest) buffer.push(rest);
    } else if (lower.startsWith("[if no]") || lower.startsWith("if no:")) {
      flush();
      currentType = "branch-no";
      currentLabel = "If No";
      const rest = line.replace(/^\[if no\]/i, "").replace(/^if no:/i, "").trim();
      if (rest) buffer.push(rest);
    } else if (lower.startsWith("[question]") || lower.startsWith("question:") || line.endsWith("?")) {
      flush();
      currentType = "question";
      currentLabel = "Question";
      const rest = line
        .replace(/^\[question\]/i, "")
        .replace(/^question:/i, "")
        .trim();
      if (rest) buffer.push(rest);
      else if (line.endsWith("?")) buffer.push(line);
    } else if (
      lower.startsWith("[script]") ||
      lower.startsWith("script:")
    ) {
      flush();
      currentType = "script";
      currentLabel = "Script";
      const rest = line.replace(/^\[script\]/i, "").replace(/^script:/i, "").trim();
      if (rest) buffer.push(rest);
    } else {
      buffer.push(line);
    }
  }
  flush();

  return bubbles;
}

/* ------------------------------------------------------------------ */
/*  Bubble styles per type                                             */
/* ------------------------------------------------------------------ */

function bubbleStyle(type: Bubble["type"]): React.CSSProperties {
  const base: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 8,
    maxWidth: "85%",
    fontSize: 14,
    lineHeight: 1.55,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    position: "relative",
  };

  switch (type) {
    case "script":
      return { ...base, background: "#dcf8c6", alignSelf: "flex-end" };
    case "objection":
      return { ...base, background: "#ffffff", color: "#dc2626", alignSelf: "flex-start", border: "1px solid #fecaca" };
    case "response":
      return { ...base, background: "#dcf8c6", alignSelf: "flex-end" };
    case "branch-yes":
      return { ...base, background: "#e8f5e9", alignSelf: "flex-end", borderLeft: "3px solid #4caf50" };
    case "branch-no":
      return { ...base, background: "#fce4ec", alignSelf: "flex-start", borderLeft: "3px solid #e91e63" };
    case "question":
      return { ...base, background: "#dcf8c6", alignSelf: "flex-end", fontWeight: 600 };
    default:
      return base;
  }
}

function labelStyle(type: Bubble["type"]): React.CSSProperties {
  const base: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  };

  switch (type) {
    case "objection":
      return { ...base, color: "#dc2626" };
    case "branch-yes":
      return { ...base, color: "#4caf50" };
    case "branch-no":
      return { ...base, color: "#e91e63" };
    case "question":
      return { ...base, color: "#075e54" };
    default:
      return { ...base, color: "#075e54" };
  }
}

/* ------------------------------------------------------------------ */
/*  ConnectorLine                                                      */
/* ------------------------------------------------------------------ */

function ConnectorLine() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "2px 0",
      }}
    >
      <div
        style={{
          width: 2,
          height: 16,
          background: "#c5dbca",
          borderRadius: 1,
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  BubbleComponent                                                    */
/* ------------------------------------------------------------------ */

function BubbleComponent({ bubble }: { bubble: Bubble }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={bubbleStyle(bubble.type)}>
        <div style={labelStyle(bubble.type)}>{bubble.label}</div>
        <div>{bubble.text}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  parseTalkingPoints                                                 */
/* ------------------------------------------------------------------ */

function parseTalkingPoints(tp: string | string[] | null): string[] {
  if (!tp) return [];
  if (Array.isArray(tp)) return tp;
  try {
    const parsed = JSON.parse(tp);
    if (Array.isArray(parsed)) return parsed;
    return [String(parsed)];
  } catch {
    return tp
      .split("\n")
      .map((l) => l.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean);
  }
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function ScriptDetailPage() {
  const params = useParams();
  const scriptId = params.scriptId as string;

  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<number>(0);

  const chatRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* Fetch script */
  useEffect(() => {
    if (!scriptId) return;
    setLoading(true);
    fetch(`/api/scripts/${scriptId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Script not found");
        return r.json();
      })
      .then((data: Script) => {
        setScript(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [scriptId]);

  /* Scroll-spy: highlight active section in sidebar */
  const handleScroll = useCallback(() => {
    if (!chatRef.current || !script) return;
    const scrollTop = chatRef.current.scrollTop;
    const offset = 120;

    for (let i = sectionRefs.current.length - 1; i >= 0; i--) {
      const el = sectionRefs.current[i];
      if (el && el.offsetTop - offset <= scrollTop) {
        setActiveSection(i);
        return;
      }
    }
    setActiveSection(0);
  }, [script]);

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* Scroll to section */
  const scrollToSection = (index: number) => {
    const el = sectionRefs.current[index];
    if (el && chatRef.current) {
      chatRef.current.scrollTo({
        top: el.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Render states                                                    */
  /* ---------------------------------------------------------------- */

  if (loading) {
    return (
      <div
        style={{
          margin: "-32px -48px",
          height: "calc(100vh - 60px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
          fontSize: 15,
        }}
      >
        Loading script...
      </div>
    );
  }

  if (error || !script) {
    return (
      <div
        style={{
          margin: "-32px -48px",
          height: "calc(100vh - 60px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 12,
          color: "#64748b",
        }}
      >
        <div style={{ fontSize: 48 }}>{"\u{1F4CB}"}</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>
          {error || "Script not found"}
        </div>
        <Link href="/scripts">
          <button
            style={{
              marginTop: 8,
              padding: "8px 20px",
              borderRadius: 8,
              background: "#4f46e5",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Back to Scripts
          </button>
        </Link>
      </div>
    );
  }

  const sections = script.sections || [];

  /* ---------------------------------------------------------------- */
  /*  Main layout                                                      */
  /* ---------------------------------------------------------------- */

  return (
    <div
      style={{
        margin: "-32px -48px",
        height: "calc(100vh - 60px)",
        display: "flex",
        overflow: "hidden",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ============================================================ */}
      {/*  LEFT SIDEBAR – Section Navigation                           */}
      {/* ============================================================ */}
      <div
        style={{
          width: 280,
          minWidth: 280,
          background: "#ffffff",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Script info header */}
        <div
          style={{
            padding: "20px 16px 16px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#1e293b",
              margin: 0,
              marginBottom: 6,
              lineHeight: 1.3,
            }}
          >
            {script.title}
          </h2>
          <p
            style={{
              fontSize: 12,
              color: "#64748b",
              margin: 0,
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {script.description}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              marginTop: 10,
            }}
          >
            <span
              style={{
                background: "#dbeafe",
                color: "#1d4ed8",
                padding: "2px 8px",
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {script.industry?.replace(/_/g, " ")}
            </span>
            <span
              style={{
                background: "#f3e8ff",
                color: "#7c3aed",
                padding: "2px 8px",
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {script.company_size?.replace(/_/g, " ")}
            </span>
            {script.difficulty_level && (
              <span
                style={{
                  background:
                    script.difficulty_level === "easy"
                      ? "#dcfce7"
                      : script.difficulty_level === "hard"
                      ? "#fee2e2"
                      : "#fef3c7",
                  color:
                    script.difficulty_level === "easy"
                      ? "#16a34a"
                      : script.difficulty_level === "hard"
                      ? "#dc2626"
                      : "#d97706",
                  padding: "2px 8px",
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              >
                {script.difficulty_level}
              </span>
            )}
          </div>
        </div>

        {/* Section list */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px 0",
          }}
        >
          <div
            style={{
              padding: "8px 16px 6px",
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "#94a3b8",
            }}
          >
            Sections
          </div>
          {sections.map((section, i) => {
            const sType = section.section_type;
            const icon = SECTION_ICONS[sType] || "\u{1F4C4}";
            const color = SECTION_COLORS[sType] || "#6b7280";
            const isActive = activeSection === i;

            return (
              <div
                key={section.id}
                onClick={() => scrollToSection(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  cursor: "pointer",
                  borderLeft: isActive ? `3px solid ${color}` : "3px solid transparent",
                  background: isActive ? `${color}10` : "transparent",
                  transition: "all 0.15s ease",
                }}
              >
                <span style={{ fontSize: 18 }}>{icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? color : "#1e293b",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {section.title}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#94a3b8",
                      textTransform: "capitalize",
                    }}
                  >
                    {sType.replace(/_/g, " ")}
                  </div>
                </div>
                {isActive && (
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div
          style={{
            padding: 16,
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Link href={`/scripts/${script.id}/edit`} style={{ textDecoration: "none" }}>
            <button
              style={{
                width: "100%",
                padding: "10px 16px",
                borderRadius: 8,
                background: "#4f46e5",
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {"\u270F\uFE0F"} Edit Script
            </button>
          </Link>
          <Link href={`/roleplay?script=${script.id}`} style={{ textDecoration: "none" }}>
            <button
              style={{
                width: "100%",
                padding: "10px 16px",
                borderRadius: 8,
                background: "#ffffff",
                color: "#1e293b",
                fontSize: 13,
                fontWeight: 600,
                border: "1px solid #e2e8f0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {"\u{1F3AD}"} Practice Roleplay
            </button>
          </Link>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  RIGHT SIDE – WhatsApp Chat Area                             */}
      {/* ============================================================ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Chat header */}
        <div
          style={{
            height: 56,
            minHeight: 56,
            background: "#075e54",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            {"\u{1F4DE}"}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                color: "#ffffff",
                fontSize: 15,
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              {script.title}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 12,
              }}
            >
              {sections.length} section{sections.length !== 1 ? "s" : ""} &middot;{" "}
              {script.target_role} &middot; {script.target_location}
            </div>
          </div>
        </div>

        {/* Chat body */}
        <div
          ref={chatRef}
          style={{
            flex: 1,
            overflowY: "auto",
            background: "#efeae2",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cfc6' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            padding: "20px 24px",
          }}
        >
          {sections.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#64748b",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>{"\u{1F4AD}"}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>
                No sections yet
              </div>
              <div style={{ fontSize: 13, marginTop: 4 }}>
                Edit this script to add sections
              </div>
            </div>
          ) : (
            sections.map((section, sectionIndex) => {
              const sType = section.section_type;
              const icon = SECTION_ICONS[sType] || "\u{1F4C4}";
              const color = SECTION_COLORS[sType] || "#6b7280";
              const talkingPoints = parseTalkingPoints(section.talking_points);
              const bubbles = parseBubbles(section.content);

              return (
                <div
                  key={section.id}
                  ref={(el) => {
                    sectionRefs.current[sectionIndex] = el;
                  }}
                  style={{ marginBottom: 32 }}
                >
                  {/* Section divider */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      margin: "16px 0 20px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        background: `${color}40`,
                      }}
                    />
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: color,
                        color: "#ffffff",
                        padding: "5px 14px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                      }}
                    >
                      <span>{icon}</span>
                      <span>{section.title}</span>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        background: `${color}40`,
                      }}
                    />
                  </div>

                  {/* Talking points card */}
                  {talkingPoints.length > 0 && (
                    <div
                      style={{
                        background: "#ffffff",
                        borderRadius: 10,
                        padding: "12px 16px",
                        marginBottom: 14,
                        border: `1px solid ${color}30`,
                        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          color: color,
                          marginBottom: 8,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {"\u{1F4CC}"} Talking Points
                      </div>
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: 18,
                          listStyle: "disc",
                        }}
                      >
                        {talkingPoints.map((point, pi) => (
                          <li
                            key={pi}
                            style={{
                              fontSize: 13,
                              color: "#374151",
                              lineHeight: 1.6,
                              marginBottom: 2,
                            }}
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tips card */}
                  {section.tips && (
                    <div
                      style={{
                        background: "#fffbeb",
                        borderRadius: 10,
                        padding: "12px 16px",
                        marginBottom: 14,
                        border: "1px solid #fde68a",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          color: "#d97706",
                          marginBottom: 6,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {"\u{1F4A1}"} Tips
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#92400e",
                          lineHeight: 1.6,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {section.tips}
                      </div>
                    </div>
                  )}

                  {/* Chat bubbles */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0,
                    }}
                  >
                    {bubbles.map((bubble, bi) => (
                      <div key={bi}>
                        {bi > 0 && <ConnectorLine />}
                        <BubbleComponent bubble={bubble} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
