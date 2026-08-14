// src/components/FeaturedHotels.tsx
"use client";

import Link from "next/link";
import { HotelProperty } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

interface Props {
  hotels: HotelProperty[];
}

export default function FeaturedHotels({ hotels }: Props) {
  if (!hotels?.length) return null;

  return (
    <section className="bg-surface-container py-section-gap-lg">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="mb-12 text-center">
          <h3 className="font-headline-md text-headline-md text-primary mb-3">
            Our Handpicked Collection
          </h3>
          <p className="text-on-surface-variant font-body-md max-w-2xl mx-auto">
            Selected for their exceptional service, prime locations, and uncompromising luxury standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel) => {
            const slug = hotel.slug ?? hotel.id;
            const image = toAbsoluteImageUrl(
              hotel.image ?? hotel.image_url ?? hotel.thumbnail ?? ""
            );
            const name = hotel.name ?? hotel.title ?? "Luxury Hotel";
            const location = hotel.location ?? hotel.city ?? "UAE";
            const price = hotel.price ?? hotel.active_price ?? hotel.pricePerNight ?? 0;
            const currency = hotel.currency ?? "AED";
            const rating = hotel.rating ?? 5.0;
            const reviews = hotel.reviews_count ?? 0;

            return (
              <Link
                key={slug}
                href={`/hotels/${slug}`}
                className="bg-white rounded-lg border border-outline-variant overflow-hidden group hover:shadow-2xl transition-shadow duration-300 block"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      // TODO: toggle wishlist
                    }}
                    className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-colors"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      favorite
                    </span>
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-1 text-secondary-fixed-dim mb-2">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">
                      {rating.toFixed(1)}
                      {reviews > 0 && ` (${reviews} reviews)`}
                    </span>
                  </div>

                  <h5 className="font-headline-md text-[20px] text-primary mb-1">
                    {name}
                  </h5>
                  <p className="text-on-surface-variant text-body-sm mb-4">
                    {location}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
                    <span className="font-body-md text-on-surface-variant">
                      From{" "}
                      <span className="text-primary font-bold">
                        {currency} {price}
                      </span>
                      /night
                    </span>
                    <span className="material-symbols-outlined text-secondary">
                      arrow_circle_right
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}