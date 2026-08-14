"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { getUserWishlistHotels, type WishlistHotel } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";
import { removeFromWishlist } from "@/lib/wishlist";

export default function WishlistPage() {
  const [hotels, setHotels] = useState<WishlistHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | number | null>(null);

  useEffect(() => {
    getUserWishlistHotels()
      .then(setHotels)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (hotelId: string | number) => {
    setRemovingId(hotelId);
    try {
      await removeFromWishlist(String(hotelId));
      setHotels((prev) => prev.filter((h) => (h.hotel_id ?? h.id) !== hotelId));
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove");
    } finally {
      setRemovingId(null);
    }
  };

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
        <h1 className="font-display-lg-mobile md:font-display-lg text-primary">Wishlist</h1>
        <p className="text-on-surface-variant mt-1">{hotels.length} saved hotels</p>
      </div>

      {hotels.length === 0 ? (
        <div className="bg-white border border-outline-variant rounded-xl p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-3 block">favorite</span>
          <p className="text-on-surface-variant">No saved hotels yet</p>
          <Link href="/hotels" className="mt-3 inline-block text-sm text-secondary hover:underline">
            Browse hotels →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {hotels.map((h) => {
            const hotelId = h.hotel_id ?? h.id;
            return (
              <div key={hotelId} className="relative bg-white border border-outline-variant rounded-xl overflow-hidden group">
                <Link href={`/hotels/${h.slug}`} className="block">
                  <div className="h-40 bg-surface-container-high overflow-hidden">
                    {toAbsoluteImageUrl(h.image ?? h.image_url) ? (
                      <img
                        src={toAbsoluteImageUrl(h.image ?? h.image_url)!}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={h.name ?? h.title}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🏨</div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-headline-md text-[18px] text-primary truncate">{h.name ?? h.title}</p>
                    <p className="text-secondary text-sm mt-1">AED {Number(h.price ?? 0).toLocaleString()}/night</p>
                  </div>
                </Link>

                <button
                  onClick={() => handleRemove(hotelId)}
                  disabled={removingId === hotelId}
                  className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-secondary hover:bg-error hover:text-on-error transition disabled:opacity-50 shadow-sm"
                  aria-label="Remove from wishlist"
                >
                  {removingId === hotelId ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}