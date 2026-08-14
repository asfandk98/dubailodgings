"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import AdminTopBar from "@/components/admin/AdminTopBar";
import {
  getHotelsForRoomSelect,
  getRoomsForHotel,
  getSeasonalPricesForRoom,
  createSeasonalPrice,
  deleteSeasonalPrice,
  type AdminHotel,
  type AvailabilityRoom,
  type SeasonalPriceRow,
} from "@/lib/admin";

export default function SeasonalPricesPage() {
  const [hotels, setHotels] = useState<AdminHotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [rooms, setRooms] = useState<AvailabilityRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [prices, setPrices] = useState<SeasonalPriceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ price: "", start_date: "", end_date: "" });

  useEffect(() => {
    getHotelsForRoomSelect()
      .then((res) => {
        const data = res.data;
        setHotels(Array.isArray(data) ? data : (data.data ?? []));
      })
      .catch(() => toast.error("Failed to load hotels"));
  }, []);

  useEffect(() => {
    if (!selectedHotel) {
      setRooms([]);
      setSelectedRoom("");
      setPrices([]);
      return;
    }
    getRoomsForHotel(selectedHotel)
      .then((res) => {
        setRooms(res.data);
        setSelectedRoom("");
        setPrices([]);
      })
      .catch(() => toast.error("Failed to load rooms"));
  }, [selectedHotel]);

  useEffect(() => {
    if (!selectedRoom) {
      setPrices([]);
      return;
    }
    setLoading(true);
    getSeasonalPricesForRoom(selectedRoom)
      .then((res) => setPrices(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error("Failed to load prices"))
      .finally(() => setLoading(false));
  }, [selectedRoom]);

  const selectedRoomData = rooms.find((r) => String(r.id) === selectedRoom);

  const handleSave = async () => {
    if (!form.price || !form.start_date || !form.end_date) {
      toast.error("All fields are required");
      return;
    }
    if (new Date(form.end_date) <= new Date(form.start_date)) {
      toast.error("End date must be after start date");
      return;
    }
    setSaving(true);
    try {
      const { data } = await createSeasonalPrice(selectedRoom, form);
      setPrices((prev) => [...prev, data]);
      setForm({ price: "", start_date: "", end_date: "" });
      setShowForm(false);
      toast.success("Seasonal price added!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Delete this seasonal price?")) return;
    try {
      await deleteSeasonalPrice(id);
      setPrices((prev) => prev.filter((p) => p.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—");

  const discount = (original?: number | string, seasonal?: number | string) => {
    if (!original || !seasonal) return null;
    const pct = Math.round((1 - Number(seasonal) / Number(original)) * 100);
    return pct > 0 ? pct : null;
  };

  return (
    <>
      <AdminTopBar title="Seasonal Prices" subtitle="Set special pricing for rooms during specific date ranges" />
      <div className="flex-1 overflow-y-auto p-gutter">
        <div className="space-y-6 max-w-3xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-on-surface-variant">Select Hotel</label>
              <select value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)} className="admin-input">
                <option value="">— Choose hotel —</option>
                {hotels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-on-surface-variant">Select Room</label>
              <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} disabled={!selectedHotel || rooms.length === 0} className="admin-input disabled:opacity-40">
                <option value="">— Choose room —</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — AED {r.price}/night
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedRoom && (
            <>
              {selectedRoomData && (
                <div className="bg-white border border-outline-variant rounded-xl px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-primary font-medium">{selectedRoomData.name}</p>
                    <p className="text-on-surface-variant text-xs mt-0.5">Base price: AED {selectedRoomData.price}/night</p>
                  </div>
                  <button onClick={() => setShowForm((p) => !p)} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition">
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add Seasonal Price
                  </button>
                </div>
              )}

              {showForm && (
                <div className="bg-white border border-secondary rounded-xl p-5 space-y-4">
                  <h2 className="text-sm font-semibold text-primary">New Seasonal Price</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-on-surface-variant font-medium">Price (AED) *</label>
                      <input type="number" min={0} value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="e.g. 3500" className="admin-input" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-on-surface-variant font-medium">Start Date *</label>
                      <input type="date" value={form.start_date} onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))} className="admin-input" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-on-surface-variant font-medium">End Date *</label>
                      <input type="date" value={form.end_date} onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))} className="admin-input" />
                    </div>
                  </div>

                  {form.price && selectedRoomData && discount(selectedRoomData.price, form.price) !== null && (
                    <p className="text-xs text-green-700">✓ {discount(selectedRoomData.price, form.price)}% discount from base price</p>
                  )}
                  {form.price && selectedRoomData && Number(form.price) > Number(selectedRoomData.price) && (
                    <p className="text-xs text-amber-700">⚠ Price is higher than base price (peak season surcharge)</p>
                  )}

                  <div className="flex gap-3">
                    <button onClick={handleSave} disabled={saving} className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition disabled:opacity-50">
                      {saving ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setForm({ price: "", start_date: "", end_date: "" });
                      }}
                      className="text-on-surface-variant hover:text-primary text-sm transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white border border-outline-variant rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-outline-variant">
                  <h2 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Seasonal Prices ({prices.length})</h2>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-6 h-6 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : prices.length === 0 ? (
                  <div className="text-center py-12 text-on-surface-variant text-sm">No seasonal prices yet. Add one above.</div>
                ) : (
                  <table className="w-full text-sm zebra-table">
                    <thead>
                      <tr className="border-b border-outline-variant text-on-surface-variant text-xs uppercase tracking-wider">
                        <th className="text-left px-5 py-3">Period</th>
                        <th className="text-left px-5 py-3">Seasonal Price</th>
                        <th className="text-left px-5 py-3">vs Base</th>
                        <th className="text-right px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="font-admin-data">
                      {prices.map((p) => {
                        const disc = discount(selectedRoomData?.price, p.price);
                        const isSurcharge = selectedRoomData && Number(p.price) > Number(selectedRoomData.price);
                        return (
                          <tr key={p.id}>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary text-lg shrink-0">sell</span>
                                <div>
                                  <p className="text-primary font-medium">{fmt(p.start_date)}</p>
                                  <p className="text-on-surface-variant text-xs">to {fmt(p.end_date)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-primary font-semibold">
                              AED {p.price}
                              <span className="text-on-surface-variant font-normal text-xs">/night</span>
                            </td>
                            <td className="px-5 py-4">
                              {disc !== null && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">-{disc}% off</span>}
                              {isSurcharge && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">+surcharge</span>}
                              {!disc && !isSurcharge && <span className="text-on-surface-variant text-xs">same</span>}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex justify-end">
                                <button onClick={() => handleDelete(p.id)} className="text-on-surface-variant hover:text-error transition">
                                  <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}