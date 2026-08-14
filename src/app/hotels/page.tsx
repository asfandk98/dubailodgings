import { Suspense } from "react";
import HotelsClient from "./HotelsClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Luxury Hotels | DUBAILODGINGS.COM",
};

export default function HotelsPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="pt-24 min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <HotelsClient />
      </Suspense>
      <Footer />
    </>
  );
}