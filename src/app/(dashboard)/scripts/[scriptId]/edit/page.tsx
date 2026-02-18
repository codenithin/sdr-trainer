"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const SECTION_TYPES = ["intro", "discovery", "pitch", "objection_handling", "close"];
const SECTION_ICONS: Record<string, string> = {
  intro: "\u{1F44B}",
  discovery: "\u{1F50D}",
  pitch: "\u{1F3AF}",
  objection_handling: "\u{1F6E1}\uFE0F",
  close: "\u{1F91D}",
};

interface Section {
  id: number;
  script_id: number;
  section_type: string;
  title: string;
  content: string;
  talking_points: string | string[] | null;
  tips: string;
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
  sections: Section[];
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

function parseTalkingPoints(tp: string | string[] | null): string[] {
  if (!tp) return [];
  if (Array.isArray(tp)) return tp;
  try {
    const parsed = JSON.parse(tp);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function EditScriptPage() {
  const params = useParams();
  const scriptId = params.scriptId as string;

  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSection, setSavingSection] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Metadata form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [targetLocation, setTargetLocation] = useState("");
  const [productName, setProductName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");

  // Section editor state
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionType, setSectionType] = useState("intro");
  const [sectionContent, setSectionContent] = useState("");
  const [talkingPoints, setTalkingPoints] = useState<string[]>([]);
  const [sectionTips, setSectionTips] = useState("");

  const showToast = useCallback((message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const loadSectionIntoEditor = useCallback((section: Section) => {
    setSectionTitle(section.title);
    setSectionType(section.section_type);
    setSectionContent(section.content);
    setTalkingPoints(parseTalkingPoints(section.talking_points));
    setSectionTips(section.tips || "");
  }, []);

  const fetchScript = useCallback(async () => {
    try {
      const res = await fetch(`/api/scripts/${scriptId}`);
      if (!res.ok) throw new Error("Failed to fetch script");
      const data: Script = await res.json();
      setScript(data);

      // Populate metadata form
      setTitle(data.title);
      setDescription(data.description);
      setIndustry(data.industry);
      setCompanySize(data.company_size);
      setTargetLocation(data.target_location);
      setProductName(data.product_name || "");
      setTargetRole(data.target_role);
      setDifficultyLevel(data.difficulty_level);

      // Load first section if available
      if (data.sections.length > 0) {
        const idx = activeTab < data.sections.length ? activeTab : 0;
        loadSectionIntoEditor(data.sections[idx]);
        setActiveTab(idx);
      }
    } catch {
      showToast("Failed to load script", "error");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptId, showToast]);

  useEffect(() => {
    fetchScript();
  }, [fetchScript]);

  const handleSaveDetails = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/scripts/${scriptId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          industry,
          company_size: companySize,
          target_location: targetLocation,
          product_name: productName,
          target_role: targetRole,
          difficulty_level: difficultyLevel,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data: Script = await res.json();
      setScript(data);
      showToast("Script details saved successfully", "success");
    } catch {
      showToast("Failed to save script details", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSection = async () => {
    if (!script || !script.sections[activeTab]) return;
    const section = script.sections[activeTab];
    setSavingSection(true);
    try {
      const res = await fetch(`/api/scripts/${scriptId}/sections/${section.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: sectionTitle,
          section_type: sectionType,
          content: sectionContent,
          talking_points: talkingPoints,
          tips: sectionTips,
        }),
      });
      if (!res.ok) throw new Error("Failed to save section");
      const data: Script = await res.json();
      setScript(data);
      showToast("Section saved successfully", "success");
    } catch {
      showToast("Failed to save section", "error");
    } finally {
      setSavingSection(false);
    }
  };

  const handleAddSection = async () => {
    if (!script) return;
    try {
      const res = await fetch(`/api/scripts/${scriptId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Section",
          section_type: "intro",
          content: "",
          talking_points: [],
          tips: "",
          order_index: script.sections.length,
        }),
      });
      if (!res.ok) throw new Error("Failed to add section");
      const data: Script = await res.json();
      setScript(data);
      const newIdx = data.sections.length - 1;
      setActiveTab(newIdx);
      loadSectionIntoEditor(data.sections[newIdx]);
      showToast("Section added", "success");
    } catch {
      showToast("Failed to add section", "error");
    }
  };

  const handleDeleteSection = async () => {
    if (!script || !script.sections[activeTab]) return;
    const section = script.sections[activeTab];
    if (!confirm(`Delete section "${section.title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/scripts/${scriptId}/sections/${section.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete section");
      const data: Script = await res.json();
      setScript(data);
      const newIdx = Math.min(activeTab, data.sections.length - 1);
      setActiveTab(Math.max(newIdx, 0));
      if (data.sections.length > 0) {
        loadSectionIntoEditor(data.sections[Math.max(newIdx, 0)]);
      } else {
        setSectionTitle("");
        setSectionType("intro");
        setSectionContent("");
        setTalkingPoints([]);
        setSectionTips("");
      }
      showToast("Section deleted", "success");
    } catch {
      showToast("Failed to delete section", "error");
    }
  };

  const handleTabClick = (idx: number) => {
    if (!script) return;
    setActiveTab(idx);
    loadSectionIntoEditor(script.sections[idx]);
  };

  const handleAddTalkingPoint = () => {
    setTalkingPoints([...talkingPoints, ""]);
  };

  const handleRemoveTalkingPoint = (idx: number) => {
    setTalkingPoints(talkingPoints.filter((_, i) => i !== idx));
  };

  const handleTalkingPointChange = (idx: number, value: string) => {
    const updated = [...talkingPoints];
    updated[idx] = value;
    setTalkingPoints(updated);
  };

  if (loading) {
    return (
      <div style={{ margin: "-32px -48px", height: "calc(100vh - 60px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="loading-spinner">Loading script...</div>
      </div>
    );
  }

  if (!script) {
    return (
      <div style={{ margin: "-32px -48px", height: "calc(100vh - 60px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="empty-state">
          <h3>Script not found</h3>
          <p>The script you are looking for does not exist.</p>
          <Link href="/scripts" style={{ color: "var(--primary)", fontWeight: 600, marginTop: 12, display: "inline-block" }}>
            Back to Scripts
          </Link>
        </div>
      </div>
    );
  }

  const activeSection = script.sections[activeTab] || null;

  return (
    <div style={{ margin: "-32px -48px", height: "calc(100vh - 60px)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Toast notifications */}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              padding: "12px 20px",
              borderRadius: 8,
              color: "white",
              fontSize: 14,
              fontWeight: 600,
              background: toast.type === "success" ? "var(--success)" : "var(--danger)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              animation: "fadeIn 0.2s ease",
              minWidth: 200,
            }}
          >
            {toast.type === "success" ? "\u2713" : "\u2717"} {toast.message}
          </div>
        ))}
      </div>

      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          borderBottom: "1px solid var(--border)",
          background: "white",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href={`/scripts/${scriptId}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "var(--text-secondary)",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {"\u2190"} Back to View
          </Link>
          <span style={{ color: "var(--border)" }}>|</span>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
            {"\u270F\uFE0F"} Editing: {script.title}
          </h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href={`/scripts/${scriptId}`}>
            <button className="btn btn-secondary btn-sm">
              {"\u{1F441}\uFE0F"} Preview
            </button>
          </Link>
        </div>
      </div>

      {/* Main Two-Panel Layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Panel - Metadata + Section Tabs */}
        <div
          style={{
            width: 380,
            borderRight: "1px solid var(--border)",
            background: "white",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {/* Metadata Form */}
          <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Script Details
            </h3>

            <div className="input-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Script title"
              />
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Script description"
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="input-group">
                <label>Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. technology"
                />
              </div>

              <div className="input-group">
                <label>Company Size</label>
                <input
                  type="text"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  placeholder="e.g. mid_market"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="input-group">
                <label>Target Location</label>
                <input
                  type="text"
                  value={targetLocation}
                  onChange={(e) => setTargetLocation(e.target.value)}
                  placeholder="e.g. US"
                />
              </div>

              <div className="input-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Nvelop"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="input-group">
                <label>Target Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. VP of Sales"
                />
              </div>

              <div className="input-group">
                <label>Difficulty Level</label>
                <select
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleSaveDetails}
              disabled={saving}
              style={{ width: "100%", marginTop: 4 }}
            >
              {saving ? "Saving..." : "Save Details"}
            </button>

            {/* Section Tabs */}
            <div style={{ marginTop: 24, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                  Sections
                </h3>
                <button
                  onClick={handleAddSection}
                  style={{
                    background: "var(--primary-light)",
                    color: "var(--primary)",
                    border: "1px solid var(--primary)",
                    borderRadius: 6,
                    padding: "4px 12px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  + Add
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {script.sections.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => handleTabClick(idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: activeTab === idx ? "1px solid var(--primary)" : "1px solid var(--border)",
                      background: activeTab === idx ? "var(--primary-light)" : "white",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      fontSize: 13,
                      fontWeight: activeTab === idx ? 600 : 500,
                      color: activeTab === idx ? "var(--primary)" : "var(--text)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{SECTION_ICONS[section.section_type] || "\u{1F4C4}"}</span>
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {section.title || "Untitled"}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--text-secondary)",
                        background: "var(--bg)",
                        padding: "2px 6px",
                        borderRadius: 4,
                        textTransform: "capitalize",
                      }}
                    >
                      {section.section_type.replace(/_/g, " ")}
                    </span>
                  </button>
                ))}

                {script.sections.length === 0 && (
                  <div style={{ textAlign: "center", padding: 20, color: "var(--text-secondary)", fontSize: 13 }}>
                    No sections yet. Click &quot;+ Add&quot; to create one.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Section Editor */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            background: "var(--bg)",
            padding: 24,
          }}
        >
          {activeSection ? (
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
                  {SECTION_ICONS[activeSection.section_type] || "\u{1F4C4}"} Edit Section
                </h3>
                <button
                  onClick={handleDeleteSection}
                  style={{
                    background: "none",
                    color: "var(--danger)",
                    border: "1px solid var(--danger)",
                    borderRadius: 6,
                    padding: "6px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {"\u{1F5D1}\uFE0F"} Delete Section
                </button>
              </div>

              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Section Title</label>
                    <input
                      type="text"
                      value={sectionTitle}
                      onChange={(e) => setSectionTitle(e.target.value)}
                      placeholder="Section title"
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Section Type</label>
                    <select
                      value={sectionType}
                      onChange={(e) => setSectionType(e.target.value)}
                    >
                      {SECTION_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {SECTION_ICONS[t]} {t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="card" style={{ marginBottom: 16 }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Content</label>
                  <textarea
                    value={sectionContent}
                    onChange={(e) => setSectionContent(e.target.value)}
                    placeholder="Write the section content here..."
                    rows={8}
                    style={{ resize: "vertical" }}
                  />
                </div>
              </div>

              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <label style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: 0 }}>
                    Talking Points
                  </label>
                  <button
                    onClick={handleAddTalkingPoint}
                    style={{
                      background: "var(--primary-light)",
                      color: "var(--primary)",
                      border: "1px solid var(--primary)",
                      borderRadius: 6,
                      padding: "4px 12px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    + Add Point
                  </button>
                </div>

                {talkingPoints.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 16, color: "var(--text-secondary)", fontSize: 13, background: "var(--bg)", borderRadius: 8 }}>
                    No talking points yet. Click &quot;+ Add Point&quot; to add one.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {talkingPoints.map((point, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, minWidth: 20 }}>
                          {idx + 1}.
                        </span>
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => handleTalkingPointChange(idx, e.target.value)}
                          placeholder="Enter talking point..."
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            border: "1px solid var(--border)",
                            borderRadius: 6,
                            fontSize: 14,
                            outline: "none",
                          }}
                        />
                        <button
                          onClick={() => handleRemoveTalkingPoint(idx)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--danger)",
                            fontSize: 18,
                            cursor: "pointer",
                            padding: "4px 8px",
                            borderRadius: 4,
                            lineHeight: 1,
                          }}
                          title="Remove talking point"
                        >
                          {"\u00D7"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card" style={{ marginBottom: 16 }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Tips</label>
                  <textarea
                    value={sectionTips}
                    onChange={(e) => setSectionTips(e.target.value)}
                    placeholder="Tips and notes for this section..."
                    rows={4}
                    style={{ resize: "vertical" }}
                  />
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleSaveSection}
                disabled={savingSection}
                style={{ width: "100%" }}
              >
                {savingSection ? "Saving..." : "Save Section"}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-secondary)" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{"\u{1F4DD}"}</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>No Section Selected</h3>
                <p style={{ fontSize: 14 }}>
                  {script.sections.length === 0
                    ? 'Add a section using the "+ Add" button on the left.'
                    : "Select a section from the left panel to edit it."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
