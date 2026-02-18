"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Session {
  id: number;
  script_title: string;
  persona_name: string;
  is_active: boolean;
  started_at: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/roleplay/sessions")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => setSessions(Array.isArray(data) ? data.slice(0, 5) : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {session?.user?.name?.split(" ")[0]}!</h1>
        <p>Practice makes perfect. Pick up where you left off or start fresh.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/scripts">
          <div className="card text-center cursor-pointer hover:shadow-md transition-shadow">
            <span className="text-4xl block mb-3">📋</span>
            <h3 className="font-bold">Browse Scripts</h3>
            <p className="text-[var(--text-secondary)] text-sm mt-1">
              Explore call scripts filtered by industry, company size, and location
            </p>
          </div>
        </Link>
        <Link href="/roleplay">
          <div className="card text-center cursor-pointer hover:shadow-md transition-shadow">
            <span className="text-4xl block mb-3">🎭</span>
            <h3 className="font-bold">Start Roleplay</h3>
            <p className="text-[var(--text-secondary)] text-sm mt-1">
              Practice with AI personas and get real-time coaching feedback
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Recent Practice Sessions</h2>
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="card text-center text-[var(--text-secondary)]">
            <p>No practice sessions yet. Start your first roleplay!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {sessions.map((s) => (
              <Link key={s.id} href={`/roleplay/session/${s.id}`}>
                <div className="card flex justify-between items-center py-3.5 px-5 cursor-pointer hover:shadow-sm transition-shadow">
                  <div>
                    <strong>{s.script_title}</strong>
                    <span className="text-[var(--text-secondary)] ml-2 text-[13px]">
                      with {s.persona_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${s.is_active ? "badge-easy" : "badge-size"}`}>
                      {s.is_active ? "Active" : "Completed"}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {new Date(s.started_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
