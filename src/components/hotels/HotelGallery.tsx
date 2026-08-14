"use client";

import { useState } from "react";

export default function HotelGallery({ images, alt }: { images: string[]; alt: string }) {
  const [showAll, setShowAll] = useState(false);
  const shown = images.slice(0, 4);
  const extraCount = Math.max(0, images.length - 4);

  return (
    <>
      <section className="max-w-container-max mx-auto px-gutter mt-base md:mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px] md:h-[600px]">
          <div className="md:col-span-2 relative overflow-hidden rounded-lg group">
            {shown[0] ? (
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                role="img"
                aria-label={alt}
                style={{ backgroundImage: `url('${shown[0]}')` }}
              />
            ) : (
              <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-4xl">🏨</div>
            )}
          </div>

          <div className="hidden md:grid grid-rows-2 gap-4 col-span-1">
            {[shown[1], shown[2]].map((src, i) =>
              src ? (
                <div key={i} className="relative overflow-hidden rounded-lg group">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${src}')` }}
                  />
                </div>
              ) : (
                <div key={i} className="bg-surface-container-high rounded-lg" />
              )
            )}
          </div>

          <div className="hidden md:block relative overflow-hidden rounded-lg group">
            {shown[3] && (
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${shown[3]}')` }}
              />
            )}
            {extraCount > 0 && (
              <button
                onClick={() => setShowAll(true)}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full font-label-caps text-label-caps cursor-pointer hover:bg-white transition-all"
              >
                VIEW {images.length}+ PHOTOS
              </button>
            )}
          </div>
        </div>
      </section>

      {showAll && (
        <div className="fixed inset-0 bg-black/90 z-[100] overflow-y-auto p-6" onClick={() => setShowAll(false)}>
          <button className="fixed top-6 right-6 text-white material-symbols-outlined text-3xl" onClick={() => setShowAll(false)}>
            close
          </button>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 py-16">
            {images.map((src, i) => (
              <img key={i} src={src} alt={`${alt} ${i + 1}`} className="w-full rounded-lg" onClick={(e) => e.stopPropagation()} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}