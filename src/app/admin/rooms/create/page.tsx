"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { getHotelsForRoomSelect, createRoom, uploadRoomImages, type AdminHotel } from "@/lib/admin";

const ROOM_AMENITIES = [
  "King Size Bed", "Twin Beds", "Ocean View", "Balcony", "Mini Bar",
  "Jacuzzi", "Living Room", "Butler Service", "Private Pool", "City View",
  "Free WiFi", "Air Conditioning", "Safe", "Smart TV", "Bathrobe & Slippers",
];

interface RoomForm {
  hotel_id: string;
  name: string;
  size: string;
  beds: string;
  price: string;
  description: string;
  amenities: string[];
}

interface Preview {
  file: File;
  url: string;
}

export default function CreateRoomPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [hotels, setHotels] = useState<AdminHotel[]>([]);
  const [saving, setSaving] = useState(false);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [form, setForm] = useState<RoomForm>({
    hotel_id: "", name: "", size: "", beds: "1", price: "", description: "", amenities: [],
  });

  useEffect(() => {
    getHotelsForRoomSelect()
      .then((res) => {
        const data = res.data;
        setHotels(Array.isArray(data) ? data : (data.data ?? []));
      })
      .catch(() => toast.error("Failed to load hotels"));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (a: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter((x) => x !== a) : [...prev.amenities, a],
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const newPreviews = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removePreview = (idx: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.hotel_id) {
      toast.error("Please select a hotel");
      return;
    }
    if (!form.name.trim()) {
      toast.error("Room name is required");
      return;
    }
    if (!form.price) {
      toast.error("Price is required");
      return;
    }

    setSaving(true);
    try {
      const { data: room } = await createRoom(form.hotel_id, {
        name: form.name,
        size: form.size,
        beds: form.beds,
        price: form.price,
        description: form.description,
        amenities: form.amenities,
      });

      if (previews.length > 0) {
        const fd = new FormData();
        previews.forEach((p) => fd.append("images[]", p.file));
        await uploadRoomImages(room.id, fd);
      }

      toast.success("Room created successfully!");
      router.push("/admin/hotels");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminTopBar title="Add New Room" subtitle="Create a room and assign it to a hotel" />
      <div className="flex-1 overflow-y-auto p-gutter">
        <div className="max-w-3xl space-y-5 pb-16">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Section title="Select Hotel">
              <Field label="Hotel *">
                <select name="hotel_id" value={form.hotel_id} onChange={handleChange} required className="admin-input">
                  <option value="">— Choose a hotel —</option>
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.title} — {h.location}
                    </option>
                  ))}
                </select>
              </Field>
            </Section>

            <Section title="Room Details">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Room Name *">
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Deluxe Suite" className="admin-input" />
                </Field>
                <Field label="Size">
                  <input name="size" value={form.size} onChange={handleChange} placeholder="e.g. 50m²" className="admin-input" />
                </Field>
                <Field label="Number of Beds *">
                  <input name="beds" type="number" min="1" value={form.beds} onChange={handleChange} required className="admin-input" />
                </Field>
                <Field label="Price per Night (AED) *">
                  <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required placeholder="2500" className="admin-input" />
                </Field>
              </div>
              <Field label="Description">
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Describe the room..." className="admin-input resize-none" />
              </Field>
            </Section>

            <Section title="Room Images">
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-outline-variant rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-surface-container-low transition group"
              >
                <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-primary mx-auto mb-2 block transition">
                  add_photo_alternate
                </span>
                <p className="text-sm text-on-surface-variant group-hover:text-primary transition">Click to upload room photos</p>
                <p className="text-xs text-on-surface-variant/60 mt-1">PNG, JPG up to 5MB each</p>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {previews.map((p, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden aspect-video bg-surface-container-high">
                      <img src={p.url} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePreview(idx)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition hover:bg-error"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-secondary text-on-secondary px-1.5 py-0.5 rounded font-medium">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="aspect-video border-2 border-dashed border-outline-variant rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant">upload</span>
                  </div>
                </div>
              )}

              {previews.length > 0 && (
                <p className="text-xs text-on-surface-variant mt-1">
                  {previews.length} image{previews.length !== 1 ? "s" : ""} selected · First image used as cover
                </p>
              )}
            </Section>

            <Section title="Room Amenities">
              <div className="flex flex-wrap gap-2">
                {ROOM_AMENITIES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition ${
                      form.amenities.includes(a) ? "bg-primary text-on-primary border-primary" : "border-outline-variant text-on-surface-variant hover:border-primary"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
              {form.amenities.length > 0 && (
                <p className="text-xs text-on-surface-variant mt-2">{form.amenities.length} amenity(s) selected</p>
              )}
            </Section>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-label-caps hover:bg-secondary transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />}
                {saving ? "Saving…" : "CREATE ROOM"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/hotels")}
                className="px-6 py-3 border border-outline-variant text-on-surface-variant rounded-lg hover:bg-surface-container-low transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-outline-variant rounded-xl p-5 space-y-4">
      <h2 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-on-surface-variant">{label}</label>
      {children}
    </div>
  );
}