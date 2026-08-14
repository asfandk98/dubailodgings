import httpClient from "./httpClient";

// ── Dashboard stats ──────────────────────────────────────────────────────
export interface AdminStats {
  hotels: number;
  active_hotels: number;
  rooms: number;
  bookings: number;
  pending: number;
  revenue: number | string;
}

export const getAdminStats = () => httpClient.get<AdminStats>("/admin/stats");

// ── Bookings ──────────────────────────────────────────────────────────────
export interface AdminBooking {
  id: string | number;
  reference?: string;
  status: string;
  total_price?: number | string;
  nights?: number;
  check_in?: string;
  user?: { name?: string; email?: string };
  guest_name?: string;
  hotel?: { title?: string };
  room?: { name?: string };
}

export const getAdminBookings = (params: { page?: number; search?: string; status?: string } = {}) =>
  httpClient.get<{ data: AdminBooking[]; meta?: { last_page?: number } }>("/admin/bookings", { params });

// ── Hotels ────────────────────────────────────────────────────────────────
export interface AdminHotel {
  id: string | number;
  title: string;
  location: string;
  type: string;
  price: number | string;
  rating?: number;
  status: "active" | "draft";
  featured: boolean;
  image?: string | null;
  image_url?: string | null;
  amenities?: string[];
  guests?: string | number;
  description?: string;
  rooms?: unknown[];
}
export const getAdminHotels = () =>
  httpClient.get<{ data?: AdminHotel[] } | AdminHotel[]>("/admin/hotels");

export const getAdminHotel = (id: string | number) =>
  httpClient.get<AdminHotel>(`/admin/hotels/${id}`);

export const deleteAdminHotel = (id: string | number) =>
  httpClient.delete(`/admin/hotels/${id}`);

export const createAdminHotel = (formData: FormData) =>
  httpClient.post<AdminHotel>("/admin/hotels", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateAdminHotel = (
  id: string | number,
  formData: FormData
) =>
  httpClient.post<AdminHotel>(`/admin/hotels/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // ── Rooms (public API base, not /admin — matches old rooms/create behavior) ─
export interface AdminRoom {
  id: string | number;
  hotel_id?: string | number;
  name: string;
  size?: string;
  beds?: string | number;
  price: number | string;
  description?: string;
  amenities?: string[];
}

export const getAdminRooms = (params?: { page?: number; hotel_id?: string | number }) =>
  httpClient.get<{ data?: AdminRoom[] } | AdminRoom[]>("/admin/rooms", {
    params,
  });

export const getAdminRoom = (id: string | number) =>
  httpClient.get<AdminRoom>(`/admin/rooms/${id}`);

export const updateAdminRoom = (
  id: string | number,
  payload: {
    hotel_id: string | number;
    name: string;
    size: string;
    beds: string;
    price: string;
    description: string;
    amenities: string[];
  }
) =>
  httpClient.put<AdminRoom>(`/admin/rooms/${id}`, payload);

export const deleteAdminRoom = (id: string | number) =>
  httpClient.delete(`/admin/rooms/${id}`);

// Reuses the public /hotels list (with auth header attached via httpClient's
// interceptor) to populate the hotel picker — same as old rooms/create.
export const getHotelsForRoomSelect = () =>
  httpClient.get<{ data?: AdminHotel[] } | AdminHotel[]>("/hotels");

export const createRoom = (
  hotelId: string | number,
  payload: {
    name: string;
    size: string;
    beds: string;
    price: string;
    description: string;
    amenities: string[];
  }
) => httpClient.post<AdminRoom>(`/hotels/${hotelId}/rooms`, payload);

export const uploadRoomImages = (roomId: string | number, formData: FormData) =>
  httpClient.post(`/admin/rooms/${roomId}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  export interface AvailabilityRoom {
  id: string | number;
  name: string;
  price: number | string;
}

export const getRoomsForHotel = (hotelId: string | number) =>
  httpClient.get<AvailabilityRoom[]>(`/admin/hotels/${hotelId}/rooms`);

export interface AvailabilityResponse {
  blocked_dates?: string[];
  booked_dates?: string[];
}

export const getRoomAvailability = (roomId: string | number, month: number, year: number) =>
  httpClient.get<AvailabilityResponse>(`/admin/rooms/${roomId}/availability`, { params: { month, year } });

export const blockDates = (roomId: string | number, dates: string[]) =>
  httpClient.post(`/admin/rooms/${roomId}/availability/block`, { dates });

export const unblockDates = (roomId: string | number, dates: string[]) =>
  httpClient.post(`/admin/rooms/${roomId}/availability/unblock`, { dates });

export interface SeasonalPriceRow {
  id: string | number;
  price: number | string;
  start_date: string;
  end_date: string;
}

export const getRoomsForHotelAdmin = (hotelId: string | number) =>
  httpClient.get<AvailabilityRoom[]>(`/admin/hotels/${hotelId}/rooms`);

export const getSeasonalPricesForRoom = (roomId: string | number) =>
  httpClient.get<SeasonalPriceRow[]>(`/admin/rooms/${roomId}/seasonal-prices`);

export const createSeasonalPrice = (
  roomId: string | number,
  payload: { price: string; start_date: string; end_date: string }
) => httpClient.post<SeasonalPriceRow>(`/admin/rooms/${roomId}/seasonal-prices`, payload);

export const deleteSeasonalPrice = (id: string | number) =>
  httpClient.delete(`/admin/seasonal-prices/${id}`);

// ── Blog categories ──────────────────────────────────────────────────────
export interface BlogCategory {
  id: string | number;
  name: string;
  description?: string;
  status?: "active" | "inactive";
  posts_count?: number;
}

export const getBlogCategories = () => httpClient.get<BlogCategory[]>("/admin/blog/categories");

export const createBlogCategory = (payload: { name: string; description: string; status: string }) =>
  httpClient.post<BlogCategory>("/admin/blog/categories", payload);

export const updateBlogCategory = (id: string | number, payload: { name: string; description: string; status: string }) =>
  httpClient.put<BlogCategory>(`/admin/blog/categories/${id}`, payload);

export const deleteBlogCategory = (id: string | number) => httpClient.delete(`/admin/blog/categories/${id}`);

// ── Blog posts ────────────────────────────────────────────────────────────
export interface BlogPost {
  id: string | number;
  title: string;
  blog_category_id?: string | number;
  category?: { name?: string };
  excerpt?: string;
  content?: string;
  status: "draft" | "published" | "archived";
  featured?: boolean;
  publish_date?: string;
  created_at?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  tags?: string;
  featured_image?: string;
  og_image?: string;
}

export const getBlogPosts = (page = 1) =>
  httpClient.get<{ data: BlogPost[]; meta?: { total?: number; last_page?: number } } | BlogPost[]>(
    "/admin/blog/posts",
    { params: { page } }
  );

export const getBlogPost = (id: string | number) => httpClient.get<BlogPost>(`/admin/blog/posts/${id}`);

export const saveBlogPost = (id: string | number | null, formData: FormData) => {
  if (id) formData.append("_method", "PUT");
  return httpClient.post<BlogPost>(id ? `/admin/blog/posts/${id}` : "/admin/blog/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteBlogPost = (id: string | number) => httpClient.delete(`/admin/blog/posts/${id}`);

// ── AI generation — proxied through Laravel, never calls Groq directly ────
export interface GeneratedBlogContent {
  excerpt: string;
  content: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  tags: string;
}

export const generateBlogContent = (title: string, category?: string) =>
  httpClient.post<GeneratedBlogContent>("/admin/blog/generate", { title, category });

export interface AdminBookingDetail extends AdminBooking {
  hotel?: { title?: string };
  room?: { name?: string; price?: number | string };
  room_price?: number | string;
  check_out?: string;
  adults?: number;
  children?: number;
  subtotal?: number | string;
  tax?: number | string;
  tourism_fee?: number | string;
  guest_email?: string;
  guest_phone?: string;
  user?: { name?: string; email?: string; phone?: string };
}

export const updateBookingStatus = (id: string | number, status: string) =>
  httpClient.put<AdminBookingDetail>(`/admin/bookings/${id}/status`, { status });