"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { HotelDetail, HotelRoom } from "@/lib/api";
import { getSeasonalPrices } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";
import { initiatePayment } from "@/lib/payments";
import DateSelector from "./DateSelector";

declare global {
  interface Window {
    Checkout?: {
      configure: (opts: unknown) => void;
      showPaymentPage: () => void;
    };

    paymentError?: (err: {
      cause?: string;
      explanation?: string;
      [key: string]: unknown;
    }) => void;

    paymentCancelled?: () => void;

    paymentComplete?: () => void;
  }
}
const [paymentOrderId, setPaymentOrderId] = useState<string | null>(null);
function roomImage(room: HotelRoom | null): string | null {
  if (!room) return null;
  const first = room.images?.[0];
  const galleryUrl = typeof first === "string" ? first : (first?.url ?? toAbsoluteImageUrl(first?.path));
  return toAbsoluteImageUrl(room.image_url) ?? toAbsoluteImageUrl(room.image) ?? galleryUrl ?? null;
}

export default function ReserveClient({ hotel, initialRoom }: { hotel: HotelDetail; initialRoom: HotelRoom | null }) {
  const router = useRouter();
  const selectedRoom = initialRoom;

  const [dates, setDates] = useState<{ startDate: Date; endDate: Date } | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seasonalPrices, setSeasonalPrices] = useState<Awaited<ReturnType<typeof getSeasonalPrices>>>([]);
  const [activeSeasonal, setActiveSeasonal] = useState<(typeof seasonalPrices)[number] | null>(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");
      if (user?.email) setEmail(user.email);
      if (user?.name) {
        const [f, ...rest] = user.name.split(" ");
        setFirstName(f ?? "");
        setLastName(rest.join(" "));
      }
    } catch {
      // not logged in yet
    }
  }, []);

  useEffect(() => {
    if (!selectedRoom?.id) return;
    getSeasonalPrices(selectedRoom.id).then(setSeasonalPrices);
  }, [selectedRoom?.id]);

  useEffect(() => {
    if (!dates || seasonalPrices.length === 0) {
      setActiveSeasonal(null);
      return;
    }
    const s = new Date(dates.startDate);
    s.setHours(0, 0, 0, 0);
    const e = new Date(dates.endDate);
    e.setHours(0, 0, 0, 0);
    const match = seasonalPrices.find((sp) => {
      const sStart = new Date(sp.start_date);
      sStart.setHours(0, 0, 0, 0);
      const sEnd = new Date(sp.end_date);
      sEnd.setHours(0, 0, 0, 0);
      return sStart <= s && sEnd >= e;
    });
    setActiveSeasonal(match ?? null);
  }, [dates, seasonalPrices]);

  const nights = dates
    ? Math.max(0, Math.ceil((dates.endDate.getTime() - dates.startDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const basePrice = Number(selectedRoom?.active_price ?? selectedRoom?.price ?? hotel.price ?? 0);
  const seasonalPrice = activeSeasonal ? Number(activeSeasonal.price) : null;
  const isOnOffer = seasonalPrice !== null && seasonalPrice < basePrice;
  const nightRate = isOnOffer ? seasonalPrice! : basePrice;

  const subtotal = nights * nightRate;
  const serviceCharge = Math.round(subtotal * 0.1);
  const vat = Math.round(subtotal * 0.05);
  const tourismFee = nights > 0 ? 4 * nights : 0;
  const total = subtotal + serviceCharge + vat + tourismFee;

 useEffect(() => {
  window.paymentError = (err) => {
    console.error(
      "MPGS paymentError:",
      JSON.stringify(err, null, 2)
    );

    const message =
      err?.explanation ||
      err?.cause ||
      "The payment could not be completed.";

    setError(`Payment failed: ${message}`);
    setLoading(false);
  };

  window.paymentCancelled = () => {
    console.log("MPGS payment cancelled");

    setError(
      "Payment was cancelled. You have not been charged."
    );

    setLoading(false);
  };

  window.paymentComplete = () => {
    console.log("MPGS payment completed");

    if (paymentOrderId) {
      window.location.href =
        `/payment/result?order_id=${encodeURIComponent(paymentOrderId)}`;
    } else {
      window.location.href = "/payment/result";
    }
  };

  return () => {
    delete window.paymentError;
    delete window.paymentCancelled;
    delete window.paymentComplete;
  };
}, [paymentOrderId]);

  const loadMpgsAndPay = (
  sessionId: string,
  mpgsJsUrl: string,
  orderId: string
) => {
  setPaymentOrderId(orderId);

  const existingScript = document.querySelector(
    `script[src="${mpgsJsUrl}"]`
  ) as HTMLScriptElement | null;

  const configureCheckout = () => {
    if (!window.Checkout) {
      setError(
        "Payment gateway failed to initialize. Please try again."
      );
      setLoading(false);
      return;
    }

    try {
      console.log("Configuring MPGS checkout:", {
        sessionId,
        orderId,
      });

      window.Checkout.configure({
        session: {
          id: sessionId,
        },
      });

      console.log("Showing MPGS payment page");

      window.Checkout.showPaymentPage();
    } catch (err) {
      console.error(
        "MPGS configure/showPaymentPage error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to open payment gateway."
      );

      setLoading(false);
    }
  };

  if (existingScript) {
    if (window.Checkout) {
      configureCheckout();
    } else {
      existingScript.addEventListener(
        "load",
        configureCheckout,
        { once: true }
      );
    }

    return;
  }

  const script = document.createElement("script");

  script.src = mpgsJsUrl;
  script.async = true;

  script.setAttribute(
    "data-error",
    "paymentError"
  );

  script.setAttribute(
    "data-cancel",
    "paymentCancelled"
  );

  script.setAttribute(
    "data-complete",
    "paymentComplete"
  );

  script.onload = configureCheckout;

  script.onerror = () => {
    console.error(
      "Failed to load MPGS:",
      mpgsJsUrl
    );

    setError(
      "Could not connect to payment gateway. Please try again."
    );

    setLoading(false);
  };

  document.body.appendChild(script);
};
  return (
    <main className="pt-32 pb-section-gap-lg px-gutter max-w-container-max mx-auto">
      {/* Progress */}
      <nav className="flex items-center gap-8 mb-12 overflow-x-auto whitespace-nowrap pb-4 md:pb-0">
        <div className="flex items-center gap-2 text-on-surface-variant font-label-caps opacity-60">
          <span className="w-6 h-6 rounded-full border border-outline flex items-center justify-center text-[10px]">01</span>
          SEARCH
        </div>
        <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
        <div className="flex items-center gap-2 text-secondary font-bold font-label-caps border-b-2 border-secondary pb-1">
          <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[10px]">02</span>
          BOOKING DETAILS
        </div>
        <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
        <div className="flex items-center gap-2 text-on-surface-variant font-label-caps opacity-60">
          <span className="w-6 h-6 rounded-full border border-outline flex items-center justify-center text-[10px]">03</span>
          CONFIRMATION
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left column */}
        <div className="lg:col-span-7 space-y-10">
          {/* Room summary */}
          <section className="bg-surface-container-lowest border border-outline-variant p-6 md:p-8 flex flex-col md:flex-row gap-6 relative overflow-hidden">
            <div className="w-full md:w-48 h-32 flex-shrink-0">
              {roomImage(selectedRoom) ? (
                <img src={roomImage(selectedRoom)!} className="w-full h-full object-cover" alt={selectedRoom?.name ?? "Room"} />
              ) : (
                <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-2xl">🛏️</div>
              )}
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="font-headline-md text-headline-md text-primary mb-1">
                  {selectedRoom?.name ?? selectedRoom?.title ?? hotel.title}
                </h2>
                <p className="text-on-surface-variant font-body-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  {hotel.title}, {hotel.location}
                </p>
              </div>
              {(selectedRoom?.size_sqm || selectedRoom?.capacity) && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {selectedRoom?.size_sqm && (
                    <span className="flex items-center gap-1 text-on-surface-variant text-[12px] uppercase tracking-wider font-semibold">
                      <span className="material-symbols-outlined text-[16px]">square_foot</span> {selectedRoom.size_sqm}m²
                    </span>
                  )}
                  {selectedRoom?.capacity && (
                    <span className="flex items-center gap-1 text-on-surface-variant text-[12px] uppercase tracking-wider font-semibold">
                      <span className="material-symbols-outlined text-[16px]">group</span> {selectedRoom.capacity}
                    </span>
                  )}
                </div>
              )}
            </div>
            {isOnOffer && (
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 font-label-caps text-[10px] uppercase">
                  Best Value
                </span>
              </div>
            )}
          </section>

          {/* Dates & Guests */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <DateSelector setDates={setDates} roomId={selectedRoom?.id ?? hotel.rooms?.[0]?.id} />

            <div>
              <label className="font-label-caps text-on-surface-variant mb-3 block">GUESTS</label>
              <div className="border border-outline-variant p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary text-sm">Adults</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setAdults((a) => Math.max(1, a - 1))} className="w-7 h-7 border border-outline-variant flex items-center justify-center">
                      −
                    </button>
                    <span className="w-4 text-center">{adults}</span>
                    <button onClick={() => setAdults((a) => a + 1)} className="w-7 h-7 border border-outline-variant flex items-center justify-center">
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary text-sm">Children</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setChildren((c) => Math.max(0, c - 1))} className="w-7 h-7 border border-outline-variant flex items-center justify-center">
                      −
                    </button>
                    <span className="w-4 text-center">{children}</span>
                    <button onClick={() => setChildren((c) => c + 1)} className="w-7 h-7 border border-outline-variant flex items-center justify-center">
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Checkout form */}
          <section className="space-y-6">
            <h3 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-4">Secure Checkout</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-[11px] mb-2 block">FIRST NAME</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border border-outline-variant p-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none font-body-sm"
                    placeholder="John"
                    type="text"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-[11px] mb-2 block">LAST NAME</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border border-outline-variant p-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none font-body-sm"
                    placeholder="Doe"
                    type="text"
                  />
                </div>
              </div>
              <div>
                <label className="font-label-caps text-[11px] mb-2 block">EMAIL ADDRESS</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-outline-variant p-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none font-body-sm"
                  placeholder="john.doe@example.com"
                  type="email"
                />
              </div>

              <div className="pt-6">
                <label className="font-label-caps text-[11px] mb-4 block">PAYMENT METHOD</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="border-2 border-primary p-4 flex flex-col items-center gap-2 bg-surface-bright">
                    <span className="material-symbols-outlined">credit_card</span>
                    <span className="text-[12px] font-bold">Credit Card</span>
                  </div>
                  <div className="border border-outline-variant p-4 flex flex-col items-center gap-2 opacity-40 cursor-not-allowed">
                    <span className="material-symbols-outlined">account_balance</span>
                    <span className="text-[12px] font-bold">Bank Transfer</span>
                    <span className="text-[9px]">Coming soon</span>
                  </div>
                  <div className="border border-outline-variant p-4 flex flex-col items-center gap-2 opacity-40 cursor-not-allowed">
                    <span className="material-symbols-outlined">payments</span>
                    <span className="text-[12px] font-bold">Pay at Hotel</span>
                    <span className="text-[9px]">Coming soon</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low rounded-lg flex gap-4 items-start">
              <span className="material-symbols-outlined text-secondary">verified_user</span>
              <div>
                <p className="text-body-sm font-bold">Encrypted Transaction</p>
                <p className="text-[12px] text-on-surface-variant">
                  Your payment details are processed through a PCI-DSS compliant gateway with AES-256 encryption.
                </p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-error-container border border-error/30 rounded-lg">
                <p className="text-error text-sm">{error}</p>
              </div>
            )}
          </section>
        </div>

        {/* Right column: price summary */}
        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-28 bg-white border border-outline-variant p-8 shadow-sm">
            <h3 className="font-headline-md text-headline-md text-primary mb-6">Price Summary</h3>

            {nights > 0 ? (
              <>
                <div className="space-y-4 border-b border-outline-variant pb-6 mb-6">
                  <div className="flex justify-between items-center text-body-md">
                    <span className="text-on-surface-variant">
                      {nights} Night{nights !== 1 ? "s" : ""} (AED {nightRate.toLocaleString()} per night)
                    </span>
                    <span className="font-medium">AED {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-on-surface-variant">Service Charge (10%)</span>
                    <span className="font-medium">AED {serviceCharge.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-on-surface-variant">VAT (5%)</span>
                    <span className="font-medium">AED {vat.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-on-surface-variant">Tourism Fee</span>
                    <span className="font-medium">AED {tourismFee.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                  <div>
                    <span className="font-label-caps text-on-surface-variant">TOTAL PRICE</span>
                    <p className="text-[12px] text-on-surface-variant">Including all taxes &amp; fees</p>
                  </div>
                  <span className="text-[32px] font-bold text-primary">AED {total.toLocaleString()}</span>
                </div>
              </>
            ) : (
              <p className="text-on-surface-variant text-sm mb-8">Select your stay dates to see the full price breakdown.</p>
            )}

            <button
              onClick={handleConfirm}
              disabled={!dates || nights === 0 || !email || loading}
              className="w-full bg-primary text-on-primary py-4 px-8 font-bold text-body-lg hover:bg-secondary transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-40"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span> Processing…
                </>
              ) : (
                <>
                  Confirm &amp; Pay
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </>
              )}
            </button>

            <p className="mt-6 text-center text-[12px] text-on-surface-variant italic">
              Free cancellation available on select rooms. Review terms before booking.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}