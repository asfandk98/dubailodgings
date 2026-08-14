"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getHotelsList, getFilters, type HotelProperty } from "@/lib/api";
import HotelListingCard from "@/components/hotels/HotelListingCard";
import FilterDrawer from "@/components/hotels/FilterDrawer";
import BottomNav from "@/components/BottomNav";

const SORT_OPTIONS = [
  { value: "recommended", label: "SORT: POPULARITY" },
  { value: "price_low", label: "PRICE: LOW TO HIGH" },
  { value: "price_high", label: "PRICE: HIGH TO LOW" },
  { value: "rating", label: "RATING: HIGHEST" },
];

const PER_LOAD = 6;

export default function HotelsClient() {
  const searchParams = useSearchParams();

  const [hotels, setHotels] = useState<HotelProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PER_LOAD);
  const [sort, setSort] = useState("recommended");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [filterOptions, setFilterOptions] = useState<{ locations: string[]; max_price: number }>({
    locations: [],
    max_price: 10000,
  });

  const initialLocation = searchParams.get("location");
  const [activeLocations, setActiveLocations] = useState<string[]>(initialLocation ? [initialLocation] : []);
  const [activePriceMax, setActivePriceMax] = useState(10000);
  const [activeStars, setActiveStars] = useState<number[]>([]);

  const [draftLocations, setDraftLocations] = useState<string[]>(activeLocations);
  const [draftPriceMax, setDraftPriceMax] = useState(10000);
  const [draftStars, setDraftStars] = useState<number[]>([]);

  useEffect(() => {
    getFilters().then((data) => {
      setFilterOptions({
        locations: data.locations ?? ["Dubai", "Abu Dhabi", "Sharjah"],
        max_price: data.max_price ?? 10000,
      });
      setActivePriceMax(data.max_price ?? 10000);
      setDraftPriceMax(data.max_price ?? 10000);
    });
  }, []);

  const fetchHotels = useCallback(() => {
  setLoading(true);
  getHotelsList({
    location: activeLocations.join(",") || undefined,
    max_price: activePriceMax,
    rating: activeStars.length ? Math.min(...activeStars) : undefined,
    sort,
  }).then(({ hotels }) => {
    setHotels(hotels);
    setVisibleCount(PER_LOAD);
    setLoading(false);
  });
}, [activeLocations, activePriceMax, activeStars, sort]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const openDrawer = () => {
    setDraftLocations(activeLocations);
    setDraftPriceMax(activePriceMax);
    setDraftStars(activeStars);
    setDrawerOpen(true);
  };

  const toggleDraftLocation = (loc: string) =>
    setDraftLocations((prev) => (prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]));

  const toggleDraftStar = (star: number) =>
    setDraftStars((prev) => (prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]));

  const applyFilters = () => {
    setActiveLocations(draftLocations);
    setActivePriceMax(draftPriceMax);
    setActiveStars(draftStars);
    setDrawerOpen(false);
  };

  const resetFilters = () => {
    setDraftLocations([]);
    setDraftPriceMax(filterOptions.max_price);
    setDraftStars([]);
  };

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((v) => v + PER_LOAD);
      setLoadingMore(false);
    }, 300);
  };

  const visibleHotels = hotels.slice(0, visibleCount);
  const hasMore = visibleCount < hotels.length;

  return (
    <main className="pt-24 pb-20">
      {/* Search & filter summary */}
      <section className="bg-surface-container-low py-8 mb-base">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-display-lg-mobile md:font-headline-md text-primary mb-2">
                {activeLocations.length > 0 ? `Exclusive Stays in ${activeLocations.join(", ")}` : "All Exceptional Properties"}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-on-surface-variant font-body-sm text-body-sm">
                {activeLocations.map((loc) => (
                  <span key={loc} className="bg-surface-container-highest px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">location_on</span> {loc}
                  </span>
                ))}
                {activeStars.length > 0 && (
                  <span className="bg-surface-container-highest px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">star</span> {Math.min(...activeStars)}+ stars
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={openDrawer}
                className="flex items-center gap-2 px-6 py-touch-target border-2 border-secondary text-secondary font-label-caps text-label-caps hover:bg-secondary/5 transition-all"
              >
                <span className="material-symbols-outlined">filter_list</span> FILTERS
              </button>
              <div className="relative group">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-primary text-on-primary px-6 py-3 pr-10 font-label-caps text-label-caps cursor-pointer focus:ring-0 border-none transition-all hover:bg-secondary"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-primary pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-container-max mx-auto px-gutter py-section-gap-sm md:py-section-gap-lg">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-surface-container-high animate-pulse" />
            ))}
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-headline-md text-primary mb-2">No properties match your filters</p>
            <p className="text-on-surface-variant mb-6">Try adjusting your search criteria</p>
            <button
              onClick={resetFilters}
              className="border-2 border-primary text-primary px-8 py-3 font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all"
            >
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {visibleHotels.map((hotel) => (
                <HotelListingCard key={hotel.id ?? hotel.slug} hotel={hotel} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-section-gap-sm md:mt-section-gap-lg flex flex-col items-center">
                <p className="text-on-surface-variant font-body-sm text-body-sm mb-6">
                  Showing {visibleCount} of {hotels.length} exceptional properties
                </p>
                <div className="w-full max-w-xs bg-surface-container h-1 rounded-full overflow-hidden mb-8">
                  <div
                    className="bg-secondary h-full transition-all duration-1000"
                    style={{ width: `${(visibleCount / hotels.length) * 100}%` }}
                  />
                </div>
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="group flex items-center gap-4 px-10 py-4 border-2 border-primary text-primary font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all duration-300 disabled:opacity-50"
                >
                  {loadingMore ? "LOADING…" : "LOAD MORE LISTINGS"}
                  <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">
                    expand_more
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <FilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        locations={filterOptions.locations}
        selectedLocations={draftLocations}
        onToggleLocation={toggleDraftLocation}
        minPrice={0}
        maxPrice={filterOptions.max_price}
        priceRange={draftPriceMax}
        onPriceChange={setDraftPriceMax}
        selectedStars={draftStars}
        onToggleStar={toggleDraftStar}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      <BottomNav />
    </main>
  );
}