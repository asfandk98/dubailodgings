import { API_BASE_URL } from "./config";
const BACKEND_URL = API_BASE_URL
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");

/**
 * Converts Laravel image values into an absolute URL.
 *
 * Handles:
 * - https://domain.com/storage/hotels/file.jpg
 * - http://domain.com/storage/hotels/file.jpg
 * - //domain.com/storage/hotels/file.jpg
 * - hotels/file.jpg
 * - storage/hotels/file.jpg
 * - { url: "..." }
 * - { path: "..." }
 * - { image_url: "..." }
 */
export function toAbsoluteImageUrl(value: unknown): string | null {
  if (!value) return null;

  let raw = "";

  if (typeof value === "string") {
    raw = value.trim();
  } else if (typeof value === "object") {
    const obj = value as Record<string, unknown>;

    raw = String(
      obj.url ??
        obj.path ??
        obj.image_url ??
        obj.image ??
        obj.src ??
        ""
    ).trim();
  }

  if (!raw) return null;

  // Fix malformed:
  // https:/example.com
  // http:/example.com
  raw = raw.replace(
    /^(https?):\/(?!\/)/i,
    "$1://"
  );

  // If it is already a valid absolute URL,
  // return it unchanged.
  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  // Protocol-relative URL
  if (raw.startsWith("//")) {
    return `https:${raw}`;
  }

  // Remove leading slash
  raw = raw.replace(/^\/+/, "");

  // Prevent accidental /api/storage/...
  raw = raw.replace(/^api\/+/i, "");

  // Already contains storage/
  if (raw.startsWith("storage/")) {
    return `${BACKEND_URL}/${raw}`;
  }

  // Already contains uploads/
  if (raw.startsWith("uploads/")) {
    return `${BACKEND_URL}/${raw}`;
  }

  // Normal Laravel storage path
  return `${BACKEND_URL}/storage/${raw}`;
}