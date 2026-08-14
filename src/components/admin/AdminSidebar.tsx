"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface AuthUser {
  name?: string;
}

interface NavLeaf {
  label: string;
  href: string;
}
interface NavItem {
  label: string;
  href?: string;
  icon: string;
  children?: NavLeaf[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/admin/dashboard", icon: "dashboard" },
  { label: "Properties", href: "/admin/hotels", icon: "hotel" },
  {
    label: "Rooms",
    icon: "meeting_room",
    children: [
      { label: "Add Room", href: "/admin/rooms/create" },
      { label: "Availability", href: "/admin/rooms/availability" },
      { label: "Seasonal Prices", href: "/admin/rooms/seasonal-prices" },
    ],
  },
  { label: "Bookings", href: "/admin/bookings", icon: "event_available" },
  {
    label: "Blog",
    icon: "article",
    children: [
      { label: "All Posts", href: "/admin/blog" },
      { label: "New Post", href: "/admin/blog/create" },
      { label: "Categories", href: "/admin/blog/categories" },
    ],
  },
  { label: "Users", href: "/admin/users", icon: "group" },
];

const SECONDARY_ITEMS = [
  { label: "Settings", href: "/admin/settings", icon: "settings" },
  { label: "Support", href: "/admin/support", icon: "help" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    NAV_ITEMS.forEach((item) => {
      if (item.children?.some((c) => pathname.startsWith(c.href))) initial[item.label] = true;
    });
    return initial;
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore malformed cache
    }
  }, []);

  const toggle = (label: string) => setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <aside className="h-full w-[280px] fixed left-0 top-0 z-[60] bg-surface shadow-2xl flex flex-col py-6 border-r border-outline-variant">
      <div className="px-6 mb-10">
        <Link href="/" className="font-display-lg-mobile text-display-lg-mobile text-primary tracking-tight block">
          DUBAILODGINGS.COM
        </Link>
        <p className="font-label-caps text-label-caps text-on-surface-variant mt-2">ADMIN CONSOLE</p>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          if (item.children) {
            const isExpanded = !!expanded[item.label];
            const active = item.children.some((c) => pathname.startsWith(c.href));
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggle(item.label)}
                  className={`w-full flex items-center justify-between gap-4 px-4 py-3 transition-all ${
                    active ? "text-primary font-semibold" : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span className="font-body-md">{item.label}</span>
                  </div>
                  <span className={`material-symbols-outlined text-sm transition-transform ${isExpanded ? "rotate-180" : ""}`}>expand_more</span>
                </button>
                {isExpanded && (
                  <div className="ml-4">
                    {item.children.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block pl-8 pr-4 py-2.5 text-sm transition-colors ${
                            childActive ? "text-secondary font-semibold" : "text-on-surface-variant hover:text-primary"
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex items-center gap-4 px-4 py-3 active:scale-95 transition-all ${
                active
                  ? "bg-secondary-container text-on-secondary-container border-l-4 border-secondary"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-body-md">{item.label}</span>
            </Link>
          );
        })}

        <div className="my-4 border-t border-outline-variant mx-4" />

        {SECONDARY_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-body-md">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="px-6 pt-6 mt-auto border-t border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined">account_circle</span>
          </div>
          <div>
            <p className="font-admin-data text-admin-data text-primary">{user?.name ?? "Admin User"}</p>
            <p className="text-[11px] text-on-surface-variant">System Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}