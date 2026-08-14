"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { createAdminHotel, updateAdminHotel, getAdminHotel, type AdminHotel } from "@/lib/admin";

const AMENITY_OPTIONS = [
  "Free WiFi", "Swimming Pool", "Spa", "Gym", "Restaurant",
  "Bar", "Room Service", "Airport Shuttle", "Parking", "Concierge",
  "Business Center", "Laundry", "Kids Club", "Private Beach", "Valet Parking",
];
const HOTEL_TYPES = ["Luxury", "Resort", "Boutique", "Business", "Budget", "Apartment", "Villa"];

interface HotelFormState {
  title: string;
  location: string;
  price: string;
  type: string;
  guests: string;
  rating: string;
  description: string;
  status: "draft" | "active";
  featured: boolean;
  amenities: string[];
}

export default function HotelForm({ hotelId }: { hotelId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<HotelFormState>({
    title: "", location: "", price: "", type: "Luxury",
    guests: "2", rating: "", description: "",
    status: "draft", featured: false, amenities: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!hotelId);

  useEffect(() => {
    if (!hotelId) return;
   getAdminHotel(hotelId)
  .then((res) => {
    const data: AdminHotel = res.data;

    setForm({
      title: data.title ?? "",
      location: data.location ?? "",
      price: String(data.price ?? ""),
      type: data.type ?? "Luxury",
      guests: String(data.guests ?? "2"),
      rating: data.rating != null ? String(data.rating) : "",
      description: data.description ?? "",
      status: data.status ?? "draft",
      featured: !!data.featured,
      amenities: Array.isArray(data.amenities) ? data.amenities : [],
    });

    if (data.image_url) {
      setImagePreview(data.image_url);
    }
  })
  .catch(() => toast.error("Failed to load hotel"))
  .finally(() => setLoading(false));
  }, [hotelId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (a: string) =>
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter((x) => x !== a) : [...prev.amenities, a],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "amenities") fd.append(k, JSON.stringify(v));
      else fd.append(k, String(v));
    });
    if (imageFile) fd.append("image", imageFile);

    try {
      if (hotelId) {
        fd.append("_method", "PUT");
        await updateAdminHotel(hotelId, fd);
        toast.success("Hotel updated!");
      } else {
        await createAdminHotel(fd);
        toast.success("Hotel created!");
      }
      router.push("/admin/hotels");
    } catch {
      toast.error(hotelId ? "Failed to update hotel" : "Failed to create hotel");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 pb-16">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Section title="Basic Information">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title *">
              <input name="title" value={form.title} onChange={handleChange} required className="admin-input" placeholder="e.g. Burj Al Arab" />
            </Field>
            <Field label="Location *">
              <input name="location" value={form.location} onChange={handleChange} required className="admin-input" placeholder="e.g. Dubai Marina" />
            </Field>
            <Field label="Price / night (AED) *">
              <input name="price" type="number" value={form.price} onChange={handleChange} required className="admin-input" />
            </Field>
            <Field label="Max Guests *">
              <input name="guests" type="number" value={form.guests} onChange={handleChange} required className="admin-input" />
            </Field>
            <Field label="Hotel Type">
              <select name="type" value={form.type} onChange={handleChange} className="admin-input">
                {HOTEL_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Star Rating">
              <input name="rating" type="number" step="0.1" min="1" max="5" value={form.rating} onChange={handleChange} className="admin-input" placeholder="4.5" />
            </Field>
          </div>
        </Section>

        <Section title="Description">
          <textarea name="description" value={form.description} onChange={handleChange} rows={5} className="admin-input resize-none" placeholder="Hotel description…" />
        </Section>

        <Section title="Visibility & Flags">
          <div className="flex items-center gap-8">
            <Toggle
              label="Active"
              description="Visible on frontend"
              active={form.status === "active"}
              onToggle={() => setForm((p) => ({ ...p, status: p.status === "active" ? "draft" : "active" }))}
            />
            <Toggle
              label="Featured"
              description="Show in featured section"
              active={form.featured}
              onToggle={() => setForm((p) => ({ ...p, featured: !p.featured }))}
            />
          </div>
        </Section>

        <Section title="Amenities">
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map((a) => (
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
        </Section>

        <Section title="Main Image">
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-outline-variant hover:border-primary rounded-lg p-8 text-center transition">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img src={imagePreview} className="h-40 rounded-lg object-cover" alt="Preview" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-error rounded-full flex items-center justify-center text-on-error"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ) : (
                <div className="text-on-surface-variant">
                  <span className="material-symbols-outlined text-3xl mb-2 block">upload</span>
                  <p className="text-sm">Click to upload PNG, JPG, WebP</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setImageFile(f);
                setImagePreview(URL.createObjectURL(f));
              }}
            />
          </label>
        </Section>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-label-caps hover:bg-secondary transition disabled:opacity-50"
          >
            {saving ? "Saving…" : hotelId ? "UPDATE HOTEL" : "CREATE HOTEL"}
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

function Toggle({ label, description, active, onToggle }: { label: string; description: string; active: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-3 cursor-pointer" onClick={onToggle}>
      <div className={`w-10 h-5 rounded-full transition-colors relative ${active ? "bg-primary" : "bg-surface-container-high"}`}>
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${active ? "translate-x-5" : "translate-x-0.5"}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-primary">{label}</p>
        <p className="text-xs text-on-surface-variant">{description}</p>
      </div>
    </div>
  );
}