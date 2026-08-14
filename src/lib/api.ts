// src/lib/api.ts
import { API_BASE_URL } from "./config";
import httpClient from "./httpClient";

export { API_BASE_URL };

export interface ImageItem {
  id?: string | number;
  path?: string;
  url?: string;
}

// Loose shape to tolerate whatever your API actually returns.
export interface HotelProperty {
  id?: string | number;
  hotel_id?: string | number;
  slug?: string;
  name?: string;
  title?: string;
  location?: string;
  city?: string;
  price?: number | string;
  pricePerNight?: number | string;
  active_price?: number | string;
  original_price?: number | string;
  is_on_offer?: boolean;
  currency?: string;
  rating?: number;
  reviews_count?: number;
  image?: string;
  image_url?: string;
  thumbnail?: string;
  images?: (string | ImageItem)[];
  alt?: string;
}

export interface HotelSections {
  featured: HotelProperty[];
  dubai: HotelProperty[];
  abuDhabi: HotelProperty[];
  sharjah: HotelProperty[];
}

export interface CityProperty {
  id?: string | number;
  slug?: string;
  name?: string;
  title?: string;
  image?: string;
  image_url?: string;
  properties?: string;
  properties_count?: number;
  propertyCount?: number;
  alt?: string;
}

async function fetchJson<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Fetch failed (${res.status}): ${path}`);
      return [];
    }

    const json = await res.json();
    return json?.data ?? json ?? [];
  } catch (err) {
    console.error(`Fetch error: ${path}`, err);
    return [];
  }
}

export async function getHotels(): Promise<HotelSections> {
  const [featured, dubai, abuDhabi, sharjah] = await Promise.all([
    fetchJson<HotelProperty>("/hotels/featured"),
    fetchJson<HotelProperty>("/hotels?location=Dubai"),
    fetchJson<HotelProperty>("/hotels?location=AbuDhabi"),
    fetchJson<HotelProperty>("/hotels?location=Sharjah"),
  ]);

  return { featured, dubai, abuDhabi, sharjah };
}

export async function getCities(): Promise<CityProperty[]> {
  return fetchJson<CityProperty>("/location");
}

export interface HotelListParams {
  location?: string;
  price_min?: string | number;
  max_price?: string | number;
  rating?: string | number;
  sort?: string;
  check_in?: string;
  check_out?: string;
  guests?: string;
}

export interface HotelListResult {
  hotels: HotelProperty[];
  meta: Record<string, unknown>;
}

export async function getHotelsList(
  params: HotelListParams = {}
): Promise<HotelListResult> {
  try {
    const qs = new URLSearchParams(
      Object.entries(params).reduce((acc, [k, v]) => {
        if (v !== undefined && v !== "") acc[k] = String(v);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const res = await fetch(`${API_BASE_URL}/hotels${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Fetch failed (${res.status}): /hotels`);
      return { hotels: [], meta: {} };
    }

    const json = await res.json();
    return {
      hotels: Array.isArray(json) ? json : (json?.data ?? []),
      meta: json?.meta ?? {},
    };
  } catch (err) {
    console.error("Fetch error: /hotels", err);
    return { hotels: [], meta: {} };
  }
}

export interface HotelFilters {
  locations?: string[];
  max_price?: number;
}

export async function getFilters(): Promise<HotelFilters> {
  try {
    const res = await fetch(`${API_BASE_URL}/hotels/filters`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return {};
    return await res.json();
  } catch (err) {
    console.error("Fetch error: /hotels/filters", err);
    return {};
  }
}

export interface HotelRoom {
  id?: string | number;
  hotel_id?: string | number;

  slug?: string;
  name?: string;
  title?: string;
  description?: string;
  tag?: string;

  size_sqm?: number;
  size_sqft?: number;
  size?: string;

  beds?: number | string;
  capacity?: string | number;

  // Base price
  price?: number | string;

  // Seasonal / active pricing
  active_price?: number | string;
  original_price?: number | string;

  // Offer information
  is_on_offer?: boolean;
  discount_percent?: number | string;

  // Images
  image?: string;
  image_url?: string;
  images?: (string | ImageItem)[];

  amenities?: string[];
}
export interface SeasonalPrice {
  id: string | number;
  start_date: string;
  end_date: string;
  price: number | string;
}

export async function getSeasonalPrices(roomId: string | number): Promise<SeasonalPrice[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/seasonal-prices-public`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Fetch error: seasonal-prices-public", err);
    return [];
  }
}

export interface NearbyHotel {
  id?: string | number;
  slug?: string;
  name?: string;
  title?: string;
  distance_km?: number | string;
  image?: string;
  image_url?: string;
}

export interface HotelDetail extends HotelProperty {
  description?: string;
  stars?: number;
  reviews_count?: number;
  amenities?: string[];
  rooms?: HotelRoom[];
  nearby?: NearbyHotel[];
  images?: ImageItem[];
}

export async function getHotel(slug: string): Promise<HotelDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/hotels/${slug}`, { cache: "no-store" });
    if (!res.ok) {
      console.error(`Fetch failed (${res.status}): /hotels/${slug}`);
      return null;
    }
    const json = await res.json();
    return json?.data ?? json ?? null;
  } catch (err) {
    console.error(`Fetch error: /hotels/${slug}`, err);
    return null;
  }
}

// ── BLOG (public) ─────────────────────────────────────────────────────────

export interface BlogPostSummary {
  id: string | number;
  slug?: string;
  title: string;
  excerpt?: string;
  category?: { name?: string } | string;
  image?: string;
  image_url?: string;
  featured_image?: string;
  alt?: string;
  publish_date?: string;
  created_at?: string;
}

export async function getPublicBlogPosts(): Promise<BlogPostSummary[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/blog/posts?status=published`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error(`Fetch failed (${res.status}): /blog/posts`);
      return [];
    }
    const json = await res.json();
    return Array.isArray(json) ? json : (json?.data ?? []);
  } catch (err) {
    console.error("Fetch error: /blog/posts", err);
    return [];
  }
}

export interface BlogPostDetail extends BlogPostSummary {
  content?: string;
  meta_title?: string;
  meta_description?: string;
  tags?: string;
  og_image?: string;
}

export async function getPublicBlogPost(slug: string): Promise<BlogPostDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/blog/posts/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error(`Fetch failed (${res.status}): /blog/posts/slug/${slug}`);
      return null;
    }
    const json = await res.json();
    return json?.data ?? json ?? null;
  } catch (err) {
    console.error(`Fetch error: /blog/posts/slug/${slug}`, err);
    return null;
  }
}

// ── CONTACT ──────────────────────────────────────────────────────────────

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ContactResult {
  ok: boolean;
  message: string;
}

export async function sendContactMessage(payload: ContactPayload): Promise<ContactResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (res.status === 422 && data?.errors) {
      const firstError = Object.values(data.errors as Record<string, string[]>)[0]?.[0];
      return { ok: false, message: firstError ?? "Please check your details and try again." };
    }

    if (!res.ok || data?.status === false) {
      return { ok: false, message: data?.message ?? "Failed to send message. Please try again." };
    }

    return { ok: true, message: data?.message ?? "Message sent successfully" };
  } catch (err) {
    console.error("Fetch error: /contact", err);
    return { ok: false, message: "Network error — please try again." };
  }
}

// ── USER DASHBOARD ──────────────────────────────────────────────────────────

export interface UserBooking {
  id: string | number;
  reference?: string;
  status: "confirmed" | "pending" | "cancelled" | "cancellation_requested";
  hotel_name?: string;
  hotel_image?: string;
  hotel_slug?: string;
  room_name?: string;
  check_in: string;
  check_out: string;
  nights: number;
  total_price: number | string;
  subtotal?: number | string;
  tax?: number | string;
  tourism_fee?: number | string;
  adults?: number;
  children?: number;
  payment_status?: string;
  created_at?: string;
}

export interface WishlistHotel {
  id: string | number;
  hotel_id?: string | number;
  slug?: string;
  name?: string;
  title?: string;
  image?: string;
  image_url?: string;
  price?: number | string;
}

export interface UserProfile {
  name: string;
  email: string;
}

export async function getUserBookings(): Promise<UserBooking[]> {
  try {
    const { data } = await httpClient.get("/user/bookings");
    return Array.isArray(data) ? data : (data?.data ?? []);
  } catch (err) {
    console.error("Fetch error: /user/bookings", err);
    return [];
  }
}

export async function getUserBooking(id: string | number): Promise<UserBooking | null> {
  try {
    const { data } = await httpClient.get(`/user/bookings/${id}`);
    return data;
  } catch (err) {
    console.error(`Fetch error: /user/bookings/${id}`, err);
    return null;
  }
}

export async function requestCancelBooking(id: string | number) {
  return httpClient.post(`/user/bookings/${id}/cancel`);
}

export async function getUserWishlistHotels(): Promise<WishlistHotel[]> {
  try {
    const { data } = await httpClient.get("/user/wishlist");
    return Array.isArray(data) ? data : (data?.data ?? []);
  } catch (err) {
    console.error("Fetch error: /user/wishlist", err);
    return [];
  }
}

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const { data } = await httpClient.get("/user/profile");
    return data;
  } catch (err) {
    console.error("Fetch error: /user/profile", err);
    return null;
  }
}

export async function updateUserProfile(payload: UserProfile) {
  return httpClient.put("/user/profile", payload);
}

// ── CONCIERGE (AI chat) ─────────────────────────────────────────────────────

export interface ConciergeHotel {
  id: number;
  title: string;
  location: string;
  price: number | string;
  type?: string;
  rating?: number;
  slug?: string;
  image?: string;
  image_url?: string;
}

export interface ConciergeMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ConciergeChatResponse {
  content: string;
  hotels: ConciergeHotel[];
}

export async function sendConciergeChat(messages: ConciergeMessage[]): Promise<ConciergeChatResponse> {
  const res = await fetch(`${API_BASE_URL}/concierge/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error("AI service unavailable");
  return res.json();
}