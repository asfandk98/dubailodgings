import httpClient from "./httpClient";

export const getWishlist = async () => {
  const res = await httpClient.get("/wishlist");
  return res.data; // array (or { data: [...] } — ProductCard handles both)
};

export const addToWishlist = async (hotel_id: string | number) => {
  const res = await httpClient.post("/wishlist", { hotel_id });
  return res.data;
};

export const removeFromWishlist = async (hotel_id: string | number) => {
  const res = await httpClient.delete(`/wishlist/${hotel_id}`);
  return res.data;
};
