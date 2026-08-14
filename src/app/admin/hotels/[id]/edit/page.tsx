"use client";

import { useParams } from "next/navigation";
import AdminTopBar from "@/components/admin/AdminTopBar";
import HotelForm from "@/components/admin/HotelForm";

export default function EditHotelPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <>
      <AdminTopBar title="Edit Hotel" subtitle="Update property details" />
      <div className="flex-1 overflow-y-auto p-gutter">
        <HotelForm hotelId={id} />
      </div>
    </>
  );
}