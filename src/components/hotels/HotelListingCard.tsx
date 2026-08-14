import Link from "next/link";
import type { HotelProperty } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

function getImage(h: HotelProperty): string | null {
  const first = h.images?.[0];
  const galleryUrl = typeof first === "string" ? first : (first?.url ?? toAbsoluteImageUrl(first?.path));
  return toAbsoluteImageUrl(h.image_url) ?? toAbsoluteImageUrl(h.image) ?? galleryUrl ?? null;
}

export default function HotelListingCard({ hotel }: { hotel: HotelProperty }) {
  const name = hotel.title ?? hotel.name ?? "Untitled Property";
  const location = hotel.location ?? hotel.city ?? "";
  const price = hotel.active_price ?? hotel.price ?? hotel.pricePerNight;
  const image = getImage(hotel);
  const rating = Math.round(Number(hotel.rating ?? 0));
  const href = hotel.slug ? `/hotels/${hotel.slug}` : `/hotels/${hotel.id}`;

  return (
    <Link
      href={href}
      className="group bg-surface-container-lowest border border-outline-variant hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col block"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {image ? (
          <div
            className="bg-cover bg-center w-full h-full transform group-hover:scale-105 transition-transform duration-700"
            style={{ backgroundImage: `url('${image}')` }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-high text-3xl">🏨</div>
        )}
        {"featured" in hotel && hotel.featured ? (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-primary font-label-caps text-label-caps tracking-widest shadow-sm">
            FEATURED
          </div>
        ) : rating >= 5 ? (
          <div className="absolute top-4 left-4 bg-secondary-container text-on-secondary-container px-3 py-1 font-label-caps text-label-caps tracking-widest shadow-sm">
            BEST RATED
          </div>
        ) : null}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display-lg-mobile md:font-headline-md text-primary leading-tight">{name}</h3>
          <div className="flex text-secondary-fixed-dim shrink-0 ml-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: `'FILL' ${i <= rating ? 1 : 0}` }}
              >
                star
              </span>
            ))}
          </div>
        </div>
        <p className="text-on-surface-variant font-body-sm text-body-sm mb-6 flex items-center gap-1 uppercase tracking-wider">
          <span className="material-symbols-outlined text-[18px]">location_on</span> {location}
        </p>
        <div className="mt-auto flex justify-between items-end border-t border-outline-variant pt-4">
          <div>
            <span className="text-on-surface-variant font-label-caps text-[10px] block mb-1">PRICE FROM</span>
            <span className="font-display-lg-mobile text-secondary text-2xl">AED {price ?? "—"}</span>
            <span className="text-on-surface-variant font-body-sm text-xs">/ night</span>
          </div>
          <span className="h-10 px-4 bg-primary text-on-primary font-label-caps text-label-caps hover:bg-secondary transition-colors flex items-center">
            DETAILS
          </span>
        </div>
      </div>
    </Link>
  );
}