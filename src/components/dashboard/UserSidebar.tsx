"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { logoutUser } from "@/lib/auth";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: "dashboard" },
  { label: "My Bookings", href: "/dashboard/bookings", icon: "event_available" },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: "favorite" },
  { label: "Profile", href: "/dashboard/profile", icon: "person" },
];

export default function UserSidebar() {
  const pathname = usePathname();
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
    <aside className="hidden md:flex flex-col w-[280px] fixed left-0 top-20 bottom-0 bg-white border-r border-outline-variant z-40">
      <nav className="flex-1 py-6">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-3 transition-all ${
                active
                  ? "bg-secondary-container text-on-secondary-container border-l-4 border-secondary"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-body-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-outline-variant">
        <button onClick={handleLogout} className="flex items-center gap-3 text-on-surface-variant hover:text-error transition-colors">
          <span className="material-symbols-outlined">logout</span>
          <span className="font-label-caps text-label-caps">Logout</span>
        </button>
      </div>
    </aside>
  );
}