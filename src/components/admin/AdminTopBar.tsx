"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { logoutUser } from "@/lib/auth";

export default function AdminTopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout request failed, signing out locally");
    }
    localStorage.clear();
    window.dispatchEvent(new Event("auth-change"));
    router.replace("/login");
  };

  return (
    <header className="h-20 flex justify-between items-center px-gutter bg-surface border-b border-outline-variant sticky top-0 z-50">
      <div>
        <h2 className="font-headline-md text-headline-md text-primary">{title}</h2>
        {subtitle && <p className="font-body-sm text-body-sm text-on-surface-variant">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <button onClick={handleLogout} className="text-on-surface-variant hover:text-error transition-colors" aria-label="Logout">
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </header>
  );
}