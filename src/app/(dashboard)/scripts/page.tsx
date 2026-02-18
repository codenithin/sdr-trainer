"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Script {
  id: number;
  title: string;
  description: string;
  industry: string;
  company_size: string;
  target_location: string;
  target_role: string;
}

interface Filters {
  industries: string[];
  company_sizes: string[];
  locations: string[];
}

function FilterGroup({
  label,
  options,
  selected,
  onSelect,
  formatLabel,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  formatLabel?: (v: string) => string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <div className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide whitespace-nowrap min-w-[110px]">
        {label}
      </div>
      <button
        onClick={() => onSelect("")}
        className={`px-5 py-2 rounded-full border text-sm font-medium capitalize transition-all ${
          selected === ""
            ? "bg-[var(--primary)] text-white border-[var(--primary)] font-semibold"
            : "bg-white text-[var(--text)] border-[var(--border)]"
        }`}
      >
        All
      </button>
      {(options || []).map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(selected === opt ? "" : opt)}
          className={`px-5 py-2 rounded-full border text-sm font-medium capitalize transition-all ${
            selected === opt
              ? "bg-[var(--primary)] text-white border-[var(--primary)] font-semibold"
              : "bg-white text-[var(--text)] border-[var(--border)]"
          }`}
        >
          {formatLabel ? formatLabel(opt) : opt}
        </button>
      ))}
    </div>
  );
}

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [filters, setFilters] = useState<Filters>({ industries: [], company_sizes: [], locations: [] });
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/scripts/filters")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setFilters)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedIndustry) params.set("industry", selectedIndustry);
    if (selectedSize) params.set("company_size", selectedSize);
    if (selectedLocation) params.set("location", selectedLocation);
    if (search) params.set("search", search);

    fetch(`/api/scripts?${params}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setScripts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedIndustry, selectedSize, selectedLocation, search]);

  const activeCount = [selectedIndustry, selectedSize, selectedLocation].filter(Boolean).length;

  return (
    <div>
      <div className="page-header flex flex-wrap justify-between items-start gap-3">
        <div>
          <h1>Call Scripts</h1>
          <p>Browse and filter scripts by industry, company size, and location</p>
        </div>
        <Link href="/scripts/generate">
          <button className="btn btn-primary whitespace-nowrap">+ Generate from LinkedIn</button>
        </Link>
      </div>

      <div className="card p-5 mb-6 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-sm">Filters</span>
          {activeCount > 0 && (
            <button
              onClick={() => { setSelectedIndustry(""); setSelectedSize(""); setSelectedLocation(""); }}
              className="text-[var(--primary)] text-[13px] font-semibold"
            >
              Clear all ({activeCount})
            </button>
          )}
        </div>
        <div className="flex flex-col">
          <FilterGroup label="Industry" options={filters.industries} selected={selectedIndustry} onSelect={setSelectedIndustry} formatLabel={(v) => v.replace(/_/g, " ")} />
          <FilterGroup label="Company Size" options={filters.company_sizes} selected={selectedSize} onSelect={setSelectedSize} formatLabel={(v) => v.replace(/_/g, " ")} />
          <FilterGroup label="Location" options={filters.locations} selected={selectedLocation} onSelect={setSelectedLocation} />
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide whitespace-nowrap min-w-[90px]">Search</div>
            <input
              type="text"
              placeholder="Search scripts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3.5 py-2 rounded-lg border border-[var(--border)] text-sm w-full max-w-[360px] outline-none"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading scripts...</div>
      ) : scripts.length === 0 ? (
        <div className="empty-state"><h3>No scripts found</h3><p>Try adjusting your filters</p></div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {scripts.map((script) => (
            <div key={script.id} className="card flex flex-col gap-3">
              <div className="flex gap-2">
                <span className="badge badge-industry">{script.industry.replace(/_/g, " ")}</span>
                <span className="badge badge-size">{script.company_size.replace(/_/g, " ")}</span>
              </div>
              <h3 className="text-base font-bold">{script.title}</h3>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{script.description}</p>
              <div className="flex gap-4 text-[13px] text-[var(--text-secondary)]">
                <span>🎯 {script.target_role}</span>
                <span>📍 {script.target_location}</span>
              </div>
              <div className="flex gap-2 mt-1">
                <Link href={`/scripts/${script.id}`}><button className="btn btn-primary btn-sm">View Script</button></Link>
                <Link href={`/scripts/${script.id}/edit`}><button className="btn btn-sm bg-[#f0f4ff] text-[var(--primary)] border border-[var(--primary)]">Edit</button></Link>
                <Link href={`/roleplay?script=${script.id}`}><button className="btn btn-secondary btn-sm">Practice</button></Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
