// src/app/page.tsx
import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BrowseByCity from "@/components/BrowseByCity";
import FeaturedHotels from "@/components/FeaturedHotels";
import WhyChooseUs from "@/components/WhyChooseUs";
import BlogPreview from "@/components/BlogPreview";
import Footer from "@/components/Footer";
import TripPlanner from "@/components/TripPlanner";
import BottomNav from "@/components/BottomNav";
import { getHotels, getCities } from "@/lib/api";

export const metadata: Metadata = {
  title: "Best Hotels in Dubai | Book Cheap Hotels UAE",
  description:
    "Find and book hotels in Dubai, Abu Dhabi, and Sharjah at the best prices.",
  keywords: ["hotels in dubai", "cheap hotels UAE", "abu dhabi hotels"],
};

export default async function Home() {
  const [{ featured, dubai, abuDhabi, sharjah }, cities] = await Promise.all([
    getHotels(),
    getCities(),
  ]);

  return (
    <>
      <Header />
      <main className="mt-20 space-y-section-gap-lg">
        <Hero />
        <BrowseByCity cities={cities} />
        <FeaturedHotels hotels={featured} />

       

        <WhyChooseUs />
        <BlogPreview />
      </main>
      <Footer />
      <TripPlanner />
      <BottomNav />
    </>
  );
}