"use client";

import { useSession, signOut } from "next-auth/react";

export default function TopBar() {
  const { data: session } = useSession();

  return (
    <header className="h-[60px] bg-white border-b border-[var(--border)] flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-[var(--text)]">
          {session?.user?.name}
        </span>
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
