import Link from "next/link";
import type { NearbyHotel } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

export default function NearbyHotels({ hotels }: { hotels: NearbyHotel[] }) {
  if (!hotels || hotels.length === 0) return null;

  return (
    <section className="max-w-container-max mx-auto px-gutter mt-section-gap-lg">
      <h3 className="font-headline-md text-headline-md mb-8">Nearby Hotels</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hotels.slice(0, 3).map((h) => {
          const image = toAbsoluteImageUrl(h.image_url) ?? toAbsoluteImageUrl(h.image);
          const name = h.name ?? h.title ?? "Nearby Hotel";
          return (
            <Link
              key={h.id ?? h.slug}
              href={`/hotels/${h.slug ?? h.id}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg block"
            >
              {image ? (
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${image}')` }}
                />
              ) : (
                <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-3xl">🏨</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 p-6 w-full">
                {h.distance_km && (
                  <span className="font-label-caps text-[10px] text-secondary-fixed">{h.distance_km} KM AWAY</span>
                )}
                <h5 className="text-white font-headline-md text-lg mb-2">{name}</h5>
                <span className="text-white border-b border-white text-xs font-bold py-1 hover:text-secondary-fixed hover:border-secondary-fixed transition-colors">
                  VIEW DETAILS
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}