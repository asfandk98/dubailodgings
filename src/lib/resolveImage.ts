import { API_BASE_URL } from "./api";

const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, "");

/**
 * Your API sometimes returns a full URL (image_url), sometimes an
 * ImageItem object ({ id, path, url }), and sometimes a relative
 * storage path (e.g. "hotels/xxxx.jpg" or "storage/hotels/xxxx.jpg").
 *
 * This resolves all of those cases to an absolute URL on the API host,
 * instead of letting the browser resolve a relative path against the
 * frontend's own origin.
 */
export function toAbsoluteImageUrl(value: unknown): string | null {
  if (!value) return null;

  let raw = "";

  if (typeof value === "string") {
    raw = value.trim();
  } else if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    raw = String(
      obj.url ?? obj.path ?? obj.image_url ?? obj.image ?? obj.src ?? ""
    ).trim();
  }

  if (!raw) return null;

  // Already an absolute URL
  if (/^https?:\/\//i.test(raw)) return raw;

  // Protocol-relative URL
  if (raw.startsWith("//")) return `https:${raw}`;

  // Remove leading slash
  raw = raw.replace(/^\/+/, "");

  // Path already includes the storage/ or uploads/ prefix — don't double it up
  if (raw.startsWith("storage/") || raw.startsWith("uploads/")) {
    return `${BACKEND_URL}/${raw}`;
  }

  // Otherwise assume it's a relative path under Laravel's public storage
  return `${BACKEND_URL}/storage/${raw}`;
}