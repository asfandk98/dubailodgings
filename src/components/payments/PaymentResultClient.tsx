"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyPayment, type VerifyPaymentResponse } from "@/lib/payments";
import Confetti from "./Confetti";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";
type ViewState = "verifying" | "success" | "failed" | "pending" | "error";

const money = (v: number | string | undefined) => Number(v ?? 0).toLocaleString();

export default function PaymentResultClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? searchParams.get("order_id") ?? searchParams.get("resultIndicator");

  const [state, setState] = useState<ViewState>("verifying");
  const [result, setResult] = useState<VerifyPaymentResponse | null>(null);

  useEffect(() => {
    if (!orderId) {
      setState("error");
      return;
    }
    verifyPayment(orderId)
      .then((res) => {
        setResult(res);
        setState(res.success ? "success" : "failed");
      })
      .catch(() => setState("error"));
  }, [orderId]);

  const handlePrint = () => {
    if (!result) return;
    const w = window.open("", "_blank", "width=700,height=900");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head>
      <title>Receipt — ${orderId}</title>
      <style>
        body { font-family: Georgia, serif; padding: 40px; color: #111; max-width: 640px; margin: 0 auto; }
        @media print { body { padding: 20px; } }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        td { padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px; }
        td:first-child { color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; width: 42%; }
        td:last-child { font-weight: 600; }
        .total { font-weight: 700; font-size: 18px; border-top: 2px solid #111; }
      </style>
      </head><body>
      <h2>DUBAILODGINGS.COM — Booking Receipt</h2>
      <table>
        <tr><td>Hotel</td><td>${result.hotel_name ?? "—"}</td></tr>
        <tr><td>Room</td><td>${result.room_name ?? "—"}</td></tr>
        <tr><td>Check-in</td><td>${result.check_in ?? "—"}</td></tr>
        <tr><td>Check-out</td><td>${result.check_out ?? "—"}</td></tr>
        <tr><td>Nights</td><td>${result.nights ?? "—"}</td></tr>
        <tr><td>Guests</td><td>${result.guests ?? "—"}</td></tr>
        <tr><td>Subtotal</td><td>${result.currency ?? "AED"} ${money(result.subtotal)}</td></tr>
        <tr><td>Tax</td><td>${result.currency ?? "AED"} ${money(result.tax)}</td></tr>
        <tr><td>Tourism Fee</td><td>${result.currency ?? "AED"} ${money(result.tourism_fee)}</td></tr>
        <tr class="total"><td>Total Paid</td><td>${result.currency ?? "AED"} ${money(result.amount)}</td></tr>
      </table>
      <script>window.onload=()=>{window.print();window.onafterprint=()=>window.close()}<\/script>
      </body></html>`);
    w.document.close();
  };

  if (state === "verifying") {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-outline-variant border-t-secondary rounded-full animate-spin mx-auto mb-5" />
          <p className="font-label-caps text-label-caps text-primary">Confirming your payment…</p>
          <p className="text-on-surface-variant text-xs mt-2">Please wait, do not close this page</p>
        </div>
      </div>
    );
  }

  if (state === "failed" || state === "error" || !result) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh] px-gutter">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-error-container text-error rounded-full mb-6">
            <span className="material-symbols-outlined !text-5xl">cancel</span>
          </div>
          <h2 className="font-display-lg-mobile md:font-display-lg text-primary mb-2">
            {state === "error" ? "Something Went Wrong" : "Payment Not Completed"}
          </h2>
          <p className="font-body-lg text-on-surface-variant mb-10">
            {state === "error"
              ? "We couldn't verify your payment status. If you were charged, contact us with your booking details."
              : "You have not been charged. You can try again or choose a different payment method."}
          </p>
          <Link
            href="/hotels"
            className="inline-block bg-primary text-on-primary px-10 py-4 font-bold uppercase tracking-widest hover:bg-secondary transition-all"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Confetti />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-secondary-container text-on-secondary-container rounded-full mb-6 shadow-lg">
            <span className="material-symbols-outlined !text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          <h2 className="font-display-lg-mobile md:font-display-lg text-primary mb-2">Booking Confirmed!</h2>
          <p className="font-body-lg text-on-surface-variant max-w-lg mx-auto">
            Your stay at {result.hotel_name ?? "your selected hotel"} is secured. A confirmation email has been sent to
            your registered address.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          <div className="md:col-span-7 bg-surface-container-lowest border border-outline-variant p-8 rounded-xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="font-label-caps text-label-caps text-secondary uppercase block mb-1">
                    Confirmation ID
                  </span>
                  <p className="font-admin-data text-admin-data text-on-surface text-xl">
                    #{orderId?.slice(-8) ?? "—"}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-label-caps text-xs">PAID</span>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant">hotel</span>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-primary">{result.hotel_name}</h3>
                    <p className="text-on-surface-variant text-body-sm">{result.room_name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant">
                  <div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">CHECK-IN</span>
                    <p className="font-body-md text-body-md font-semibold">{result.check_in}</p>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">CHECK-OUT</span>
                    <p className="font-body-md text-body-md font-semibold">{result.check_out}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 relative overflow-hidden rounded-xl h-[300px] md:h-auto border border-outline-variant bg-primary-container flex items-end p-6">
            
          </div>

          <div className="md:col-span-12 bg-primary-container p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-on-primary-container/20 rounded-lg flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white">receipt_long</span>
              </div>
              <div>
                <p className="text-white font-body-md font-semibold">
                  Your payment of {result.currency ?? "AED"} {money(result.amount)} was successful
                </p>
                <p className="text-on-primary-container text-body-sm">Secured via Mastercard Payment Gateway</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              <button
                onClick={handlePrint}
                className="flex-1 md:flex-none px-6 py-3 bg-white text-primary font-label-caps text-label-caps rounded hover:bg-secondary-fixed transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined !text-sm">download</span>
                Download Receipt
              </button>
              <Link
                href={result.booking_id ? `/dashboard/bookings/${result.booking_id}` : "/dashboard/bookings"}
                className="flex-1 md:flex-none px-6 py-3 border border-on-primary-container text-white font-label-caps text-label-caps rounded hover:bg-white/10 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined !text-sm">event_available</span>
                Go to My Bookings
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-3">
            <span className="material-symbols-outlined text-secondary">support_agent</span>
            <h4 className="font-body-md font-bold">24/7 Concierge</h4>
            <p className="text-on-surface-variant text-body-sm">
              Our luxury travel specialists are ready to assist with airport transfers and dinner reservations.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="material-symbols-outlined text-secondary">explore</span>
            <h4 className="font-body-md font-bold">Nearby Attractions</h4>
            <p className="text-on-surface-variant text-body-sm">
              Discover exclusive beach clubs and Michelin-star dining nearby.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="material-symbols-outlined text-secondary">policy</span>
            <h4 className="font-body-md font-bold">Cancellation Policy</h4>
            <p className="text-on-surface-variant text-body-sm">
              Flexible cancellation until 48 hours before check-in. Review details in your booking dashboard.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}