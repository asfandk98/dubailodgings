import httpClient from "./httpClient";

export interface InitiatePaymentPayload {
  total: number;
  email: string;
  hotel_id?: string | number;
  room_id?: string | number | null;
  check_in: string;
  check_out: string;
  guests: { adults: number; children: number };
  night_rate: number;
  seasonal_price_id?: string | number | null;
  description: string;
}

export interface InitiatePaymentResponse {
  session_id: string;
  order_id: string;
  amount: number;
  mpgs_js: string;
}

export async function initiatePayment(payload: InitiatePaymentPayload): Promise<InitiatePaymentResponse> {
  const { data } = await httpClient.post<InitiatePaymentResponse>("/payments/initiate", payload);
  return data;
}

export interface VerifyPaymentResponse {
  success: boolean;
  status?: string;
  amount?: number | string;
  currency?: string;
  hotel_name?: string;
  room_name?: string;
  room_image?: string | null;
  card_last4?: string | null;
  card_brand?: string | null;
  check_in?: string;
  check_out?: string;
  nights?: number | string;
  guests?: string;
  email?: string;
  subtotal?: number | string;
  tax?: number | string;
  tourism_fee?: number | string;
  booking_id?: string | number;
}

export async function verifyPayment(orderId: string): Promise<VerifyPaymentResponse> {
  const { data } = await httpClient.get<VerifyPaymentResponse>("/payments/verify", {
    params: { order_id: orderId },
  });
  return data;
}