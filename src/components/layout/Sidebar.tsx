"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { path: "/", label: "Dashboard", icon: "📊" },
  { path: "/scripts", label: "Scripts", icon: "📋" },
  { path: "/roleplay", label: "Roleplay", icon: "🎭" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 h-screen bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] flex flex-col sticky left-0 top-0">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <span className="text-2xl">📞</span>
        <span className="text-lg font-bold text-white">SDR Trainer</span>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? pathname === "/"
              : pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-[var(--sidebar-active)] text-white"
                  : "text-[var(--sidebar-text)] hover:bg-white/5"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
