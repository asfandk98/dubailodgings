"use client";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locations: string[];
  selectedLocations: string[];
  onToggleLocation: (loc: string) => void;
  minPrice: number;
  maxPrice: number;
  priceRange: number;
  onPriceChange: (val: number) => void;
  selectedStars: number[];
  onToggleStar: (star: number) => void;
  onApply: () => void;
  onReset: () => void;
}

export default function FilterDrawer({
  isOpen,
  onClose,
  locations,
  selectedLocations,
  onToggleLocation,
  minPrice,
  maxPrice,
  priceRange,
  onPriceChange,
  selectedStars,
  onToggleStar,
  onApply,
  onReset,
}: FilterDrawerProps) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-[65] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <aside
        className={`h-full w-full md:w-[400px] fixed right-0 top-0 z-[70] bg-surface-container-lowest shadow-2xl transform transition-transform duration-500 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-gutter h-full flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h4 className="font-headline-md text-primary">Refine Search</h4>
            <button className="material-symbols-outlined text-primary hover:rotate-90 transition-transform" onClick={onClose}>
              close
            </button>
          </div>

          <div className="space-y-10 flex-grow">
            <div>
              <h5 className="font-label-caps text-label-caps text-primary mb-4">LOCATION</h5>
              <div className="space-y-3">
                {locations.map((loc) => (
                  <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(loc)}
                      onChange={() => onToggleLocation(loc)}
                      className="w-5 h-5 border-2 border-outline rounded-none checked:bg-secondary focus:ring-0"
                    />
                    <span className="text-on-surface font-body-md group-hover:text-secondary">{loc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-label-caps text-label-caps text-primary mb-4">PRICE RANGE (AED)</h5>
              <div className="px-2">
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step={100}
                  value={priceRange}
                  onChange={(e) => onPriceChange(Number(e.target.value))}
                  className="w-full h-1 bg-surface-container-highest appearance-none cursor-pointer accent-secondary"
                />
                <div className="flex justify-between mt-3 text-on-surface-variant font-body-sm">
                  <span>{minPrice}</span>
                  <span>{priceRange} AED</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-label-caps text-label-caps text-primary mb-4">STAR RATING</h5>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => onToggleStar(star)}
                    className={`py-2 border transition-colors ${
                      selectedStars.includes(star)
                        ? "border-secondary bg-secondary-container text-on-secondary-container"
                        : "border-outline text-on-surface hover:bg-secondary-container"
                    }`}
                  >
                    {star}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-10 space-y-4">
            <button
              onClick={onApply}
              className="w-full h-14 bg-primary text-on-primary font-label-caps text-label-caps hover:bg-secondary transition-colors"
            >
              APPLY FILTERS
            </button>
            <button
              onClick={onReset}
              className="w-full h-12 text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors"
            >
              CLEAR ALL
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}