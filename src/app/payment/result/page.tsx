import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import PaymentResultClient from "@/components/payments/PaymentResultClient";

export const metadata = {
  title: "Booking Confirmed | DUBAILODGINGS.COM",
};

export default function PaymentResultPage() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-section-gap-lg px-gutter">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-8 h-8 border-4 border-outline-variant border-t-secondary rounded-full animate-spin" />
            </div>
          }
        >
          <PaymentResultClient />
        </Suspense>
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}