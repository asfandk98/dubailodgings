import { API_BASE_URL } from "./api";

// Your API sometimes returns a full URL (image_url) and sometimes a
// relative storage path (image, e.g. "hotels/xxxx.jpg" or "cities/xxxx.jpg").
// This resolves the relative case to the API host's /storage path instead
// of letting the browser resolve it against the frontend's own origin.
export function toAbsoluteImageUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL.replace("/api", "")}/storage/${path}`;
}
