"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const COMPANY_SIZES = ["startup", "mid_market", "enterprise"];
const INDUSTRIES = [
  "saas", "technology", "manufacturing", "healthcare", "financial_services",
  "retail", "energy", "government", "education", "logistics",
];

export default function ScriptGeneratorPage() {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [form, setForm] = useState({
    prospect_name: "",
    prospect_title: "",
    prospect_company: "",
    industry: "",
    company_size: "",
    location: "",
    linkedin_summary: "",
    additional_context: "",
  });

  const updateField = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleGenerate = async () => {
    if (!form.prospect_name || !form.prospect_title || !form.prospect_company) {
      setError("Please fill in prospect name, title, and company.");
      return;
    }
    setError("");
    setGenerating(true);
    try {
      const res = await fetch("/api/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, linkedin_url: linkedinUrl }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to generate script");
      }
      const data = await res.json();
      router.push(`/scripts/${data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate script. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Generate Call Script</h1>
        <p>Enter prospect details from their LinkedIn profile to generate a personalized cold call script</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* Left - LinkedIn + Prospect Info */}
        <div className="flex flex-col gap-4">
          {/* LinkedIn URL */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🔗</span>
              <span className="font-bold text-[15px] flex-1">LinkedIn Profile</span>
            </div>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-3 mt-0">
              Paste the LinkedIn URL for reference, then fill in the prospect details below.
              LinkedIn blocks automated scraping, so you&apos;ll need to enter the key details manually.
            </p>
            <input
              className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] text-sm outline-none"
              placeholder="https://www.linkedin.com/in/..."
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
          </div>

          {/* Prospect Details */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">👤</span>
              <span className="font-bold text-[15px] flex-1">Prospect Details</span>
              <span className="text-[11px] text-red-600 font-semibold">* Required</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-1">
              <div className="mb-3">
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">Full Name *</label>
                <input
                  className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] text-sm outline-none"
                  placeholder="e.g. Priya Sharma"
                  value={form.prospect_name}
                  onChange={(e) => updateField("prospect_name", e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">Job Title / Role *</label>
                <input
                  className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] text-sm outline-none"
                  placeholder="e.g. VP of Procurement"
                  value={form.prospect_title}
                  onChange={(e) => updateField("prospect_title", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-1">
              <div className="mb-3">
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">Company *</label>
                <input
                  className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] text-sm outline-none"
                  placeholder="e.g. Acme Corp"
                  value={form.prospect_company}
                  onChange={(e) => updateField("prospect_company", e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">Location</label>
                <input
                  className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] text-sm outline-none"
                  placeholder="e.g. US - West Coast"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-1">
              <div className="mb-3">
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">Industry</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] text-sm outline-none bg-white"
                  value={form.industry}
                  onChange={(e) => updateField("industry", e.target.value)}
                >
                  <option value="">Select industry...</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">Company Size</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] text-sm outline-none bg-white"
                  value={form.company_size}
                  onChange={(e) => updateField("company_size", e.target.value)}
                >
                  <option value="">Select size...</option>
                  {COMPANY_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Context */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📋</span>
              <span className="font-bold text-[15px] flex-1">Additional Context</span>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">LinkedIn About / Summary</label>
              <textarea
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] text-sm outline-none min-h-[100px] font-[inherit]"
                placeholder="Paste their LinkedIn 'About' section or headline here. This helps the AI personalize the script to their experience and priorities..."
                value={form.linkedin_summary}
                onChange={(e) => updateField("linkedin_summary", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">Additional Context / Notes</label>
              <textarea
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] text-sm outline-none min-h-[80px] font-[inherit]"
                placeholder="Any additional context — recent posts, mutual connections, company news, specific pain points you know about..."
                value={form.additional_context}
                onChange={(e) => updateField("additional_context", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right - Preview & Generate */}
        <div className="sticky top-[88px]">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">✨</span>
              <span className="font-bold text-[15px] flex-1">AI Script Generator</span>
            </div>

            <div className="bg-[#f9fafb] rounded-[10px] p-3.5 mb-4">
              {[
                { label: "Prospect", value: `${form.prospect_name || "\u2014"} ${form.prospect_title ? `(${form.prospect_title})` : ""}` },
                { label: "Company", value: form.prospect_company || "\u2014" },
                { label: "Industry", value: form.industry ? form.industry.replace(/_/g, " ") : "\u2014" },
                { label: "Size", value: form.company_size ? form.company_size.replace(/_/g, " ") : "\u2014" },
                { label: "Location", value: form.location || "\u2014" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-start py-1.5 text-[13px] border-b border-[#f0f0f0]">
                  <span className="text-[var(--text-secondary)] font-semibold text-xs min-w-[70px]">{item.label}</span>
                  <span className="text-right font-medium capitalize">{item.value}</span>
                </div>
              ))}
              {linkedinUrl && (
                <div className="flex justify-between items-start py-1.5 text-[13px] border-b border-[#f0f0f0]">
                  <span className="text-[var(--text-secondary)] font-semibold text-xs min-w-[70px]">LinkedIn</span>
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[13px] text-[var(--primary)] break-all"
                  >
                    {linkedinUrl}
                  </a>
                </div>
              )}
            </div>

            <div className="bg-[#f0f4ff] rounded-[10px] p-3.5 mb-4">
              <h4 className="m-0 mb-2 text-sm">What you&apos;ll get:</h4>
              <ul className="m-0 pl-[18px] text-[13px] leading-[1.8] text-[var(--text-secondary)]">
                <li>Personalized opening referencing their role & company</li>
                <li>Industry-specific social proof & discovery questions</li>
                <li>Tailored value proposition tied to their pain points</li>
                <li>Role-specific objection handling (3-4 objections)</li>
                <li>Closing script with meeting ask</li>
                <li>Coaching tips & talking points per section</li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-3.5 py-2.5 rounded-lg text-[13px] font-medium mb-3 border border-red-300">
                {error}
              </div>
            )}

            <button
              className="btn btn-primary w-full py-3.5 text-[15px] font-bold"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating script with AI... (15-30s)
                </span>
              ) : (
                "Generate Call Script"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
