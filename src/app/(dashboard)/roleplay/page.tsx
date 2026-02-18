"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Script {
  id: number;
  title: string;
  industry: string;
  company_size: string;
}

interface Persona {
  id: number;
  name: string;
  role_title: string;
  personality_summary: string;
  difficulty: string;
  avatar_emoji: string;
  traits: string[];
}

const DIFFICULTY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  easy: { color: "#16a34a", bg: "#dcfce7", label: "Easy" },
  medium: { color: "#d97706", bg: "#fef3c7", label: "Medium" },
  hard: { color: "#dc2626", bg: "#fee2e2", label: "Hard" },
};

const AVATAR_COLORS = [
  "#4f46e5", "#0891b2", "#059669", "#7c3aed",
  "#db2777", "#ea580c", "#2563eb",
];

function PersonaAvatar({ initials, index, size = 48 }: { initials: string; index: number; size?: number }) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
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
        boxShadow: `0 2px 8px ${color}40`,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

export default function RoleplaySetupPageWrapper() {
  return (
    <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
      <RoleplaySetupPage />
    </Suspense>
  );
}

function RoleplaySetupPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedScript, setSelectedScript] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("");
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    Promise.all([
      fetch("/api/scripts").then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
      fetch("/api/personas").then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
    ])
      .then(([scriptsData, personasData]) => {
        setScripts(Array.isArray(scriptsData) ? scriptsData : []);
        setPersonas(Array.isArray(personasData) ? personasData : []);
        const preselected = searchParams.get("script");
        if (preselected) setSelectedScript(preselected);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleStart = async () => {
    if (!selectedScript || !selectedPersona) {
      setError("Please select both a script and a persona");
      return;
    }
    setStarting(true);
    setError("");
    try {
      const res = await fetch("/api/roleplay/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script_id: Number(selectedScript),
          persona_id: Number(selectedPersona),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to start session");
      }
      const data = await res.json();
      router.push(`/roleplay/session/${data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to start session");
    } finally {
      setStarting(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Start Roleplay Practice</h1>
        <p>Choose a script and a prospect persona to practice with</p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 px-3.5 py-2.5 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {/* Script Selection */}
      <div className="mb-8">
        <h2 className="text-base font-bold mb-3">1. Select a Script</h2>
        <div className="max-w-[500px]">
          <select
            value={selectedScript}
            onChange={(e) => setSelectedScript(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--border)] text-sm bg-white"
          >
            <option value="">Choose a script...</option>
            {scripts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.industry} / {s.company_size})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Persona Selection */}
      <div className="mb-8">
        <h2 className="text-base font-bold mb-3">2. Choose a Prospect Persona</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {personas.map((p, idx) => {
            const isSelected = selectedPersona === String(p.id);
            const dc = DIFFICULTY_CONFIG[p.difficulty] || DIFFICULTY_CONFIG.easy;
            const initials = p.avatar_emoji || p.name.split(" ").map((w) => w[0]).join("");

            return (
              <div
                key={p.id}
                className="card cursor-pointer transition-all relative"
                onClick={() => setSelectedPersona(String(p.id))}
                style={{
                  border: `2px solid ${isSelected ? AVATAR_COLORS[idx % AVATAR_COLORS.length] : "var(--border)"}`,
                  boxShadow: isSelected
                    ? `0 0 0 3px ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}25`
                    : "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <PersonaAvatar initials={initials} index={idx} />
                  <div
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: dc.bg, color: dc.color }}
                  >
                    {dc.label}
                  </div>
                </div>

                <h3 className="text-base font-bold mt-1">{p.name}</h3>
                <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 font-medium">{p.role_title}</p>
                <p className="text-[13px] mt-2 leading-relaxed text-[#475569]">{p.personality_summary}</p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.traits.map((t, i) => (
                    <span
                      key={i}
                      className="bg-[#f1f5f9] text-[var(--text-secondary)] px-2.5 py-0.5 rounded-xl text-[11px] font-semibold"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {isSelected && (
                  <div
                    className="absolute top-3 right-3 flex items-center gap-1 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-xl"
                    style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                  >
                    ✓ Selected
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button
        className="btn btn-primary py-3.5 px-8 text-base"
        onClick={handleStart}
        disabled={starting || !selectedScript || !selectedPersona}
      >
        {starting ? "Starting..." : "Start Practice Session"}
      </button>
    </div>
  );
}
