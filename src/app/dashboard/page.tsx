"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserBookings, getUserWishlistHotels, type UserBooking, type WishlistHotel } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

interface AuthUser {
  name?: string;
}

const STATUS_STYLES: Record<string, { label: string; classes: string; icon: string }> = {
  confirmed: { label: "Confirmed", classes: "bg-green-100 text-green-800", icon: "check_circle" },
  pending: { label: "Pending", classes: "bg-amber-100 text-amber-800", icon: "schedule" },
  cancelled: { label: "Cancelled", classes: "bg-red-100 text-red-800", icon: "cancel" },
  cancellation_requested: { label: "Cancel Req.", classes: "bg-orange-100 text-orange-800", icon: "error" },
};

export default function DashboardOverview() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [wishlist, setWishlist] = useState<WishlistHotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore malformed cache
    }

    Promise.all([getUserBookings(), getUserWishlistHotels()])
      .then(([b, w]) => {
        setBookings(b);
        setWishlist(w);
      })
      .finally(() => setLoading(false));
  }, []);

  const upcoming = bookings.filter((b) => new Date(b.check_in) >= new Date() && b.status === "confirmed");
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: "event_available" },
    { label: "Confirmed", value: confirmedCount, icon: "check_circle" },
    { label: "Pending", value: pendingCount, icon: "schedule" },
    { label: "Saved Hotels", value: wishlist.length, icon: "favorite" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-container-max">
      <div>
        <h1 className="font-display-lg-mobile md:font-display-lg text-primary">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-on-surface-variant mt-1">Here&apos;s a summary of your activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-outline-variant rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="font-label-caps text-label-caps text-on-surface-variant">{s.label}</p>
              <span className="material-symbols-outlined text-secondary text-lg">{s.icon}</span>
            </div>
            <p className="font-headline-md text-headline-md text-primary">{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline-md text-headline-md text-primary">Upcoming Stays</h2>
          <Link href="/dashboard/bookings" className="text-sm text-secondary hover:underline">
            View all →
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="bg-white border border-outline-variant rounded-xl p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-3 block">event_available</span>
            <p className="text-on-surface-variant text-sm">No upcoming stays</p>
            <Link href="/hotels" className="mt-3 inline-block text-sm text-secondary hover:underline">
              Browse hotels →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 3).map((b) => {
              const cfg = STATUS_STYLES[b.status] ?? STATUS_STYLES.pending;
              return (
                <Link
                  key={b.id}
                  href={`/dashboard/bookings/${b.id}`}
                  className="flex items-center gap-4 bg-white border border-outline-variant rounded-xl p-4 hover:border-secondary transition-colors"
                >
                  <div className="w-14 h-14 rounded-lg bg-surface-container-high overflow-hidden shrink-0">
                    {toAbsoluteImageUrl(b.hotel_image) ? (
                      <img src={toAbsoluteImageUrl(b.hotel_image)!} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">🏨</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-primary text-sm font-semibold truncate">{b.hotel_name}</p>
                    <p className="text-on-surface-variant text-xs mt-0.5 truncate">
                      {b.check_in} → {b.check_out} · {b.nights} night{b.nights !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${cfg.classes}`}>
                    <span className="material-symbols-outlined text-[14px]">{cfg.icon}</span>
                    {cfg.label}
                  </div>
                  <p className="text-secondary font-bold text-sm shrink-0">AED {Number(b.total_price).toLocaleString()}</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {wishlist.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-md text-headline-md text-primary">Saved Hotels</h2>
            <Link href="/dashboard/wishlist" className="text-sm text-secondary hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {wishlist.slice(0, 4).map((h) => (
              <Link
                key={h.id}
                href={`/hotels/${h.slug}`}
                className="bg-white border border-outline-variant rounded-lg overflow-hidden hover:border-secondary transition-colors block"
              >
                <div className="h-24 bg-surface-container-high overflow-hidden">
                  {toAbsoluteImageUrl(h.image ?? h.image_url) ? (
                    <img src={toAbsoluteImageUrl(h.image ?? h.image_url)!} className="w-full h-full object-cover" alt={h.name ?? h.title} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🏨</div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-primary text-xs font-semibold truncate">{h.name ?? h.title}</p>
                  <p className="text-on-surface-variant text-[10px] mt-0.5">AED {Number(h.price ?? 0).toLocaleString()}/night</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}