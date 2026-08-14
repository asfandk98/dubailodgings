"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { getAdminStats, getAdminBookings, type AdminStats, type AdminBooking } from "@/lib/admin";

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  paid: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-violet-100 text-violet-800",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminBookings({ page: 1, status: "pending" })])
      .then(([statsRes, bookingsRes]) => {
        setStats(statsRes.data);
        setBookings((bookingsRes.data.data ?? []).slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = stats
    ? [
        {
          label: "Total Revenue",
          value: `AED ${Number(stats.revenue).toLocaleString()}`,
          icon: "payments",
          iconBg: "bg-secondary-container",
          iconColor: "text-on-secondary-container",
          trend: null, // no baseline in /admin/stats to compute a % change
        },
        {
          label: "Total Bookings",
          value: stats.bookings,
          icon: "book_online",
          iconBg: "bg-primary-container",
          iconColor: "text-white",
          trend: `${stats.pending} pending`,
        },
        {
          label: "Hotel Partners",
          value: stats.hotels,
          icon: "hotel",
          iconBg: "bg-tertiary-fixed",
          iconColor: "text-on-tertiary-fixed",
          trend: `${stats.active_hotels} active`,
        },
        {
          label: "Total Rooms",
          value: stats.rooms,
          icon: "meeting_room",
          iconBg: "bg-secondary-fixed",
          iconColor: "text-on-secondary-fixed",
          trend: null,
        },
      ]
    : [];

  return (
    <>
      <AdminTopBar title="Dashboard Overview" subtitle="Welcome back. Here is what is happening today." />

      <div className="flex-1 overflow-y-auto p-gutter">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {cards.map((card) => (
            <div key={card.label} className="bg-white p-6 border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${card.iconBg}`}>
                  <span className={`material-symbols-outlined ${card.iconColor}`}>{card.icon}</span>
                </div>
                {card.trend && <span className="text-on-surface-variant font-admin-data text-xs">{card.trend}</span>}
              </div>
              <p className="font-label-caps text-on-surface-variant">{card.label}</p>
              <h3 className="font-headline-md text-headline-md mt-1">{card.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending bookings table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-outline-variant flex flex-col">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
              <h4 className="font-headline-md text-[20px] text-primary">Pending Bookings</h4>
              <Link href="/admin/bookings" className="text-primary font-label-caps hover:underline">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-6 py-3 font-label-caps text-on-surface-variant">Reference</th>
                    <th className="px-6 py-3 font-label-caps text-on-surface-variant">Guest</th>
                    <th className="px-6 py-3 font-label-caps text-on-surface-variant">Property</th>
                    <th className="px-6 py-3 font-label-caps text-on-surface-variant">Status</th>
                    <th className="px-6 py-3 font-label-caps text-on-surface-variant">Action</th>
                  </tr>
                </thead>
                <tbody className="font-admin-data text-primary">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                        No pending bookings
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b, i) => (
                      <tr key={b.id} className={i % 2 === 1 ? "bg-surface-container-low" : ""}>
                        <td className="px-6 py-4">{b.reference ?? `#${b.id}`}</td>
                        <td className="px-6 py-4">{b.user?.name ?? b.guest_name ?? "—"}</td>
                        <td className="px-6 py-4">{b.hotel?.title ?? "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLES[b.status] ?? "bg-gray-100 text-gray-800"}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/admin/bookings?ref=${b.reference ?? b.id}`} className="text-primary hover:text-secondary">
                            <span className="material-symbols-outlined">edit</span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-8">
            <section className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
              <h4 className="font-headline-md text-[20px] text-primary mb-4">Quick Actions</h4>
              <div className="grid grid-cols-3 gap-4">
                <Link href="/admin/hotels/create" className="flex flex-col items-center justify-center gap-2 p-4 border border-outline-variant rounded-lg hover:border-secondary hover:bg-surface-container-low transition-all group">
                  <span className="material-symbols-outlined text-primary group-hover:text-secondary">add_business</span>
                  <span className="font-label-caps text-[10px]">Add Hotel</span>
                </Link>
                <Link href="/admin/bookings" className="flex flex-col items-center justify-center gap-2 p-4 border border-outline-variant rounded-lg hover:border-secondary hover:bg-surface-container-low transition-all group">
                  <span className="material-symbols-outlined text-primary group-hover:text-secondary">event_available</span>
                  <span className="font-label-caps text-[10px]">All Bookings</span>
                </Link>
                <Link href="/admin/blog/create" className="flex flex-col items-center justify-center gap-2 p-4 border border-outline-variant rounded-lg hover:border-secondary hover:bg-surface-container-low transition-all group">
                  <span className="material-symbols-outlined text-primary group-hover:text-secondary">edit_note</span>
                  <span className="font-label-caps text-[10px]">New Post</span>
                </Link>
                <Link href="/admin/hotels" className="flex flex-col items-center justify-center gap-2 p-4 border border-outline-variant rounded-lg hover:border-secondary hover:bg-surface-container-low transition-all group">
                  <span className="material-symbols-outlined text-primary group-hover:text-secondary">hotel</span>
                  <span className="font-label-caps text-[10px]">All Hotels</span>
                </Link>

<Link
  href="/admin/rooms/create"
  className="flex flex-col items-center justify-center gap-2 p-4 border border-outline-variant rounded-lg hover:border-secondary hover:bg-surface-container-low transition-all group"
>
  <span className="material-symbols-outlined text-primary group-hover:text-secondary">
    meeting_room
  </span>
  <span className="font-label-caps text-[10px]">
    Add Room
  </span>
</Link>

              </div>
            </section>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-outline-variant px-gutter py-4 flex justify-between items-center text-on-surface-variant">
        <p className="font-body-sm text-[12px]">© {new Date().getFullYear()} DUBAILODGINGS.COM. Luxury Reimagined.</p>
      </footer>
    </>
  );
}