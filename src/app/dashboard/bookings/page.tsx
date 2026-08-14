"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserBookings, type UserBooking } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

const STATUS_STYLES: Record<string, { label: string; classes: string; icon: string }> = {
  confirmed: { label: "Confirmed", classes: "bg-green-100 text-green-800", icon: "check_circle" },
  pending: { label: "Pending", classes: "bg-amber-100 text-amber-800", icon: "schedule" },
  cancelled: { label: "Cancelled", classes: "bg-red-100 text-red-800", icon: "cancel" },
  cancellation_requested: { label: "Cancel Req.", classes: "bg-orange-100 text-orange-800", icon: "error" },
};

const FILTERS = ["all", "confirmed", "pending", "cancellation_requested", "cancelled"] as const;

export default function BookingsPage() {
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserBookings()
      .then(setBookings)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-container-max">
      <div>
        <h1 className="font-display-lg-mobile md:font-display-lg text-primary">My Bookings</h1>
        <p className="text-on-surface-variant mt-1">All your past and upcoming reservations</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => {
          const label = f === "all" ? "All" : (STATUS_STYLES[f]?.label ?? f);
          const count = f === "all" ? bookings.length : bookings.filter((b) => b.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition border whitespace-nowrap shrink-0 ${
                filter === f ? "bg-primary text-on-primary border-primary" : "bg-white text-on-surface-variant border-outline-variant hover:border-primary"
              }`}
            >
              {label}
              {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-outline-variant rounded-xl p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-3 block">event_available</span>
          <p className="text-on-surface-variant">No bookings found</p>
          <Link href="/hotels" className="mt-3 inline-block text-sm text-secondary hover:underline">
            Browse hotels →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const cfg = STATUS_STYLES[b.status] ?? STATUS_STYLES.pending;
            const isPast = new Date(b.check_out) < new Date();

            return (
              <Link
                key={b.id}
                href={`/dashboard/bookings/${b.id}`}
                className="block bg-white border border-outline-variant rounded-xl p-4 hover:border-secondary transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg bg-surface-container-high overflow-hidden shrink-0">
                    {toAbsoluteImageUrl(b.hotel_image) ? (
                      <img src={toAbsoluteImageUrl(b.hotel_image)!} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🏨</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="min-w-0">
                        <p className="text-primary font-semibold text-sm truncate">{b.hotel_name}</p>
                        <p className="text-on-surface-variant text-xs mt-0.5 truncate">{b.room_name}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${cfg.classes}`}>
                        <span className="material-symbols-outlined text-[14px]">{cfg.icon}</span>
                        <span className="hidden sm:inline">{cfg.label}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-on-surface-variant">
                      <span>{b.check_in} → {b.check_out}</span>
                      <span>{b.nights} night{b.nights !== 1 ? "s" : ""}</span>
                      <span className="hidden sm:inline">
                        {b.adults ?? 1} adult{(b.adults ?? 1) !== 1 ? "s" : ""}
                        {b.children ? `, ${b.children} child${b.children !== 1 ? "ren" : ""}` : ""}
                      </span>
                      {isPast && <span className="text-on-surface-variant/50">Past stay</span>}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-secondary font-bold text-sm">AED {Number(b.total_price).toLocaleString()}</p>
                    <p className="text-on-surface-variant/50 text-[10px] mt-0.5 hidden sm:block">Ref: {b.reference?.slice(-8)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}