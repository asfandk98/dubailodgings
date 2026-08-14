import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReserveClient from "@/components/hotels/ReserveClient";
import { getHotel } from "@/lib/api";

export const metadata = {
  title: "Complete Your Booking | DUBAILODGINGS.COM",
};

export default async function ReservePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ room?: string }>;
}) {
  const { slug } = await params;
  const { room } = await searchParams;

  const hotel = await getHotel(slug);
  if (!hotel) return notFound();

  const initialRoom =
    hotel.rooms?.find((r) => (r.slug ?? String(r.id)) === room) ?? hotel.rooms?.[0] ?? null;

  return (
    <>
      <Header />
      <ReserveClient hotel={hotel} initialRoom={initialRoom} />
      <Footer />
    </>
  );
}