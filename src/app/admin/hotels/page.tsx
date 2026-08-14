"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { getAdminHotels, deleteAdminHotel, type AdminHotel } from "@/lib/admin";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  draft: "bg-surface-container-highest text-on-surface-variant",
};

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<AdminHotel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHotels = () => {
    setLoading(true);
    getAdminHotels()
      .then((res) => {
        const data = res.data;
        setHotels(Array.isArray(data) ? data : (data.data ?? []));
      })
      .catch(() => toast.error("Failed to load hotels"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const remove = async (id: string | number) => {
    if (!confirm("Delete this hotel?")) return;
    try {
      await deleteAdminHotel(id);
      setHotels((prev) => prev.filter((h) => h.id !== id));
      toast.success("Hotel deleted");
    } catch {
      toast.error("Failed to delete hotel");
    }
  };

  return (
    <>
      <AdminTopBar title="Properties" subtitle={`${hotels.length} listed properties`} />
      <div className="flex-1 overflow-y-auto p-gutter">
        <div className="flex justify-end mb-6">
          <Link
            href="/admin/hotels/create"
            className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-lg font-label-caps hover:bg-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Hotel
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
          <table className="w-full text-left zebra-table">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-3 font-label-caps text-on-surface-variant">Hotel</th>
                <th className="px-6 py-3 font-label-caps text-on-surface-variant">Location</th>
                <th className="px-6 py-3 font-label-caps text-on-surface-variant">Type</th>
                <th className="px-6 py-3 font-label-caps text-on-surface-variant">Price</th>
                <th className="px-6 py-3 font-label-caps text-on-surface-variant">Status</th>
                <th className="px-6 py-3 font-label-caps text-on-surface-variant">Featured</th>
                <th className="px-6 py-3 font-label-caps text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-admin-data text-primary">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <div className="w-6 h-6 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : hotels.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-on-surface-variant">No hotels yet</td>
                </tr>
              ) : (
                hotels.map((hotel) => (
                  <tr key={hotel.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {toAbsoluteImageUrl(hotel.image) ? (
                          <img src={toAbsoluteImageUrl(hotel.image)!} className="w-10 h-10 rounded-lg object-cover" alt={hotel.title} />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-xl">🏨</div>
                        )}
                        <span className="font-medium">{hotel.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{hotel.location}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{hotel.type}</td>
                    <td className="px-6 py-4">AED {hotel.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLES[hotel.status] ?? STATUS_STYLES.draft}`}>
                        {hotel.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {hotel.featured ? (
                        <span className="flex items-center gap-1 text-secondary text-xs">
                          <span className="material-symbols-outlined text-sm">star</span> Featured
                        </span>
                      ) : (
                        <span className="text-on-surface-variant/50 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/hotels/${hotel.id}/edit`} className="text-primary hover:text-secondary">
                          <span className="material-symbols-outlined">edit</span>
                        </Link>
                        <button onClick={() => remove(hotel.id)} className="text-primary hover:text-error">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}