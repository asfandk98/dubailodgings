// Best-guess mapping from amenity strings (from the API) to Material
// Symbols icon names. Extend as you learn the real amenity vocabulary.
const AMENITY_ICONS: Record<string, string> = {
  pool: "pool",
  "infinity pool": "pool",
  spa: "spa",
  restaurant: "restaurant",
  dining: "restaurant",
  beach: "beach_access",
  "private beach": "beach_access",
  gym: "fitness_center",
  fitness: "fitness_center",
  concierge: "concierge",
  wifi: "wifi",
  parking: "directions_car",
  valet: "directions_car",
  butler: "room_service",
};

export function iconForAmenity(amenity: string): string {
  const key = amenity.toLowerCase();
  const match = Object.keys(AMENITY_ICONS).find((k) => key.includes(k));
  return match ? AMENITY_ICONS[match] : "check_circle";
}