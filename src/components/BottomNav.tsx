"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav({ onOpenChat }: { onOpenChat?: () => void }) {
  const pathname = usePathname();

  const items = [
    { label: "Explore", href: "/", icon: "explore" },
    { label: "Search", href: "/hotels", icon: "search" },
    { label: "Profile", href: "/dashboard", icon: "person" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-16 pb-safe px-4 bg-surface/80 backdrop-blur-md border-t border-outline-variant z-50">
      {items.slice(0, 1).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center justify-center ${pathname === item.href ? "text-secondary font-bold" : "text-on-surface-variant"}`}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span className="font-label-caps text-[10px]">{item.label}</span>
        </Link>
      ))}
      <Link
        href="/hotels"
        className={`flex flex-col items-center justify-center ${pathname === "/hotels" ? "text-secondary font-bold" : "text-on-surface-variant"}`}
      >
        <span className="material-symbols-outlined">search</span>
        <span className="font-label-caps text-[10px]">Search</span>
      </Link>
      <button onClick={onOpenChat} className="flex flex-col items-center justify-center text-on-surface-variant">
        <span className="material-symbols-outlined">auto_awesome</span>
        <span className="font-label-caps text-[10px]">AI Plan</span>
      </button>
      <Link
        href="/dashboard"
        className={`flex flex-col items-center justify-center ${pathname === "/dashboard" ? "text-secondary font-bold" : "text-on-surface-variant"}`}
      >
        <span className="material-symbols-outlined">person</span>
        <span className="font-label-caps text-[10px]">Profile</span>
      </Link>
    </nav>
  );
}