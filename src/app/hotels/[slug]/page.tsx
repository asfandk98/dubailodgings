import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import HotelGallery from "@/components/hotels/HotelGallery";
import RoomsAndBooking from "@/components/hotels/RoomsAndBooking";
import NearbyHotels from "@/components/hotels/NearbyHotels";
import { getHotel } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hotel = await getHotel(slug);
  if (!hotel) return { title: "Hotel Not Found | DUBAILODGINGS.COM" };
  return { title: `${hotel.title ?? hotel.name} | DUBAILODGINGS.COM` };
}

export default async function HotelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hotel = await getHotel(slug);
  if (!hotel) return notFound();

  const name = hotel.title ?? hotel.name ?? "";
  const galleryItems = hotel.images && hotel.images.length > 0
    ? hotel.images.map((img) => (typeof img === "string" ? img : (img.url ?? img.path)))
    : [hotel.image_url ?? hotel.image];
  const gallery = galleryItems.map((src) => toAbsoluteImageUrl(src ?? undefined)).filter((s): s is string => !!s);

  return (
    <>
      <Header />
      <main className="pt-20 pb-20">
        <HotelGallery images={gallery} alt={name} />
        <RoomsAndBooking hotel={hotel} />
        <NearbyHotels hotels={hotel.nearby ?? []} />
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}