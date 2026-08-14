"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { getAdminBookings, updateBookingStatus, type AdminBookingDetail } from "@/lib/admin";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  paid: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-violet-100 text-violet-800",
};

const STATUSES = ["", "pending", "confirmed", "paid", "cancelled", "refunded"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBookingDetail[]>([]);
  const [meta, setMeta] = useState<{ last_page?: number }>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminBookingDetail | null>(null);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const fetchBookings = () => {
    setLoading(true);
    getAdminBookings({ page, search: search || undefined, status: status || undefined })
      .then((res) => {
        setBookings(res.data.data as AdminBookingDetail[]);
        setMeta(res.data.meta ?? {});
      })
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, page]);

  const openDetail = (booking: AdminBookingDetail) => {
    setSelected(booking);
    setNewStatus(booking.status);
  };

  const updateStatus = async () => {
    if (!selected || !newStatus || newStatus === selected.status) return;
    setUpdating(true);
    try {
      const { data: updated } = await updateBookingStatus(selected.id, newStatus);
      setSelected(updated);
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update");
    } finally {
      setUpdating(false);
    }
  };

  const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—");

  return (
    <>
      <AdminTopBar title="Bookings" subtitle="Track and manage all guest reservations" />
      <div className="flex-1 overflow-y-auto p-gutter">
        <div className="flex items-center gap-3 flex-wrap mb-6">
          <div className="relative flex-1 min-w-[220px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search reference or guest name…"
              className="admin-input pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm border transition capitalize ${
                  status === s ? "bg-primary text-on-primary border-primary" : "border-outline-variant text-on-surface-variant hover:border-primary"
                }`}
              >
                {s || "All"}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
          <table className="w-full text-left zebra-table">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 font-label-caps text-on-surface-variant">Reference</th>
                <th className="px-6 py-4 font-label-caps text-on-surface-variant">Guest</th>
                <th className="px-6 py-4 font-label-caps text-on-surface-variant">Hotel</th>
                <th className="px-6 py-4 font-label-caps text-on-surface-variant">Check-in</th>
                <th className="px-6 py-4 font-label-caps text-on-surface-variant">Nights</th>
                <th className="px-6 py-4 font-label-caps text-on-surface-variant">Amount</th>
                <th className="px-6 py-4 font-label-caps text-on-surface-variant">Status</th>
                <th className="px-6 py-4 font-label-caps text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-admin-data text-primary">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <div className="w-6 h-6 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-on-surface-variant">No bookings found</td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="px-6 py-4 text-xs">{b.reference ?? `#${b.id}`}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{b.user?.name ?? b.guest_name ?? "—"}</p>
                      <p className="text-xs text-on-surface-variant">{b.user?.email ?? b.guest_email ?? ""}</p>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{b.hotel?.title ?? "—"}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{fmt(b.check_in)}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{b.nights ?? "—"}</td>
                    <td className="px-6 py-4 font-medium">AED {Number(b.total_price ?? 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLES[b.status] ?? "bg-gray-100 text-gray-800"}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openDetail(b)} className="text-primary hover:text-secondary transition">
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {(meta.last_page ?? 0) > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: meta.last_page ?? 0 }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm transition ${p === page ? "bg-primary text-on-primary" : "bg-white border border-outline-variant text-on-surface-variant hover:border-primary"}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-outline-variant">
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-0.5">Booking</p>
                  <h2 className="text-lg font-bold text-primary">#{selected.reference ?? selected.id}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[selected.status]}`}>{selected.status}</span>
                  <button onClick={() => setSelected(null)} className="text-on-surface-variant hover:text-primary transition">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-5">
                <DetailSection title="Guest Information">
                  <DetailRow label="Name" value={selected.user?.name ?? selected.guest_name ?? "—"} />
                  <DetailRow label="Email" value={selected.user?.email ?? selected.guest_email ?? "—"} />
                  <DetailRow label="Phone" value={selected.user?.phone ?? selected.guest_phone ?? "—"} />
                </DetailSection>

                <DetailSection title="Stay Details">
                  <DetailRow label="Hotel" value={selected.hotel?.title ?? "—"} />
                  <DetailRow label="Room" value={selected.room?.name ?? "—"} />
                  <DetailRow label="Check-in" value={fmt(selected.check_in)} />
                  <DetailRow label="Check-out" value={fmt(selected.check_out)} />
                  <DetailRow label="Nights" value={selected.nights ?? "—"} />
                  <DetailRow label="Guests" value={`${selected.adults ?? 1} adult(s), ${selected.children ?? 0} child(ren)`} />
                </DetailSection>

                <DetailSection title="Price Breakdown">
                  <DetailRow label="Room price / night" value={`AED ${Number(selected.room_price ?? selected.room?.price ?? 0).toLocaleString()}`} />
                  <DetailRow label={`Subtotal (${selected.nights ?? 1} night)`} value={`AED ${Number(selected.subtotal ?? 0).toLocaleString()}`} />
                  {selected.tax != null && <DetailRow label="Tax (5%)" value={`AED ${Number(selected.tax).toLocaleString()}`} />}
                  {selected.tourism_fee != null && <DetailRow label="Tourism Fee" value={`AED ${Number(selected.tourism_fee).toLocaleString()}`} />}
                  <div className="flex justify-between pt-2 border-t border-outline-variant font-semibold">
                    <span className="text-primary">Total</span>
                    <span className="text-primary">AED {Number(selected.total_price ?? 0).toLocaleString()}</span>
                  </div>
                </DetailSection>

                <DetailSection title="Update Status">
                  <div className="flex items-center gap-3">
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="flex-1 admin-input">
                      {["pending", "confirmed", "paid", "cancelled", "refunded"].map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={updateStatus}
                      disabled={updating || newStatus === selected.status}
                      className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary transition disabled:opacity-40"
                    >
                      {updating ? "Saving…" : "Update"}
                    </button>
                  </div>
                </DetailSection>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-low rounded-lg p-4 space-y-2.5">
      <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-3">{title}</p>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-on-surface-variant">{label}</span>
      <span className="text-primary font-medium text-right max-w-[60%] truncate">{value}</span>
    </div>
  );
}