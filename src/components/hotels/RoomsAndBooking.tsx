"use client";

import { useState } from "react";
import Link from "next/link";
import type { HotelDetail, HotelRoom } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

function roomImage(room: HotelRoom): string | null {
  const first = room.images?.[0];
  const galleryUrl = typeof first === "string" ? first : (first?.url ?? toAbsoluteImageUrl(first?.path));
  return toAbsoluteImageUrl(room.image_url) ?? toAbsoluteImageUrl(room.image) ?? galleryUrl ?? null;
}

export default function RoomsAndBooking({ hotel }: { hotel: HotelDetail }) {
  const rooms = hotel.rooms ?? [];
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom | null>(null);
  const startPrice = rooms.length
    ? Math.min(...rooms.map((r) => Number(r.active_price ?? r.price ?? Infinity)))
    : hotel.price;

  return (
    <>
      <section className="max-w-container-max mx-auto px-gutter mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className="material-symbols-outlined text-secondary"
                style={{ fontVariationSettings: `'FILL' ${i <= Math.round(hotel.stars ?? hotel.rating ?? 5) ? 1 : 0}` }}
              >
                star
              </span>
            ))}
            <span className="ml-2 font-label-caps text-label-caps text-on-surface-variant">
              {Math.round(hotel.stars ?? hotel.rating ?? 5)}-STAR LUXURY
            </span>
          </div>
          <h2 className="font-display-lg-mobile md:font-display-lg mb-6">{hotel.title ?? hotel.name}</h2>
          {hotel.description && (
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-3xl">
              {hotel.description}
            </p>
          )}

          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="mt-12">
              <h3 className="font-headline-md text-headline-md mb-6">World-Class Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {hotel.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-4 p-4 border border-outline-variant rounded-lg">
                    <span className="material-symbols-outlined text-secondary">verified</span>
                    <span className="font-body-md text-body-md">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky booking sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 p-8 bg-white border border-outline-variant rounded-lg luxury-shadow">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="font-label-caps text-label-caps block text-on-surface-variant">FROM</span>
                <span className="font-display-lg text-3xl">AED {startPrice ?? "—"}</span>
                <span className="text-on-surface-variant">/night</span>
              </div>
              <div className="flex items-center gap-1 text-green-700 font-bold">
                <span className="material-symbols-outlined text-sm">verified</span>
                <span className="text-sm">BEST PRICE</span>
              </div>
            </div>

            {selectedRoom ? (
              <div className="mb-6 p-4 bg-secondary-container/30 border border-secondary rounded">
                <p className="font-label-caps text-[10px] text-secondary mb-1">SELECTED ROOM</p>
                <p className="font-body-md font-bold">{selectedRoom.name ?? selectedRoom.title}</p>
                <p className="text-on-surface-variant text-sm">AED {selectedRoom.active_price ?? selectedRoom.price}/night</p>
              </div>
            ) : (
              <p className="text-on-surface-variant text-sm mb-6">Select a room below to continue booking.</p>
            )}

            <Link
              href={
                selectedRoom
                  ? `/hotels/${hotel.slug ?? hotel.id}/reserve?room=${selectedRoom.slug ?? selectedRoom.id}`
                  : "#rooms"
              }
              className="block text-center w-full py-4 bg-primary text-on-primary font-bold uppercase tracking-widest hover:bg-secondary transition-all duration-300"
            >
              {selectedRoom ? "Check Availability" : "Select a Room"}
            </Link>
            <p className="text-center mt-4 text-on-surface-variant font-body-sm">No payment required today.</p>
          </div>
        </div>
      </section>

      {/* Rooms */}
      {rooms.length > 0 && (
        <section id="rooms" className="max-w-container-max mx-auto px-gutter mt-section-gap-lg">
          <h3 className="font-headline-md text-headline-md mb-8">Available Rooms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rooms.map((room) => {
              const image = roomImage(room);
              const isSelected = selectedRoom?.id === room.id;
              return (
                <div
                  key={room.id}
                  className={`bg-white border rounded-lg overflow-hidden flex flex-col luxury-shadow ${
                    isSelected ? "border-secondary" : "border-outline-variant"
                  }`}
                >
                  <div className="h-64 relative">
                    {image ? (
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${image}')` }} />
                    ) : (
                      <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-3xl">🛏️</div>
                    )}
                    {room.is_on_offer && (
                      <span className="absolute top-4 right-4 bg-error text-on-error px-3 py-1 rounded-full font-label-caps text-[10px]">
                        -{room.discount_percent}% OFF
                      </span>
                    )}
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-headline-md text-headline-md">{room.name ?? room.title}</h4>
                      {room.tag && (
                        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-caps text-[10px] shrink-0 ml-2">
                          {room.tag}
                        </span>
                      )}
                    </div>
                    {room.description && (
                      <p className="text-on-surface-variant font-body-md mb-6 flex-grow">{room.description}</p>
                    )}
                    <div className="flex justify-between items-center pt-6 border-t border-outline-variant">
                      <div>
                        {room.is_on_offer && (
                          <span className="text-on-surface-variant line-through text-sm mr-2">AED {room.original_price}</span>
                        )}
                        <span className="font-display-lg text-2xl">AED {room.active_price ?? room.price}</span>
                        <span className="text-on-surface-variant">/night</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedRoom(room);
                          document.querySelector(".lg\\:sticky")?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                        className={`px-8 py-3 font-bold uppercase tracking-wider transition-colors ${
                          isSelected ? "bg-secondary text-on-secondary" : "bg-primary text-on-primary hover:bg-secondary"
                        }`}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}