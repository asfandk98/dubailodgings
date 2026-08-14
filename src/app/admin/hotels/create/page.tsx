import AdminTopBar from "@/components/admin/AdminTopBar";
import HotelForm from "@/components/admin/HotelForm";

export default function CreateHotelPage() {
  return (
    <>
      <AdminTopBar title="Add Hotel" subtitle="Create a new property listing" />
      <div className="flex-1 overflow-y-auto p-gutter">
        <HotelForm />
      </div>
    </>
  );
}